import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface RatingButtonsProps {
  githubId: string;
  type: 'profile' | 'repo';
  onRated?: () => void;
  disabled?: boolean;
}

export function RatingButtons({ githubId, type, onRated, disabled = false }: RatingButtonsProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get rating counts - DISABLED for performance
  // const { data: counts } = useQuery<{hotty: number; notty: number}>({
  //   queryKey: ['/api/ratings', githubId, type, 'counts'],
  //   enabled: !!githubId,
  // });

  // Check if user has already rated
  const { data: userRating } = useQuery<{hasRated: boolean; rating?: string}>({
    queryKey: ['/api/ratings/user', user?.id, 'check', githubId, type],
    enabled: !!user && !!githubId,
  });

  const ratingMutation = useMutation({
    mutationFn: async (rating: 'hotty' | 'notty') => {
      if (!user) throw new Error('Must be logged in to rate');
      
      return apiRequest('POST', '/api/ratings', {
        user_id: user.id,
        github_id: githubId,
        type,
        rating,
      });
    },
    onMutate: async (rating) => {
      // Optimistic update for user rating only (no counts)
      queryClient.setQueryData(['/api/ratings/user', user?.id, 'check', githubId, type], {
        hasRated: true,
        rating,
      });
    },
    onError: (error: Error) => {
      // Rollback optimistic updates on error
      queryClient.setQueryData(['/api/ratings/user', user?.id, 'check', githubId, type], {
        hasRated: false,
      });
      
      toast({
        title: "Rating failed",
        description: error.message || "Failed to submit rating",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      // Invalidate and refetch relevant queries silently (no counts API)
      queryClient.invalidateQueries({ queryKey: ['/api/ratings/user', user?.id, 'check', githubId, type] });
      queryClient.invalidateQueries({ queryKey: ['/api/leaderboard'] });
      
      // No toast needed since user has already moved on to next item
    },
  });

  const handleRating = (rating: 'hotty' | 'notty') => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in with GitHub to rate profiles and repositories.",
        variant: "destructive",
      });
      return;
    }

    if (userRating?.hasRated) {
      toast({
        title: "Already rated",
        description: "You have already rated this item.",
        variant: "destructive",
      });
      return;
    }

    // Call onRated immediately for optimistic transition
    onRated?.();
    
    // Then submit the rating in the background
    ratingMutation.mutate(rating);
  };

  const isDisabled = !user || userRating?.hasRated || ratingMutation.isPending || disabled;

  return (
    <div className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 p-6">
      <div className="flex justify-center space-x-8">
        <Button
          onClick={() => handleRating('notty')}
          disabled={isDisabled}
          className="group bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-8 py-4 rounded-xl text-lg font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          <span className="text-2xl mr-3">🧊</span>
          <span>Notty</span>
        </Button>
        
        <Button
          onClick={() => handleRating('hotty')}
          disabled={isDisabled}
          className="group bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-4 rounded-xl text-lg font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          <span className="text-2xl mr-3">🔥</span>
          <span>Hotty</span>
        </Button>
      </div>
      
      {userRating?.hasRated && (
        <div className="text-center mt-4 text-sm text-gray-500 dark:text-gray-400">
          You rated this {type} as {userRating.rating === 'hotty' ? '🔥 Hotty' : '🧊 Notty'}
        </div>
      )}
      
      {!user && (
        <div className="text-center mt-4 text-sm text-gray-500 dark:text-gray-400">
          Sign in with GitHub to rate this {type}
        </div>
      )}
    </div>
  );
}
