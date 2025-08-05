import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

import { githubAPI } from '@/lib/github';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const id = searchParams.get('id');

    if (!type || !id) {
      return new Response('Missing type or id parameter', { status: 400 });
    }

    const decodedId = decodeURIComponent(id);

    if (type === 'profile') {
      const profile = await githubAPI.getUser(decodedId);

      return new ImageResponse(
        (
          <div
            style={{
              height: '100%',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#0f172a',
              padding: '60px',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '40px',
              }}
            >
              <img
                src={profile.avatar_url}
                alt={`${profile.login}'s avatar`}
                width={120}
                height={120}
                style={{
                  borderRadius: '60px',
                  border: '4px solid #374151',
                  marginRight: '30px',
                }}
              />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div
                  style={{
                    fontSize: '48px',
                    fontWeight: 'bold',
                    color: 'white',
                    marginBottom: '8px',
                  }}
                >
                  {profile.login}
                </div>
                <div
                  style={{
                    fontSize: '24px',
                    color: '#d1d5db',
                    marginBottom: '12px',
                  }}
                >
                  {profile.name || 'GitHub Developer'}
                </div>
                <div
                  style={{
                    fontSize: '18px',
                    color: '#9ca3af',
                    maxWidth: '500px',
                  }}
                >
                  {profile.bio
                    ? profile.bio.length > 80
                      ? profile.bio.substring(0, 80) + '...'
                      : profile.bio
                    : 'Building amazing things on GitHub'}
                </div>
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                gap: '40px',
                marginBottom: '40px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '20px',
                  backgroundColor: '#1e293b',
                  borderRadius: '12px',
                  minWidth: '120px',
                }}
              >
                <div
                  style={{
                    fontSize: '28px',
                    fontWeight: 'bold',
                    color: '#60a5fa',
                    marginBottom: '8px',
                  }}
                >
                  {profile.followers.toLocaleString()}
                </div>
                <div
                  style={{
                    fontSize: '14px',
                    color: '#9ca3af',
                  }}
                >
                  Followers
                </div>
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '20px',
                  backgroundColor: '#1e293b',
                  borderRadius: '12px',
                  minWidth: '120px',
                }}
              >
                <div
                  style={{
                    fontSize: '28px',
                    fontWeight: 'bold',
                    color: '#34d399',
                    marginBottom: '8px',
                  }}
                >
                  {profile.public_repos.toLocaleString()}
                </div>
                <div
                  style={{
                    fontSize: '14px',
                    color: '#9ca3af',
                  }}
                >
                  Repositories
                </div>
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '20px',
              }}
            >
              <div
                style={{
                  fontSize: '32px',
                  fontWeight: 'bold',
                  color: '#f59e0b',
                }}
              >
                Commit King
              </div>
              <div
                style={{
                  fontSize: '18px',
                  color: '#9ca3af',
                }}
              >
                Rate 🔥 Hotty or 🧊 Notty
              </div>
            </div>
          </div>
        ),
        {
          width: 1200,
          height: 630,
        }
      );
    } else if (type === 'repo') {
      const [owner, repo] = decodedId.split('/');
      const repository = await githubAPI.getRepo(owner, repo);

      return new ImageResponse(
        (
          <div
            style={{
              height: '100%',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#0f172a',
              padding: '60px',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '40px',
              }}
            >
              <img
                src={repository.owner.avatar_url}
                alt={`${repository.owner.login}'s avatar`}
                width={120}
                height={120}
                style={{
                  borderRadius: '60px',
                  border: '4px solid #374151',
                  marginRight: '30px',
                }}
              />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div
                  style={{
                    fontSize: '48px',
                    fontWeight: 'bold',
                    color: 'white',
                    marginBottom: '8px',
                    maxWidth: '600px',
                  }}
                >
                  {repository.name}
                </div>
                <div
                  style={{
                    fontSize: '20px',
                    color: '#d1d5db',
                    marginBottom: '12px',
                  }}
                >
                  by {repository.owner.login}
                </div>
                <div
                  style={{
                    fontSize: '18px',
                    color: '#9ca3af',
                    maxWidth: '600px',
                  }}
                >
                  {repository.description
                    ? repository.description.length > 100
                      ? repository.description.substring(0, 100) + '...'
                      : repository.description
                    : 'An amazing open source project'}
                </div>
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                gap: '40px',
                marginBottom: '40px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '20px',
                  backgroundColor: '#fef3c7',
                  borderRadius: '12px',
                  minWidth: '120px',
                }}
              >
                <div
                  style={{
                    fontSize: '28px',
                    fontWeight: 'bold',
                    color: '#d97706',
                    marginBottom: '8px',
                  }}
                >
                  ⭐ {repository.stargazers_count.toLocaleString()}
                </div>
                <div
                  style={{
                    fontSize: '14px',
                    color: '#92400e',
                  }}
                >
                  Stars
                </div>
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '20px',
                  backgroundColor: '#dbeafe',
                  borderRadius: '12px',
                  minWidth: '120px',
                }}
              >
                <div
                  style={{
                    fontSize: '28px',
                    fontWeight: 'bold',
                    color: '#2563eb',
                    marginBottom: '8px',
                  }}
                >
                  🍴 {repository.forks_count.toLocaleString()}
                </div>
                <div
                  style={{
                    fontSize: '14px',
                    color: '#1e40af',
                  }}
                >
                  Forks
                </div>
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '20px',
                  backgroundColor: '#fecaca',
                  borderRadius: '12px',
                  minWidth: '120px',
                }}
              >
                <div
                  style={{
                    fontSize: '28px',
                    fontWeight: 'bold',
                    color: '#dc2626',
                    marginBottom: '8px',
                  }}
                >
                  🐛 {repository.open_issues_count.toLocaleString()}
                </div>
                <div
                  style={{
                    fontSize: '14px',
                    color: '#991b1b',
                  }}
                >
                  Issues
                </div>
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '20px',
              }}
            >
              <div
                style={{
                  fontSize: '32px',
                  fontWeight: 'bold',
                  color: '#f59e0b',
                }}
              >
                Commit King
              </div>
              <div
                style={{
                  fontSize: '18px',
                  color: '#9ca3af',
                }}
              >
                Rate 🔥 Hotty or 🧊 Notty
              </div>
            </div>
          </div>
        ),
        {
          width: 1200,
          height: 630,
        }
      );
    }

    return new Response('Invalid type parameter', { status: 400 });
  } catch (error) {
    console.error('OG Image generation error:', error);
    return new Response('Failed to generate image', { status: 500 });
  }
}
