import { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, username?: string) => Promise<{ error: Error | null; data?: { user: User | null } }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  updatePassword: (newPassword: string) => Promise<{ error: Error | null }>;
  updateEmail: (newEmail: string) => Promise<{ error: Error | null }>;
  deleteAccount: () => Promise<{ error: Error | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      (async () => {
        setUser(session?.user ?? null);
      })();
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, username?: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: username || email.split('@')[0],
          },
          emailRedirectTo: window.location.origin,
        },
      });

      if (error) throw error;

      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: data.user.id,
              email: data.user.email!,
              username: username || email.split('@')[0],
              skill_level: 'beginner',
            },
          ]);

        if (profileError && import.meta.env.DEV) {
          console.error('Profile creation error:', profileError);
        }
      }

      return { error: null, data: { user: data.user } };
    } catch (error) {
      return { error: error as Error, data: undefined };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const updatePassword = async (newPassword: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const updateEmail = async (newEmail: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        email: newEmail,
      });
      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const deleteAccount = async () => {
    try {
      if (!user) throw new Error('No user logged in');

      await supabase.from('user_lesson_progress').delete().eq('user_id', user.id);
      await supabase.from('user_module_progress').delete().eq('user_id', user.id);
      await supabase.from('course_enrollments').delete().eq('user_id', user.id);
      await supabase.from('user_achievements').delete().eq('user_id', user.id);
      await supabase.from('user_assessment_results').delete().eq('user_id', user.id);
      await supabase.from('user_notification_preferences').delete().eq('user_id', user.id);
      await supabase.from('user_progress').delete().eq('user_id', user.id);
      await supabase.from('lesson_code_drafts').delete().eq('user_id', user.id);
      await supabase.from('email_log').delete().eq('user_id', user.id);
      await supabase.from('user_roles').delete().eq('user_id', user.id);
      await supabase.from('profiles').delete().eq('id', user.id);

      await supabase.auth.signOut();

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut, updatePassword, updateEmail, deleteAccount }}>
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
