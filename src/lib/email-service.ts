import { supabase } from './supabase';
import {
  generateWelcomeEmail,
  generatePasswordRecoveryEmail,
  generateAchievementEmail,
  generateAssessmentReminderEmail,
  type WelcomeEmailData,
  type PasswordRecoveryEmailData,
  type AchievementEmailData,
  type AssessmentReminderEmailData,
} from './email-templates';

export type EmailType =
  | 'welcome'
  | 'password_recovery'
  | 'achievement_unlocked'
  | 'assessment_reminder'
  | 'course_update'
  | 'weekly_digest';

interface SendEmailParams {
  userId: string;
  recipientEmail: string;
  emailType: EmailType;
  subject: string;
  html: string;
  text: string;
}

async function sendEmail(params: SendEmailParams): Promise<{ success: boolean; error?: string }> {
  try {
    const { data: session } = await supabase.auth.getSession();
    if (!session?.session) {
      throw new Error('User must be authenticated to send emails');
    }

    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Supabase configuration is missing');
    }

    const response = await fetch(`${supabaseUrl}/functions/v1/send-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.session.access_token}`,
        'apikey': supabaseAnonKey,
      },
      body: JSON.stringify({
        to: params.recipientEmail,
        subject: params.subject,
        html: params.html,
        text: params.text,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Failed to send email');
    }

    await supabase.from('email_log').insert({
      user_id: params.userId,
      email_type: params.emailType,
      recipient_email: params.recipientEmail,
      subject: params.subject,
      status: 'sent',
      resend_id: result.id,
      sent_at: new Date().toISOString(),
    });

    return { success: true };
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error('Error sending email:', error);
    }

    await supabase.from('email_log').insert({
      user_id: params.userId,
      email_type: params.emailType,
      recipient_email: params.recipientEmail,
      subject: params.subject,
      status: 'failed',
      error_message: error instanceof Error ? error.message : 'Unknown error',
    });

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send email',
    };
  }
}

export async function sendWelcomeEmail(
  userId: string,
  email: string,
  username: string
): Promise<{ success: boolean; error?: string }> {
  const baseUrl = window.location.origin;

  const emailData: WelcomeEmailData = {
    username,
    email,
    assessmentUrl: `${baseUrl}/assessment`,
    dashboardUrl: `${baseUrl}/dashboard`,
  };

  const template = generateWelcomeEmail(emailData);

  return sendEmail({
    userId,
    recipientEmail: email,
    emailType: 'welcome',
    subject: template.subject,
    html: template.html,
    text: template.text,
  });
}

export async function sendPasswordRecoveryEmail(
  userId: string,
  email: string,
  username: string,
  resetLink: string,
  expirationTime: string = '1 hour'
): Promise<{ success: boolean; error?: string }> {
  const emailData: PasswordRecoveryEmailData = {
    username,
    resetLink,
    expirationTime,
  };

  const template = generatePasswordRecoveryEmail(emailData);

  return sendEmail({
    userId,
    recipientEmail: email,
    emailType: 'password_recovery',
    subject: template.subject,
    html: template.html,
    text: template.text,
  });
}

export async function sendAchievementEmail(
  userId: string,
  email: string,
  username: string,
  achievementName: string,
  achievementDescription: string,
  achievementIcon: string,
  totalAchievements: number
): Promise<{ success: boolean; error?: string }> {
  const baseUrl = window.location.origin;

  const emailData: AchievementEmailData = {
    username,
    achievementName,
    achievementDescription,
    achievementIcon,
    totalAchievements,
    dashboardUrl: `${baseUrl}/dashboard`,
  };

  const template = generateAchievementEmail(emailData);

  return sendEmail({
    userId,
    recipientEmail: email,
    emailType: 'achievement_unlocked',
    subject: template.subject,
    html: template.html,
    text: template.text,
  });
}

export async function sendAssessmentReminderEmail(
  userId: string,
  email: string,
  username: string,
  estimatedMinutes: string = '5-10 minutes'
): Promise<{ success: boolean; error?: string }> {
  const baseUrl = window.location.origin;

  const emailData: AssessmentReminderEmailData = {
    username,
    assessmentUrl: `${baseUrl}/assessment`,
    estimatedMinutes,
  };

  const template = generateAssessmentReminderEmail(emailData);

  return sendEmail({
    userId,
    recipientEmail: email,
    emailType: 'assessment_reminder',
    subject: template.subject,
    html: template.html,
    text: template.text,
  });
}

export async function checkEmailPreference(
  userId: string,
  emailType: EmailType
): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('user_notification_preferences')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error || !data) {
      return true;
    }

    const prefKey = `email_${emailType}` as keyof typeof data;
    return data[prefKey] !== false;
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error('Error checking email preference:', error);
    }
    return true;
  }
}

export async function unlockAchievement(
  userId: string,
  achievementId: string
): Promise<{ success: boolean; achievement?: any; error?: string }> {
  try {
    const { data: existingAchievement } = await supabase
      .from('user_achievements')
      .select('*')
      .eq('user_id', userId)
      .eq('achievement_id', achievementId)
      .maybeSingle();

    if (existingAchievement) {
      return { success: false, error: 'Achievement already unlocked' };
    }

    const { data: achievement, error: achievementError } = await supabase
      .from('achievements')
      .select('*')
      .eq('id', achievementId)
      .single();

    if (achievementError || !achievement) {
      throw new Error('Achievement not found');
    }

    const { error: insertError } = await supabase
      .from('user_achievements')
      .insert({
        user_id: userId,
        achievement_id: achievementId,
      });

    if (insertError) throw insertError;

    return { success: true, achievement };
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error('Error unlocking achievement:', error);
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to unlock achievement',
    };
  }
}

export async function getUserAchievements(userId: string) {
  try {
    const { data, error } = await supabase
      .from('user_achievements')
      .select(`
        *,
        achievement:achievements(*)
      `)
      .eq('user_id', userId)
      .order('unlocked_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error('Error fetching user achievements:', error);
    }
    return [];
  }
}

export async function getAllAchievements() {
  try {
    const { data, error } = await supabase
      .from('achievements')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error('Error fetching achievements:', error);
    }
    return [];
  }
}

export async function checkAndAwardAchievement(
  userId: string,
  criteriaType: string,
  criteriaValue: any
): Promise<string[]> {
  try {
    const { data: achievements } = await supabase
      .from('achievements')
      .select('*')
      .eq('criteria_type', criteriaType);

    if (!achievements || achievements.length === 0) return [];

    const awardedAchievements: string[] = [];

    for (const achievement of achievements) {
      const criteria = achievement.criteria_value as any;
      let shouldAward = false;

      switch (criteriaType) {
        case 'enrollment':
          shouldAward = criteriaValue.count >= (criteria.count || 0);
          break;
        case 'completion':
          if (criteria.percentage) {
            shouldAward = criteriaValue.percentage >= criteria.percentage;
          }
          if (criteria.count) {
            shouldAward = criteriaValue.count >= criteria.count;
          }
          break;
        case 'assessment_score':
          shouldAward = criteriaValue.score >= (criteria.min_score || 0);
          break;
        case 'custom':
          shouldAward = criteriaValue.action === criteria.action;
          break;
      }

      if (shouldAward) {
        const result = await unlockAchievement(userId, achievement.id);
        if (result.success) {
          awardedAchievements.push(achievement.id);
        }
      }
    }

    return awardedAchievements;
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error('Error checking and awarding achievements:', error);
    }
    return [];
  }
}
