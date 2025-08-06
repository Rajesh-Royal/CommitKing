'use client';

import {
  CheckCircle,
  Code,
  Flame,
  GitBranch,
  Github,
  Loader2,
  Users,
} from 'lucide-react';

import { useEffect, useState } from 'react';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface SharePageLoaderProps {
  type: 'profile' | 'repo';
  id: string;
}

export default function SharePageLoader({ type, id }: SharePageLoaderProps) {
  const router = useRouter();
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { label: 'Connecting to GitHub', icon: Github, status: 'loading' },
    {
      label: `Fetching ${type === 'profile' ? 'Profile' : 'Repository'} Data`,
      icon: type === 'profile' ? Users : Code,
      status: 'pending',
    },
    {
      label:
        type === 'profile'
          ? 'Loading Repositories'
          : 'Loading Repository Details',
      icon: GitBranch,
      status: 'pending',
    },
    { label: 'Preparing Rating Interface', icon: Flame, status: 'pending' },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 2;
        const stepIndex = Math.floor(newProgress / 25);
        setCurrentStep(stepIndex);

        if (newProgress >= 100) {
          clearInterval(timer);
          // Redirect after completion
          setTimeout(() => {
            router.push(`/?type=${type}&val=${encodeURIComponent(id)}`);
          }, 1000);
          return 100;
        }
        return newProgress;
      });
    }, 100);

    return () => clearInterval(timer);
  }, [router, type, id]);

  const getStepStatus = (index: number) => {
    if (index < currentStep) return 'completed';
    if (index === currentStep) return 'loading';
    return 'pending';
  };

  const decodedId = decodeURIComponent(id);
  const displayName =
    type === 'profile' ? decodedId : decodedId.split('/').pop();
  const avatarFallback =
    type === 'profile'
      ? decodedId.slice(0, 2).toUpperCase()
      : decodedId.split('/').pop()?.slice(0, 2).toUpperCase() || 'RE';

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo and Branding */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-2">
            <div className="w-12 h-12 relative">
              <Image
                src="/commit-kings-logo.png"
                alt="CommitKings Logo"
                width={48}
                height={48}
                className="rounded-xl"
                priority
              />
            </div>
            <h1 className="text-2xl font-bold text-white">CommitKings</h1>
          </div>
          <p className="text-slate-400 text-sm">
            Preparing your GitHub rating experience for {displayName}...
          </p>
        </div>

        {/* Profile/Repo Preview Card */}
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <div className="flex items-center space-x-4 mb-4">
            <div className="relative">
              <Avatar className="w-12 h-12 border-2 border-slate-600">
                <AvatarImage
                  src={
                    progress > 50
                      ? `https://github.com/${type === 'profile' ? decodedId : decodedId.split('/')[0]}.png?size=48`
                      : undefined
                  }
                />
                <AvatarFallback className="bg-slate-700 text-slate-300">
                  {progress > 25 ? avatarFallback : '?'}
                </AvatarFallback>
              </Avatar>
              {progress > 75 && (
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-3 h-3 text-white" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <div
                className="h-4 bg-slate-700 rounded animate-pulse mb-2"
                style={{ width: progress > 25 ? '60%' : '40%' }}
              />
              <div
                className="h-3 bg-slate-700 rounded animate-pulse"
                style={{ width: progress > 50 ? '40%' : '20%' }}
              />
            </div>
          </div>

          {progress > 60 && (
            <div className="flex items-center space-x-4 text-sm text-slate-400">
              {type === 'profile' ? (
                <>
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4" />
                    <span>followers</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <GitBranch className="w-4 h-4" />
                    <span>repos</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center space-x-1">
                    <Code className="w-4 h-4" />
                    <span>repository</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <GitBranch className="w-4 h-4" />
                    <span>branches</span>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-400">Loading Progress</span>
            <span className="text-white font-medium">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2 bg-slate-800" />
        </div>

        {/* Loading Steps */}
        <div className="space-y-3">
          {steps.map((step, index) => {
            const status = getStepStatus(index);
            const StepIcon = step.icon;

            return (
              <div key={index} className="flex items-center space-x-3">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    status === 'completed'
                      ? 'bg-green-500'
                      : status === 'loading'
                        ? 'bg-pink-500'
                        : 'bg-slate-700'
                  }`}
                >
                  {status === 'loading' ? (
                    <Loader2 className="w-4 h-4 text-white animate-spin" />
                  ) : status === 'completed' ? (
                    <CheckCircle className="w-4 h-4 text-white" />
                  ) : (
                    <StepIcon className="w-4 h-4 text-slate-400" />
                  )}
                </div>
                <span
                  className={`text-sm ${
                    status === 'completed'
                      ? 'text-green-400'
                      : status === 'loading'
                        ? 'text-white'
                        : 'text-slate-500'
                  }`}
                >
                  {step.label}
                </span>
                {status === 'completed' && (
                  <Badge
                    variant="secondary"
                    className="ml-auto bg-green-500/20 text-green-400 border-green-500/30"
                  >
                    Done
                  </Badge>
                )}
              </div>
            );
          })}
        </div>

        {/* Ready State */}
        {progress >= 100 && (
          <div className="text-center space-y-4 animate-in fade-in duration-500">
            <div className="flex items-center justify-center space-x-2 text-orange-400">
              <Flame className="w-5 h-5" />
              <span className="font-medium">
                Ready to rate this{' '}
                {type === 'profile' ? 'developer' : 'repository'}!
              </span>
            </div>
            <div className="flex space-x-2 justify-center">
              <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">
                🔥 Hotty
              </Badge>
              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                🧊 Notty
              </Badge>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
