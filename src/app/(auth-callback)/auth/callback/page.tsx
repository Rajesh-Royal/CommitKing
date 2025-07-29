'use client';
import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { handleGitHubCallback } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import GithubAuthLoader from "./_components/GithubAuthLoader";

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
      <GithubAuthLoader />
  );
}