import { useAuth } from '@/contexts/AuthContext';
import { Github, Home, Loader2, Menu, Trophy, User } from 'lucide-react';

import { useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

import { useToast } from '@/hooks/use-toast';

import { signInWithGitHub } from '@/lib/supabase';

import { ThemeToggle } from './ui/theme-toggle';

export function Navigation() {
  const { user, logout, isLoading } = useAuth();
  const pathname = usePathname();
  const { toast } = useToast();
  const [isSigningIn, setIsSigningIn] = useState(false);

  const handleGitHubAuth = async () => {
    setIsSigningIn(true);
    toast({
      title: 'Sign In clicked',
      description: 'Redirecting to GitHub login...',
      variant: 'default',
    });

    // Do not block the UI with a loading state
    setTimeout(async () => {
      try {
        await signInWithGitHub();
        // The user will be redirected to GitHub OAuth and then back to /auth/callback
      } catch (error) {
        console.error('GitHub auth error:', error);
        toast({
          title: 'Authentication failed',
          description:
            error instanceof Error ? error.message : 'Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsSigningIn(false);
      }
    }, 1000);
  };

  const handleLogout = async () => {
    try {
      const { signOut } = await import('@/lib/supabase');
      await signOut();
      logout();
      toast({
        title: 'Signed out',
        description: 'You have been successfully signed out.',
      });
    } catch (error) {
      console.error('Logout error:', error);
      logout(); // Fallback to local logout
      toast({
        title: 'Signed out',
        description: 'You have been signed out.',
      });
    }
  };

  const isActive = (path: string) => pathname === path;

  const navLinks = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/leaderboard', label: 'Leaderboard', icon: Trophy },
    ...(user ? [{ href: '/dashboard', label: 'Dashboard', icon: User }] : []),
  ];

  const NavLink = ({
    href,
    label,
    icon: Icon,
    mobile = false,
  }: {
    href: string;
    label: string;
    icon: React.ElementType;
    mobile?: boolean;
  }) => (
    <Link href={href}>
      <Button
        variant="ghost"
        className={`${mobile ? 'w-full justify-start' : ''} px-3 py-2 text-sm font-medium transition-colors ${
          isActive(href)
            ? 'text-gray-900 dark:text-white'
            : 'text-gray-500 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400'
        }`}
      >
        <Icon className="w-4 h-4 mr-1" />
        {label}
      </Button>
    </Link>
  );

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
                className="mr-3"
              />
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                CommitKings
              </h1>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex space-x-8">
            {navLinks.map(link => (
              <NavLink key={link.href} {...link} />
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            <ThemeToggle />

            {isLoading ? (
              // Show loading skeleton for auth state
              <div className="flex items-center space-x-3 animate-pulse">
                <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20 hidden sm:block"></div>
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
              </div>
            ) : user ? (
              <>
                {/* Desktop User Info */}
                <div className="hidden sm:flex items-center space-x-3">
                  <Image
                    src={user.user_metadata.avatar_url || '/default-avatar.png'}
                    alt={
                      user.user_metadata.user_name ||
                      user.user_metadata.preferred_username ||
                      'User'
                    }
                    width={32}
                    height={32}
                    className="w-8 h-8 rounded-full"
                    unoptimized
                  />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {user.user_metadata.user_name ||
                      user.user_metadata.preferred_username ||
                      'User'}
                  </span>
                  <Button variant="outline" size="sm" onClick={handleLogout}>
                    Sign out
                  </Button>
                </div>

                {/* Mobile User Avatar and Menu */}
                <div className="flex sm:hidden items-center space-x-2">
                  <Image
                    src={user.user_metadata.avatar_url || '/default-avatar.png'}
                    alt={
                      user.user_metadata.user_name ||
                      user.user_metadata.preferred_username ||
                      'User'
                    }
                    width={32}
                    height={32}
                    className="w-8 h-8 rounded-full"
                    unoptimized
                  />
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <Menu className="w-5 h-5" />
                      </Button>
                    </SheetTrigger>
                    <SheetContent
                      side="right"
                      className="w-[300px] sm:w-[400px]"
                    >
                      <SheetHeader>
                        <SheetTitle className="text-left">
                          Navigation
                        </SheetTitle>
                        <SheetDescription className="text-left">
                          Welcome,{' '}
                          {user.user_metadata.user_name ||
                            user.user_metadata.preferred_username ||
                            'User'}
                          !
                        </SheetDescription>
                      </SheetHeader>
                      <div className="flex flex-col space-y-4 mt-6">
                        {navLinks.map(link => (
                          <NavLink key={link.href} {...link} mobile />
                        ))}
                        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                          <Button
                            variant="outline"
                            onClick={handleLogout}
                            className="w-full justify-start"
                          >
                            Sign out
                          </Button>
                        </div>
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>
              </>
            ) : (
              <>
                {/* Desktop Sign In */}
                <Button
                  variant="default"
                  onClick={handleGitHubAuth}
                  className="hidden sm:flex"
                  disabled={isSigningIn}
                >
                  {isSigningIn ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Github className="w-4 h-4 mr-2" />
                  )}
                  {isSigningIn ? 'Signing in...' : 'Sign in with GitHub'}
                </Button>

                {/* Mobile Sign In and Menu */}
                <div className="flex sm:hidden items-center space-x-2">
                  <Button
                    variant="default"
                    onClick={handleGitHubAuth}
                    size="sm"
                    disabled={isSigningIn}
                  >
                    {isSigningIn ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      'Sign In'
                    )}
                  </Button>
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <Menu className="w-5 h-5" />
                      </Button>
                    </SheetTrigger>
                    <SheetContent
                      side="right"
                      className="w-[300px] sm:w-[400px]"
                    >
                      <SheetHeader>
                        <SheetTitle className="text-left">
                          Navigation
                        </SheetTitle>
                        <SheetDescription className="text-left">
                          Explore CommitKings
                        </SheetDescription>
                      </SheetHeader>
                      <div className="flex flex-col space-y-4 mt-6">
                        {navLinks.map(link => (
                          <NavLink key={link.href} {...link} mobile />
                        ))}
                        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                          <Button
                            variant="default"
                            onClick={handleGitHubAuth}
                            className="w-full justify-start"
                            disabled={isSigningIn}
                          >
                            {isSigningIn ? (
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            ) : (
                              <Github className="w-4 h-4 mr-2" />
                            )}
                            {isSigningIn
                              ? 'Signing in...'
                              : 'Sign in with GitHub'}
                          </Button>
                        </div>
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
