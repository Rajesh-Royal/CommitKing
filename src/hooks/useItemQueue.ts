import { useState, useEffect, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { githubAPI } from '@/lib/github';
import { useGitHubErrorHandler } from './useGitHubErrorHandler';
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

  // Generate a random GitHub username or repository (fallback method)
  const generateRandomItem = useCallback(async (type: ItemType): Promise<QueueItem | null> => {
    try {
      if (type === 'profile') {
        // Generate random profile
        const characters = 'abcdefghijklmnopqrstuvwxyz';
        const randomChar = characters[Math.floor(Math.random() * characters.length)];
        const randomLength = Math.floor(Math.random() * 3) + 3; // 3-5 characters
        let username = randomChar;
        
        for (let i = 1; i < randomLength; i++) {
          const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
          username += chars[Math.floor(Math.random() * chars.length)];
        }

        const profile = await githubAPI.getUser(username);
        if (profile) {
          return {
            type: 'profile',
            id: profile.login,
            data: profile,
          };
        }
      } else {
        // Generate random repository
        const topics = ['javascript', 'python', 'react', 'nodejs', 'typescript', 'go', 'rust', 'java', 'php', 'ruby'];
        const randomTopic = topics[Math.floor(Math.random() * topics.length)];
        
        const repos = await githubAPI.searchRepos(`topic:${randomTopic}`, 1);
        if (repos?.items && repos.items.length > 0) {
          const randomRepo = repos.items[Math.floor(Math.random() * repos.items.length)];
          return {
            type: 'repo',
            id: randomRepo.full_name,
            data: randomRepo,
          };
        }
      }
    } catch (error) {
      handleGitHubError(error);
    }
    return null;
  }, [handleGitHubError]);

  // Get random item from cache or API
  const getRandomItemFromCache = useCallback(async (type: ItemType): Promise<QueueItem | null> => {
    try {
      // First, try to get from cache
      const queryPattern = type === 'repo' ? 'github-random-repos' : 'github-random-profiles';
      const queries = queryClient.getQueriesData({ 
        queryKey: [queryPattern],
      });

      // Flatten all cached data
      const cachedItems = queries
        .flatMap(([, data]) => Array.isArray(data) ? data : [])
        .filter(Boolean);

      if (cachedItems.length > 0) {
        // Get random item from cache
        const randomItem = cachedItems[Math.floor(Math.random() * cachedItems.length)];
        
        // Trigger background prefetch if cache is getting low
        const totalCached = getCachedItemsCount();
        if (totalCached < 10) {
          prefetchBatch();
        }
        
        return {
          type,
          id: type === 'profile' ? randomItem.login : randomItem.full_name,
          data: randomItem,
        };
      }

      // Fallback to generating random item via API
      return await generateRandomItem(type);
    } catch (error) {
      handleGitHubError(error);
      return null;
    }
  }, [queryClient, getCachedItemsCount, prefetchBatch, handleGitHubError, generateRandomItem]);

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
    setIsLoading(true);
    const initialQueue = await fillQueue();
    setQueue(initialQueue);
    setCurrentItem(initialQueue[0] || null);
    setIsLoading(false);
  }, [fillQueue]);

  // Initialize queue on mount or when itemType changes
  useEffect(() => {
    initializeQueue();
  }, [initializeQueue]);

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
