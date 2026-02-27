/*
  # Retroactive Achievement Awards

  ## Overview
  Awards achievements retroactively to all existing users who meet the criteria
  but haven't been awarded the achievements yet.

  ## Actions
  1. Awards "Welcome Aboard" to all users with profiles
  2. Awards "First Steps" to users with at least 1 enrollment
  3. Awards "Dedicated Learner" to users with at least 3 enrollments
  4. Awards "Knowledge Seeker" to users who completed assessments

  ## Safety
  - Uses ON CONFLICT to prevent duplicate awards
  - Non-destructive operation
  - Can be run multiple times safely
*/

-- Award "Welcome Aboard" achievement to all existing users with profiles
INSERT INTO user_achievements (user_id, achievement_id, unlocked_at)
SELECT 
  p.id,
  a.id,
  now()
FROM profiles p
CROSS JOIN achievements a
WHERE a.criteria_type = 'custom' 
  AND a.criteria_value->>'action' = 'signup'
ON CONFLICT (user_id, achievement_id) DO NOTHING;

-- Award "First Steps" achievement to users with at least 1 enrollment
INSERT INTO user_achievements (user_id, achievement_id, unlocked_at)
SELECT DISTINCT
  ce.user_id,
  a.id,
  now()
FROM course_enrollments ce
CROSS JOIN achievements a
WHERE a.criteria_type = 'enrollment' 
  AND (a.criteria_value->>'count')::integer = 1
  AND (SELECT COUNT(*) FROM course_enrollments WHERE user_id = ce.user_id) >= 1
ON CONFLICT (user_id, achievement_id) DO NOTHING;

-- Award "Dedicated Learner" achievement to users with at least 3 enrollments
INSERT INTO user_achievements (user_id, achievement_id, unlocked_at)
SELECT DISTINCT
  ce.user_id,
  a.id,
  now()
FROM course_enrollments ce
CROSS JOIN achievements a
WHERE a.criteria_type = 'enrollment' 
  AND (a.criteria_value->>'count')::integer = 3
  AND (SELECT COUNT(*) FROM course_enrollments WHERE user_id = ce.user_id) >= 3
ON CONFLICT (user_id, achievement_id) DO NOTHING;

-- Award "Knowledge Seeker" achievement to users who completed assessments
INSERT INTO user_achievements (user_id, achievement_id, unlocked_at)
SELECT DISTINCT
  uar.user_id,
  a.id,
  now()
FROM user_assessment_results uar
CROSS JOIN achievements a
WHERE a.criteria_type = 'assessment_score' 
  AND (a.criteria_value->>'min_score')::integer = 0
ON CONFLICT (user_id, achievement_id) DO NOTHING;
