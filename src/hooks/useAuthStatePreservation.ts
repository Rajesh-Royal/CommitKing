import { useAuth } from '@/contexts/AuthContext';

import { useCallback, useEffect, useRef } from 'react';

import { useRouter } from 'next/navigation';

interface CurrentItem {
  type: 'profile' | 'repo';
  id: string;
}

export const AUTH_STORAGE_KEY = 'commit-king-auth-return-state';

export function useAuthStatePreservation(currentItem: CurrentItem | null) {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const lastSavedItem = useRef<string | null>(null);

  // Save state before potential auth redirect - only when user is not logged in
  useEffect(() => {
    // Don't save state if user is already logged in or auth is still loading
    if (isLoading || user) {
      return;
    }

    if (currentItem) {
      const itemKey = `${currentItem.type}:${currentItem.id}`;

      // Only save if it's different from the last saved item to prevent unnecessary updates
      if (lastSavedItem.current !== itemKey) {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(currentItem));
        lastSavedItem.current = itemKey;
      }
    }
  }, [currentItem, user, isLoading]);

  // Restore state after auth (called once on component mount)
  const restoreAfterAuth = useCallback(() => {
    // Don't restore if still loading auth state
    if (isLoading) {
      return false;
    }

    // If user is logged in, remove the saved state
    if (user) {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      return false;
    }

    const savedState = localStorage.getItem(AUTH_STORAGE_KEY);
    if (savedState) {
      try {
        const item: CurrentItem = JSON.parse(savedState);
        localStorage.removeItem(AUTH_STORAGE_KEY);
        lastSavedItem.current = null; // Reset the ref

        // Use router instead of window.location to avoid full page reload
        router.push(`/?type=${item.type}&val=${encodeURIComponent(item.id)}`);
        return true;
      } catch (error) {
        console.error('Failed to restore auth state:', error);
        localStorage.removeItem(AUTH_STORAGE_KEY);
        lastSavedItem.current = null;
      }
    }
    return false;
  }, [router, isLoading]);

  return { restoreAfterAuth };
}
