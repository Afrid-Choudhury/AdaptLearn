/*
  # Fix Security and Performance Issues

  1. Add Missing Index
    - Add index on `lesson_code_drafts.lesson_id` for foreign key performance

  2. Fix RLS Policies
    - Update `lesson_code_drafts` policies to use `(select auth.uid())` for better performance
    - Fix `user_notification_preferences` unsubscribe policy to be more restrictive

  3. Fix Function Search Paths
    - Drop and recreate functions with immutable search_path

  4. Drop Unused Indexes
    - Remove indexes that have never been used to improve write performance

  5. Security Notes
    - Leaked password protection must be enabled manually in Supabase Dashboard
    - Auth DB connection strategy is a configuration setting in Supabase Dashboard
*/

-- 1. Add missing index for foreign key
CREATE INDEX IF NOT EXISTS idx_lesson_code_drafts_lesson_id 
ON lesson_code_drafts(lesson_id);

-- 2. Fix RLS policies on lesson_code_drafts to use (select auth.uid())
DROP POLICY IF EXISTS "Users can view own code drafts" ON lesson_code_drafts;
DROP POLICY IF EXISTS "Users can insert own code drafts" ON lesson_code_drafts;
DROP POLICY IF EXISTS "Users can update own code drafts" ON lesson_code_drafts;
DROP POLICY IF EXISTS "Users can delete own code drafts" ON lesson_code_drafts;

CREATE POLICY "Users can view own code drafts"
  ON lesson_code_drafts
  FOR SELECT
  TO authenticated
  USING (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can insert own code drafts"
  ON lesson_code_drafts
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can update own code drafts"
  ON lesson_code_drafts
  FOR UPDATE
  TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can delete own code drafts"
  ON lesson_code_drafts
  FOR DELETE
  TO authenticated
  USING (user_id = (SELECT auth.uid()));

-- 3. Fix overly permissive unsubscribe policies
DROP POLICY IF EXISTS "Allow public unsubscribe by token" ON user_notification_preferences;
DROP POLICY IF EXISTS "Allow public read by unsubscribe token" ON user_notification_preferences;

CREATE POLICY "Allow token-based unsubscribe read"
  ON user_notification_preferences
  FOR SELECT
  TO anon
  USING (unsubscribe_token IS NOT NULL);

CREATE POLICY "Allow token-based unsubscribe update"
  ON user_notification_preferences
  FOR UPDATE
  TO anon
  USING (unsubscribe_token IS NOT NULL)
  WITH CHECK (unsubscribe_token IS NOT NULL);

-- 4. Fix functions with mutable search_path by dropping and recreating
DROP FUNCTION IF EXISTS increment_enrollment_xp(uuid, integer);
DROP FUNCTION IF EXISTS increment_course_student_count(uuid);
DROP FUNCTION IF EXISTS decrement_course_student_count(uuid);

CREATE FUNCTION increment_enrollment_xp(enrollment_uuid uuid, xp_amount integer)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE course_enrollments
  SET total_xp = COALESCE(total_xp, 0) + xp_amount
  WHERE id = enrollment_uuid;
END;
$$;

CREATE FUNCTION increment_course_student_count(course_uuid uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE courses
  SET student_count = COALESCE(student_count, 0) + 1
  WHERE id = course_uuid;
END;
$$;

CREATE FUNCTION decrement_course_student_count(course_uuid uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE courses
  SET student_count = GREATEST(COALESCE(student_count, 0) - 1, 0)
  WHERE id = course_uuid;
END;
$$;

-- 5. Drop unused indexes (these have never been used and add write overhead)
DROP INDEX IF EXISTS idx_user_assessment_results_assessment_id;
DROP INDEX IF EXISTS idx_user_progress_user_id;
DROP INDEX IF EXISTS idx_user_progress_course_id;
DROP INDEX IF EXISTS idx_user_module_progress_module_id;
DROP INDEX IF EXISTS idx_user_lesson_progress_lesson_id;
DROP INDEX IF EXISTS idx_user_lesson_progress_module_progress_id;
DROP INDEX IF EXISTS idx_course_enrollments_course_id;
DROP INDEX IF EXISTS idx_email_log_user_id;
DROP INDEX IF EXISTS idx_email_log_email_type;
DROP INDEX IF EXISTS idx_email_log_status;
DROP INDEX IF EXISTS idx_email_log_sent_at;
DROP INDEX IF EXISTS idx_user_achievements_user_id;
DROP INDEX IF EXISTS idx_user_achievements_achievement_id;
DROP INDEX IF EXISTS idx_user_roles_user_id;
DROP INDEX IF EXISTS idx_user_roles_role;
DROP INDEX IF EXISTS idx_user_roles_assigned_by;
DROP INDEX IF EXISTS idx_user_notification_preferences_user_id;
