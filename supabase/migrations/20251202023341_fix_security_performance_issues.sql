/*
  # Fix Security and Performance Issues

  1. Performance Improvements
    - Add missing foreign key index on user_roles.assigned_by
    - Optimize all RLS policies to use (select auth.uid()) instead of auth.uid()
    - Fix function search paths for security functions

  2. Security Improvements
    - Consolidate multiple permissive policies on user_roles
    - Ensure all functions have immutable search paths

  3. Notes
    - Unused indexes are kept as they will be used as the application scales
    - All RLS policies are dropped and recreated with optimized syntax
    - Multiple permissive policies are consolidated into single policies
*/

-- =====================================================
-- 1. Add Missing Foreign Key Index
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_user_roles_assigned_by
ON user_roles(assigned_by);

-- =====================================================
-- 2. Fix Function Search Paths (Security)
-- Note: CASCADE will drop and recreate dependent policies
-- =====================================================

-- Drop and recreate is_admin with immutable search_path
DROP FUNCTION IF EXISTS is_admin() CASCADE;
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM user_roles
    WHERE user_id = auth.uid()
    AND role = 'admin'
  );
END;
$$;

-- Drop and recreate is_admin_or_instructor with immutable search_path
DROP FUNCTION IF EXISTS is_admin_or_instructor() CASCADE;
CREATE OR REPLACE FUNCTION is_admin_or_instructor()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM user_roles
    WHERE user_id = auth.uid()
    AND role IN ('admin', 'instructor')
  );
END;
$$;

-- Fix update_updated_at_column search_path
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$;

-- Recreate triggers for update_updated_at_column
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_courses_updated_at
  BEFORE UPDATE ON courses
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 3. Optimize RLS Policies - profiles table
-- =====================================================

DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;

CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (id = (select auth.uid()));

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (id = (select auth.uid()));

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (id = (select auth.uid()))
  WITH CHECK (id = (select auth.uid()));

-- =====================================================
-- 4. Optimize RLS Policies - user_assessment_results
-- =====================================================

DROP POLICY IF EXISTS "Users can view their own assessment results" ON user_assessment_results;
DROP POLICY IF EXISTS "Users can insert their own assessment results" ON user_assessment_results;

CREATE POLICY "Users can view their own assessment results"
  ON user_assessment_results FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

CREATE POLICY "Users can insert their own assessment results"
  ON user_assessment_results FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

-- =====================================================
-- 5. Optimize RLS Policies - user_progress
-- =====================================================

DROP POLICY IF EXISTS "Users can view their own progress" ON user_progress;
DROP POLICY IF EXISTS "Users can insert their own progress" ON user_progress;
DROP POLICY IF EXISTS "Users can update their own progress" ON user_progress;

CREATE POLICY "Users can view their own progress"
  ON user_progress FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

CREATE POLICY "Users can insert their own progress"
  ON user_progress FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can update their own progress"
  ON user_progress FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

-- =====================================================
-- 6. Optimize RLS Policies - course_enrollments
-- =====================================================

DROP POLICY IF EXISTS "Users can view their own enrollments" ON course_enrollments;
DROP POLICY IF EXISTS "Users can create their own enrollments" ON course_enrollments;
DROP POLICY IF EXISTS "Users can update their own enrollments" ON course_enrollments;

CREATE POLICY "Users can view their own enrollments"
  ON course_enrollments FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

CREATE POLICY "Users can create their own enrollments"
  ON course_enrollments FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can update their own enrollments"
  ON course_enrollments FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

-- =====================================================
-- 7. Optimize RLS Policies - user_module_progress
-- =====================================================

DROP POLICY IF EXISTS "Users can view their own module progress" ON user_module_progress;
DROP POLICY IF EXISTS "Users can create their own module progress" ON user_module_progress;
DROP POLICY IF EXISTS "Users can update their own module progress" ON user_module_progress;

CREATE POLICY "Users can view their own module progress"
  ON user_module_progress FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

CREATE POLICY "Users can create their own module progress"
  ON user_module_progress FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can update their own module progress"
  ON user_module_progress FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

