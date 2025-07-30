import { useToast } from "@/hooks/use-toast";
import { useCallback } from "react";

// Array of witty rate limit messages - one will be randomly selected
const WITTY_RATE_LIMIT_MESSAGES = [
  {
    title: "🚦 Slow Down There, Speed Racer!",
    description: "GitHub says we're asking for data faster than a caffeinated developer codes! Time to take a breather.",
  },
  {
    title: "⏰ Coffee Break Time!",
    description: "Looks like we've been a bit too eager with GitHub's API. Even robots need to catch their breath sometimes! ☕",
  },
  {
    title: "🔄 Rate Limit Timeout!",
    description: "GitHub's rate limiter just gave us a timeout. Consider it a forced break from all this hot-or-not action! 🔥",
  },
  {
    title: "🚀 Houston, We Have a Rate Limit!",
    description: "Our rocket-speed requests hit GitHub's speed bump. Time to slow down our warp drive! 🛸",
  },
  {
    title: "🎯 Bulls-eye on the Rate Limit!",
    description: "We've hit GitHub's rate limit with sniper precision! Maybe grab a snack while GitHub recharges? 🍕",
  },
  {
    title: "🏃‍♂️ Too Fast, Too Furious!",
    description: "GitHub thinks we're moving too fast! Time to shift into cruise control and enjoy the scenic route.",
  },
  {
    title: "🔋 GitHub Battery Low!",
    description: "Looks like GitHub's API battery needs recharging. While we wait, why not stretch those coding fingers? 🤲",
  },
  {
    title: "🚨 API Police on Patrol!",
    description: "The GitHub API police caught us speeding! We've been issued a temporary slow-down ticket. 🎫",
  },
  {
    title: "🐌 Time to Channel Our Inner Snail!",
    description: "GitHub wants us to embrace the snail life for a bit. Sometimes slow and steady wins the API race! 🏁",
  },
  {
    title: "🎮 Achievement Unlocked: Rate Limited!",
    description: "Congratulations! You've successfully maxed out GitHub's rate limit. This is actually pretty impressive! 🏆",
  },
  {
    title: "🌪️ API Tornado Warning!",
    description: "We've stirred up quite the data tornado at GitHub! Time to wait for the storm to pass. ⛈️",
  },
  {
    title: "🎪 The GitHub Circus is Full!",
    description: "Looks like the GitHub API circus has reached capacity. Please wait for the next show! 🎭",
  },
];

interface GitHubError {
  status?: number;
  message?: string;
  documentation_url?: string;
}

export const useGitHubErrorHandler = () => {
  const { toast } = useToast();

  const isRateLimitError = useCallback((error: unknown): boolean => {
    if (!error || typeof error !== 'object') return false;
    
    const githubError = error as GitHubError;
    
    return (
      (githubError.status === 403 &&
      githubError.message?.toLowerCase().includes('rate limit exceeded')) ||
      (githubError.documentation_url?.includes('rate-limiting') || false)
    );
  }, []);

  const getRandomRateLimitMessage = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * WITTY_RATE_LIMIT_MESSAGES.length);
    return WITTY_RATE_LIMIT_MESSAGES[randomIndex];
  }, []);

  const handleGitHubError = useCallback((error: unknown) => {
    if (isRateLimitError(error)) {
      const { title, description } = getRandomRateLimitMessage();
      
      toast({
        title,
        description,
        variant: "destructive",
        duration: 8000, // Show longer for rate limit errors
      });
      
      return true; // Indicates error was handled
    }
    
    // Handle other GitHub errors
    const githubError = error as GitHubError;
    if (githubError.status && githubError.status >= 400) {
      toast({
        title: "🐙 GitHub Says No-No!",
        description: githubError.message || "Something went wrong with GitHub. Maybe try again in a moment?",
        variant: "destructive",
      });
      
      return true;
    }
    
    return false; // Error not handled, let it bubble up
  }, [isRateLimitError, getRandomRateLimitMessage, toast]);

  return {
    handleGitHubError,
    isRateLimitError,
  };
};
