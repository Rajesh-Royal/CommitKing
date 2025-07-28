import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, MapPin, Users, Code } from "lucide-react";
import { ContributionGraph } from "./ContributionGraph";

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
  contributions?: any[];
  totalContributions?: number;
  type: 'profile' | 'repo';
}

export function ProfileCard({ 
  profile, 
  repository, 
  contributions = [], 
  totalContributions = 0, 
  type 
}: ProfileCardProps) {
  if (type === 'profile' && profile) {
    return (
      <Card className="w-full max-w-4xl mx-auto overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img
                src={profile.avatar_url}
                alt={`${profile.login}'s avatar`}
                className="w-16 h-16 rounded-full border-2 border-gray-200 dark:border-gray-600"
              />
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {profile.login}
                </h2>
                {profile.name && (
                  <p className="text-lg text-gray-700 dark:text-gray-300">
                    {profile.name}
                  </p>
                )}
                {profile.bio && (
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    {profile.bio}
                  </p>
                )}
                <div className="flex items-center mt-2 space-x-4 text-sm text-gray-500 dark:text-gray-400">
                  {profile.location && (
                    <span className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {profile.location}
                    </span>
                  )}
                  <span className="flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    {profile.followers.toLocaleString()} followers
                  </span>
                  <span className="flex items-center">
                    <Code className="w-4 h-4 mr-1" />
                    {profile.public_repos} repos
                  </span>
                </div>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => window.open(profile.html_url, '_blank')}
              className="flex items-center"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              View on GitHub
            </Button>
          </div>
        </div>

        {/* Contribution Graph */}
        <CardContent className="p-6">
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
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img
                src={repository.owner.avatar_url}
                alt={`${repository.owner.login}'s avatar`}
                className="w-16 h-16 rounded-full border-2 border-gray-200 dark:border-gray-600"
              />
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {repository.full_name}
                </h2>
                {repository.description && (
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    {repository.description}
                  </p>
                )}
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => window.open(repository.html_url, '_blank')}
              className="flex items-center"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              View on GitHub
            </Button>
          </div>
        </div>

        {/* Repository Metrics */}
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                ⭐ {repository.stargazers_count.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Stars</div>
            </div>
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                🍴 {repository.forks_count.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Forks</div>
            </div>
            <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                🐛 {repository.open_issues_count.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Issues</div>
            </div>
            <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                👥 {repository.owner.login}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Owner</div>
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
