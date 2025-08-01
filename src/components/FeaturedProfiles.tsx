import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Flame, Snowflake } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { githubAPI } from "@/lib/github";
import { AvatarWithLoading } from "@/components/ui/avatar-with-loading";
import { FeaturedContentSkeleton } from "@/components/skeletons";

interface LeaderboardEntry {
  id: string;
  github_id: string;
  type: string;
  username?: string;
  avatar_url?: string;
  hotty_count: number;
  notty_count: number;
}

interface FeaturedProfile {
  username: string;
  avatar_url: string;
  bio?: string;
  hotty_count: number;
  notty_count: number;
}

interface FeaturedProfilesProps {
  onProfileSelect: (username: string) => void;
}

export function FeaturedProfiles({ onProfileSelect }: FeaturedProfilesProps) {
  // Get top 3 profiles from leaderboard
  const { data: leaderboard } = useQuery<LeaderboardEntry[]>({
    queryKey: ['/api/leaderboard', 'profile'],
  });

  const { data: featuredProfiles, isLoading } = useQuery<FeaturedProfile[]>({
    queryKey: ['featured-profiles', leaderboard],
    queryFn: async () => {
      if (!leaderboard || leaderboard.length === 0) return [];

      const top3 = leaderboard.slice(0, 3);
      const profiles = await Promise.all(
        top3.map(async (entry) => {
          try {
            // Fetch real GitHub profile data
            const githubProfile = await githubAPI.getUser(entry.github_id);
            return {
              username: githubProfile.login,
              avatar_url: githubProfile.avatar_url,
              bio: githubProfile.bio || `${githubProfile.public_repos} public repositories`,
              hotty_count: entry.hotty_count,
              notty_count: entry.notty_count,
            };
          } catch {
            // Fallback if GitHub API fails
            return {
              username: entry.github_id,
              avatar_url: entry.avatar_url || `https://avatars.githubusercontent.com/u/${entry.github_id}?v=4`,
              bio: 'GitHub Developer',
              hotty_count: entry.hotty_count,
              notty_count: entry.notty_count,
            };
          }
        })
      );
      return profiles;
    },
    enabled: !!leaderboard && leaderboard.length > 0,
  });

  // Fallback data when database is not available
  const fallbackProfiles = [
    {
      username: 't3dotgg',
      avatar_url: 'https://github.com/t3dotgg.png',
      bio: 'TypeScript enthusiast, creator of create-t3-app',
      hotty_count: 2100,
      notty_count: 145,
    },
    {
      username: 'BlankParticle',
      avatar_url: 'https://github.com/BlankParticle.png',
      bio: 'Full-stack developer and open source contributor',
      hotty_count: 1800,
      notty_count: 89,
    },
    {
      username: 'StarKnightt',
      avatar_url: 'https://github.com/StarKnightt.png',
      bio: 'React & Next.js developer',
      hotty_count: 1500,
      notty_count: 203,
    }
  ];

  const displayProfiles = (featuredProfiles && featuredProfiles.length > 0) ? featuredProfiles : fallbackProfiles;

  if (isLoading) {
    return <FeaturedContentSkeleton />;
  }

  return (
    <section className="mb-12">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
          🏆 Top Rated Developers
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayProfiles?.map((profile, index) => (
            <Card
              key={profile.username}
              className="hover:shadow-lg transition-shadow cursor-pointer relative"
              onClick={() => onProfileSelect(profile.username)}
            >
              {index === 0 && (
                <div className="absolute -top-2 -right-2 bg-gray-600 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                  👑
                </div>
              )}
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <AvatarWithLoading
                    src={profile.avatar_url}
                    alt={`${profile.username}'s avatar`}
                    username={profile.username}
                    type="user"
                    size="md"
                    className="border-2 border-gray-200 dark:border-gray-600"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {profile.username}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {profile.bio}
                    </p>
                  </div>
                </div>

                <div className="flex justify-between items-center text-sm">
                  <div className="flex space-x-4">
                    <span className="flex items-center text-orange-500">
                      <Flame className="w-4 h-4 mr-1" />
                      {profile.hotty_count.toLocaleString()}
                    </span>
                    <span className="flex items-center text-blue-400">
                      <Snowflake className="w-4 h-4 mr-1" />
                      {profile.notty_count.toLocaleString()}
                    </span>
                  </div>
                  <Button variant="ghost" size="sm" className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium">
                    Rate →
                  </Button>
                </div>

                {index < 3 && (
                  <div className="mt-3 text-center">
                    <Badge variant={index === 0 ? "default" : "secondary"} className="text-xs">
                      #{index + 1} Developer
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
