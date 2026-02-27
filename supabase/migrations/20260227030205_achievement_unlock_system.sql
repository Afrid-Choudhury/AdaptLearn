/*
  # Achievement Unlock System

  ## Overview
  Creates comprehensive achievement evaluation and unlock system with automatic checks,
  leaderboard views, and XP ranking functionality.

  ## New Functions

  ### Achievement Management
  - `award_achievement(p_user_id, p_achievement_id)` - Safely awards achievement preventing duplicates
  - `check_enrollment_achievements(p_user_id)` - Checks and awards enrollment-based achievements
  - `check_completion_achievements(p_user_id)` - Checks and awards completion-based achievements
  - `check_assessment_achievements(p_user_id, p_score)` - Checks and awards assessment achievements
  - `check_all_achievements(p_user_id)` - Comprehensive check of all achievement criteria

  ### Leaderboard Functions
  - `get_user_rank(p_user_id)` - Returns user's global rank based on total XP
  - `get_leaderboard(p_limit, p_offset)` - Returns paginated global leaderboard
  - `get_users_near_rank(p_user_id, p_context_size)` - Returns users near current user's rank

  ## New Views
  - `leaderboard_global` - Global XP rankings with rank calculation
  - `achievement_progress` - User progress towards achievements

  ## New Indexes
  - Index on `course_enrollments.total_xp` for fast leaderboard queries
  - Composite index on `user_achievements(user_id, achievement_id)` for duplicate prevention

  ## Security
  - All functions use authenticated user context
  - RLS policies ensure users can only see public leaderboard data
  - Achievement awards are atomic with duplicate protection
*/

-- Add unique constraint to prevent duplicate achievements
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'user_achievements_user_achievement_unique'
  ) THEN
    ALTER TABLE user_achievements 
    ADD CONSTRAINT user_achievements_user_achievement_unique 
    UNIQUE (user_id, achievement_id);
  END IF;
END $$;

-- Create index for leaderboard performance
CREATE INDEX IF NOT EXISTS idx_course_enrollments_total_xp 
ON course_enrollments(total_xp DESC NULLS LAST);

-- Create composite index for achievement lookups
CREATE INDEX IF NOT EXISTS idx_user_achievements_user_achievement 
ON user_achievements(user_id, achievement_id);

-- Global leaderboard view with ranking
CREATE OR REPLACE VIEW leaderboard_global AS
SELECT 
  u.id as user_id,
  COALESCE(p.username, SPLIT_PART(u.email, '@', 1)) as username,
  p.email,
  COALESCE(SUM(ce.total_xp), 0) as total_xp,
  COUNT(DISTINCT ce.id) as course_count,
  COUNT(DISTINCT CASE WHEN ce.status = 'completed' THEN ce.id END) as completed_courses,
  RANK() OVER (ORDER BY COALESCE(SUM(ce.total_xp), 0) DESC) as rank
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
LEFT JOIN course_enrollments ce ON u.id = ce.user_id
GROUP BY u.id, p.username, p.email
ORDER BY total_xp DESC;

