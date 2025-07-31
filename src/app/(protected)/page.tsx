'use client';

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ProfileCard } from "@/components/ProfileCard";
import { RatingButtons } from "@/components/RatingButtons";
import { SearchToggle } from "@/components/SearchToggle";
import { FeaturedProfiles } from "@/components/FeaturedProfiles";
import { FeaturedRepositories } from "@/components/FeaturedRepositories";
import { TabSelector } from "@/components/TabSelector";
import { githubAPI } from "@/lib/github";
import { SkipForward } from "lucide-react";
import { AvatarWithLoading } from "@/components/ui/avatar-with-loading";
import { useItemQueue } from "@/hooks/useItemQueue";
import { useGitHubErrorHandler } from "@/hooks/useGitHubErrorHandler";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'repo'>('profile');
  const {
    currentItem,
    isTransitioning,
    initializeQueue,
    transitionToNext,
    setSpecificItem,
    loadNextItem,
  } = useItemQueue({ itemType: activeTab === 'profile' ? 'profile' : 'repo' });

  const { handleGitHubError } = useGitHubErrorHandler();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Initialize queue on mount and when tab changes
  useEffect(() => {
    initializeQueue();
  }, [initializeQueue, activeTab]);

  const handleTabChange = (tab: 'profile' | 'repo') => {
    setActiveTab(tab);
  };

  const handleRepositorySelect = (fullName: string) => {
    setSpecificItem({ type: 'repo', id: fullName });
  };

  // Fetch current item data
  const { data: profileData, isLoading: profileLoading } = useQuery({
    queryKey: ['github-profile', currentItem?.id],
    queryFn: async () => {
      if (!currentItem || currentItem.type !== 'profile') return null;
      try {
        return await githubAPI.getUser(currentItem.id);
      } catch (error) {
        handleGitHubError(error);
        return null;
      }
    },
    enabled: currentItem?.type === 'profile',
  });

  const { data: repoData, isLoading: repoLoading } = useQuery({
    queryKey: ['github-repo', currentItem?.id],
    queryFn: async () => {
      if (!currentItem || currentItem.type !== 'repo') return null;
      try {
        const [owner, repo] = currentItem.id.split('/');
        return await githubAPI.getRepo(owner, repo);
      } catch (error) {
        handleGitHubError(error);
        return null;
      }
    },
    enabled: currentItem?.type === 'repo',
  });

  const { data: contributions } = useQuery({
    queryKey: ['github-contributions', currentItem?.id],
    queryFn: async () => {
      if (!currentItem || currentItem.type !== 'profile') return [];
      try {
        return await githubAPI.getContributions(currentItem.id);
      } catch (error) {
        handleGitHubError(error);
        return [];
      }
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
      // Use our centralized GitHub error handler
      const handled = handleGitHubError(error);
      if (!handled) {
        console.error('Search failed:', error);
      }
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleProfileSelect = (username: string) => {
    setSpecificItem({ type: 'profile', id: username });
    setSearchResults([]);
  };

  const handleRated = () => {
    // Optimistically transition to next item immediately with minimal delay for smooth UX
    transitionToNext(150);
  };

  const handleSkip = () => {
    transitionToNext(200);
  };

  const isLoading = (profileLoading || repoLoading) && !isTransitioning;
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
                    setSpecificItem({ type: 'profile', id: result.login });
                  } else {
                    // Repo result
                    setSpecificItem({ type: 'repo', id: result.full_name });
                  }
                  setSearchResults([]);
                }}
              >
                <div className="flex items-center space-x-3">
                  <AvatarWithLoading
                    src={result.avatar_url || result.owner?.avatar_url}
                    alt="Avatar"
                    username={result.login || result.owner?.login}
                    type={result.login ? 'user' : 'repo'}
                    size="sm"
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

      {/* Tab Selector */}
      <div className="flex justify-center mb-8">
        <TabSelector activeTab={activeTab} onTabChange={handleTabChange} />
      </div>

      {/* Rating Interface */}
      <div className="mb-12" style={{minHeight: 550}}>
        {isLoading ? (
          <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center">
            <div className="text-gray-500 dark:text-gray-400">Loading...</div>
          </div>
        ) : currentItem ? (
          <div 
            className={`max-w-4xl mx-auto transition-all duration-150 ${
              isTransitioning ? 'opacity-50 scale-95' : 'opacity-100 scale-100'
            }`}
          >
            <ProfileCard
              profile={profileData || undefined}
              repository={repoData || undefined}
              contributions={contributions}
              totalContributions={totalContributions}
              type={currentItem.type}
              isTransitioning={isTransitioning}
            />
            <RatingButtons
              githubId={currentItem.type === 'profile' ? profileData?.id?.toString() || '' : repoData?.id?.toString() || ''}
              type={currentItem.type}
              onRated={handleRated}
              disabled={isTransitioning}
            />
            <div className="text-center mt-4">
              <Button
                variant="ghost"
                onClick={handleSkip}
                disabled={isTransitioning}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-sm font-medium transition-colors disabled:opacity-50"
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
            <Button onClick={loadNextItem} className="mt-4">
              Load Random Profile/Repo
            </Button>
          </div>
        )}
      </div>

      {/* Featured Content */}
      {activeTab === 'profile' ? (
        <FeaturedProfiles onProfileSelect={handleProfileSelect} />
      ) : (
        <FeaturedRepositories onRepositorySelect={handleRepositorySelect} />
      )}
    </main>
  );
}
