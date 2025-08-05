'use client';

import { useQuery } from '@tanstack/react-query';
import { SkipForward } from 'lucide-react';

import { Suspense } from 'react';
import { useEffect, useState } from 'react';

import { useSearchParams } from 'next/navigation';

import { FeaturedProfiles } from '@/components/FeaturedProfiles';
import { FeaturedRepositories } from '@/components/FeaturedRepositories';
import { NoMoreContent } from '@/components/NoMoreContent';
import { ProfileCard } from '@/components/ProfileCard';
import { RatingButtons } from '@/components/RatingButtons';
import { SearchToggle } from '@/components/SearchToggle';
import { TabSelector } from '@/components/TabSelector';
import { ProfileCardSkeleton, RepoCardSkeleton } from '@/components/skeletons';
import { AvatarWithLoading } from '@/components/ui/avatar-with-loading';
import { Button } from '@/components/ui/button';

import { useGitHubErrorHandler } from '@/hooks/useGitHubErrorHandler';
import { useItemQueue } from '@/hooks/useItemQueue';

import { githubAPI } from '@/lib/github';

function HomePageContent() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<'profile' | 'repo'>('profile');
  const {
    currentItem,
    isLoading: queueLoading,
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

  // Handle URL parameters on initial load or initialize queue
  useEffect(() => {
    const type = searchParams.get('type') as 'profile' | 'repo' | null;
    const val = searchParams.get('val');

    if (type && val && (type === 'profile' || type === 'repo')) {
      setActiveTab(type);
      setSpecificItem({ type, id: val });
    } else {
      initializeQueue();
    }
  }, [searchParams, setSpecificItem, initializeQueue]);

  // Initialize queue when tab changes (but not on initial load if we have URL params)
  useEffect(() => {
    const type = searchParams.get('type');
    const val = searchParams.get('val');

    // Only initialize queue if we don't have URL params
    if (!type || !val) {
      initializeQueue();
    }
  }, [activeTab, initializeQueue, searchParams]);

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

  const isLoading =
    queueLoading || ((profileLoading || repoLoading) && !isTransitioning);
  const totalContributions =
    contributions?.reduce((sum, day) => sum + day.count, 0) || 0;

  // Show loading when queue is loading or when we have a current item but data is loading
  const shouldShowLoading =
    queueLoading ||
    (currentItem && (profileLoading || repoLoading) && !isTransitioning);

  // Show NoMoreContent only when queue is not loading, no current item, and not transitioning
  const shouldShowNoMoreContent =
    !queueLoading && !currentItem && !isTransitioning;

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Hero Section */}
      <section className="text-center mb-8 sm:mb-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
            Rate GitHub Profiles & Repos
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-6 sm:mb-8 px-2">
            Discover amazing developers and repositories. Vote 🔥{' '}
            <strong>Hotty</strong> or 🧊 <strong>Notty</strong> and explore the
            community!
          </p>

          <SearchToggle onSearch={handleSearch} isLoading={isSearching} />
        </div>
      </section>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <section className="mb-8 sm:mb-12">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">
            Search Results
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
            {searchResults.slice(0, 6).map(result => (
              <div
                key={result.id}
                className="bg-white dark:bg-gray-800 rounded-lg p-3 sm:p-4 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow cursor-pointer"
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
      <div className="mb-12" style={{ minHeight: 560 }}>
        {shouldShowLoading ? (
          // Show appropriate skeleton based on current item type
          activeTab === 'profile' ? (
            <ProfileCardSkeleton />
          ) : (
            <RepoCardSkeleton />
          )
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
              githubId={
                currentItem.type === 'profile'
                  ? profileData?.id?.toString() || ''
                  : repoData?.owner?.id?.toString() || ''
              }
              gitUserName={
                currentItem.type === 'profile'
                  ? profileData?.name?.toString() || ''
                  : repoData?.full_name?.toString() || ''
              }
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
        ) : shouldShowNoMoreContent ? (
          // Use NoMoreContent component only when truly no more content available
          <NoMoreContent
            itemType={activeTab}
            onSearchClick={() => {
              // Focus on search toggle
              const searchElement = document.querySelector(
                '[data-search-toggle]'
              );
              if (searchElement) {
                (searchElement as HTMLElement).focus();
              }
            }}
            onRefreshClick={loadNextItem}
          />
        ) : null}
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

export default function HomePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomePageContent />
    </Suspense>
  );
}
