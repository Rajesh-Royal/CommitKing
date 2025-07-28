import { createContext, useContext, useEffect, useState } from "react";
import type { User } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

interface AuthContextType {
  user: User | null;
  login: (githubUser: any) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check for existing Supabase session first
        const { getCurrentSession } = await import('@/lib/supabase');
        const session = await getCurrentSession();
        
        if (session?.user) {
          const userMetadata = session.user.user_metadata;
          const githubUser = {
            id: userMetadata.user_id || session.user.id,
            login: userMetadata.user_name || userMetadata.preferred_username,
            avatar_url: userMetadata.avatar_url,
            name: userMetadata.full_name || userMetadata.name,
            bio: userMetadata.bio || '',
            email: session.user.email,
          };
          await login(githubUser);
        } else {
          // Fallback to localStorage
          const storedUser = localStorage.getItem("commitkings_user");
          if (storedUser) {
            try {
              setUser(JSON.parse(storedUser));
            } catch (error) {
              console.error("Failed to parse stored user:", error);
              localStorage.removeItem("commitkings_user");
            }
          }
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        // Fallback to localStorage
        const storedUser = localStorage.getItem("commitkings_user");
        if (storedUser) {
          try {
            setUser(JSON.parse(storedUser));
          } catch (error) {
            console.error("Failed to parse stored user:", error);
            localStorage.removeItem("commitkings_user");
          }
        }
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    // Listen for Supabase auth state changes
    let authListener: any;
    import('@/lib/supabase').then(({ onAuthStateChange }) => {
      authListener = onAuthStateChange((event: string, session: any) => {
        if (event === 'SIGNED_IN' && session?.user) {
          const userMetadata = session.user.user_metadata;
          const githubUser = {
            id: userMetadata.user_id || session.user.id,
            login: userMetadata.user_name || userMetadata.preferred_username,
            avatar_url: userMetadata.avatar_url,
            name: userMetadata.full_name || userMetadata.name,
            bio: userMetadata.bio || '',
            email: session.user.email,
          };
          login(githubUser);
        } else if (event === 'SIGNED_OUT') {
          logout();
        }
      });
    }).catch(console.error);

    return () => {
      if (authListener?.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  const login = async (githubUser: any) => {
    try {
      const response = await apiRequest("POST", "/api/auth/github", {
        github_id: githubUser.id.toString(),
        username: githubUser.login,
        avatar_url: githubUser.avatar_url,
      });
      
      const { user } = await response.json();
      setUser(user);
      localStorage.setItem("commitkings_user", JSON.stringify(user));
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("commitkings_user");
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
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
