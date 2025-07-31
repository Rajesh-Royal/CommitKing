/**
 * Utility functions for optimizing and handling GitHub avatars
 */

export function getOptimizedGitHubAvatar(avatarUrl: string, size: number = 48): string {
  if (!avatarUrl.includes('avatars.githubusercontent.com')) {
    return avatarUrl;
  }

  // Remove existing query parameters and add optimized ones
  const baseUrl = avatarUrl.split('?')[0];
  return `${baseUrl}?s=${size}&v=4`;
}

export function preloadGitHubAvatar(avatarUrl: string, size: number = 48): void {
  if (typeof window === 'undefined') return;
  
  try {
    const optimizedUrl = getOptimizedGitHubAvatar(avatarUrl, size);
    
    // Create a new Image object to preload
    const img = new Image();
    img.src = optimizedUrl;
    
    // Optionally, add to document head as link preload for better browser support
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = optimizedUrl;
    document.head.appendChild(link);
    
    // Clean up the link after a reasonable time
    setTimeout(() => {
      try {
        if (document.head.contains(link)) {
          document.head.removeChild(link);
        }
      } catch (e) {
        // Link might already be removed, ignore error
        console.debug('Preload link cleanup failed:', e);
      }
    }, 5000);
  } catch (error) {
    console.warn('Failed to preload avatar:', error);
  }
}

export function isGitHubAvatar(url: string): boolean {
  return url.includes('avatars.githubusercontent.com');
}

export function getAvatarSizeForComponent(componentSize: 'sm' | 'md' | 'lg' | 'xl'): number {
  switch (componentSize) {
    case 'sm': return 32;
    case 'md': return 48;
    case 'lg': return 64;
    case 'xl': return 96;
    default: return 48;
  }
}
