import { useQuery } from '@tanstack/react-query';
import { GitBranch, User } from 'lucide-react';

import { useState } from 'react';

import { LeaderboardTableSkeleton } from '@/components/skeletons';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

type LeaderboardType = 'profile' | 'repo';

interface LeaderboardEntry {
  id: string;
  github_id: string;
  type: string;
  username?: string;
  avatar_url?: string;
  hotty_count: number;
  notty_count: number;
}

export function LeaderboardTable() {
  const [type, setType] = useState<LeaderboardType>('profile');

  const { data: leaderboard, isLoading } = useQuery<LeaderboardEntry[]>({
    queryKey: ['/api/leaderboard', type],
    staleTime: 60 * 1000, // 1 minute
    gcTime: 60 * 1000, // 1 minute
  });

  const getRankEmoji = (index: number) => {
    switch (index) {
      case 0:
        return '🥇';
      case 1:
        return '🥈';
      case 2:
        return '🥉';
      default:
        return '';
    }
  };

  const getScorePercentage = (hotty: number, notty: number) => {
    const total = hotty + notty;
    if (total === 0) return 0;
    return ((hotty / total) * 100).toFixed(1);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          🏆 Leaderboard
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Top-rated developers and repositories in the community
        </p>
      </div>

      {/* Type Toggle */}
      <div className="flex justify-center mb-6">
        <div className="bg-gray-100 dark:bg-gray-700 p-1 rounded-lg flex">
          <Button
            variant={type === 'profile' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setType('profile')}
            className="px-6 py-2 rounded-md text-sm font-medium transition-all"
          >
            <User className="w-4 h-4 mr-2" />
            Top Profiles
          </Button>
          <Button
            variant={type === 'repo' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setType('repo')}
            className="px-6 py-2 rounded-md text-sm font-medium transition-all"
          >
            <GitBranch className="w-4 h-4 mr-2" />
            Top Repositories
          </Button>
        </div>
      </div>

      {/* Leaderboard Table */}
      {isLoading ? (
        <LeaderboardTableSkeleton />
      ) : (
        <Card>
          <CardContent className="p-0">
            {!leaderboard || leaderboard.length === 0 ? (
              <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                No leaderboard data available yet. Start rating to build the
                leaderboard!
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Rank
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        {type === 'profile' ? 'Profile' : 'Repository'}
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        🔥 Hotty
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        🧊 Notty
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Score
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {leaderboard.map(
                      (entry: LeaderboardEntry, index: number) => (
                        <tr
                          key={entry.id}
                          className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <span className="text-2xl mr-2">
                                {getRankEmoji(index)}
                              </span>
                              <span className="text-sm font-medium text-gray-900 dark:text-white">
                                {index + 1}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              {entry.avatar_url && (
                                <img
                                  src={entry.avatar_url}
                                  alt="Avatar"
                                  className="w-10 h-10 rounded-full mr-3"
                                />
                              )}
                              <div>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                  {entry.username || entry.github_id}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  {type === 'profile'
                                    ? 'Developer'
                                    : 'Repository'}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <span className="text-lg font-bold text-orange-500">
                              {entry.hotty_count.toLocaleString()}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <span className="text-lg font-bold text-blue-400">
                              {entry.notty_count.toLocaleString()}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <span className="text-lg font-bold text-green-500">
                              {getScorePercentage(
                                entry.hotty_count,
                                entry.notty_count
                              )}
                              %
                            </span>
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
