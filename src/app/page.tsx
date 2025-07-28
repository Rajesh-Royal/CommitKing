'use client';

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ProfileCard } from "@/components/ProfileCard";
import { RatingButtons } from "@/components/RatingButtons";
import { SearchToggle } from "@/components/SearchToggle";
import { FeaturedProfiles } from "@/components/FeaturedProfiles";
import { githubAPI, PRIORITY_PROFILES, PRIORITY_REPOS } from "@/lib/github";
import { SkipForward } from "lucide-react";

export default function HomePage() {
  const [currentItem, setCurrentItem] = useState<{
    type: 'profile' | 'repo';
    id: string;
  } | null>(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Get random priority item on initial load
  useEffect(() => {
    loadRandomItem();
  }, []);

  const loadRandomItem = () => {
    // Randomly choose between profile and repo
    const type = Math.random() > 0.5 ? 'profile' : 'repo';
    
    if (type === 'profile') {
      const randomProfile = PRIORITY_PROFILES[Math.floor(Math.random() * PRIORITY_PROFILES.length)];
      setCurrentItem({ type: 'profile', id: randomProfile });
    } else {
      const randomRepo = PRIORITY_REPOS[Math.floor(Math.random() * PRIORITY_REPOS.length)];
      setCurrentItem({ type: 'repo', id: randomRepo });
    }
  };

  // Fetch current item data
  const { data: profileData, isLoading: profileLoading } = useQuery({
    queryKey: ['github-profile', currentItem?.id],
    queryFn: async () => {
      if (!currentItem || currentItem.type !== 'profile') return null;
      return githubAPI.getUser(currentItem.id);
    },
    enabled: currentItem?.type === 'profile',
  });

  const { data: repoData, isLoading: repoLoading } = useQuery({
    queryKey: ['github-repo', currentItem?.id],
    queryFn: async () => {
      if (!currentItem || currentItem.type !== 'repo') return null;
      const [owner, repo] = currentItem.id.split('/');
      return githubAPI.getRepo(owner, repo);
    },
    enabled: currentItem?.type === 'repo',
  });

  const { data: contributions } = useQuery({
    queryKey: ['github-contributions', currentItem?.id],
    queryFn: async () => {
      if (!currentItem || currentItem.type !== 'profile') return [];
      return githubAPI.getContributions(currentItem.id);
    },
    enabled: currentItem?.type === 'profile',
  });

  const handleSearch = async (query: string, type: 'profile' | 'repo') => {
    setIsSearching(true);
    try {
      let results;
      if (type === 'profile') {
        const data = await githubAPI.searchUsers(query);
        results = data.items;
      } else {
        const data = await githubAPI.searchRepos(query);
        results = data.items;
      }
      setSearchResults(results);
    } catch (error) {
      console.error('Search failed:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleProfileSelect = (username: string) => {
    setCurrentItem({ type: 'profile', id: username });
    setSearchResults([]);
  };

  const handleRated = () => {
    // Load next random item after rating
    setTimeout(loadRandomItem, 1000);
  };

  const handleSkip = () => {
    loadRandomItem();
  };

  const isLoading = profileLoading || repoLoading;
  const totalContributions = contributions?.reduce((sum, day) => sum + day.count, 0) || 0;

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <section className="text-center mb-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Rate GitHub Profiles & Repos
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Discover amazing developers and repositories. Vote 🔥 <strong>Hotty</strong> or 🧊 <strong>Notty</strong> and explore the community!
          </p>
          
          <SearchToggle onSearch={handleSearch} isLoading={isSearching} />
        </div>
      </section>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <section className="mb-12">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Search Results
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {searchResults.slice(0, 6).map((result) => (
              <div
                key={result.id}
                className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => {
                  if (result.login) {
                    // Profile result
                    setCurrentItem({ type: 'profile', id: result.login });
                  } else {
                    // Repo result
                    setCurrentItem({ type: 'repo', id: result.full_name });
                  }
                  setSearchResults([]);
                }}
              >
                <div className="flex items-center space-x-3">
                  <img
                    src={result.avatar_url || result.owner?.avatar_url}
                    alt="Avatar"
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {result.login || result.full_name}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {result.bio || result.description || 'No description'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Rating Interface */}
      <section className="mb-12">
        {isLoading ? (
          <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center">
            <div className="text-gray-500 dark:text-gray-400">Loading...</div>
          </div>
        ) : currentItem ? (
          <div className="max-w-4xl mx-auto">
            <ProfileCard
              profile={profileData || undefined}
              repository={repoData || undefined}
              contributions={contributions}
              totalContributions={totalContributions}
              type={currentItem.type}
            />
            <RatingButtons
              githubId={currentItem.type === 'profile' ? profileData?.id?.toString() || '' : repoData?.id?.toString() || ''}
              type={currentItem.type}
              onRated={handleRated}
            />
            <div className="text-center mt-4">
              <Button
                variant="ghost"
                onClick={handleSkip}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-sm font-medium transition-colors"
              >
                <SkipForward className="w-4 h-4 mr-1" />
                Skip this {currentItem.type}
              </Button>
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center">
            <div className="text-gray-500 dark:text-gray-400">
              Click &quot;Load Random&quot; to start rating!
            </div>
            <Button onClick={loadRandomItem} className="mt-4">
              Load Random Profile/Repo
            </Button>
          </div>
        )}
      </section>

      {/* Featured Profiles */}
      <FeaturedProfiles onProfileSelect={handleProfileSelect} />
    </main>
  );
}
