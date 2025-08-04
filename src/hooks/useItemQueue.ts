// Simplified item queue without complex queue system
import { debugLog } from '@/utils/debugLog';

import { useCallback, useEffect, useRef, useState } from 'react';

import { PRIORITY_PROFILES, PRIORITY_REPOS } from '@/lib/github';

import { useGitHubErrorHandler } from './useGitHubErrorHandler';

export type ItemType = 'profile' | 'repo';

export interface CurrentItem {
  type: ItemType;
  id: string;
}

interface UseItemQueueOptions {
  itemType?: ItemType;
}

export function useItemQueue(options: UseItemQueueOptions = {}) {
  const { itemType = 'profile' } = options;

  const [currentItem, setCurrentItem] = useState<CurrentItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Track already-shown items to prevent duplicates
  const [shownItems, setShownItems] = useState<Set<string>>(new Set());

  // Prevent infinite re-initialization
  const isInitialized = useRef(false);
  const currentItemType = useRef(itemType);

  const { handleGitHubError } = useGitHubErrorHandler();

  // Get random item from priority lists
  const getRandomPriorityItem = useCallback(
    (type: ItemType): string | null => {
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
        debugLog.info(`All ${type} items shown, resetting tracking`);
        setShownItems(new Set());
        availableItems = [...priorityList];
      }

      // Get random item
      const randomIndex = Math.floor(Math.random() * availableItems.length);
      return availableItems[randomIndex] || null;
    },
    [shownItems]
  );

  // Load first item on initialization
  const initializeQueue = useCallback(async () => {
    if (isInitialized.current && currentItemType.current === itemType) {
      return;
    }

    debugLog.info(`Initializing simple item loader for ${itemType}`);
    setIsLoading(true);

    try {
      const randomId = getRandomPriorityItem(itemType);
      if (randomId) {
        setCurrentItem({ type: itemType, id: randomId });
        setShownItems(prev => new Set(prev).add(randomId));
      }

      isInitialized.current = true;
      currentItemType.current = itemType;
    } catch (error) {
      debugLog.error('Failed to initialize item loader', error);
      handleGitHubError(error);
    } finally {
      setIsLoading(false);
    }
  }, [itemType, getRandomPriorityItem, handleGitHubError]);

  // Initialize when component mounts or itemType changes
  useEffect(() => {
    // Reset tracking when itemType changes
    if (currentItemType.current !== itemType) {
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
      setIsTransitioning(true);

      // Add delay for smooth transition
      setTimeout(() => {
        const randomId = getRandomPriorityItem(itemType);
        if (randomId) {
          setCurrentItem({ type: itemType, id: randomId });
          setShownItems(prev => new Set(prev).add(randomId));
        }
        setIsTransitioning(false);
      }, delay);
    },
    [itemType, getRandomPriorityItem]
  );

  // Set a specific item
  const setSpecificItem = useCallback(
    (item: { type: ItemType; id: string }) => {
      setCurrentItem(item);
      setShownItems(prev => new Set(prev).add(item.id));
    },
    []
  );

  // Load next item (alias for transitionToNext without delay)
  const loadNextItem = useCallback(() => {
    return transitionToNext(0);
  }, [transitionToNext]);

  return {
    currentItem,
    isLoading,
    isTransitioning,
    initializeQueue,
    transitionToNext,
    setSpecificItem,
    loadNextItem,
  };
}
