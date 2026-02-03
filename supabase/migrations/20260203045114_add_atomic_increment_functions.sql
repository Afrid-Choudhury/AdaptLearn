/*
  # Add Atomic Increment Functions
  
  1. New Functions
    - `increment_enrollment_xp(enrollment_id, xp_amount)` - Atomically increments XP for an enrollment
    - `increment_course_student_count(course_id)` - Atomically increments student count for a course
    - `decrement_course_student_count(course_id)` - Atomically decrements student count for a course
  
  2. Purpose
    - These functions provide safe atomic operations for numeric fields
    - Prevents race conditions when multiple operations occur simultaneously
    - Used by the frontend to properly update XP and student counts
  
  3. Security
    - Functions check that the authenticated user owns the enrollment (for XP)
    - Student count functions are called during enrollment/unenrollment
*/

CREATE OR REPLACE FUNCTION increment_enrollment_xp(p_enrollment_id uuid, p_xp_amount integer)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE course_enrollments
  SET total_xp = COALESCE(total_xp, 0) + p_xp_amount
  WHERE id = p_enrollment_id
    AND user_id = auth.uid();
END;
$$;

CREATE OR REPLACE FUNCTION increment_course_student_count(p_course_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE courses
  SET student_count = COALESCE(student_count, 0) + 1
  WHERE id = p_course_id;
END;
$$;

CREATE OR REPLACE FUNCTION decrement_course_student_count(p_course_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE courses
  SET student_count = GREATEST(COALESCE(student_count, 0) - 1, 0)
  WHERE id = p_course_id;
END;
$$;