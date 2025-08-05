'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Code, ExternalLink, Github, Users } from 'lucide-react';

import { useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';

interface SharePageLoaderProps {
  type: 'profile' | 'repo';
  id: string;
}

export default function SharePageLoader({ type, id }: SharePageLoaderProps) {
  const router = useRouter();
  const [stage, setStage] = useState<'loading' | 'found' | 'redirecting'>(
    'loading'
  );
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setStage('found');
      setProgress(70);
    }, 1500);

    const timer2 = setTimeout(() => {
      setStage('redirecting');
      setProgress(100);
    }, 2500);

    const redirectTimer = setTimeout(() => {
      // Redirect to main page with query parameters
      router.push(`/?type=${type}&val=${encodeURIComponent(id)}`);
    }, 3500);

    // Simulate progress
    const progressTimer = setInterval(() => {
      setProgress(prev => {
        if (prev < 30) return prev + Math.random() * 8;
        if (prev < 60) return prev + Math.random() * 5;
        if (prev < 90) return prev + Math.random() * 3;
        return prev;
      });
    }, 150);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(redirectTimer);
      clearInterval(progressTimer);
    };
  }, [router, type, id]);

  const getStageText = () => {
    const itemType = type === 'profile' ? 'Profile' : 'Repository';
    const decodedId = decodeURIComponent(id);
    const displayName =
      type === 'profile' ? decodedId : decodedId.split('/').pop();

    switch (stage) {
      case 'loading':
        return {
          title: `Finding ${itemType}`,
          subtitle: `Searching for ${displayName} on GitHub...`,
        };
      case 'found':
        return {
          title: `${itemType} Found!`,
          subtitle: `${displayName} is ready to be rated`,
        };
      case 'redirecting':
        return {
          title: 'Opening Commit King',
          subtitle: 'Taking you to the rating page...',
        };
    }
  };

  const getIcon = () => {
    switch (stage) {
      case 'loading':
        return Github;
      case 'found':
        return type === 'profile' ? Users : Code;
      case 'redirecting':
        return ExternalLink;
    }
  };

  const stageText = getStageText();
  const IconComponent = getIcon();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Main Content Card */}
        <motion.div
          className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Icon Section */}
          <div className="relative mb-8">
            <motion.div
              className="w-20 h-20 mx-auto bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center relative overflow-hidden"
              animate={{
                scale: stage === 'found' ? 1.1 : 1,
                rotate: stage === 'loading' ? 360 : 0,
              }}
              transition={{
                scale: { duration: 0.3 },
                rotate: {
                  duration: 2,
                  repeat: stage === 'loading' ? Number.POSITIVE_INFINITY : 0,
                  ease: 'linear',
                },
              }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={stage}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: 180 }}
                  transition={{ duration: 0.4 }}
                >
                  <IconComponent className="w-10 h-10 text-white" />
                </motion.div>
              </AnimatePresence>

              {/* Animated ring */}
              {stage === 'loading' && (
                <motion.div
                  className="absolute inset-0 border-4 border-transparent border-t-white/30 rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 1.5,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: 'linear',
                  }}
                />
              )}
            </motion.div>

            {/* Floating particles for found state */}
            {stage === 'found' && (
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-orange-400 rounded-full"
                    style={{
                      left: '50%',
                      top: '50%',
                    }}
                    initial={{ scale: 0, x: 0, y: 0 }}
                    animate={{
                      scale: [0, 1, 0],
                      x: Math.cos((i * 45 * Math.PI) / 180) * 50,
                      y: Math.sin((i * 45 * Math.PI) / 180) * 50,
                    }}
                    transition={{
                      duration: 0.8,
                      delay: i * 0.05,
                      ease: 'easeOut',
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Text Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={stage}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="mb-8"
            >
              <h1 className="text-2xl font-bold text-white mb-3">
                {stageText.title}
              </h1>
              <p className="text-gray-400 text-sm leading-relaxed">
                {stageText.subtitle}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-gray-500">Loading Progress</span>
              <span className="text-xs text-gray-400">
                {Math.round(progress)}%
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              />
            </div>
          </div>

          {/* Status Indicators */}
          <div className="flex justify-center space-x-6 text-xs">
            <div className="flex items-center space-x-2">
              <motion.div
                className={`w-2 h-2 rounded-full ${stage === 'loading' ? 'bg-orange-500' : 'bg-green-500'}`}
                animate={{ scale: stage === 'loading' ? [1, 1.2, 1] : 1 }}
                transition={{
                  duration: 1,
                  repeat: stage === 'loading' ? Number.POSITIVE_INFINITY : 0,
                }}
              />
              <span
                className={
                  stage === 'loading' ? 'text-orange-400' : 'text-green-400'
                }
              >
                Search
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <motion.div
                className={`w-2 h-2 rounded-full ${
                  stage === 'found'
                    ? 'bg-orange-500'
                    : stage === 'redirecting'
                      ? 'bg-green-500'
                      : 'bg-gray-600'
                }`}
                animate={{ scale: stage === 'found' ? [1, 1.2, 1] : 1 }}
                transition={{
                  duration: 1,
                  repeat: stage === 'found' ? Number.POSITIVE_INFINITY : 0,
                }}
              />
              <span
                className={
                  stage === 'found'
                    ? 'text-orange-400'
                    : stage === 'redirecting'
                      ? 'text-green-400'
                      : 'text-gray-500'
                }
              >
                Found
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <motion.div
                className={`w-2 h-2 rounded-full ${stage === 'redirecting' ? 'bg-orange-500' : 'bg-gray-600'}`}
                animate={{ scale: stage === 'redirecting' ? [1, 1.2, 1] : 1 }}
                transition={{
                  duration: 1,
                  repeat:
                    stage === 'redirecting' ? Number.POSITIVE_INFINITY : 0,
                }}
              />
              <span
                className={
                  stage === 'redirecting' ? 'text-orange-400' : 'text-gray-500'
                }
              >
                Rate
              </span>
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          className="text-center mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <p className="text-gray-500 text-xs">
            {type === 'profile'
              ? '🔥 Ready to rate this developer?'
              : '⭐ Ready to rate this repository?'}
          </p>
        </motion.div>
      </div>
    </div>
  );
}
