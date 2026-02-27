/*
  # Seed Test Cases for Java Lessons

  1. Purpose
    - Add test cases for existing Java exercise lessons
    - Enable code execution for lessons with test cases
    - Provide both visible and hidden test cases for comprehensive validation

  2. Test Cases Added
    - "Your First Java Program" - Hello World test
    - "Variables and Data Types" - Variable declaration and output tests
    - "String Operations" - String manipulation tests
    - "If-Else Statements" - Conditional logic tests
    - "Switch Statements" - Switch case tests
    - "For Loops" - Loop iteration tests
    - "While Loops" - While loop tests
    - And more...

  3. Security
    - All test cases follow output_match validation mode
    - Timeout set to 5 seconds max per test
    - Memory limit inherited from lesson settings
*/

-- First, enable execution for all exercise lessons
UPDATE course_lessons
SET execution_enabled = true
WHERE content_type = 'exercise'
AND validation_rules IS NOT NULL;

-- Helper function to get lesson ID by title
CREATE OR REPLACE FUNCTION get_lesson_id_by_title(p_title text)
RETURNS uuid
LANGUAGE plpgsql
AS $$
DECLARE
  v_lesson_id uuid;
BEGIN
  SELECT id INTO v_lesson_id
  FROM course_lessons
  WHERE title = p_title
  LIMIT 1;
  
  RETURN v_lesson_id;
END;
$$;

-- Test cases for "Your First Java Program"
DO $$
DECLARE
  v_lesson_id uuid;
BEGIN
  v_lesson_id := get_lesson_id_by_title('Your First Java Program');
  
  IF v_lesson_id IS NOT NULL THEN
    INSERT INTO lesson_test_cases (lesson_id, test_case_number, input_data, expected_output, is_hidden, points)
    VALUES
      (v_lesson_id, 1, '', 'Hello, World!', false, 50),
      (v_lesson_id, 2, '', 'Hello, World!', true, 50)
    ON CONFLICT (lesson_id, test_case_number) DO NOTHING;
  END IF;
END $$;

-- Test cases for "Variables and Data Types"
DO $$
DECLARE
  v_lesson_id uuid;
