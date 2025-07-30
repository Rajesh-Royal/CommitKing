'use client';

import { ReactNode } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useGitHubErrorHandler } from '@/hooks/useGitHubErrorHandler';

interface GitHubErrorProviderProps {
  children: ReactNode;
}

export function GitHubErrorProvider({ children }: GitHubErrorProviderProps) {
  const queryClient = useQueryClient();
  const { handleGitHubError } = useGitHubErrorHandler();

  // Set up global error handling for React Query
  queryClient.setMutationDefaults(['github'], {
    onError: (error) => {
      handleGitHubError(error);
    },
  });

  // Note: For queries, we'll handle errors individually since we want different behavior
  // for different types of failures (some should be silent, others should show errors)

  return <>{children}</>;
}
