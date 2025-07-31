import { useQueryClient } from '@tanstack/react-query';
import { githubAPI, PRIORITY_PROFILES, PRIORITY_REPOS } from '@/lib/github';
import { useEffect, useCallback } from 'react';
import { debugLog } from '@/utils/debugLog';

interface UseSmartPrefetchOptions {
  type: 'profile' | 'repo';
  enabled?: boolean;
}

export function useSmartPrefetch({ type, enabled = true }: UseSmartPrefetchOptions) {
  const queryClient = useQueryClient();

  const prefetchProfile = useCallback(async (username: string) => {
    try {
      await queryClient.prefetchQuery({
        queryKey: ['github-profile', username],
        queryFn: () => githubAPI.getUser(username),
        staleTime: 1000 * 60 * 60 * 24, // 24 hours
      });
      debugLog.api.success(`profile/${username}`, 1);
    } catch (error) {
      debugLog.api.error(`profile/${username}`, error);
    }
  }, [queryClient]);

  const prefetchRepository = useCallback(async (username: string, repo: string) => {
    try {
      await queryClient.prefetchQuery({
        queryKey: ['github-repo', username, repo],
        queryFn: () => githubAPI.getRepo(username, repo),
        staleTime: 1000 * 60 * 60 * 24, // 24 hours
      });
      debugLog.api.success(`repo/${username}/${repo}`, 1);
    } catch (error) {
      debugLog.api.error(`repo/${username}/${repo}`, error);
    }
  }, [queryClient]);

  // Prefetch priority items based on type
  const prefetchBatch = useCallback(async () => {
    if (!enabled) return;

    debugLog.cache.prefetch(type, type === 'repo' ? PRIORITY_REPOS.length : PRIORITY_PROFILES.length);

    try {
      if (type === 'repo') {
        // Prefetch a subset of priority repositories
        const reposToPrefix = PRIORITY_REPOS.slice(0, 8); // Prefetch first 8 repos
        debugLog.api.start(`Prefetching ${reposToPrefix.length} priority repositories`);
        
        for (const repoPath of reposToPrefix) {
          const [username, repo] = repoPath.split('/');
          await prefetchRepository(username, repo);
          // Small delay to be respectful to the API
          await new Promise(resolve => setTimeout(resolve, 150));
        }
      } else {
        // Prefetch a subset of priority profiles
        const profilesToPrefetch = PRIORITY_PROFILES.slice(0, 12); // Prefetch first 12 profiles
        debugLog.api.start(`Prefetching ${profilesToPrefetch.length} priority profiles`);
        
        for (const username of profilesToPrefetch) {
          await prefetchProfile(username);
          await new Promise(resolve => setTimeout(resolve, 150));
        }
      }
      
      debugLog.api.success(`priority-${type}-prefetch`, type === 'repo' ? 8 : 12);
    } catch (error) {
      debugLog.api.error(`prefetch-${type}`, error);
    }
  }, [type, enabled, prefetchProfile, prefetchRepository]);

  // Auto-prefetch on mount
  useEffect(() => {
    if (!enabled) return;

    const prefetchTimer = setTimeout(() => {
      prefetchBatch();
    }, 2000); // Delay to not block initial render

    return () => clearTimeout(prefetchTimer);
  }, [type, enabled, prefetchBatch]);

  // Get cached items count for priority items
  const getCachedItemsCount = useCallback(() => {
    if (type === 'repo') {
      // Count cached repositories from priority list
      return PRIORITY_REPOS.reduce((count, repoPath) => {
        const [username, repo] = repoPath.split('/');
        const queryData = queryClient.getQueryData(['github-repo', username, repo]);
        return queryData ? count + 1 : count;
      }, 0);
    } else {
      // Count cached profiles from priority list
      return PRIORITY_PROFILES.reduce((count, username) => {
        const queryData = queryClient.getQueryData(['github-profile', username]);
        return queryData ? count + 1 : count;
      }, 0);
    }
  }, [type, queryClient]);

  return {
    prefetchBatch,
    getCachedItemsCount,
    prefetchProfile,
    prefetchRepository,
  };
}
