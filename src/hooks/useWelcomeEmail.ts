import { useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { sendWelcomeEmail } from '../lib/email-service';
import { supabase } from '../lib/supabase';

export function useWelcomeEmail() {
  const { user } = useAuth();
  const hasRun = useRef(false);

  useEffect(() => {
    if (!user || hasRun.current) return;

    const createdAt = new Date(user.created_at || '');
    const now = new Date();
    const timeSinceCreation = now.getTime() - createdAt.getTime();
    const oneMinute = 60 * 1000;

    if (timeSinceCreation < oneMinute) {
      hasRun.current = true;
      const displayName = user.user_metadata?.username || user.email?.split('@')[0] || 'there';

      if (user.email) {
        setTimeout(() => {
          sendWelcomeEmail(user.id, user.email!, displayName).catch(err => {
            if (import.meta.env.DEV) {
              console.error('Failed to send welcome email:', err);
            }
          });

          supabase.rpc('check_all_achievements', {
            p_user_id: user.id
          }).catch(err => {
            if (import.meta.env.DEV) {
              console.error('Failed to check achievements:', err);
            }
          });
        }, 2000);
      }
    }
  }, [user]);
}
