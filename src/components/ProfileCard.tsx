import { Code, ExternalLink, MapPin, Users } from 'lucide-react';

import { AvatarWithLoading } from '@/components/ui/avatar-with-loading';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

import { ContributionGraph } from './ContributionGraph';

interface Profile {
  id: number;
  login: string;
  avatar_url: string;
  name: string;
  bio: string;
  location: string;
  public_repos: number;
  followers: number;
  following: number;
  html_url: string;
}

interface Repository {
  id: number;
  name: string;
  full_name: string;
  description: string;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  html_url: string;
  owner: {
    login: string;
    avatar_url: string;
  };
}

interface ProfileCardProps {
  profile?: Profile;
  repository?: Repository;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  contributions?: any[];
  totalContributions?: number;
  type: 'profile' | 'repo';
  isTransitioning?: boolean;
}

export function ProfileCard({
  profile,
  repository,
  contributions = [],
  totalContributions = 0,
  type,
  isTransitioning = false,
}: ProfileCardProps) {
  if (type === 'profile' && profile) {
    return (
      <Card className="w-full max-w-4xl mx-auto overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <AvatarWithLoading
                src={profile.avatar_url}
                alt={`${profile.login}'s avatar`}
                username={profile.login}
                type="user"
                size="lg"
                isTransitioning={isTransitioning}
                className="border-2 border-gray-200 dark:border-gray-600 self-center sm:self-auto"
              />
              <div className="text-center sm:text-left">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                  {profile.login}
                </h2>
                {profile.name && (
                  <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300">
                    {profile.name}
                  </p>
                )}
                {profile.bio && (
                  <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm sm:text-base">
                    {profile.bio}
                  </p>
                )}
                <div className="flex flex-wrap items-center justify-center sm:justify-start mt-2 gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                  {profile.location && (
                    <span className="flex items-center">
                      <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                      {profile.location}
                    </span>
                  )}
                  <span className="flex items-center">
                    <Users className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                    {profile.followers.toLocaleString()} followers
                  </span>
                  <span className="flex items-center">
                    <Code className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                    {profile.public_repos} repos
                  </span>
                </div>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => window.open(profile.html_url, '_blank')}
              className="flex items-center self-center sm:self-auto text-sm"
              size="sm"
            >
              <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
              <span className="hidden sm:inline">View on GitHub</span>
              <span className="sm:hidden">GitHub</span>
            </Button>
          </div>
        </div>

        {/* Contribution Graph */}
        <CardContent className="p-4 sm:p-6">
          <ContributionGraph
            contributions={contributions}
            totalContributions={totalContributions}
          />
        </CardContent>
      </Card>
    );
  }

  if (type === 'repo' && repository) {
    return (
      <Card className="w-full max-w-4xl mx-auto overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <AvatarWithLoading
                src={repository.owner.avatar_url}
                alt={`${repository.owner.login}'s avatar`}
                username={repository.owner.login}
                type="user"
                size="lg"
                isTransitioning={isTransitioning}
                className="border-2 border-gray-200 dark:border-gray-600 self-center sm:self-auto"
              />
              <div className="text-center sm:text-left">
                <h2 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white break-words">
                  {repository.full_name}
                </h2>
                {repository.description && (
                  <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm sm:text-base">
                    {repository.description}
                  </p>
                )}
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => window.open(repository.html_url, '_blank')}
              className="flex items-center self-center sm:self-auto text-sm"
              size="sm"
            >
              <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
              <span className="hidden sm:inline">View on GitHub</span>
              <span className="sm:hidden">GitHub</span>
            </Button>
          </div>
        </div>

        {/* Repository Metrics */}
        <CardContent className="p-4 sm:p-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <div className="text-center p-3 sm:p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <div className="text-lg sm:text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                ⭐ {repository.stargazers_count.toLocaleString()}
              </div>
              <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                Stars
              </div>
            </div>
            <div className="text-center p-3 sm:p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="text-lg sm:text-2xl font-bold text-blue-600 dark:text-blue-400">
                🍴 {repository.forks_count.toLocaleString()}
              </div>
              <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                Forks
              </div>
            </div>
            <div className="text-center p-3 sm:p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <div className="text-lg sm:text-2xl font-bold text-red-600 dark:text-red-400">
                🐛 {repository.open_issues_count.toLocaleString()}
              </div>
              <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                Issues
              </div>
            </div>
            <div className="text-center p-3 sm:p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg col-span-2 sm:col-span-1">
              <div className="text-lg sm:text-2xl font-bold text-purple-600 dark:text-purple-400 truncate">
                👥 {repository.owner.login}
              </div>
              <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                Owner
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardContent className="p-12 text-center">
        <div className="text-gray-500 dark:text-gray-400">
          No {type} data available
        </div>
      </CardContent>
    </Card>
  );
}
