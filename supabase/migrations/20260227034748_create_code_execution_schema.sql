/*
  # Code Execution Engine Schema

  1. New Tables
    - `lesson_test_cases`
      - Stores test cases for each exercise lesson
      - `id` (uuid, primary key)
      - `lesson_id` (uuid, references course_lessons)
      - `test_case_number` (integer, for ordering)
      - `input_data` (text, stdin input for the program)
      - `expected_output` (text, expected stdout)
      - `is_hidden` (boolean, whether visible to students)
      - `points` (integer, weight of this test case)
      - `timeout_seconds` (integer, max execution time)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `code_submissions`
      - Stores all code execution attempts
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `lesson_id` (uuid, references course_lessons)
      - `enrollment_id` (uuid, references course_enrollments)
      - `submitted_code` (text, the code that was executed)
      - `execution_status` (text, success/compilation_error/runtime_error/timeout/memory_exceeded)
      - `compilation_errors` (text, javac error messages)
      - `stdout` (text, program output)
      - `stderr` (text, program error output)
      - `execution_time_ms` (integer, how long it took to run)
      - `memory_used_kb` (integer, memory consumption)
      - `test_results` (jsonb, array of test case results)
      - `passed_all_tests` (boolean, whether all tests passed)
      - `xp_awarded` (integer, XP given for this submission)
      - `submitted_at` (timestamptz)

    - `user_submission_rate_limit`
      - Tracks submission rate for rate limiting
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `submission_count` (integer, submissions in current window)
      - `window_start` (timestamptz, start of rate limit window)

  2. Changes to Existing Tables
    - Add columns to `course_lessons`:
      - `execution_enabled` (boolean, whether to allow code execution)
      - `test_case_mode` (text, output_match/unit_test/custom_validator)
      - `max_execution_time` (integer, seconds)
      - `max_memory_mb` (integer, megabytes)

  3. Security
    - Enable RLS on all new tables
    - Users can only view their own submissions
    - Test cases are readable by enrolled students
    - Rate limit table is private (only RPC functions access it)

  4. Functions
    - `record_code_submission` - Securely record submission and award XP
    - `check_rate_limit` - Verify user hasn't exceeded submission limit
    - `get_lesson_test_cases` - Fetch test cases (hide hidden ones until passed)
*/

-- Create lesson_test_cases table
CREATE TABLE IF NOT EXISTS lesson_test_cases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id uuid REFERENCES course_lessons(id) ON DELETE CASCADE NOT NULL,
  test_case_number integer NOT NULL,
  input_data text DEFAULT '',
  expected_output text NOT NULL,
  is_hidden boolean DEFAULT false,
  points integer DEFAULT 10,
  timeout_seconds integer DEFAULT 5,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(lesson_id, test_case_number)
);

-- Create index for fast lookups
CREATE INDEX IF NOT EXISTS idx_lesson_test_cases_lesson_id ON lesson_test_cases(lesson_id);

-- Create code_submissions table
CREATE TABLE IF NOT EXISTS code_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  lesson_id uuid REFERENCES course_lessons(id) ON DELETE CASCADE NOT NULL,
  enrollment_id uuid REFERENCES course_enrollments(id) ON DELETE CASCADE,
  submitted_code text NOT NULL,
  execution_status text NOT NULL CHECK (execution_status IN ('success', 'compilation_error', 'runtime_error', 'timeout', 'memory_exceeded', 'security_violation')),
  compilation_errors text,
  stdout text,
  stderr text,
  execution_time_ms integer DEFAULT 0,
  memory_used_kb integer DEFAULT 0,
  test_results jsonb DEFAULT '[]'::jsonb,
  passed_all_tests boolean DEFAULT false,
  xp_awarded integer DEFAULT 0,
  submitted_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_code_submissions_user_id ON code_submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_code_submissions_lesson_id ON code_submissions(lesson_id);
CREATE INDEX IF NOT EXISTS idx_code_submissions_submitted_at ON code_submissions(submitted_at DESC);

