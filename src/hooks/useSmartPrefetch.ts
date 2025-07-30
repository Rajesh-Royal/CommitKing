import { useQueryClient } from '@tanstack/react-query';
import { githubAPI } from '@/lib/github';
import { useEffect, useCallback } from 'react';

interface UseSmartPrefetchOptions {
  type: 'profile' | 'repo';
  enabled?: boolean;
}

export function useSmartPrefetch({ type, enabled = true }: UseSmartPrefetchOptions) {
  const queryClient = useQueryClient();

  // Prefetch random items in background
  const prefetchBatch = useCallback(async () => {
    if (type === 'repo') {
      // Prefetch popular repositories with different topics
      const topics = ['javascript', 'typescript', 'react', 'nextjs', 'nodejs', 'python', 'go', 'rust'];
      const randomTopic = topics[Math.floor(Math.random() * topics.length)];
      
      await queryClient.prefetchQuery({
        queryKey: ['github-random-repos', randomTopic, Date.now()],
        queryFn: async () => {
          const repos = await githubAPI.searchRepos(
            `topic:${randomTopic}+stars:>100`,
            Math.floor(Math.random() * 10) + 1
          );
          return repos.items || [];
        },
        staleTime: 60 * 60 * 1000, // 1 hour
      });
    } else {
      // Prefetch random user profiles
      await queryClient.prefetchQuery({
        queryKey: ['github-random-profiles', Date.now()],
        queryFn: async () => {
          const users = await githubAPI.searchUsers(
            `followers:>100+type:user`,
            Math.floor(Math.random() * 10) + 1
          );
          return users.items || [];
        },
        staleTime: 60 * 60 * 1000, // 1 hour
      });
    }
  }, [type, queryClient]);

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
