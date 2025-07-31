import { useState, useCallback, useEffect } from 'react';
import { debugLog } from '@/utils/debugLog';

export type RatingType = 'hotty' | 'notty';

interface CachedRating {
  rating: RatingType;
  timestamp: number;
}

// Rating cache that persists in localStorage and resets on logout
class RatingCache {
  private cache = new Map<string, CachedRating>();
  private readonly STORAGE_KEY = 'commitkings_rating_cache';
  private readonly CACHE_EXPIRY = 7 * 24 * 60 * 60 * 1000; // 7 days

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        // Convert back to Map and filter expired entries
        const now = Date.now();
        Object.entries(data).forEach(([key, value]) => {
          const cachedRating = value as CachedRating;
          if (cachedRating.timestamp && (now - cachedRating.timestamp) < this.CACHE_EXPIRY) {
            this.cache.set(key, cachedRating);
          }
        });
        debugLog.cache.hit('rating', this.cache.size);
      }
    } catch (error) {
      debugLog.info('Failed to load rating cache from storage:', error);
    }
  }

  private saveToStorage() {
    try {
      const data = Object.fromEntries(this.cache);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      debugLog.info('Failed to save rating cache to storage:', error);
    }
  }

  getRating(itemType: 'profile' | 'repo', itemId: string): RatingType | null {
    const key = `${itemType}:${itemId}`;
    const cached = this.cache.get(key);
    
    if (cached) {
      // Check if cache entry is still valid
      const now = Date.now();
      if ((now - cached.timestamp) < this.CACHE_EXPIRY) {
        debugLog.cache.hit('rating', 1);
        return cached.rating;
      } else {
        // Remove expired entry
        this.cache.delete(key);
        this.saveToStorage();
      }
    }
    
    debugLog.cache.miss('rating', key);
    return null;
  }

  setRating(itemType: 'profile' | 'repo', itemId: string, rating: RatingType) {
    const key = `${itemType}:${itemId}`;
    const cachedRating: CachedRating = {
      rating,
      timestamp: Date.now(),
    };
    
    this.cache.set(key, cachedRating);
    this.saveToStorage();
    debugLog.info(`Set rating cache: ${key} = ${rating}`);
  }

  hasRating(itemType: 'profile' | 'repo', itemId: string): boolean {
    return this.getRating(itemType, itemId) !== null;
  }

  clear() {
    this.cache.clear();
    localStorage.removeItem(this.STORAGE_KEY);
    debugLog.info('Cleared rating cache');
  }

  size() {
    return this.cache.size;
  }

  // Get all cached ratings for debugging/stats
  getAllRatings() {
    return Object.fromEntries(this.cache);
  }
}

// Singleton instance
const ratingCache = new RatingCache();

export function useRatingCache() {
  const [cacheSize, setCacheSize] = useState(ratingCache.size());

  const getRating = useCallback((itemType: 'profile' | 'repo', itemId: string): RatingType | null => {
    return ratingCache.getRating(itemType, itemId);
  }, []);

  const setRating = useCallback((itemType: 'profile' | 'repo', itemId: string, rating: RatingType) => {
    ratingCache.setRating(itemType, itemId, rating);
    setCacheSize(ratingCache.size());
  }, []);

  const hasRating = useCallback((itemType: 'profile' | 'repo', itemId: string): boolean => {
    return ratingCache.hasRating(itemType, itemId);
  }, []);

  const clearCache = useCallback(() => {
    ratingCache.clear();
    setCacheSize(0);
  }, []);

  const getCacheStats = useCallback(() => {
    return {
      size: ratingCache.size(),
      ratings: ratingCache.getAllRatings(),
    };
  }, []);

  // Listen for storage changes (e.g., logout from another tab)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'commitkings_rating_cache' && e.newValue === null) {
        // Cache was cleared in another tab
        setCacheSize(0);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return {
    getRating,
    setRating,
    hasRating,
    clearCache,
    cacheSize,
    getCacheStats,
  };
}

// Export the singleton for direct access if needed
export { ratingCache };
