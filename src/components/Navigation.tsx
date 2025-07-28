import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useAuth } from "@/contexts/AuthContext";
import { githubAPI } from "@/lib/github";
import { Github, Home, Trophy, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { signInWithGitHub } from "@/lib/supabase";

export function Navigation() {
  const { user, login, logout } = useAuth();
  const pathname = usePathname();
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

  const isActive = (path: string) => pathname === path;

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Github className="text-2xl text-indigo-600 dark:text-indigo-400 mr-2" />
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                CommitKings
              </h1>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/">
              <Button
                variant="ghost"
                className={`px-3 py-2 text-sm font-medium transition-colors ${
                  isActive('/') 
                    ? 'text-gray-900 dark:text-white' 
                    : 'text-gray-500 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400'
                }`}
              >
                <Home className="w-4 h-4 mr-1" />
                Home
              </Button>
            </Link>
            <Link href="/leaderboard">
              <Button
                variant="ghost"
                className={`px-3 py-2 text-sm font-medium transition-colors ${
                  isActive('/leaderboard') 
                    ? 'text-gray-900 dark:text-white' 
                    : 'text-gray-500 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400'
                }`}
              >
                <Trophy className="w-4 h-4 mr-1" />
                Leaderboard
              </Button>
            </Link>
            {user && (
              <Link href="/dashboard">
                <Button
                  variant="ghost"
                  className={`px-3 py-2 text-sm font-medium transition-colors ${
                    isActive('/dashboard') 
                      ? 'text-gray-900 dark:text-white' 
                      : 'text-gray-500 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400'
                  }`}
                >
                  <User className="w-4 h-4 mr-1" />
                  Dashboard
                </Button>
              </Link>
            )}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            
            {user ? (
              <div className="flex items-center space-x-3">
                <img
                  src={user.avatar_url || ''}
                  alt={user.username}
                  className="w-8 h-8 rounded-full"
                />
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {user.username}
                </span>
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
                >
                  Sign out
                </Button>
              </div>
            ) : (
              <Button
                onClick={handleGitHubAuth}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center transition-colors"
              >
                <Github className="w-4 h-4 mr-2" />
                Sign in with GitHub
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
