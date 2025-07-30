'use client';
import React from 'react'
import { Navigation } from "@/components/Navigation";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import { queryClient } from "@/lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";

const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => <QueryClientProvider client={queryClient}>
  <ThemeProvider
    attribute="class"
    defaultTheme="system"
    enableSystem
    disableTransitionOnChange
  >
    <AuthProvider>
      <TooltipProvider>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
          <Navigation />
          {children}
          <Toaster />
        </div>
      </TooltipProvider>
    </AuthProvider>
  </ThemeProvider>
</QueryClientProvider>;

export default AppProvider