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
              backgroundColor: 'white',
              fontFamily: 'system-ui, -apple-system, sans-serif',
            }}
          >
            {/* Card Container */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                height: '100%',
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
                overflow: 'hidden',
              }}
            >
              {/* Header Section */}
              <div
                style={{
                  display: 'flex',
                  padding: '48px',
                  borderBottom: '1px solid #e5e7eb',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flex: 1,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '32px',
                  }}
                >
                  <img
                    src={profile.avatar_url}
                    alt={`${profile.login}'s avatar`}
                    width={120}
                    height={120}
                    style={{
                      borderRadius: '60px',
                      border: '2px solid #d1d5db',
                    }}
                  />
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {profile.name ? (
                      <div
                        style={{
                          fontSize: '48px',
                          color: '#111827',
                          marginBottom: '12px',
                        }}
                      >
                        {profile.name}
                      </div>
                    ) : (
                      <div
                        style={{
                          fontSize: '48px',
                          fontWeight: 'bold',
                          color: '#111827',
                          marginBottom: '8px',
                        }}
                      >
                        {profile.login}
                      </div>
                    )}
                    {profile.bio && (
                      <div
                        style={{
                          fontSize: '24px',
                          color: '#6b7280',
                          maxWidth: '600px',
                          marginBottom: '16px',
                        }}
                      >
                        {profile.bio.length > 100
                          ? profile.bio.substring(0, 100) + '...'
                          : profile.bio}
                      </div>
                    )}
                    <div
                      style={{
                        display: 'flex',
                        gap: '32px',
                        fontSize: '20px',
                        color: '#6b7280',
                      }}
                    >
                      {profile.location && (
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          📍 {profile.location}
                        </div>
                      )}
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        👥 {profile.followers.toLocaleString()} followers
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        📦 {profile.public_repos} repos
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* User Metrics Grid */}
              <div
                style={{
                  display: 'flex',
                  padding: '48px',
                  gap: '24px',
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {/* Followers */}
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: '32px',
                    backgroundColor: '#eff6ff',
                    borderRadius: '12px',
                    minWidth: '180px',
                    border: '1px solid #60a5fa',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      fontSize: '48px',
                      fontWeight: 'bold',
                      color: '#2563eb',
                      marginBottom: '8px',
                    }}
                  >
                    👥 {profile.followers.toLocaleString()}
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      fontSize: '20px',
                      color: '#6b7280',
                    }}
                  >
                    Followers
                  </div>
                </div>

                {/* Following */}
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: '32px',
                    backgroundColor: '#f0fdf4',
                    borderRadius: '12px',
                    minWidth: '180px',
                    border: '1px solid #4ade80',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      fontSize: '48px',
                      fontWeight: 'bold',
                      color: '#16a34a',
                      marginBottom: '8px',
                    }}
                  >
                    🤝 {profile.following.toLocaleString()}
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      fontSize: '20px',
                      color: '#6b7280',
                    }}
                  >
                    Following
                  </div>
                </div>

                {/* Public Repositories */}
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: '32px',
                    backgroundColor: '#faf5ff',
                    borderRadius: '12px',
                    minWidth: '180px',
                    border: '1px solid #c084fc',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      fontSize: '48px',
                      fontWeight: 'bold',
                      color: '#9333ea',
                      marginBottom: '8px',
                    }}
                  >
                    � {profile.public_repos.toLocaleString()}
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      fontSize: '20px',
                      color: '#6b7280',
                    }}
                  >
                    Repositories
                  </div>
                </div>
              </div>

              {/* Footer Section */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '32px',
                  backgroundColor: '#f9fafb',
                  gap: '24px',
                }}
              >
                <img
                  src={`${request.nextUrl.origin}/web-app-manifest-512x512.png`}
                  alt="Commit King Logo"
                  width={48}
                  height={48}
                  style={{
                    borderRadius: '8px',
                  }}
                />
                <div
                  style={{
                    fontSize: '36px',
                    fontWeight: 'bold',
                    color: '#f59e0b',
                  }}
                >
                  Commit King
                </div>
                <div
                  style={{
                    fontSize: '24px',
                    color: '#6b7280',
                  }}
                >
                  Rate 🔥 Hotty or 🧊 Notty
                </div>
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
              backgroundColor: 'white',
              fontFamily: 'system-ui, -apple-system, sans-serif',
            }}
          >
            {/* Card Container */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                height: '100%',
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
                overflow: 'hidden',
              }}
            >
              {/* Header Section */}
              <div
                style={{
                  display: 'flex',
                  padding: '48px',
                  borderBottom: '1px solid #e5e7eb',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '32px',
                  }}
                >
                  <img
                    src={repository.owner.avatar_url}
                    alt={`${repository.owner.login}'s avatar`}
                    width={120}
                    height={120}
                    style={{
                      borderRadius: '60px',
                      border: '2px solid #d1d5db',
                    }}
                  />
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <div
                      style={{
                        display: 'flex',
                        fontSize: '40px',
                        fontWeight: 'bold',
                        color: '#111827',
                        marginBottom: '8px',
                        maxWidth: '600px',
                      }}
                    >
                      {repository.full_name}
                    </div>
                    {repository.description && (
                      <div
                        style={{
                          display: 'flex',
                          fontSize: '24px',
                          color: '#6b7280',
                          maxWidth: '600px',
                        }}
                      >
                        {repository.description.length > 100
                          ? repository.description.substring(0, 100) + '...'
                          : repository.description}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Repository Metrics Grid */}
              <div
                style={{
                  display: 'flex',
                  padding: '48px',
                  gap: '24px',
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {/* Stars */}
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: '32px',
                    backgroundColor: '#fefce8',
                    borderRadius: '12px',
                    minWidth: '180px',
                    border: '1px solid #fde047',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      fontSize: '48px',
                      fontWeight: 'bold',
                      color: '#ca8a04',
                      marginBottom: '8px',
                    }}
                  >
                    ⭐ {repository.stargazers_count.toLocaleString()}
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      fontSize: '20px',
                      color: '#6b7280',
                    }}
                  >
                    Stars
                  </div>
                </div>

                {/* Forks */}
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: '32px',
                    backgroundColor: '#eff6ff',
                    borderRadius: '12px',
                    minWidth: '180px',
                    border: '1px solid #60a5fa',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      fontSize: '48px',
                      fontWeight: 'bold',
                      color: '#2563eb',
                      marginBottom: '8px',
                    }}
                  >
                    🍴 {repository.forks_count.toLocaleString()}
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      fontSize: '20px',
                      color: '#6b7280',
                    }}
                  >
                    Forks
                  </div>
                </div>

                {/* Issues */}
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: '32px',
                    backgroundColor: '#fef2f2',
                    borderRadius: '12px',
                    minWidth: '180px',
                    border: '1px solid #f87171',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      fontSize: '48px',
                      fontWeight: 'bold',
                      color: '#dc2626',
                      marginBottom: '8px',
                    }}
                  >
                    🐛 {repository.open_issues_count.toLocaleString()}
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      fontSize: '20px',
                      color: '#6b7280',
                    }}
                  >
                    Issues
                  </div>
                </div>

                {/* Owner */}
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: '32px',
                    backgroundColor: '#faf5ff',
                    borderRadius: '12px',
                    minWidth: '180px',
                    border: '1px solid #c084fc',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      fontSize: '48px',
                      fontWeight: 'bold',
                      color: '#9333ea',
                      marginBottom: '8px',
                    }}
                  >
                    👥 {repository.owner.login.substring(0, 8)}
                    {repository.owner.login.length > 8 ? '...' : ''}
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      fontSize: '20px',
                      color: '#6b7280',
                    }}
                  >
                    Owner
                  </div>
                </div>
              </div>

              {/* Footer Section */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '32px',
                  backgroundColor: '#f9fafb',
                  gap: '24px',
                }}
              >
                <img
                  src={`${request.nextUrl.origin}/web-app-manifest-512x512.png`}
                  alt="Commit King Logo"
                  width={48}
                  height={48}
                  style={{
                    borderRadius: '8px',
                  }}
                />
                <div
                  style={{
                    fontSize: '36px',
                    fontWeight: 'bold',
                    color: '#f59e0b',
                  }}
                >
                  Commit King
                </div>
                <div
                  style={{
                    fontSize: '24px',
                    color: '#6b7280',
                  }}
                >
                  Rate 🔥 Hotty or 🧊 Notty
                </div>
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
