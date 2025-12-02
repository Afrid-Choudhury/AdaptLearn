import { useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { sendWelcomeEmail, checkAndAwardAchievement } from '../lib/email-service';

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

          checkAndAwardAchievement(user.id, 'custom', { action: 'signup' }).catch(err => {
            if (import.meta.env.DEV) {
              console.error('Failed to award signup achievement:', err);
            }
          });
        }, 2000);
      }
    }
  }, [user]);
}