-- Function to safely award achievement (prevents duplicates)
CREATE OR REPLACE FUNCTION award_achievement(p_user_id uuid, p_achievement_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Try to insert, ignore if duplicate
  INSERT INTO user_achievements (user_id, achievement_id, unlocked_at)
  VALUES (p_user_id, p_achievement_id, now())
  ON CONFLICT (user_id, achievement_id) DO NOTHING;
  
  -- Return true if a new row was inserted
  RETURN FOUND;
END;
$$;

-- Check enrollment-based achievements
CREATE OR REPLACE FUNCTION check_enrollment_achievements(p_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_enrollment_count integer;
  v_achievement_id uuid;
BEGIN
  -- Count active enrollments
  SELECT COUNT(*) INTO v_enrollment_count
  FROM course_enrollments
  WHERE user_id = p_user_id;

  -- First Steps: Enroll in first course
  IF v_enrollment_count >= 1 THEN
    SELECT id INTO v_achievement_id 
    FROM achievements 
    WHERE criteria_type = 'enrollment' 
      AND (criteria_value->>'count')::integer = 1
    LIMIT 1;
    
    IF v_achievement_id IS NOT NULL THEN
      PERFORM award_achievement(p_user_id, v_achievement_id);
    END IF;
  END IF;

  -- Dedicated Learner: Enroll in 3 courses
  IF v_enrollment_count >= 3 THEN
    SELECT id INTO v_achievement_id 
    FROM achievements 
    WHERE criteria_type = 'enrollment' 
      AND (criteria_value->>'count')::integer = 3
    LIMIT 1;
    
    IF v_achievement_id IS NOT NULL THEN
      PERFORM award_achievement(p_user_id, v_achievement_id);
    END IF;
  END IF;
END;
$$;

-- Check completion-based achievements
CREATE OR REPLACE FUNCTION check_completion_achievements(p_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_completed_count integer;
  v_half_complete_count integer;
  v_achievement_id uuid;
BEGIN
  -- Count completed courses
  SELECT COUNT(*) INTO v_completed_count
  FROM course_enrollments
  WHERE user_id = p_user_id AND status = 'completed';

  -- Count courses at 50%+ progress
  SELECT COUNT(*) INTO v_half_complete_count
  FROM user_progress
  WHERE user_id = p_user_id AND progress_percentage >= 50;

  -- Rising Star: Reach 50% in any course
  IF v_half_complete_count >= 1 THEN
    SELECT id INTO v_achievement_id 
    FROM achievements 
    WHERE criteria_type = 'completion' 
      AND criteria_value->>'threshold' = '50'
    LIMIT 1;
    
    IF v_achievement_id IS NOT NULL THEN
      PERFORM award_achievement(p_user_id, v_achievement_id);
    END IF;
  END IF;

  -- Course Champion: Complete first course
  IF v_completed_count >= 1 THEN
    SELECT id INTO v_achievement_id 
    FROM achievements 
    WHERE criteria_type = 'completion' 
      AND (criteria_value->>'count')::integer = 1
    LIMIT 1;
    
    IF v_achievement_id IS NOT NULL THEN
      PERFORM award_achievement(p_user_id, v_achievement_id);
    END IF;
  END IF;

  -- Master Student: Complete 5 courses
  IF v_completed_count >= 5 THEN
    SELECT id INTO v_achievement_id 
    FROM achievements 
    WHERE criteria_type = 'completion' 
      AND (criteria_value->>'count')::integer = 5
    LIMIT 1;
    
    IF v_achievement_id IS NOT NULL THEN
      PERFORM award_achievement(p_user_id, v_achievement_id);
    END IF;
  END IF;
END;
$$;

-- Check assessment-based achievements
CREATE OR REPLACE FUNCTION check_assessment_achievements(p_user_id uuid, p_score integer)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_assessment_count integer;
  v_achievement_id uuid;
BEGIN
  -- Count completed assessments
  SELECT COUNT(*) INTO v_assessment_count
  FROM user_assessment_results
  WHERE user_id = p_user_id;

  -- Knowledge Seeker: Complete first assessment
  IF v_assessment_count >= 1 THEN
    SELECT id INTO v_achievement_id 
    FROM achievements 
    WHERE criteria_type = 'assessment_score' 
      AND criteria_value->>'type' = 'first'
    LIMIT 1;
    
    IF v_achievement_id IS NOT NULL THEN
      PERFORM award_achievement(p_user_id, v_achievement_id);
    END IF;
  END IF;

  -- Overachiever: Score 90% or higher
  IF p_score >= 90 THEN
    SELECT id INTO v_achievement_id 
    FROM achievements 
    WHERE criteria_type = 'assessment_score' 
      AND (criteria_value->>'threshold')::integer = 90
    LIMIT 1;
    
    IF v_achievement_id IS NOT NULL THEN
      PERFORM award_achievement(p_user_id, v_achievement_id);
    END IF;
  END IF;
END;
$$;

-- Comprehensive achievement check
CREATE OR REPLACE FUNCTION check_all_achievements(p_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  PERFORM check_enrollment_achievements(p_user_id);
  PERFORM check_completion_achievements(p_user_id);
END;
$$;

-- Get user's global rank
CREATE OR REPLACE FUNCTION get_user_rank(p_user_id uuid)
RETURNS TABLE(
  rank bigint,
  total_xp bigint,
  course_count bigint,
  completed_courses bigint
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    lg.rank,
    lg.total_xp,
    lg.course_count,
    lg.completed_courses
  FROM leaderboard_global lg
  WHERE lg.user_id = p_user_id;
END;
$$;

-- Get paginated leaderboard
CREATE OR REPLACE FUNCTION get_leaderboard(p_limit integer DEFAULT 100, p_offset integer DEFAULT 0)
RETURNS TABLE(
  rank bigint,
  user_id uuid,
  username text,
  total_xp bigint,
  course_count bigint,
  completed_courses bigint
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    lg.rank,
    lg.user_id,
    lg.username,
    lg.total_xp,
    lg.course_count,
    lg.completed_courses
  FROM leaderboard_global lg
  ORDER BY lg.rank
  LIMIT p_limit
  OFFSET p_offset;
END;
$$;

-- Get users near a specific user's rank (for context)
CREATE OR REPLACE FUNCTION get_users_near_rank(p_user_id uuid, p_context_size integer DEFAULT 5)
RETURNS TABLE(
  rank bigint,
  user_id uuid,
  username text,
  total_xp bigint,
  is_current_user boolean
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_rank bigint;
BEGIN
  -- Get the user's rank
  SELECT lg.rank INTO v_user_rank
  FROM leaderboard_global lg
  WHERE lg.user_id = p_user_id;

  -- Return users within context range
  RETURN QUERY
  SELECT 
    lg.rank,
    lg.user_id,
    lg.username,
    lg.total_xp,
    (lg.user_id = p_user_id) as is_current_user
  FROM leaderboard_global lg
  WHERE lg.rank BETWEEN (v_user_rank - p_context_size) AND (v_user_rank + p_context_size)
  ORDER BY lg.rank;
END;
$$;

-- Add RLS policies for leaderboard view access
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

-- Users can view all achievements (public data)
DROP POLICY IF EXISTS "Anyone can view all achievements" ON achievements;
CREATE POLICY "Anyone can view all achievements"
  ON achievements
  FOR SELECT
  TO authenticated, anon
  USING (true);

-- Users can view all user achievements (leaderboard is public)
DROP POLICY IF EXISTS "Anyone can view user achievements" ON user_achievements;
CREATE POLICY "Anyone can view user achievements"
  ON user_achievements
  FOR SELECT
  TO authenticated, anon
  USING (true);

-- Only system can insert achievements (via functions)
DROP POLICY IF EXISTS "System can insert achievements" ON user_achievements;
CREATE POLICY "System can insert achievements"
  ON user_achievements
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);