'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, GitFork, Flame, Snowflake } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { githubAPI } from "@/lib/github";
import Image from "next/image";

interface LeaderboardEntry {
  id: string;
  github_id: string;
  type: string;
  repository_name?: string;
  owner_avatar_url?: string;
  hotty_count: number;
  notty_count: number;
}

interface FeaturedRepository {
  full_name: string;
  name: string;
  owner: {
    login: string;
    avatar_url: string;
  };
  description?: string;
  stargazers_count: number;
  forks_count: number;
  language?: string;
  hotty_count: number;
  notty_count: number;
}

interface FeaturedRepositoriesProps {
  onRepositorySelect: (fullName: string) => void;
}

export function FeaturedRepositories({ onRepositorySelect }: FeaturedRepositoriesProps) {
  // Get top 3 repositories from leaderboard
  const { data: leaderboard } = useQuery<LeaderboardEntry[]>({
    queryKey: ['/api/leaderboard', 'repo'],
  });

  const { data: featuredRepos, isLoading } = useQuery<FeaturedRepository[]>({
    queryKey: ['featured-repositories', leaderboard],
    queryFn: async () => {
      if (!leaderboard || leaderboard.length === 0) return [];

      const top3 = leaderboard.slice(0, 3);
      const repos = await Promise.all(
        top3.map(async (entry) => {
          try {
            // Fetch real GitHub repository data
            const [owner, repo] = entry.github_id.split('/');
            const githubRepo = await githubAPI.getRepo(owner, repo);
            return {
              ...githubRepo,
              hotty_count: entry.hotty_count,
              notty_count: entry.notty_count,
            };
          } catch (error) {
            // Fallback if GitHub API fails
            const [owner, repo] = entry.github_id.split('/');
            return {
              full_name: entry.github_id,
              name: repo,
              owner: {
                login: owner,
                avatar_url: entry.owner_avatar_url || `https://avatars.githubusercontent.com/u/${entry.github_id}?v=4`,
              },
              description: 'Popular GitHub Repository',
              stargazers_count: 0,
              forks_count: 0,
              language: 'Unknown',
              hotty_count: entry.hotty_count,
              notty_count: entry.notty_count,
            };
          }
        })
      );
      return repos;
    },
    enabled: !!leaderboard && leaderboard.length > 0,
  });

  // Fallback data when database is not available
  const fallbackRepos = [
    {
      full_name: 'vercel/next.js',
      name: 'next.js',
      owner: {
        login: 'vercel',
        avatar_url: 'https://github.com/vercel.png',
      },
      description: 'The React Framework for the Web',
      stargazers_count: 125000,
      forks_count: 26800,
      language: 'JavaScript',
      hotty_count: 3500,
      notty_count: 120,
    },
    {
      full_name: 'facebook/react',
      name: 'react',
      owner: {
        login: 'facebook',
        avatar_url: 'https://github.com/facebook.png',
      },
      description: 'The library for web and native user interfaces',
      stargazers_count: 228000,
      forks_count: 46500,
      language: 'JavaScript',
      hotty_count: 4200,
      notty_count: 95,
    },
    {
      full_name: 'microsoft/vscode',
      name: 'vscode',
      owner: {
        login: 'microsoft',
        avatar_url: 'https://github.com/microsoft.png',
      },
      description: 'Visual Studio Code',
      stargazers_count: 163000,
      forks_count: 28900,
      language: 'TypeScript',
      hotty_count: 2800,
      notty_count: 180,
    }
  ];

  const displayRepos = (featuredRepos && featuredRepos.length > 0) ? featuredRepos : fallbackRepos;

  if (isLoading) {
    return (
      <section className="mb-12">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            🏆 Top Rated Repositories
          </h2>
          <div className="text-center text-gray-500 dark:text-gray-400">
            Loading featured repositories...
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="mb-12">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
          🏆 Top Rated Repositories
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayRepos?.map((repo, index) => (
            <Card
              key={repo.full_name}
              className="hover:shadow-lg transition-shadow cursor-pointer relative"
              onClick={() => onRepositorySelect(repo.full_name)}
            >
              {index === 0 && (
                <div className="absolute -top-2 -right-2 bg-yellow-500 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                  👑
                </div>
              )}
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Image
                    src={repo.owner.avatar_url}
                    alt={`${repo.owner.login}'s avatar`}
                    width={48}
                    height={48}
                    className="w-12 h-12 rounded-full border-2 border-gray-200 dark:border-gray-600"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                      {repo.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      by {repo.owner.login}
                    </p>
                  </div>
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                  {repo.description || 'No description available'}
                </p>

                <div className="flex justify-between items-center text-sm mb-3">
                  <div className="flex space-x-3">
                    <span className="flex items-center text-yellow-500">
                      <Star className="w-4 h-4 mr-1" />
                      {repo.stargazers_count.toLocaleString()}
                    </span>
                    <span className="flex items-center text-blue-500">
                      <GitFork className="w-4 h-4 mr-1" />
                      {repo.forks_count.toLocaleString()}
                    </span>
                  </div>
                  {repo.language && (
                    <Badge variant="outline" className="text-xs">
                      {repo.language}
                    </Badge>
                  )}
                </div>

                <div className="flex justify-between items-center text-sm">
                  <div className="flex space-x-4">
                    <span className="flex items-center text-orange-500">
                      <Flame className="w-4 h-4 mr-1" />
                      {repo.hotty_count.toLocaleString()}
                    </span>
                    <span className="flex items-center text-blue-400">
                      <Snowflake className="w-4 h-4 mr-1" />
                      {repo.notty_count.toLocaleString()}
                    </span>
                  </div>
                  <Button variant="ghost" size="sm" className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium">
                    Rate →
                  </Button>
                </div>

                {index < 3 && (
                  <div className="mt-3 text-center">
                    <Badge variant={index === 0 ? "default" : "secondary"} className="text-xs">
                      #{index + 1} Repository
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