-- =====================================================
-- 8. Optimize RLS Policies - user_lesson_progress
-- =====================================================

DROP POLICY IF EXISTS "Users can view their own lesson progress" ON user_lesson_progress;
DROP POLICY IF EXISTS "Users can create their own lesson progress" ON user_lesson_progress;
DROP POLICY IF EXISTS "Users can update their own lesson progress" ON user_lesson_progress;

CREATE POLICY "Users can view their own lesson progress"
  ON user_lesson_progress FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

CREATE POLICY "Users can create their own lesson progress"
  ON user_lesson_progress FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can update their own lesson progress"
  ON user_lesson_progress FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

-- =====================================================
-- 9. Recreate Admin Policies for courses, modules, lessons
-- (these were dropped by CASCADE)
-- =====================================================

-- Courses admin policies
CREATE POLICY "Admins can delete courses"
  ON courses FOR DELETE
  TO authenticated
  USING (is_admin());

-- Course modules admin policies  
CREATE POLICY "Admins can delete modules"
  ON course_modules FOR DELETE
  TO authenticated
  USING (is_admin());

-- Course lessons admin policies
CREATE POLICY "Admins can delete lessons"
  ON course_lessons FOR DELETE
  TO authenticated
  USING (is_admin());

-- =====================================================
-- 10. Optimize and Consolidate RLS Policies - user_roles
-- =====================================================

-- Drop all existing policies (some were dropped by CASCADE already)
DROP POLICY IF EXISTS "Users can view their own role" ON user_roles;
DROP POLICY IF EXISTS "Users can insert own student role" ON user_roles;
DROP POLICY IF EXISTS "Admins can view all roles" ON user_roles;
DROP POLICY IF EXISTS "Admins can insert any role" ON user_roles;
DROP POLICY IF EXISTS "Admins can update any role" ON user_roles;
DROP POLICY IF EXISTS "Admins can delete any role" ON user_roles;

-- Consolidated SELECT policy (combines user and admin access)
CREATE POLICY "Users can view roles"
  ON user_roles FOR SELECT
  TO authenticated
  USING (
    user_id = (select auth.uid())
    OR
    is_admin()
  );

-- Consolidated INSERT policy (combines student self-insert and admin insert)
CREATE POLICY "Users can insert roles"
  ON user_roles FOR INSERT
  TO authenticated
  WITH CHECK (
    -- Users can insert their own student role
    (user_id = (select auth.uid()) AND role = 'student')
    OR
    -- Admins can insert any role
    is_admin()
  );

-- Admin-only UPDATE policy
CREATE POLICY "Admins can update roles"
  ON user_roles FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- Admin-only DELETE policy
CREATE POLICY "Admins can delete roles"
  ON user_roles FOR DELETE
  TO authenticated
  USING (is_admin());

-- =====================================================
-- 11. Optimize RLS Policies - user_notification_preferences
-- =====================================================

DROP POLICY IF EXISTS "Users can view their own notification preferences" ON user_notification_preferences;
DROP POLICY IF EXISTS "Users can insert their own notification preferences" ON user_notification_preferences;
DROP POLICY IF EXISTS "Users can update their own notification preferences" ON user_notification_preferences;

CREATE POLICY "Users can view their own notification preferences"
  ON user_notification_preferences FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

CREATE POLICY "Users can insert their own notification preferences"
  ON user_notification_preferences FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can update their own notification preferences"
  ON user_notification_preferences FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

-- =====================================================
-- 12. Optimize RLS Policies - email_log
-- =====================================================

DROP POLICY IF EXISTS "Users can view their own email logs" ON email_log;

CREATE POLICY "Users can view their own email logs"
  ON email_log FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

-- =====================================================
-- 13. Optimize RLS Policies - user_achievements
-- =====================================================

DROP POLICY IF EXISTS "Users can view their own achievements" ON user_achievements;
DROP POLICY IF EXISTS "Users can insert their own achievements" ON user_achievements;

CREATE POLICY "Users can view their own achievements"
  ON user_achievements FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

CREATE POLICY "Users can insert their own achievements"
  ON user_achievements FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));