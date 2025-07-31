import { useState, useEffect, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { githubAPI, PRIORITY_PROFILES, PRIORITY_REPOS } from '@/lib/github';
import { useGitHubErrorHandler } from './useGitHubErrorHandler';
import { useSmartPrefetch } from './useSmartPrefetch';
import { debugLog } from '@/utils/debugLog';

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
  const {
    itemType = 'profile',
    queueSize = 3,
    preloadNext = true,
  } = options;

  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [currentItem, setCurrentItem] = useState<QueueItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { handleGitHubError } = useGitHubErrorHandler();
  const queryClient = useQueryClient();
  const { prefetchBatch, getCachedItemsCount } = useSmartPrefetch({ 
    type: itemType,
    enabled: true 
  });

  // Get random item from priority lists (fallback method)
  const getRandomPriorityItem = useCallback(async (type: ItemType): Promise<QueueItem | null> => {
    try {
      const priorityList = type === 'profile' ? PRIORITY_PROFILES : PRIORITY_REPOS;
      const shuffled = [...priorityList].sort(() => Math.random() - 0.5);
      const selectedId = shuffled[0];
      
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
      handleGitHubError(error);
    }
    return null;
  }, [handleGitHubError]);

  // Get random item from cache or priority list
  const getRandomItemFromCache = useCallback(async (type: ItemType): Promise<QueueItem | null> => {
    try {
      // First, try to get from cache
      const priorityList = type === 'profile' ? PRIORITY_PROFILES : PRIORITY_REPOS;
      const shuffled = [...priorityList].sort(() => Math.random() - 0.5);
      
      // Try to find cached items from priority list
      for (const id of shuffled) {
        const queryKey = type === 'profile' ? ['github-profile', id] : ['github-repo', id];
        const cachedData = queryClient.getQueryData(queryKey);
        
        if (cachedData) {
          debugLog.cache.hit(type, 1);
          
          // Trigger background prefetch if cache is getting low
          const totalCached = getCachedItemsCount();
          if (totalCached < 5) {
            debugLog.info(`Cache running low (${totalCached} items), triggering prefetch`);
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
      // Fallback to fetching from priority list
      return await getRandomPriorityItem(type);
    } catch (error) {
      handleGitHubError(error);
      return null;
    }
  }, [queryClient, getCachedItemsCount, prefetchBatch, handleGitHubError, getRandomPriorityItem]);

  // Preload item data
  const preloadItemData = useCallback(async (item: QueueItem): Promise<QueueItem> => {
    try {
      if (item.type === 'profile') {
        const profile = item.data as GitHubUser;
        
        // Preload contributions if not already loaded
        if (!profile.contributions) {
          const contributions = await githubAPI.getContributions(profile.login);
          return {
            ...item,
            data: { ...profile, contributions } as GitHubUser,
          };
        }
      }
      // For repositories, no additional preloading needed currently
    } catch (error) {
      handleGitHubError(error);
    }
    return item;
  }, [handleGitHubError]);

  const [isTransitioning, setIsTransitioning] = useState(false);

  // Fill the queue with random items
  const fillQueue = useCallback(async () => {
    const newQueue: QueueItem[] = [];
    
    for (let i = 0; i < queueSize; i++) {
      const item = await getRandomItemFromCache(itemType);
      if (item) {
        const preloadedItem = await preloadItemData(item);
        newQueue.push(preloadedItem);
      }
    }
    
    return newQueue;
  }, [queueSize, itemType, getRandomItemFromCache, preloadItemData]);

  // Initialize queue
  const initializeQueue = useCallback(async () => {
    debugLog.queue.init(itemType, queueSize);
    setIsLoading(true);
    const initialQueue = await fillQueue();
    setQueue(initialQueue);
    setCurrentItem(initialQueue[0] || null);
    debugLog.queue.init(itemType, initialQueue.length);
    setIsLoading(false);
  }, [fillQueue, itemType, queueSize]);

  // Initialize queue on mount or when itemType changes
  useEffect(() => {
    debugLog.queue.switch('previous', itemType);
    initializeQueue();
  }, [initializeQueue, itemType]);

  // Move to next item with transition
  const transitionToNext = useCallback(async (delay = 150) => {
    if (queue.length === 0) return;

    setIsTransitioning(true);
    
    // Add delay for smooth transition
    setTimeout(async () => {
      const newQueue = [...queue.slice(1)];
      
      // If we should preload next item, add one to the end
      if (preloadNext && newQueue.length < queueSize) {
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
  }, [queue, queueSize, preloadNext, itemType, getRandomItemFromCache, preloadItemData]);

  // Move to next item without transition (original nextItem)
  const nextItem = useCallback(async () => {
    if (queue.length === 0) return;

    const newQueue = [...queue.slice(1)];
    
    // If we should preload next item, add one to the end
    if (preloadNext && newQueue.length < queueSize) {
      const newItem = await getRandomItemFromCache(itemType);
      if (newItem) {
        const preloadedItem = await preloadItemData(newItem);
        newQueue.push(preloadedItem);
      }
    }
    
    setQueue(newQueue);
    setCurrentItem(newQueue[0] || null);
  }, [queue, queueSize, preloadNext, itemType, getRandomItemFromCache, preloadItemData]);

  // Set a specific item
  const setSpecificItem = useCallback((item: { type: ItemType; id: string }) => {
    const queueItem: QueueItem = {
      type: item.type,
      id: item.id,
      data: {} as GitHubUser | GitHubRepo, // Will be loaded by the page queries
    };
    setCurrentItem(queueItem);
  }, []);

  // Load next item (alias for nextItem)
  const loadNextItem = useCallback(() => {
    return nextItem();
  }, [nextItem]);

  // Get next items (for preview)
  const getNextItems = useCallback((count: number = 2) => {
    return queue.slice(1, count + 1);
  }, [queue]);

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
  };
}