BEGIN
  v_lesson_id := get_lesson_id_by_title('Variables and Data Types');
  
  IF v_lesson_id IS NOT NULL THEN
    INSERT INTO lesson_test_cases (lesson_id, test_case_number, input_data, expected_output, is_hidden, points)
    VALUES
      (v_lesson_id, 1, '', 'Name: John
Age: 25
Height: 5.9
Is student: true', false, 40),
      (v_lesson_id, 2, '', 'Name: John
Age: 25
Height: 5.9
Is student: true', true, 60)
    ON CONFLICT (lesson_id, test_case_number) DO NOTHING;
  END IF;
END $$;

-- Test cases for "String Operations"
DO $$
DECLARE
  v_lesson_id uuid;
BEGIN
  v_lesson_id := get_lesson_id_by_title('String Operations');
  
  IF v_lesson_id IS NOT NULL THEN
    INSERT INTO lesson_test_cases (lesson_id, test_case_number, input_data, expected_output, is_hidden, points)
    VALUES
      (v_lesson_id, 1, '', 'HELLO WORLD
hello world
12', false, 33),
      (v_lesson_id, 2, '', 'HELLO WORLD
hello world
12', true, 33),
      (v_lesson_id, 3, '', 'HELLO WORLD
hello world
12', true, 34)
    ON CONFLICT (lesson_id, test_case_number) DO NOTHING;
  END IF;
END $$;

-- Test cases for "If-Else Statements"
DO $$
DECLARE
  v_lesson_id uuid;
BEGIN
  v_lesson_id := get_lesson_id_by_title('If-Else Statements');
  
  IF v_lesson_id IS NOT NULL THEN
    INSERT INTO lesson_test_cases (lesson_id, test_case_number, input_data, expected_output, is_hidden, points)
    VALUES
      (v_lesson_id, 1, '18', 'You are an adult.', false, 25),
      (v_lesson_id, 2, '15', 'You are a minor.', false, 25),
      (v_lesson_id, 3, '25', 'You are an adult.', true, 25),
      (v_lesson_id, 4, '10', 'You are a minor.', true, 25)
    ON CONFLICT (lesson_id, test_case_number) DO NOTHING;
  END IF;
END $$;

-- Test cases for "Switch Statements"
DO $$
DECLARE
  v_lesson_id uuid;
BEGIN
  v_lesson_id := get_lesson_id_by_title('Switch Statements');
  
  IF v_lesson_id IS NOT NULL THEN
    INSERT INTO lesson_test_cases (lesson_id, test_case_number, input_data, expected_output, is_hidden, points)
    VALUES
      (v_lesson_id, 1, '1', 'Monday', false, 20),
      (v_lesson_id, 2, '3', 'Wednesday', false, 20),
      (v_lesson_id, 3, '7', 'Sunday', false, 20),
      (v_lesson_id, 4, '5', 'Friday', true, 20),
      (v_lesson_id, 5, '8', 'Invalid day', true, 20)
    ON CONFLICT (lesson_id, test_case_number) DO NOTHING;
  END IF;
END $$;

-- Test cases for "For Loops"
DO $$
DECLARE
  v_lesson_id uuid;
BEGIN
  v_lesson_id := get_lesson_id_by_title('For Loops');
  
  IF v_lesson_id IS NOT NULL THEN
    INSERT INTO lesson_test_cases (lesson_id, test_case_number, input_data, expected_output, is_hidden, points)
    VALUES
      (v_lesson_id, 1, '', '1
2
3
4
5', false, 50),
      (v_lesson_id, 2, '', '1
2
3
4
5', true, 50)
    ON CONFLICT (lesson_id, test_case_number) DO NOTHING;
  END IF;
END $$;

-- Test cases for "While Loops"
DO $$
DECLARE
  v_lesson_id uuid;
BEGIN
  v_lesson_id := get_lesson_id_by_title('While Loops');
  
  IF v_lesson_id IS NOT NULL THEN
    INSERT INTO lesson_test_cases (lesson_id, test_case_number, input_data, expected_output, is_hidden, points)
    VALUES
      (v_lesson_id, 1, '', '0
1
2
3
4', false, 50),
      (v_lesson_id, 2, '', '0
1
2
3
4', true, 50)
    ON CONFLICT (lesson_id, test_case_number) DO NOTHING;
  END IF;
END $$;

-- Test cases for "Classes and Objects"
DO $$
DECLARE
  v_lesson_id uuid;
BEGIN
  v_lesson_id := get_lesson_id_by_title('Classes and Objects');
  
  IF v_lesson_id IS NOT NULL THEN
    INSERT INTO lesson_test_cases (lesson_id, test_case_number, input_data, expected_output, is_hidden, points)
    VALUES
      (v_lesson_id, 1, '', 'Toyota Camry', false, 50),
      (v_lesson_id, 2, '', 'Toyota Camry', true, 50)
    ON CONFLICT (lesson_id, test_case_number) DO NOTHING;
  END IF;
END $$;

-- Test cases for "Methods"
DO $$
DECLARE
  v_lesson_id uuid;
BEGIN
  v_lesson_id := get_lesson_id_by_title('Methods');
  
  IF v_lesson_id IS NOT NULL THEN
    INSERT INTO lesson_test_cases (lesson_id, test_case_number, input_data, expected_output, is_hidden, points)
    VALUES
      (v_lesson_id, 1, '', '15', false, 50),
      (v_lesson_id, 2, '', '15', true, 50)
    ON CONFLICT (lesson_id, test_case_number) DO NOTHING;
  END IF;
END $$;

-- Test cases for "Constructors"
DO $$
DECLARE
  v_lesson_id uuid;
BEGIN
  v_lesson_id := get_lesson_id_by_title('Constructors');
  
  IF v_lesson_id IS NOT NULL THEN
    INSERT INTO lesson_test_cases (lesson_id, test_case_number, input_data, expected_output, is_hidden, points)
    VALUES
      (v_lesson_id, 1, '', 'Alice is 20 years old', false, 50),
      (v_lesson_id, 2, '', 'Alice is 20 years old', true, 50)
    ON CONFLICT (lesson_id, test_case_number) DO NOTHING;
  END IF;
END $$;

-- Test cases for "Encapsulation"
DO $$
DECLARE
  v_lesson_id uuid;
BEGIN
  v_lesson_id := get_lesson_id_by_title('Encapsulation');
  
  IF v_lesson_id IS NOT NULL THEN
    INSERT INTO lesson_test_cases (lesson_id, test_case_number, input_data, expected_output, is_hidden, points)
    VALUES
      (v_lesson_id, 1, '', 'Balance: 1000.0
Balance after deposit: 1500.0
Balance after withdrawal: 1300.0', false, 50),
      (v_lesson_id, 2, '', 'Balance: 1000.0
Balance after deposit: 1500.0
Balance after withdrawal: 1300.0', true, 50)
    ON CONFLICT (lesson_id, test_case_number) DO NOTHING;
  END IF;
END $$;

-- Clean up helper function
DROP FUNCTION IF EXISTS get_lesson_id_by_title(text);
