/*
  # Fix User Signup Triggers

  ## Overview
  This migration consolidates multiple triggers on auth.users into a single trigger
  to prevent conflicts during user signup.

  ## Problem
  We had two separate triggers on auth.users:
  1. assign_default_role() - creates user role
  2. create_notification_preferences_for_new_user() - creates notification preferences
  
  Multiple triggers can cause conflicts and "Database error saving new user" errors.

  ## Solution
  Combine both functions into a single trigger that:
  1. Creates the default 'student' role
  2. Creates default notification preferences
  3. Uses SECURITY DEFINER to bypass RLS
  4. Handles errors gracefully

  ## Security Notes
  - Function uses SECURITY DEFINER to bypass RLS during signup
  - Only creates 'student' roles automatically
  - RLS policies remain active for all user-initiated queries
*/

-- Drop existing triggers and functions
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_created_notification_prefs ON auth.users;
DROP FUNCTION IF EXISTS assign_default_role() CASCADE;
DROP FUNCTION IF EXISTS create_notification_preferences_for_new_user() CASCADE;

-- Create a single consolidated function for user initialization
CREATE OR REPLACE FUNCTION initialize_new_user()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Create default role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'student')
  ON CONFLICT (user_id) DO NOTHING;
  
  -- Create default notification preferences
  INSERT INTO public.user_notification_preferences (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't block user creation
    RAISE WARNING 'Error initializing user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a single trigger for user initialization
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION initialize_new_user();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO postgres;
GRANT ALL ON public.user_roles TO postgres;
GRANT ALL ON public.user_notification_preferences TO postgres;
