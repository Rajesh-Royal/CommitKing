import { useQueryClient } from '@tanstack/react-query';
import { githubAPI } from '@/lib/github';
import { useEffect, useCallback } from 'react';
import { debugLog } from '@/utils/debugLog';

interface UseSmartPrefetchOptions {
  type: 'profile' | 'repo';
  enabled?: boolean;
}

export function useSmartPrefetch({ type, enabled = true }: UseSmartPrefetchOptions) {
  const queryClient = useQueryClient();

  // Prefetch random items in background
  const prefetchBatch = useCallback(async () => {
    if (!enabled) return;

    debugLog.cache.prefetch(type, type === 'repo' ? 20 : 30);

    try {
      if (type === 'repo') {
        // Fetch repositories for multiple topics in a single query
        const topics = ['javascript', 'typescript', 'react', 'nextjs', 'nodejs', 'python'];
        const topicsQuery = `topic:${topics[Math.floor(Math.random() * topics.length)]}`;
        const fullQuery = `(${topicsQuery}) stars:>100`;

        debugLog.api.start('search/repositories', {
          query: fullQuery,
          sort: 'stars',
          per_page: 20
        });

        const queryKey = ['github-random-repos', 'multi-topic', Math.floor(Date.now() / (60 * 1000))];

        await queryClient.prefetchQuery({
          queryKey,
          queryFn: async () => {
            const repos = await githubAPI.searchRepos(fullQuery, 1, 20);

            // Sort by stars (highest first) - GitHub API should already do this, but ensure it
            const sortedRepos = (repos.items || []).sort((a, b) =>
              (b.stargazers_count || 0) - (a.stargazers_count || 0)
            );

            debugLog.api.success('search/repositories', sortedRepos.length);
            return sortedRepos;
          },
          staleTime: 60 * 60 * 1000, // 1 hour
        });
      } else {
        // Prefetch user profiles
        debugLog.api.start('search/users', {
          query: 'followers:>100+type:user',
          sort: 'followers',
          per_page: 30
        });

        const queryKey = ['github-random-profiles', Math.floor(Date.now() / (60 * 1000))];

        await queryClient.prefetchQuery({
          queryKey,
          queryFn: async () => {
            const users = await githubAPI.searchUsers(
              'followers:>100+type:user',
              Math.floor(Math.random() * 10) + 1,
              30
            );

            debugLog.api.success('search/users', users.items?.length || 0);
            return users.items || [];
          },
          staleTime: 60 * 60 * 1000, // 1 hour
        });
      }
    } catch (error) {
      debugLog.api.error(`prefetch-${type}`, error);
    }
  }, [type, queryClient, enabled]);

  // Auto-prefetch on mount and when cache is low
  useEffect(() => {
    if (!enabled) return;

    const prefetchTimer = setTimeout(() => {
      prefetchBatch();
    }, 2000); // Delay to not block initial render

    return () => clearTimeout(prefetchTimer);
  }, [type, enabled, prefetchBatch]);

  // Get cached items count
  const getCachedItemsCount = useCallback(() => {
    const queryPattern = type === 'repo' ? 'github-random-repos' : 'github-random-profiles';
    const queries = queryClient.getQueriesData({
      queryKey: [queryPattern],
    });

    return queries.reduce((total, [, data]) => {
      return total + (Array.isArray(data) ? data.length : 0);
    }, 0);
  }, [type, queryClient]);

  return {
    prefetchBatch,
    getCachedItemsCount,
  };
}
