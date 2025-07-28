'use client';
import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { handleGitHubCallback } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

export default function AuthCallbackPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const result = await handleGitHubCallback();
        
        if (result) {
          await login(result.user);
          toast({
            title: "Welcome to CommitKings!",
            description: `Successfully signed in as ${result.user.login}`,
          });
          router.push('/');
        }
      } catch (error) {
        console.error('GitHub OAuth callback error:', error);
        toast({
          title: "Authentication failed",
          description: error instanceof Error ? error.message : "Failed to complete GitHub authentication",
          variant: "destructive",
        });
        router.push('/');
      }
    };

    handleCallback();
  }, [login, router, toast]);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 dark:bg-indigo-900 rounded-full mb-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Completing GitHub Authentication
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Please wait while we complete your sign-in...
        </p>
      </div>
    </main>
  );
}