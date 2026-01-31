import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // MSW 환경일 경우 가짜 사용자 세션 제공
    if (import.meta.env.VITE_USE_MSW === 'true') {
      const mockUser = {
        id: 'mock-user-uuid',
        email: 'mock@example.com',
        user_metadata: { full_name: 'Mock User' }
      } as any;
      const mockSession = {
        access_token: 'mock-token',
        user: mockUser,
      } as any;

      setSession(mockSession);
      setUser(mockUser);
      setIsLoading(false);
      return;
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session && import.meta.env.DEV) {
        const autoEmail = import.meta.env.VITE_DEV_AUTO_LOGIN_EMAIL;
        const autoPass = import.meta.env.VITE_DEV_AUTO_LOGIN_PASSWORD;
        
        if (autoEmail && autoPass) {
          console.log('Attempting development auto-login...');
          supabase.auth.signInWithPassword({
            email: autoEmail,
            password: autoPass
          }).then(({ data: { session: newSession } }) => {
            if (newSession) {
              setSession(newSession);
              setUser(newSession.user);
            }
            setIsLoading(false);
          });
          return;
        }
      }
      
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, session, isLoading, signOut }}>
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
