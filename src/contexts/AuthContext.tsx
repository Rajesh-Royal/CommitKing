/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, useContext, useEffect, useState } from 'react';

import type { SupabaseUser } from '@/shared/schema';

interface AuthContextType {
  user: SupabaseUser | null;
  login: (githubUser: any) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check for existing Supabase session first
        const { getCurrentSession } = await import('@/lib/supabase');
        const session = await getCurrentSession();

        if (session?.user) {
          // Create SupabaseUser object directly from session
          const supabaseUser: SupabaseUser = {
            id: session.user.id,
            email: session.user.email || '',
            user_metadata: {
              sub: session.user.user_metadata.sub || session.user.id,
              name:
                session.user.user_metadata.name ||
                session.user.user_metadata.full_name ||
                '',
              full_name:
                session.user.user_metadata.full_name ||
                session.user.user_metadata.name ||
                '',
              user_name:
                session.user.user_metadata.user_name ||
                session.user.user_metadata.preferred_username ||
                '',
              avatar_url: session.user.user_metadata.avatar_url || '',
              email: session.user.email || '',
              preferred_username:
                session.user.user_metadata.preferred_username ||
                session.user.user_metadata.user_name ||
                '',
            },
            created_at: session.user.created_at,
            updated_at: session.user.updated_at || session.user.created_at,
            app_metadata: {
              provider: session.user.app_metadata.provider || 'github',
              providers: session.user.app_metadata.providers || ['github'],
            },
          };
          setUser(supabaseUser);
        } else {
          // Clear any stored auth data if no session
          localStorage.removeItem('commitkings_user');
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        // Fallback to localStorage
        const storedUser = localStorage.getItem('commitkings_user');
        if (storedUser) {
          try {
            setUser(JSON.parse(storedUser));
          } catch (error) {
            console.error('Failed to parse stored user:', error);
            localStorage.removeItem('commitkings_user');
          }
        }
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    // Listen for Supabase auth state changes
    let authListener: any;
    import('@/lib/supabase')
      .then(({ onAuthStateChange }) => {
        authListener = onAuthStateChange((event: string, session: any) => {
          if (event === 'SIGNED_IN' && session?.user) {
            // Create SupabaseUser object directly from session
            const supabaseUser: SupabaseUser = {
              id: session.user.id,
              email: session.user.email || '',
              user_metadata: {
                sub: session.user.user_metadata.sub || session.user.id,
                name:
                  session.user.user_metadata.name ||
                  session.user.user_metadata.full_name ||
                  '',
                full_name:
                  session.user.user_metadata.full_name ||
                  session.user.user_metadata.name ||
                  '',
                user_name:
                  session.user.user_metadata.user_name ||
                  session.user.user_metadata.preferred_username ||
                  '',
                avatar_url: session.user.user_metadata.avatar_url || '',
                email: session.user.email || '',
                preferred_username:
                  session.user.user_metadata.preferred_username ||
                  session.user.user_metadata.user_name ||
                  '',
              },
              created_at: session.user.created_at,
              updated_at: session.user.updated_at || session.user.created_at,
              app_metadata: {
                provider: session.user.app_metadata.provider || 'github',
                providers: session.user.app_metadata.providers || ['github'],
              },
            };
            setUser(supabaseUser);
          } else if (event === 'SIGNED_OUT') {
            logout();
          }
        });
      })
      .catch(console.error);

    return () => {
      if (authListener?.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  const login = async (githubUser: any) => {
    // No longer needed - Supabase handles user creation
    // We get user data directly from Supabase session
    console.log('Login called with:', githubUser);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('commitkings_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
