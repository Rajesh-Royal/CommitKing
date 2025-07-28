import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// GitHub OAuth login
export async function signInWithGitHub() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'github',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
      scopes: 'read:user user:email'
    }
  });

  if (error) {
    throw error;
  }

  return data;
}

// GitHub OAuth callback handler
export async function handleGitHubCallback() {
  const { data, error } = await supabase.auth.getSession();
  
  if (error) {
    throw error;
  }

  if (data.session) {
    const user = data.session.user;
    const userMetadata = user.user_metadata;
    
    return {
      user: {
        id: userMetadata.user_id || user.id,
        login: userMetadata.user_name || userMetadata.preferred_username,
        avatar_url: userMetadata.avatar_url,
        name: userMetadata.full_name || userMetadata.name,
        bio: userMetadata.bio || '',
        email: user.email,
      },
      session: data.session
    };
  }

  throw new Error('No session found');
}

// Sign out
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw error;
  }
}

// Get current session
export async function getCurrentSession() {
  const { data, error } = await supabase.auth.getSession();
  if (error) {
    throw error;
  }
  return data.session;
}

// Listen to auth state changes
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function onAuthStateChange(callback: (event: string, session: any) => void) {
  return supabase.auth.onAuthStateChange(callback);
}