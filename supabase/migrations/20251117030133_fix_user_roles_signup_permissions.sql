/*
  # Fix User Roles Signup Permissions

  ## Overview
  This migration fixes the permissions issue when creating user roles during signup.
  It allows authenticated users to create their own student role record.

  ## Changes
  1. Add policy to allow users to insert their own student role during signup
  2. Keep existing admin-only policies for managing other users' roles

  ## Security Notes
  - Users can only insert a 'student' role for themselves
  - Admins are still required to assign 'admin' or 'instructor' roles
  - Existing admin management policies remain unchanged
*/

-- Drop the existing insert policy that only allows admins
DROP POLICY IF EXISTS "Admins can insert roles" ON user_roles;

-- Allow users to insert their own student role during signup
CREATE POLICY "Users can insert own student role"
  ON user_roles FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id 
    AND role = 'student'
  );

-- Allow admins to insert any role for any user
CREATE POLICY "Admins can insert any role"
  ON user_roles FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());