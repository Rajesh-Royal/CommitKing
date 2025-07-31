'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { User, Building2, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AvatarWithLoadingProps {
  src: string;
  alt: string;
  username?: string;
  type?: 'user' | 'org' | 'repo';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isTransitioning?: boolean;
  className?: string;
}

const SIZE_VARIANTS = {
  sm: { container: 'w-8 h-8', icon: 'w-4 h-4', text: 'text-xs' },
  md: { container: 'w-12 h-12', icon: 'w-6 h-6', text: 'text-sm' },
  lg: { container: 'w-16 h-16', icon: 'w-8 h-8', text: 'text-base' },
  xl: { container: 'w-24 h-24', icon: 'w-12 h-12', text: 'text-lg' },
};

// Base64 blur placeholder for better UX
const BLUR_DATA_URL = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R+Ss6RtNdMfLnRw=';

export function AvatarWithLoading({
  src,
  alt,
  username,
  type = 'user',
  size = 'md',
  isTransitioning = false,
  className
}: AvatarWithLoadingProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [imageKey, setImageKey] = useState(0);

  const sizeClasses = SIZE_VARIANTS[size];

  // Reset states when src changes or transitioning starts
  useEffect(() => {
    if (isTransitioning) {
      setIsLoading(true);
      setHasError(false);
      setImageKey(prev => prev + 1);
    }
  }, [isTransitioning]);

  useEffect(() => {
    setIsLoading(true);
    setHasError(false);
    setImageKey(prev => prev + 1);
  }, [src]);

  function handleImageLoad() {
    setIsLoading(false);
    setHasError(false);
  }

  function handleImageError() {
    setIsLoading(false);
    setHasError(true);
  }

  function getFallbackIcon() {
    switch (type) {
      case 'org':
        return <Building2 className={cn(sizeClasses.icon, 'text-gray-500 dark:text-gray-400')} />;
      case 'repo':
        return <Users className={cn(sizeClasses.icon, 'text-gray-500 dark:text-gray-400')} />;
      default:
        return <User className={cn(sizeClasses.icon, 'text-gray-500 dark:text-gray-400')} />;
    }
  }

  function getInitials(name?: string) {
    if (!name) return '?';
    return name.slice(0, 2).toUpperCase();
  }

  // Get optimized image size for GitHub avatars
  const getImageSize = () => {
    switch (size) {
      case 'sm': return 32;
      case 'md': return 48;
      case 'lg': return 64;
      case 'xl': return 96;
      default: return 48;
    }
  };

  // Create optimized GitHub avatar URL
  const getOptimizedSrc = () => {
    if (src.includes('avatars.githubusercontent.com')) {
      const baseUrl = src.split('?')[0];
      const imageSize = getImageSize();
      return `${baseUrl}?s=${imageSize}&v=4`;
    }
    return src;
  };

  const optimizedSrc = getOptimizedSrc();

  // Show skeleton during loading or transitioning
  const showSkeleton = isLoading || isTransitioning;

  return (
    <div className={cn(
      sizeClasses.container,
      'relative rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700',
      className
    )}>
      {showSkeleton && (
        <div className={cn(
          sizeClasses.container,
          'absolute inset-0 animate-pulse bg-gray-200 dark:bg-gray-700 rounded-full z-10'
        )} />
      )}

      {hasError ? (
        // Fallback UI
        <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
          {username ? (
            <span className={cn(sizeClasses.text, 'font-medium')}>
              {getInitials(username)}
            </span>
          ) : (
            getFallbackIcon()
          )}
        </div>
      ) : (
        // Image with loading states
        <Image
          key={imageKey}
          src={optimizedSrc}
          alt={alt}
          fill
          className={cn(
            'object-cover transition-opacity duration-300',
            showSkeleton ? 'opacity-0' : 'opacity-100'
          )}
          placeholder="blur"
          blurDataURL={BLUR_DATA_URL}
          onLoad={handleImageLoad}
          onError={handleImageError}
          sizes={`${getImageSize()}px`}
          priority={size === 'xl'}
        />
      )}
    </div>
  );
}
