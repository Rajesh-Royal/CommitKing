'use client';

import { Check, Copy, Share2 } from 'lucide-react';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { toast } from '@/hooks/use-toast';

import { FacebookSvgIcon, LinkedinSvgIcon, XSvgIcon } from './BrandIcons';

interface ShareButtonsProps {
  type: 'profile' | 'repo';
  id: string;
  username?: string;
  repoName?: string;
}

export function ShareButtons({
  type,
  id,
  username,
  repoName,
}: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  // Use the new share route for better Open Graph support
  // For repos, we need to encode the full name (owner/repo) properly
  const encodedId = encodeURIComponent(id);
  const shareUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/share/${type}/${encodedId}`;
  const displayName = type === 'profile' ? username : repoName;

  const shareText =
    type === 'profile'
      ? `Check out ${displayName}'s GitHub profile and rate it! 🔥 or 🧊`
      : `Check out the ${displayName} repository and rate it! 🔥 or 🧊`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      // Show toast notification
      if (typeof window !== 'undefined') {
        // Dynamically import toast to avoid SSR issues
        toast({
          title: 'Link copied!',
          description: 'Share link has been copied to your clipboard.',
        });
      }
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const shareToX = () => {
    const xUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(xUrl, '_blank');
  };

  const shareToLinkedIn = () => {
    const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
    window.open(linkedinUrl, '_blank');
  };

  const shareToFacebook = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    window.open(facebookUrl, '_blank');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <Share2 className="w-4 h-4 mr-2" />
          Share {type === 'profile' ? 'Profile' : 'Repo'}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={copyToClipboard} className="cursor-pointer">
          {copied ? (
            <Check className="w-4 h-4 mr-2" />
          ) : (
            <Copy className="w-4 h-4 mr-2" />
          )}
          {copied ? 'Copied!' : 'Copy Link'}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={shareToX} className="cursor-pointer">
          <XSvgIcon className="w-4 h-4 mr-2" />
          Twitter
        </DropdownMenuItem>
        <DropdownMenuItem onClick={shareToLinkedIn} className="cursor-pointer">
          <LinkedinSvgIcon className="w-4 h-4 mr-2" />
          LinkedIn
        </DropdownMenuItem>
        <DropdownMenuItem onClick={shareToFacebook} className="cursor-pointer">
          <FacebookSvgIcon className="w-4 h-4 mr-2" />
          Facebook
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
