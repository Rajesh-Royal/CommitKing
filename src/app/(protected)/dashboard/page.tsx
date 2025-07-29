'use client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { BarChart3, User, Github } from "lucide-react";

export default function DashboardPage() {
  const { user } = useAuth();

  const { data: userStats } = useQuery<{ratingCount: number}>({
    queryKey: ['/api/users', user?.id, 'stats'],
    enabled: !!user,
  });

  if (!user) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Please sign in to view your dashboard.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Your CommitKings activity and statistics
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Profile Card */}
        <Card>
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profile</CardTitle>
            <User className="h-4 w-4 ml-auto text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-3">
              <img
                src={user.avatar_url || ''}
                alt={user.username}
                className="w-12 h-12 rounded-full"
              />
              <div>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {user.username}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  GitHub ID: {user.github_id}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Rating Count */}
        <Card>
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Ratings</CardTitle>
            <BarChart3 className="h-4 w-4 ml-auto text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {userStats?.ratingCount || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Profiles and repositories rated
            </p>
          </CardContent>
        </Card>

        {/* Join Date */}
        <Card>
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Member Since</CardTitle>
            <Github className="h-4 w-4 ml-auto text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground">
              Welcome to CommitKings!
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Privacy Notice */}
      <Card>
        <CardHeader>
          <CardTitle>Privacy & Data</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                🔒 Privacy-First Approach
              </h3>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                CommitKings respects your privacy. We only display aggregate rating counts on leaderboards. 
                Your individual ratings are never shown publicly, and only you can see your personal statistics.
              </p>
            </div>
            
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <h3 className="font-semibold text-green-900 dark:text-green-100 mb-2">
                🌟 Contributing to the Community
              </h3>
              <p className="text-sm text-green-800 dark:text-green-200">
                Your ratings help build a community-driven showcase of amazing developers and repositories. 
                Thank you for participating and helping others discover great GitHub profiles!
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
