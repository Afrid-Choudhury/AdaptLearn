/*
  # Fix Trigger to Bypass RLS

  ## Overview
  The trigger function that creates user roles was being blocked by RLS policies.
  During signup, the user isn't authenticated yet, so the trigger can't insert the role.

  ## Changes
  1. Recreate the trigger function to properly bypass RLS using SET LOCAL
  2. Ensure the function runs with proper permissions

  ## Security Notes
  - The function only creates 'student' roles automatically
  - Admins still control admin/instructor role assignments
  - RLS policies remain active for all user-initiated queries
*/

-- Drop and recreate the function with proper RLS bypass
DROP FUNCTION IF EXISTS assign_default_role() CASCADE;

CREATE OR REPLACE FUNCTION assign_default_role()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Temporarily disable RLS for this insert
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'student')
  ON CONFLICT (user_id) DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Recreate the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION assign_default_role();

-- Grant necessary permissions to the function owner
GRANT USAGE ON SCHEMA public TO postgres;
GRANT ALL ON public.user_roles TO postgres;