'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Github, Mail, Users, Crown, Rocket, Star } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

export default function WaitlistPage() {
  const [email, setEmail] = useState("");
  const [githubUsername, setGithubUsername] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isJoined, setIsJoined] = useState(false);
  const [position, setPosition] = useState<number | null>(null);
  const { toast } = useToast();

  // Get current waitlist count
  const { data: waitlistData } = useQuery({
    queryKey: ['waitlist-count'],
    queryFn: async () => {
      const response = await fetch('/api/waitlist');
      if (!response.ok) throw new Error('Failed to fetch waitlist count');
      return response.json();
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          github_username: githubUsername || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to join waitlist');
      }

      setIsJoined(true);
      setPosition(data.position);
      toast({
        title: "Welcome to the waitlist! 🎉",
        description: `You're #${data.position} on the list. We'll notify you when we launch!`,
      });
    } catch (error) {
      toast({
        title: "Failed to join waitlist",
        description: error instanceof Error ? error.message : "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <Github className="text-4xl text-indigo-600 dark:text-indigo-400 mr-3" />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
              CommitKings
            </h1>
          </div>
          
          <Badge variant="secondary" className="mb-6 px-4 py-2 text-sm font-medium">
            <Rocket className="w-4 h-4 mr-2" />
            Coming Soon
          </Badge>

          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Rate GitHub Profiles & Repositories
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Discover amazing developers and repositories. Join the waitlist to be among the first to explore 
            the ultimate community-driven showcase of GitHub talent!
          </p>
        </div>

        {/* Features Preview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto bg-indigo-100 dark:bg-indigo-900 rounded-full p-3 mb-4 w-fit">
                <Star className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <CardTitle className="text-lg">Rate & Discover</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Vote 🔥 Hotty or 🧊 Notty on GitHub profiles and repositories
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto bg-yellow-100 dark:bg-yellow-900 rounded-full p-3 mb-4 w-fit">
                <Crown className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <CardTitle className="text-lg">Leaderboards</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                See the top-rated developers and most popular repositories
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto bg-green-100 dark:bg-green-900 rounded-full p-3 mb-4 w-fit">
                <Users className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <CardTitle className="text-lg">Community</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Connect with developers and discover new open source projects
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Waitlist Form */}
        <Card className="max-w-md mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
              {isJoined ? "You're on the list! 🎉" : "Join the Waitlist"}
            </CardTitle>
            {waitlistData && (
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                <Users className="w-4 h-4 inline mr-1" />
                {waitlistData.count} developers waiting
              </p>
            )}
          </CardHeader>
          <CardContent>
            {isJoined ? (
              <div className="text-center space-y-4">
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                  <p className="text-green-800 dark:text-green-200 font-medium">
                    You&apos;re #{position} on the waitlist!
                  </p>
                  <p className="text-green-600 dark:text-green-300 text-sm mt-1">
                    We&apos;ll email you as soon as we launch.
                  </p>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  Want to help us spread the word? Share CommitKings with your developer friends!
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email Address *
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label htmlFor="github" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    GitHub Username (optional)
                  </label>
                  <div className="relative">
                    <Github className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="github"
                      type="text"
                      placeholder="your-username"
                      value={githubUsername}
                      onChange={(e) => setGithubUsername(e.target.value)}
                      className="w-full pl-10"
                    />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    We&apos;ll prioritize developers who share their GitHub username
                  </p>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Joining...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 mr-2" />
                      Join Waitlist
                    </div>
                  )}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-12 text-sm text-gray-500 dark:text-gray-400">
          <p>Built with ❤️ for the developer community</p>
          <p className="mt-2">No spam, just launch notifications and updates</p>
        </div>
      </div>
    </div>
  );
}