-- Create rate limit tracking table
CREATE TABLE IF NOT EXISTS user_submission_rate_limit (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  submission_count integer DEFAULT 0,
  window_start timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_rate_limit_user_id ON user_submission_rate_limit(user_id);

-- Add execution columns to course_lessons
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'course_lessons' AND column_name = 'execution_enabled'
  ) THEN
    ALTER TABLE course_lessons ADD COLUMN execution_enabled boolean DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'course_lessons' AND column_name = 'test_case_mode'
  ) THEN
    ALTER TABLE course_lessons ADD COLUMN test_case_mode text DEFAULT 'output_match' CHECK (test_case_mode IN ('output_match', 'unit_test', 'custom_validator'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'course_lessons' AND column_name = 'max_execution_time'
  ) THEN
    ALTER TABLE course_lessons ADD COLUMN max_execution_time integer DEFAULT 5;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'course_lessons' AND column_name = 'max_memory_mb'
  ) THEN
    ALTER TABLE course_lessons ADD COLUMN max_memory_mb integer DEFAULT 512;
  END IF;
END $$;

-- Enable Row Level Security
ALTER TABLE lesson_test_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE code_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_submission_rate_limit ENABLE ROW LEVEL SECURITY;

-- RLS Policies for lesson_test_cases
-- Students can view test cases for lessons in courses they're enrolled in
CREATE POLICY "Students can view test cases for enrolled courses"
  ON lesson_test_cases FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM course_lessons cl
      JOIN course_modules cm ON cm.id = cl.module_id
      JOIN course_enrollments ce ON ce.course_id = cm.course_id
      WHERE cl.id = lesson_test_cases.lesson_id
      AND ce.user_id = auth.uid()
    )
  );

-- Admins and instructors can manage test cases
CREATE POLICY "Admins can manage all test cases"
  ON lesson_test_cases FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND role IN ('admin', 'instructor')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND role IN ('admin', 'instructor')
    )
  );

-- RLS Policies for code_submissions
-- Users can view their own submissions
CREATE POLICY "Users can view own submissions"
  ON code_submissions FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Users can insert their own submissions
CREATE POLICY "Users can create own submissions"
  ON code_submissions FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Admins can view all submissions
CREATE POLICY "Admins can view all submissions"
  ON code_submissions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  );

-- RLS Policies for rate limit table (no direct access, only via RPC)
CREATE POLICY "No direct access to rate limits"
  ON user_submission_rate_limit FOR ALL
  TO authenticated
  USING (false)
  WITH CHECK (false);

