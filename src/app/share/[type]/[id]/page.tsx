import { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { githubAPI } from '@/lib/github';

interface SharePageProps {
  params: Promise<{
    type: string;
    id: string;
  }>;
}

export async function generateMetadata({
  params,
}: SharePageProps): Promise<Metadata> {
  const { type, id } = await params;
  const decodedId = decodeURIComponent(id);

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const ogImageUrl = `${baseUrl}/api/og?type=${type}&id=${encodeURIComponent(decodedId)}`;

  try {
    if (type === 'profile') {
      const profile = await githubAPI.getUser(decodedId);
      return {
        title: `Rate ${profile.name || profile.login}'s GitHub Profile | Commit King`,
        description: `Check out ${profile.name || profile.login}'s GitHub profile. ${profile.bio || 'A talented developer'} - Rate them 🔥 Hotty or 🧊 Notty!`,
        openGraph: {
          title: `Rate ${profile.name || profile.login}'s Profile`,
          description: `${profile.bio || 'A talented developer'} - Vote 🔥 or 🧊`,
          images: [
            {
              url: ogImageUrl,
              width: 1200,
              height: 630,
              alt: `${profile.login}'s profile preview`,
            },
          ],
          type: 'website',
          url: `${baseUrl}/share/${type}/${id}`,
        },
        twitter: {
          card: 'summary_large_image',
          title: `Rate ${profile.name || profile.login}'s Profile`,
          description: `${profile.bio || 'A talented developer'}`,
          images: [ogImageUrl],
        },
      };
    } else if (type === 'repo') {
      const [owner, repo] = decodedId.split('/');
      const repository = await githubAPI.getRepo(owner, repo);
      return {
        title: `Rate ${repository.full_name} Repository | Commit King`,
        description: `Check out the ${repository.name} repository. ${repository.description || 'An interesting project'} - Rate it 🔥 Hotty or 🧊 Notty!`,
        openGraph: {
          title: `Rate ${repository.name} Repository`,
          description: `${repository.description || 'An interesting project'} - Vote 🔥 or 🧊`,
          images: [
            {
              url: ogImageUrl,
              width: 1200,
              height: 630,
              alt: `${repository.full_name} repository preview`,
            },
          ],
          type: 'website',
          url: `${baseUrl}/share/${type}/${id}`,
        },
        twitter: {
          card: 'summary_large_image',
          title: `Rate ${repository.name} Repository`,
          description: `${repository.description || 'An interesting project'}`,
          images: [ogImageUrl],
        },
      };
    }
  } catch (error) {
    console.error('Failed to fetch data for meta tags:', error);
  }

  // Fallback metadata
  return {
    title: 'Commit King - Rate GitHub Profiles & Repositories',
    description: 'Discover and rate amazing GitHub profiles and repositories',
  };
}

export default async function SharePage({ params }: SharePageProps) {
  const { type, id } = await params;
  const decodedId = decodeURIComponent(id);

  // Redirect to main page with query parameters
  redirect(`/?type=${type}&val=${encodeURIComponent(decodedId)}`);
}
