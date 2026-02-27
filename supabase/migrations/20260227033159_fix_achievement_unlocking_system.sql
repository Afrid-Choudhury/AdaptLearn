/*
  # Fix Achievement Unlocking System

  ## Overview
  Fixes critical issues preventing achievements from being awarded properly.

  ## Changes

  1. **New Functions**
    - `check_custom_achievements(p_user_id)` - Checks and awards custom achievements like "Welcome Aboard"
    - Updates `check_all_achievements` to include custom achievement checking

  2. **Database Triggers**
    - `award_welcome_achievement_on_profile_creation` - Automatically awards "Welcome Aboard" when user profile is created
    - Ensures every new user gets the signup achievement immediately

  3. **Fix Knowledge Seeker Achievement**
    - Updates criteria to properly detect first assessment completion

  ## Security
  - All functions use SECURITY DEFINER to bypass RLS for system operations
  - Maintains existing RLS policies for user data access
  - Prevents duplicate achievement awards using unique constraint
*/

-- Function to check custom achievements (signup, etc.)
CREATE OR REPLACE FUNCTION check_custom_achievements(p_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_achievement_id uuid;
  v_profile_exists boolean;
BEGIN
  -- Check if user has a profile (signup achievement)
  SELECT EXISTS (
    SELECT 1 FROM profiles WHERE id = p_user_id
  ) INTO v_profile_exists;

  IF v_profile_exists THEN
    SELECT id INTO v_achievement_id 
    FROM achievements 
    WHERE criteria_type = 'custom' 
      AND criteria_value->>'action' = 'signup'
    LIMIT 1;
    
    IF v_achievement_id IS NOT NULL THEN
      PERFORM award_achievement(p_user_id, v_achievement_id);
    END IF;
  END IF;
END;
$$;

-- Update check_all_achievements to include custom achievements
CREATE OR REPLACE FUNCTION check_all_achievements(p_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  PERFORM check_custom_achievements(p_user_id);
  PERFORM check_enrollment_achievements(p_user_id);
  PERFORM check_completion_achievements(p_user_id);
  
  -- Also check assessment achievements if user has taken one
  DECLARE
    v_latest_score integer;
  BEGIN
    SELECT score INTO v_latest_score
    FROM user_assessment_results
    WHERE user_id = p_user_id
    ORDER BY completed_at DESC
    LIMIT 1;
    
    IF v_latest_score IS NOT NULL THEN
      PERFORM check_assessment_achievements(p_user_id, v_latest_score);
    END IF;
  END;
END;
$$;

-- Update assessment achievement checking to fix Knowledge Seeker
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
      AND (criteria_value->>'min_score')::integer = 0
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
      AND (criteria_value->>'min_score')::integer = 90
    LIMIT 1;
    
    IF v_achievement_id IS NOT NULL THEN
      PERFORM award_achievement(p_user_id, v_achievement_id);
    END IF;
  END IF;
END;
$$;

-- Trigger function to award Welcome Aboard achievement on profile creation
CREATE OR REPLACE FUNCTION award_welcome_achievement_on_profile_creation()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_achievement_id uuid;
BEGIN
  -- Get the "Welcome Aboard" achievement ID
  SELECT id INTO v_achievement_id
  FROM achievements
  WHERE criteria_type = 'custom' 
    AND criteria_value->>'action' = 'signup'
  LIMIT 1;

  -- Award the achievement if it exists
  IF v_achievement_id IS NOT NULL THEN
    INSERT INTO user_achievements (user_id, achievement_id, unlocked_at)
    VALUES (NEW.id, v_achievement_id, now())
    ON CONFLICT (user_id, achievement_id) DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$;

-- Create trigger for automatic Welcome Aboard achievement
DROP TRIGGER IF EXISTS award_welcome_achievement_trigger ON profiles;
CREATE TRIGGER award_welcome_achievement_trigger
  AFTER INSERT ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION award_welcome_achievement_on_profile_creation();

-- Grant necessary permissions for RPC functions
GRANT EXECUTE ON FUNCTION check_custom_achievements TO authenticated, anon;
GRANT EXECUTE ON FUNCTION check_all_achievements TO authenticated, anon;
GRANT EXECUTE ON FUNCTION check_assessment_achievements TO authenticated, anon;
