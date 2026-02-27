/*
  # Achievement Email Notification System

  ## Overview
  Creates database trigger and function to send achievement unlock emails
  when users earn new achievements.

  ## New Functions
  - `send_achievement_notification()` - Trigger function that sends email when achievement is unlocked
  
  ## New Triggers
  - `on_achievement_unlock` - Fires after new achievement is inserted into user_achievements

  ## How It Works
  1. When an achievement is unlocked (row inserted into user_achievements)
  2. Trigger function checks user's email notification preferences
  3. If user has email_achievements enabled, it logs the email to be sent
  4. The edge function processes the email log and sends the email

  ## Security
  - Respects user notification preferences
  - Only sends emails for newly unlocked achievements
  - All email sending happens through secure edge function
*/

-- Function to handle achievement unlock notifications
CREATE OR REPLACE FUNCTION send_achievement_notification()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_email text;
  v_username text;
  v_achievement_name text;
  v_achievement_description text;
  v_achievement_icon text;
  v_total_achievements integer;
  v_email_enabled boolean;
BEGIN
  SELECT email INTO v_user_email
  FROM auth.users
  WHERE id = NEW.user_id;

  SELECT COALESCE(username, SPLIT_PART(email, '@', 1)) INTO v_username
  FROM profiles
  WHERE id = NEW.user_id;

  SELECT email_achievements INTO v_email_enabled
  FROM user_notification_preferences
  WHERE user_id = NEW.user_id;

  IF v_email_enabled IS NULL THEN
    v_email_enabled := true;
  END IF;

  IF NOT v_email_enabled THEN
    RETURN NEW;
  END IF;

  SELECT name, description, icon INTO v_achievement_name, v_achievement_description, v_achievement_icon
  FROM achievements
  WHERE id = NEW.achievement_id;

  SELECT COUNT(*) INTO v_total_achievements
  FROM user_achievements
  WHERE user_id = NEW.user_id;

  INSERT INTO email_log (
    user_id,
    email_type,
    recipient_email,
    subject,
    status
  ) VALUES (
    NEW.user_id,
    'achievement_unlocked',
    v_user_email,
    'Achievement Unlocked: ' || v_achievement_name,
    'pending'
  );

  RETURN NEW;
END;
$$;

-- Drop trigger if exists
DROP TRIGGER IF EXISTS on_achievement_unlock ON user_achievements;

-- Create trigger for achievement unlocks
CREATE TRIGGER on_achievement_unlock
  AFTER INSERT ON user_achievements
  FOR EACH ROW
  EXECUTE FUNCTION send_achievement_notification();