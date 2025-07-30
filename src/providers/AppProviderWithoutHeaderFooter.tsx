'use client';
import React from 'react'
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import { queryClient } from "@/lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";

const AppProviderWithoutHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => <QueryClientProvider client={queryClient}>
  <ThemeProvider
    attribute="class"
    defaultTheme="system"
    enableSystem
    disableTransitionOnChange
  >
    <AuthProvider>
      <TooltipProvider>
        <div className="min-h-screen transition-colors duration-200">
          {children}
          <Toaster />
        </div>
      </TooltipProvider>
    </AuthProvider>
  </ThemeProvider>
</QueryClientProvider>;

export default AppProviderWithoutHeader