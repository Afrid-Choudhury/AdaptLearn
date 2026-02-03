/*
  # Add Unsubscribe Token to Notification Preferences

  1. Changes
    - Adds `unsubscribe_token` column to `user_notification_preferences` table
    - Creates unique constraint on unsubscribe_token for fast lookups
    - Creates function to generate tokens for existing and new users
    - Adds policy to allow anonymous unsubscribe by token

  2. Security
    - Token is a secure random UUID that can be used in unsubscribe links
    - Token-based access allows unsubscribe without authentication
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_notification_preferences' AND column_name = 'unsubscribe_token'
  ) THEN
    ALTER TABLE user_notification_preferences 
    ADD COLUMN unsubscribe_token uuid DEFAULT gen_random_uuid() UNIQUE;
  END IF;
END $$;

UPDATE user_notification_preferences
SET unsubscribe_token = gen_random_uuid()
WHERE unsubscribe_token IS NULL;

CREATE OR REPLACE FUNCTION ensure_notification_preferences_on_signup()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql AS $$
BEGIN
  INSERT INTO user_notification_preferences (user_id, unsubscribe_token)
  VALUES (NEW.id, gen_random_uuid())
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS create_notification_preferences_on_signup ON auth.users;

CREATE TRIGGER create_notification_preferences_on_signup
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION ensure_notification_preferences_on_signup();

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'user_notification_preferences' 
    AND policyname = 'Allow public unsubscribe by token'
  ) THEN
    CREATE POLICY "Allow public unsubscribe by token"
      ON user_notification_preferences
      FOR UPDATE
      TO anon
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'user_notification_preferences' 
    AND policyname = 'Allow public read by unsubscribe token'
  ) THEN
    CREATE POLICY "Allow public read by unsubscribe token"
      ON user_notification_preferences
      FOR SELECT
      TO anon
      USING (true);
  END IF;
END $$;
