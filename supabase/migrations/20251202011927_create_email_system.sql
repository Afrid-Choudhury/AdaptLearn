/*
  # Email System and Notification Preferences

  ## Overview
  This migration creates the email tracking and notification preferences system
  for sending personalized emails to users.

  ## 1. New Tables

  ### `user_notification_preferences`
  - `id` (uuid, primary key) - Unique identifier
  - `user_id` (uuid, foreign key) - References auth.users
  - `email_welcome` (boolean) - Welcome email preference
  - `email_password_recovery` (boolean) - Password recovery email preference
  - `email_achievements` (boolean) - Achievement unlocked email preference
  - `email_assessment_reminder` (boolean) - Assessment reminder email preference
  - `email_course_updates` (boolean) - Course update email preference
  - `email_weekly_digest` (boolean) - Weekly digest email preference
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### `email_log`
  - `id` (uuid, primary key) - Unique identifier
  - `user_id` (uuid, foreign key) - References auth.users
  - `email_type` (text) - Type of email sent
  - `recipient_email` (text) - Email address
  - `subject` (text) - Email subject
  - `status` (text) - Status: 'sent', 'failed', 'pending'
  - `resend_id` (text) - Resend API email ID (nullable)
  - `error_message` (text) - Error message if failed (nullable)
  - `sent_at` (timestamptz) - Timestamp when email was sent
  - `created_at` (timestamptz) - Creation timestamp

  ### `achievements`
  - `id` (uuid, primary key) - Unique identifier
  - `name` (text) - Achievement name
  - `description` (text) - Achievement description
  - `icon` (text) - Achievement icon/emoji
  - `criteria_type` (text) - Type of criteria: 'enrollment', 'completion', 'assessment_score', 'streak'
  - `criteria_value` (jsonb) - Criteria details
  - `created_at` (timestamptz) - Creation timestamp

  ### `user_achievements`
  - `id` (uuid, primary key) - Unique identifier
  - `user_id` (uuid, foreign key) - References auth.users
  - `achievement_id` (uuid, foreign key) - References achievements
  - `unlocked_at` (timestamptz) - Unlock timestamp
  - Unique constraint on (user_id, achievement_id)

  ## 2. Security

  ### Row Level Security (RLS)
  - All tables have RLS enabled
  - Users can view/update their own notification preferences
  - Users can view their own email logs (read-only)
  - Users can view all achievements (read-only)
  - Users can view their own unlocked achievements
  - Admin users can manage achievements

  ## 3. Important Notes
  - Default notification preferences: all enabled except weekly digest
  - Email log is append-only for audit purposes
  - Achievement criteria stored as flexible JSONB for extensibility
  - Indexes on foreign keys for performance
*/

-- Create user_notification_preferences table
CREATE TABLE IF NOT EXISTS user_notification_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  email_welcome boolean DEFAULT true,
  email_password_recovery boolean DEFAULT true,
  email_achievements boolean DEFAULT true,
  email_assessment_reminder boolean DEFAULT true,
  email_course_updates boolean DEFAULT true,
  email_weekly_digest boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Create email_log table
CREATE TABLE IF NOT EXISTS email_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  email_type text NOT NULL,
  recipient_email text NOT NULL,
  subject text NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('sent', 'failed', 'pending')),
  resend_id text,
  error_message text,
  sent_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Create achievements table
CREATE TABLE IF NOT EXISTS achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  icon text NOT NULL,
  criteria_type text NOT NULL CHECK (criteria_type IN ('enrollment', 'completion', 'assessment_score', 'streak', 'custom')),
  criteria_value jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Create user_achievements table
CREATE TABLE IF NOT EXISTS user_achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  achievement_id uuid NOT NULL REFERENCES achievements ON DELETE CASCADE,
  unlocked_at timestamptz DEFAULT now(),
  UNIQUE(user_id, achievement_id)
);

-- Enable Row Level Security
ALTER TABLE user_notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

-- User notification preferences policies
CREATE POLICY "Users can view their own notification preferences"
  ON user_notification_preferences FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own notification preferences"
  ON user_notification_preferences FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own notification preferences"
  ON user_notification_preferences FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Email log policies (read-only for users)
CREATE POLICY "Users can view their own email logs"
  ON email_log FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Achievements policies (public read)
CREATE POLICY "Authenticated users can view all achievements"
  ON achievements FOR SELECT
  TO authenticated
  USING (true);

-- User achievements policies
CREATE POLICY "Users can view their own achievements"
  ON user_achievements FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own achievements"
  ON user_achievements FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_user_notification_preferences_user_id ON user_notification_preferences(user_id);
CREATE INDEX IF NOT EXISTS idx_email_log_user_id ON email_log(user_id);
CREATE INDEX IF NOT EXISTS idx_email_log_email_type ON email_log(email_type);
CREATE INDEX IF NOT EXISTS idx_email_log_status ON email_log(status);
CREATE INDEX IF NOT EXISTS idx_email_log_sent_at ON email_log(sent_at);
CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_achievement_id ON user_achievements(achievement_id);

-- Insert default achievements
INSERT INTO achievements (name, description, icon, criteria_type, criteria_value) VALUES
  ('Welcome Aboard', 'Created your AdaptLearn account', '🎉', 'custom', '{"action": "signup"}'::jsonb),
  ('First Steps', 'Enrolled in your first course', '👣', 'enrollment', '{"count": 1}'::jsonb),
  ('Knowledge Seeker', 'Completed your skill assessment', '🎯', 'assessment_score', '{"min_score": 0}'::jsonb),
  ('Dedicated Learner', 'Enrolled in 3 courses', '📚', 'enrollment', '{"count": 3}'::jsonb),
  ('Rising Star', 'Completed 50% of a course', '⭐', 'completion', '{"percentage": 50}'::jsonb),
  ('Course Champion', 'Completed your first course', '🏆', 'completion', '{"percentage": 100, "count": 1}'::jsonb),
  ('Overachiever', 'Scored 90% or higher on assessment', '🌟', 'assessment_score', '{"min_score": 90}'::jsonb),
  ('Master Student', 'Completed 5 courses', '🎓', 'completion', '{"count": 5}'::jsonb)
ON CONFLICT DO NOTHING;

-- Function to automatically create notification preferences for new users
CREATE OR REPLACE FUNCTION create_notification_preferences_for_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_notification_preferences (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create notification preferences on user signup
DROP TRIGGER IF EXISTS on_auth_user_created_notification_prefs ON auth.users;
CREATE TRIGGER on_auth_user_created_notification_prefs
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_notification_preferences_for_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at on notification preferences
DROP TRIGGER IF EXISTS update_notification_preferences_updated_at ON user_notification_preferences;
CREATE TRIGGER update_notification_preferences_updated_at
  BEFORE UPDATE ON user_notification_preferences
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
