// Fix the infinite API calls when user load the page first time
import { debugLog } from '@/utils/debugLog';
import { preloadGitHubAvatar } from '@/utils/imageUtils';
import { useQueryClient } from '@tanstack/react-query';

import { useCallback, useEffect, useRef, useState } from 'react';

import { PRIORITY_PROFILES, PRIORITY_REPOS, githubAPI } from '@/lib/github';

import { useGitHubErrorHandler } from './useGitHubErrorHandler';
import { useRatingCache } from './useRatingCache';
import { useSmartPrefetch } from './useSmartPrefetch';

export type ItemType = 'profile' | 'repo';

interface GitHubUser {
  id: number;
  login: string;
  avatar_url: string;
  name: string;
  bio: string;
  location: string;
  public_repos: number;
  followers: number;
  following: number;
  html_url: string;
  contributions?: Array<{
    date: string;
    count: number;
    level: number;
  }>;
}

interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  html_url: string;
  owner: {
    login: string;
    avatar_url: string;
  };
  language?: string;
}

export interface QueueItem {
  type: ItemType;
  id: string;
  data: GitHubUser | GitHubRepo;
}

interface UseItemQueueOptions {
  itemType?: ItemType;
  queueSize?: number;
  preloadNext?: boolean;
}

export function useItemQueue(options: UseItemQueueOptions = {}) {
  const { itemType = 'profile', queueSize = 3, preloadNext = true } = options;

  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [currentItem, setCurrentItem] = useState<QueueItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Track already-shown items to prevent duplicates
  const [shownItems, setShownItems] = useState<Set<string>>(new Set());

  // Rate limit state management
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [rateLimitRecoveryTime, setRateLimitRecoveryTime] = useState<
    number | null
  >(null);

  // Prevent infinite re-initialization
  const isInitialized = useRef(false);
  const currentItemType = useRef(itemType);

  const { handleGitHubError } = useGitHubErrorHandler();
  const { getRating, setRating, hasRating, clearCache } = useRatingCache();
  const queryClient = useQueryClient();

  // Rate limit recovery mechanism
  const handleRateLimit = useCallback((error?: unknown) => {
    setIsRateLimited(true);

    // Try to get the actual reset time from GitHub headers
    let recoveryTime = Date.now() + 15 * 60 * 1000; // Default to 15 minutes

    if (error && typeof error === 'object') {
      const githubError = error as { rateLimitReset?: number };
      if (githubError.rateLimitReset) {
        recoveryTime = githubError.rateLimitReset;
      }
    }

    setRateLimitRecoveryTime(recoveryTime);

    const minutesUntilReset = Math.ceil(
      (recoveryTime - Date.now()) / 1000 / 60
    );
    debugLog.api.error(
      'rate limit hit',
      `Pausing all API requests for ${minutesUntilReset} minutes`
    );

    // Set timeout to recover from rate limit
    const timeoutDuration = recoveryTime - Date.now();
    setTimeout(
      () => {
        setIsRateLimited(false);
        setRateLimitRecoveryTime(null);
        debugLog.api.success('rate limit recovery', 1);
      },
      Math.max(timeoutDuration, 0)
    );
  }, []);

  // Check if we should skip API calls due to rate limiting
  const shouldSkipAPICall = useCallback(() => {
    if (isRateLimited) {
      const timeRemaining = rateLimitRecoveryTime
        ? rateLimitRecoveryTime - Date.now()
        : 0;
      if (timeRemaining > 0) {
        debugLog.info(
          `Skipping API call due to rate limit, ${Math.ceil(timeRemaining / 1000 / 60)} minutes remaining`
        );
        return true;
      } else {
        // Recovery time has passed, reset state
        setIsRateLimited(false);
        setRateLimitRecoveryTime(null);
      }
    }
    return false;
  }, [isRateLimited, rateLimitRecoveryTime]);

  const { prefetchBatch, getCachedItemsCount } = useSmartPrefetch({
    type: itemType,
    enabled: true,
    shouldSkipAPICall,
  });

  // Get random item from priority lists (fallback method)
  const getRandomPriorityItem = useCallback(
    async (type: ItemType, specificId?: string): Promise<QueueItem | null> => {
      // Check if we should skip API calls due to rate limiting
      if (shouldSkipAPICall()) {
        return null;
      }

      try {
        const priorityList =
          type === 'profile' ? PRIORITY_PROFILES : PRIORITY_REPOS;
        const selectedId =
          specificId ||
          priorityList[Math.floor(Math.random() * priorityList.length)];

        debugLog.api.start(`${type} from priority list`, { id: selectedId });

        if (type === 'profile') {
          const profile = await githubAPI.getUser(selectedId);
          debugLog.api.success(`${type} from priority list`, 1);
          return {
            type: 'profile',
            id: selectedId,
            data: profile,
          };
        } else {
          const [owner, repo] = selectedId.split('/');
          const repository = await githubAPI.getRepo(owner, repo);
          debugLog.api.success(`${type} from priority list`, 1);
          return {
            type: 'repo',
            id: selectedId,
            data: repository,
          };
        }
      } catch (error) {
        debugLog.api.error(`${type} from priority list`, error);
        const errorResult = handleGitHubError(error);

        // Check if this is a rate limit error
        if (errorResult === 'rate-limited') {
          handleRateLimit(error);
          return null;
        }
      }
      return null;
    },
    [handleGitHubError, shouldSkipAPICall, handleRateLimit]
  );

  // Get random item from cache or priority list
  const getRandomItemFromCache = useCallback(
    async (type: ItemType): Promise<QueueItem | null> => {
      try {
        // First, try to get from cache
        const priorityList =
          type === 'profile' ? PRIORITY_PROFILES : PRIORITY_REPOS;

        // Get current shown items to avoid stale closure
        const currentShownItems = shownItems;

        // Filter out already-shown items
        let availableItems = priorityList.filter(
          id => !currentShownItems.has(id)
        );

        // If all items have been shown, reset the tracking and use full list
        if (availableItems.length === 0) {
          debugLog.info(`All ${type}s shown, resetting tracking`);
          setShownItems(new Set());
          availableItems = [...priorityList]; // Create new array instead of mutating
        }

        const shuffled = [...availableItems].sort(() => Math.random() - 0.5);

        // Try to find cached items from available priority list
        for (const id of shuffled) {
          const queryKey =
            type === 'profile' ? ['github-profile', id] : ['github-repo', id];
          const cachedData = queryClient.getQueryData(queryKey);

          if (cachedData) {
            debugLog.cache.hit(type, 1);

            // Mark this item as shown
            setShownItems(prev => new Set([...prev, id]));

            // Trigger background prefetch if cache is getting low (but only if not rate limited)
            const totalCached = getCachedItemsCount();
            if (totalCached < 5 && !shouldSkipAPICall()) {
              debugLog.info(
                `Cache running low (${totalCached} items), triggering prefetch`
              );
              prefetchBatch();
            }

            return {
              type,
              id: id,
              data: cachedData as GitHubUser | GitHubRepo,
            };
          }
        }

        debugLog.cache.miss(type, 'no cached priority items');

        // If we're rate limited, don't try to fetch new items
        if (shouldSkipAPICall()) {
          debugLog.info(
            'Rate limited: returning null instead of fetching new item'
          );
          return null;
        }

        // Fallback to fetching from priority list (first available item)
        const selectedId = shuffled[0];
        if (selectedId) {
          setShownItems(prev => new Set([...prev, selectedId]));
          return await getRandomPriorityItem(type, selectedId);
        }

        return null;
      } catch (error) {
        const errorResult = handleGitHubError(error);

        // Check if this is a rate limit error
        if (errorResult === 'rate-limited') {
          handleRateLimit(error);
        }

        return null;
      }
    },
    [
      queryClient,
      handleGitHubError,
      getRandomPriorityItem,
      shownItems,
      shouldSkipAPICall,
      handleRateLimit,
      getCachedItemsCount,
      prefetchBatch,
    ]
  );

  // Preload item data
  const preloadItemData = useCallback(
    async (item: QueueItem): Promise<QueueItem> => {
      try {
        if (item.type === 'profile') {
          const profile = item.data as GitHubUser;

          // Preload contributions if not already loaded and we're not rate limited
          if (!profile.contributions && !shouldSkipAPICall()) {
            const contributions = await githubAPI.getContributions(
              profile.login
            );
            return {
              ...item,
              data: { ...profile, contributions } as GitHubUser,
            };
          }
        }
        // For repositories, no additional preloading needed currently
      } catch (error) {
        const errorResult = handleGitHubError(error);

        // Check if this is a rate limit error
        if (errorResult === 'rate-limited') {
          handleRateLimit(error);
        }
      }
      return item;
    },
    [handleGitHubError, shouldSkipAPICall, handleRateLimit]
  );

  // Fill the queue with random items
  const fillQueue = useCallback(async () => {
    const newQueue: QueueItem[] = [];

    for (let i = 0; i < queueSize; i++) {
      const item = await getRandomItemFromCache(itemType);
      if (item) {
        const preloadedItem = await preloadItemData(item);
        newQueue.push(preloadedItem);
      }
      await new Promise(resolve => setTimeout(resolve, 1000)); // Throttle requests
    }

    return newQueue;
  }, [queueSize, itemType, getRandomItemFromCache, preloadItemData]);

  // Initialize queue - FIXED: Stable function to prevent infinite re-renders
  const initializeQueue = useCallback(async () => {
    if (isInitialized.current && currentItemType.current === itemType) {
      return; // Prevent duplicate initialization
    }

    debugLog.queue.init(itemType, queueSize);
    setIsLoading(true);

    try {
      const initialQueue = await fillQueue();
      setQueue(initialQueue);
      setCurrentItem(initialQueue[0] || null);
      debugLog.queue.init(itemType, initialQueue.length);

      isInitialized.current = true;
      currentItemType.current = itemType;
    } catch (error) {
      debugLog.api.error('queue initialization', error);
    } finally {
      setIsLoading(false);
    }
  }, [itemType, queueSize, fillQueue]);

  // FIXED: Only initialize once and when itemType actually changes
  useEffect(() => {
    // Reset tracking when itemType changes
    if (currentItemType.current !== itemType) {
      debugLog.queue.switch(currentItemType.current, itemType);
      setShownItems(new Set());
      isInitialized.current = false;
    }

    // Initialize only if not already initialized
    if (!isInitialized.current) {
      initializeQueue();
    }
  }, [itemType, initializeQueue]);

  // Move to next item with transition
  const transitionToNext = useCallback(
    async (delay = 150) => {
      if (queue.length === 0) return;

      setIsTransitioning(true);

      // Add delay for smooth transition
      setTimeout(async () => {
        const newQueue = [...queue.slice(1)];

        // If we should preload next item, add one to the end (but only if not rate limited)
        if (
          preloadNext &&
          newQueue.length < queueSize &&
          !shouldSkipAPICall()
        ) {
          const newItem = await getRandomItemFromCache(itemType);
          if (newItem) {
            const preloadedItem = await preloadItemData(newItem);
            newQueue.push(preloadedItem);
          }
        }

        setQueue(newQueue);
        setCurrentItem(newQueue[0] || null);
        setIsTransitioning(false);
      }, delay);
    },
    [
      queue,
      queueSize,
      preloadNext,
      itemType,
      getRandomItemFromCache,
      preloadItemData,
      setIsTransitioning,
      shouldSkipAPICall,
    ]
  );

  // Move to next item without transition (original nextItem)
  const nextItem = useCallback(async () => {
    if (queue.length === 0) return;

    const newQueue = [...queue.slice(1)];

    // If we should preload next item, add one to the end (but only if not rate limited)
    if (preloadNext && newQueue.length < queueSize && !shouldSkipAPICall()) {
      const newItem = await getRandomItemFromCache(itemType);
      if (newItem) {
        const preloadedItem = await preloadItemData(newItem);
        newQueue.push(preloadedItem);
      }
    }

    setQueue(newQueue);
    setCurrentItem(newQueue[0] || null);
  }, [
    queue,
    queueSize,
    preloadNext,
    itemType,
    getRandomItemFromCache,
    preloadItemData,
    shouldSkipAPICall,
  ]);

  // Set a specific item
  const setSpecificItem = useCallback(
    (item: { type: ItemType; id: string }) => {
      const queueItem: QueueItem = {
        type: item.type,
        id: item.id,
        data: {} as GitHubUser | GitHubRepo, // Will be loaded by the page queries
      };
      setCurrentItem(queueItem);
    },
    []
  );

  // Load next item (alias for nextItem)
  const loadNextItem = useCallback(() => {
    return nextItem();
  }, [nextItem]);

  // Get next items (for preview)
  const getNextItems = useCallback(
    (count: number = 2) => {
      return queue.slice(1, count + 1);
    },
    [queue]
  );

  // Preload next avatar for smoother transitions
  const preloadNextAvatar = useCallback((nextItem: QueueItem) => {
    if (nextItem.data) {
      let avatarUrl: string | undefined;

      // Handle both profile and repo avatars
      if ('avatar_url' in nextItem.data) {
        // User profile
        avatarUrl = nextItem.data.avatar_url;
      } else if ('owner' in nextItem.data && nextItem.data.owner?.avatar_url) {
        // Repository owner avatar
        avatarUrl = nextItem.data.owner.avatar_url;
      }

      if (avatarUrl) {
        debugLog.cache.prefetch('avatar', 1);
        preloadGitHubAvatar(avatarUrl, 96); // Preload at xl size for best quality
      }
    }
  }, []);

  // Preload next item's avatar when queue changes
  useEffect(() => {
    const nextQueueItem = queue[1]; // Next item after current
    if (nextQueueItem) {
      preloadNextAvatar(nextQueueItem);
    }
  }, [queue, preloadNextAvatar]);

  // Handle rating submission with caching
  const submitRating = useCallback(
    async (itemId: string, rating: 'hotty' | 'notty') => {
      if (!currentItem) return;

      try {
        // Cache the rating immediately for instant feedback
        setRating(currentItem.type, itemId, rating);

        // TODO: Make actual API call to submit rating
        // await ratingAPI.submitRating(currentItem.type, itemId, rating);

        debugLog.info(
          `Submitted rating: ${rating} for ${currentItem.type}:${itemId}`
        );
      } catch (error) {
        // If API call fails, you might want to remove from cache
        // For now, we'll keep it cached as the user expressed their preference
        handleGitHubError(error);
      }
    },
    [currentItem, setRating, handleGitHubError]
  );

  // Clear rating cache (useful for logout)
  const clearRatingCache = useCallback(() => {
    clearCache();
    debugLog.info('Rating cache cleared');
  }, [clearCache]);

  return {
    currentItem,
    nextItems: getNextItems(),
    nextItem,
    isLoading,
    queueLength: queue.length,
    isTransitioning,
    initializeQueue,
    transitionToNext,
    setSpecificItem,
    loadNextItem,
    // Rating cache functions
    getRating,
    hasRating,
    submitRating,
    clearRatingCache,
    // Rate limit state
    isRateLimited,
    rateLimitRecoveryTime,
  };
}
