import { useState, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { githubAPI, PRIORITY_PROFILES, PRIORITY_REPOS } from '@/lib/github';

export interface QueueItem {
  type: 'profile' | 'repo';
  id: string;
}

export function useItemQueue() {
  const [currentItem, setCurrentItem] = useState<QueueItem | null>(null);
  const [nextItem, setNextItem] = useState<QueueItem | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  const queryClient = useQueryClient();

  // Helper function to generate a random item
  const generateRandomItem = useCallback((): QueueItem => {
    const type = Math.random() > 0.5 ? 'profile' : 'repo';
    
    if (type === 'profile') {
      const randomProfile = PRIORITY_PROFILES[Math.floor(Math.random() * PRIORITY_PROFILES.length)];
      return { type: 'profile', id: randomProfile };
    } else {
      const randomRepo = PRIORITY_REPOS[Math.floor(Math.random() * PRIORITY_REPOS.length)];
      return { type: 'repo', id: randomRepo };
    }
  }, []);

  // Preload data for an item
  const preloadItemData = useCallback(async (item: QueueItem) => {
    if (item.type === 'profile') {
      // Prefetch profile data
      queryClient.prefetchQuery({
        queryKey: ['github-profile', item.id],
        queryFn: () => githubAPI.getUser(item.id),
        staleTime: 5 * 60 * 1000, // Cache for 5 minutes
      });
      
      // Prefetch contributions
      queryClient.prefetchQuery({
        queryKey: ['github-contributions', item.id],
        queryFn: () => githubAPI.getContributions(item.id),
        staleTime: 5 * 60 * 1000,
      });
    } else {
      // Prefetch repo data
      const [owner, repo] = item.id.split('/');
      queryClient.prefetchQuery({
        queryKey: ['github-repo', item.id],
        queryFn: () => githubAPI.getRepo(owner, repo),
        staleTime: 5 * 60 * 1000,
      });
    }
  }, [queryClient]);

  // Load next item from queue
  const loadNextItem = useCallback(() => {
    const newCurrent = nextItem || generateRandomItem();
    const newNext = generateRandomItem();
    
    setCurrentItem(newCurrent);
    setNextItem(newNext);
    
    // Preload the next item's data
    preloadItemData(newNext);
  }, [nextItem, generateRandomItem, preloadItemData]);

  // Initialize queue
  const initializeQueue = useCallback(() => {
    if (!currentItem) {
      const initialCurrent = generateRandomItem();
      const initialNext = generateRandomItem();
      
      setCurrentItem(initialCurrent);
      setNextItem(initialNext);
      
      // Preload next item data
      preloadItemData(initialNext);
    }
  }, [currentItem, generateRandomItem, preloadItemData]);

  // Transition to next item with animation
  const transitionToNext = useCallback((delay = 150) => {
    setIsTransitioning(true);
    
    setTimeout(() => {
      loadNextItem();
      setIsTransitioning(false);
    }, delay);
  }, [loadNextItem]);

  // Set a specific item (for search results or featured profiles)
  const setSpecificItem = useCallback((item: QueueItem) => {
    setCurrentItem(item);
    // Generate and preload a new next item
    const newNext = generateRandomItem();
    setNextItem(newNext);
    preloadItemData(newNext);
  }, [generateRandomItem, preloadItemData]);

  return {
    currentItem,
    nextItem,
    isTransitioning,
    loadNextItem,
    initializeQueue,
    transitionToNext,
    setSpecificItem,
  };
}
