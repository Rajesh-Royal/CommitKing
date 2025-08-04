'use client';

import { AuthProvider } from '@/contexts/AuthContext';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import React from 'react';

import { Footer } from '@/components/Footer';
import { Navigation } from '@/components/Navigation';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';

import { queryClient } from '@/lib/queryClient';

import { GitHubErrorProvider } from '@/providers/GitHubErrorProvider';
import { ThemeProvider } from '@/providers/ThemeProvider';

const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    <GitHubErrorProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <AuthProvider>
          <TooltipProvider>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200 flex flex-col">
              <Navigation />
              <main className="flex-1">{children}</main>
              <Footer />
              <Toaster />
            </div>
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </GitHubErrorProvider>
  </QueryClientProvider>
);

export default AppProvider;
