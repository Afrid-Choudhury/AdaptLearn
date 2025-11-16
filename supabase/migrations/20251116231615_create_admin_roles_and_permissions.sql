/*
  # Admin Roles and Permissions System

  ## Overview
  This migration creates a role-based access control system for course administration.
  It allows designated users to create, edit, and manage courses, modules, and lessons.

  ## 1. New Tables

  ### `user_roles`
  - `id` (uuid, primary key) - Unique role assignment identifier
  - `user_id` (uuid, foreign key) - References auth.users
  - `role` (text) - Role type: 'admin', 'instructor', 'student'
  - `created_at` (timestamptz) - Role assignment timestamp
  - `assigned_by` (uuid) - User who assigned the role (nullable)

  ## 2. Security

  ### Row Level Security (RLS)
  - All tables have RLS enabled
  - user_roles: Only admins can manage roles, all authenticated users can view their own role
  - courses: Admins and instructors can insert/update, all authenticated users can view
  - course_modules: Admins and instructors can insert/update, all authenticated users can view
  - course_lessons: Admins and instructors can insert/update, all authenticated users can view

  ## 3. Helper Functions

  ### `is_admin()`
  Returns true if the current user has admin role

  ### `is_admin_or_instructor()`
  Returns true if the current user has admin or instructor role

  ## 4. Important Notes
  - Default role for new users is 'student'
  - First user in the system should be made admin manually
  - Admins can assign instructor and admin roles to other users
  - Instructors can create and edit courses but cannot manage roles
*/

-- Create user_roles table
CREATE TABLE IF NOT EXISTS user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'student' CHECK (role IN ('admin', 'instructor', 'student')),
  created_at timestamptz DEFAULT now(),
  assigned_by uuid REFERENCES auth.users ON DELETE SET NULL,
  UNIQUE(user_id)
);

-- Enable Row Level Security
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- Helper function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid()
    AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to check if user is admin or instructor
CREATE OR REPLACE FUNCTION is_admin_or_instructor()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid()
    AND role IN ('admin', 'instructor')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- User roles policies
CREATE POLICY "Users can view their own role"
  ON user_roles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
  ON user_roles FOR SELECT
  TO authenticated
  USING (is_admin());

CREATE POLICY "Admins can insert roles"
  ON user_roles FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

CREATE POLICY "Admins can update roles"
  ON user_roles FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Admins can delete roles"
  ON user_roles FOR DELETE
  TO authenticated
  USING (is_admin());

-- Update courses table policies for admin/instructor management
DROP POLICY IF EXISTS "Authenticated users can view courses" ON courses;

CREATE POLICY "Anyone can view courses"
  ON courses FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins and instructors can insert courses"
  ON courses FOR INSERT
  TO authenticated
  WITH CHECK (is_admin_or_instructor());

CREATE POLICY "Admins and instructors can update courses"
  ON courses FOR UPDATE
  TO authenticated
  USING (is_admin_or_instructor())
  WITH CHECK (is_admin_or_instructor());

CREATE POLICY "Admins can delete courses"
  ON courses FOR DELETE
  TO authenticated
  USING (is_admin());

-- Update course_modules policies for admin/instructor management
DROP POLICY IF EXISTS "Authenticated users can view course modules" ON course_modules;

CREATE POLICY "Anyone can view modules"
  ON course_modules FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins and instructors can insert modules"
  ON course_modules FOR INSERT
  TO authenticated
  WITH CHECK (is_admin_or_instructor());

CREATE POLICY "Admins and instructors can update modules"
  ON course_modules FOR UPDATE
  TO authenticated
  USING (is_admin_or_instructor())
  WITH CHECK (is_admin_or_instructor());

CREATE POLICY "Admins can delete modules"
  ON course_modules FOR DELETE
  TO authenticated
  USING (is_admin());

-- Update course_lessons policies for admin/instructor management
DROP POLICY IF EXISTS "Authenticated users can view course lessons" ON course_lessons;

CREATE POLICY "Anyone can view lessons"
  ON course_lessons FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins and instructors can insert lessons"
  ON course_lessons FOR INSERT
  TO authenticated
  WITH CHECK (is_admin_or_instructor());

CREATE POLICY "Admins and instructors can update lessons"
  ON course_lessons FOR UPDATE
  TO authenticated
  USING (is_admin_or_instructor())
  WITH CHECK (is_admin_or_instructor());

CREATE POLICY "Admins can delete lessons"
  ON course_lessons FOR DELETE
  TO authenticated
  USING (is_admin());

-- Create index for role lookups
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON user_roles(role);

-- Function to automatically assign student role to new users
CREATE OR REPLACE FUNCTION assign_default_role()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_roles (user_id, role)
  VALUES (NEW.id, 'student')
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to assign default role on user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION assign_default_role();

-- Assign student role to existing users who don't have a role
INSERT INTO user_roles (user_id, role)
SELECT id, 'student'
FROM auth.users
WHERE id NOT IN (SELECT user_id FROM user_roles)
ON CONFLICT (user_id) DO NOTHING;