-- Function to check rate limit (20 submissions per hour)
CREATE OR REPLACE FUNCTION check_rate_limit(p_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_count integer;
  v_window_start timestamptz;
  v_rate_limit integer := 20; -- Max submissions per hour
  v_window_duration interval := '1 hour';
BEGIN
  -- Get current rate limit info
  SELECT submission_count, window_start
  INTO v_count, v_window_start
  FROM user_submission_rate_limit
  WHERE user_id = p_user_id;

  -- If no record exists, create one
  IF NOT FOUND THEN
    INSERT INTO user_submission_rate_limit (user_id, submission_count, window_start)
    VALUES (p_user_id, 0, now());
    RETURN true;
  END IF;

  -- Check if window has expired
  IF now() - v_window_start > v_window_duration THEN
    -- Reset the window
    UPDATE user_submission_rate_limit
    SET submission_count = 0, window_start = now()
    WHERE user_id = p_user_id;
    RETURN true;
  END IF;

  -- Check if under limit
  IF v_count < v_rate_limit THEN
    RETURN true;
  END IF;

  -- Over limit
  RETURN false;
END;
$$;

-- Function to increment rate limit counter
CREATE OR REPLACE FUNCTION increment_rate_limit(p_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO user_submission_rate_limit (user_id, submission_count, window_start)
  VALUES (p_user_id, 1, now())
  ON CONFLICT (user_id) DO UPDATE
  SET submission_count = user_submission_rate_limit.submission_count + 1;
END;
$$;

-- Function to record code submission and award XP
CREATE OR REPLACE FUNCTION record_code_submission(
  p_user_id uuid,
  p_lesson_id uuid,
  p_enrollment_id uuid,
  p_submitted_code text,
  p_execution_status text,
  p_compilation_errors text,
  p_stdout text,
  p_stderr text,
  p_execution_time_ms integer,
  p_memory_used_kb integer,
  p_test_results jsonb,
  p_passed_all_tests boolean
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_submission_id uuid;
  v_xp_to_award integer := 0;
  v_lesson_xp integer;
  v_already_completed boolean;
  v_lesson_progress_id uuid;
BEGIN
  -- Check if this lesson was already completed
  SELECT id, completed INTO v_lesson_progress_id, v_already_completed
  FROM user_lesson_progress
  WHERE user_id = p_user_id AND lesson_id = p_lesson_id;

  -- If passed all tests and not already completed, award XP
  IF p_passed_all_tests AND NOT COALESCE(v_already_completed, false) THEN
    -- Get lesson XP reward
    SELECT COALESCE(xp_reward, 0) INTO v_lesson_xp
    FROM course_lessons
    WHERE id = p_lesson_id;

    v_xp_to_award := v_lesson_xp;

    -- Mark lesson as completed
    IF v_lesson_progress_id IS NOT NULL THEN
      UPDATE user_lesson_progress
      SET completed = true, xp_earned = v_lesson_xp
      WHERE id = v_lesson_progress_id;
    ELSE
      INSERT INTO user_lesson_progress (user_id, lesson_id, completed, xp_earned)
      VALUES (p_user_id, p_lesson_id, true, v_lesson_xp);
    END IF;

    -- Award XP to enrollment
    IF p_enrollment_id IS NOT NULL THEN
      PERFORM increment_enrollment_xp(p_enrollment_id, v_lesson_xp);
    END IF;
  END IF;

  -- Insert submission record
  INSERT INTO code_submissions (
    user_id, lesson_id, enrollment_id, submitted_code,
    execution_status, compilation_errors, stdout, stderr,
    execution_time_ms, memory_used_kb, test_results,
    passed_all_tests, xp_awarded
  ) VALUES (
    p_user_id, p_lesson_id, p_enrollment_id, p_submitted_code,
    p_execution_status, p_compilation_errors, p_stdout, p_stderr,
    p_execution_time_ms, p_memory_used_kb, p_test_results,
    p_passed_all_tests, v_xp_to_award
  )
  RETURNING id INTO v_submission_id;

  -- Increment rate limit counter
  PERFORM increment_rate_limit(p_user_id);

  -- Return submission info
  RETURN jsonb_build_object(
    'submission_id', v_submission_id,
    'xp_awarded', v_xp_to_award,
    'already_completed', COALESCE(v_already_completed, false)
  );
END;
$$;

-- Function to get test cases for a lesson (hide details of hidden test cases until passed)
CREATE OR REPLACE FUNCTION get_lesson_test_cases(p_lesson_id uuid, p_user_id uuid)
RETURNS TABLE (
  id uuid,
  test_case_number integer,
  input_data text,
  expected_output text,
  is_hidden boolean,
  points integer,
  timeout_seconds integer
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_has_passed boolean;
BEGIN
  -- Check if user has passed this lesson
  SELECT COALESCE(completed, false) INTO v_has_passed
  FROM user_lesson_progress
  WHERE user_id = p_user_id AND lesson_id = p_lesson_id;

  -- If not passed, hide details of hidden test cases
  RETURN QUERY
  SELECT
    tc.id,
    tc.test_case_number,
    CASE WHEN tc.is_hidden AND NOT COALESCE(v_has_passed, false)
      THEN '[Hidden]'::text
      ELSE tc.input_data
    END AS input_data,
    CASE WHEN tc.is_hidden AND NOT COALESCE(v_has_passed, false)
      THEN '[Hidden]'::text
      ELSE tc.expected_output
    END AS expected_output,
    tc.is_hidden,
    tc.points,
    tc.timeout_seconds
  FROM lesson_test_cases tc
  WHERE tc.lesson_id = p_lesson_id
  ORDER BY tc.test_case_number;
END;
$$;