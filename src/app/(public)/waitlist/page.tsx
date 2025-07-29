'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Github, Users, Crown, Rocket, Star } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { signInWithGitHub } from "@/lib/supabase";
import Image from "next/image";

export default function WaitlistPage() {
  const { user, logout } = useAuth();
  const { toast } = useToast();

  const handleGitHubAuth = async () => {
    try {
      await signInWithGitHub();
      // The user will be redirected to GitHub OAuth and then back to /auth/callback
    } catch (error) {
      console.error('GitHub auth error:', error);
      toast({
        title: "Authentication failed",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <Github className="text-4xl text-indigo-600 dark:text-indigo-400 mr-3" />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
              CommitKings
            </h1>
          </div>
          
          <Badge variant="secondary" className="mb-6 px-4 py-2 text-sm font-medium">
            <Rocket className="w-4 h-4 mr-2" />
            Coming Soon
          </Badge>

          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Rate GitHub Profiles & Repositories
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Discover amazing developers and repositories. Join the waitlist to be among the first to explore 
            the ultimate community-driven showcase of GitHub talent!
          </p>
        </div>

        {/* Features Preview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto bg-indigo-100 dark:bg-indigo-900 rounded-full p-3 mb-4 w-fit">
                <Star className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <CardTitle className="text-lg">Rate & Discover</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Vote 🔥 Hotty or 🧊 Notty on GitHub profiles and repositories
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto bg-yellow-100 dark:bg-yellow-900 rounded-full p-3 mb-4 w-fit">
                <Crown className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <CardTitle className="text-lg">Leaderboards</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                See the top-rated developers and most popular repositories
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto bg-green-100 dark:bg-green-900 rounded-full p-3 mb-4 w-fit">
                <Users className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <CardTitle className="text-lg">Community</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Connect with developers and discover new open source projects
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Login/Profile Section */}
        <Card className="max-w-md mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
              {user ? "Welcome to CommitKings! 👋" : "Join CommitKings"}
            </CardTitle>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              {user ? "You're all set for the launch!" : "Sign in with GitHub to get notified when we launch"}
            </p>
          </CardHeader>
          <CardContent>
            {user ? (
              <div className="text-center space-y-4">
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
                  <div className="flex items-center justify-center mb-4">
                    <Image
                      src={user.avatar_url || ''}
                      alt={user.username}
                      width={64}
                      height={64}
                      className="rounded-full border-2 border-green-200 dark:border-green-600"
                    />
                  </div>
                  <p className="text-green-800 dark:text-green-200 font-medium text-lg">
                    Welcome, {user.username}! 🎉
                  </p>
                  <p className="text-green-600 dark:text-green-300 text-sm mt-2">
                    You&apos;re registered for CommitKings. We&apos;ll email you as soon as we launch!
                  </p>
                </div>
                <div className="pt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={async () => {
                      try {
                        const { signOut } = await import('@/lib/supabase');
                        await signOut();
                        logout();
                        toast({
                          title: "Signed out",
                          description: "You have been successfully signed out.",
                        });
                      } catch (error) {
                        console.error('Logout error:', error);
                        logout(); // Fallback to local logout
                        toast({
                          title: "Signed out",
                          description: "You have been signed out.",
                        });
                      }
                    }}
                    className="w-full cursor-pointer"
                  >
                    Sign out
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-4">
                <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg p-6">
                  <Github className="w-12 h-12 text-indigo-600 dark:text-indigo-400 mx-auto mb-4" />
                  <p className="text-indigo-800 dark:text-indigo-200 font-medium">
                    Ready to join the community?
                  </p>
                  <p className="text-indigo-600 dark:text-indigo-300 text-sm mt-2">
                    Connect with GitHub to get early access when we launch!
                  </p>
                </div>
                <Button
                  onClick={handleGitHubAuth}
                  className="w-full bg-indigo-900 hover:bg-indigo-800 text-white flex items-center justify-center cursor-pointer"
                >
                  <Github className="w-4 h-4 mr-2" />
                  Sign in with GitHub
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-12 text-sm text-gray-500 dark:text-gray-400">
          <p>Built with ❤️ for the developer community</p>
          <p className="mt-2">No spam, just launch notifications and updates</p>
        </div>
      </div>
    </div>
  );
}
