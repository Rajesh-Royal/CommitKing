import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Github, Home, Trophy, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { signInWithGitHub } from "@/lib/supabase";
import Image from "next/image";
import { ThemeToggle } from "./ui/theme-toggle";

export function Navigation() {
  const { user, logout, isLoading } = useAuth();
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
              <Image
                src="/web-app-manifest-512x512.png"
                alt="CommitKings Logo"
                width={50}
                height={50}
                className="mr-3" />
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
                className={`px-3 py-2 text-sm font-medium transition-colors ${isActive('/')
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
                className={`px-3 py-2 text-sm font-medium transition-colors ${isActive('/leaderboard')
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
                  className={`px-3 py-2 text-sm font-medium transition-colors ${isActive('/dashboard')
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

            {isLoading ? (
              // Show loading skeleton for auth state
              <div className="flex items-center space-x-3 animate-pulse">
                <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
              </div>
            ) : user ? (
              <div className="flex items-center space-x-3">
                <Image
                  src={user.avatar_url || '/default-avatar.png'}
                  alt={user.username}
                  width={32}
                  height={32}
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
              variant="default"
                onClick={handleGitHubAuth}
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
