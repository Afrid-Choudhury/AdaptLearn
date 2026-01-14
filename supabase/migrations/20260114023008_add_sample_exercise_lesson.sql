/*
  # Add Sample Interactive Exercise Lesson

  ## Overview
  Adds a sample interactive coding exercise to Module 1 of Java Fundamentals course

  ## Changes
  
  1. New Exercise Lesson
    - Title: "Your First Java Program"
    - Content type: exercise
    - Starter code for Hello World program
    - Validation rules to check correct output
    - XP reward: 150 points
  
  2. Features Demonstrated
    - Monaco code editor
    - Code validation with mustContain rules
    - Regex pattern matching
    - Method signature validation
*/

-- Add interactive exercise lesson to Module 1
DO $$
DECLARE
  module1_id uuid;
BEGIN
  -- Get Module 1 ID
  SELECT id INTO module1_id
  FROM course_modules
  WHERE title = 'Introduction to Java'
  LIMIT 1;

  -- Insert new exercise lesson
  IF module1_id IS NOT NULL THEN
    INSERT INTO course_lessons (
      module_id,
      title,
      description,
      order_index,
      estimated_minutes,
      content_type,
      content_text,
      starter_code,
      solution_code,
      validation_rules,
      xp_reward
    ) VALUES (
      module1_id,
      'Your First Java Program',
      'Write your first Java program and see it come to life! Learn the basic structure of a Java program.',
      6,
      20,
      'exercise',
      'Now it''s time to write your first Java program! In this exercise, you''ll create a simple program that prints "Hello, World!" to the console.

## Instructions

1. Create a class named `HelloWorld`
2. Add a `main` method with the correct signature
3. Use `System.out.println()` to print "Hello, World!"

## Requirements

Your code must:
- Have a public class named `HelloWorld`
- Include the main method: `public static void main(String[] args)`
- Print exactly: `Hello, World!`

Try to write the code yourself first! If you get stuck, think about the structure we discussed in the previous lessons.',
      '// Write your first Java program here
public class HelloWorld {
    // Add your code below

}',
      'public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}',
      jsonb_build_object(
        'mustContain', jsonb_build_array(
          'public class HelloWorld',
          'System.out.println',
          'Hello, World!'
        ),
        'methodSignatureExists', 'public\s+static\s+void\s+main\s*\(\s*String\s*\[\s*\]\s*args\s*\)',
        'mustNotContain', jsonb_build_array(
          'System.out.print("Hello, World!");'
        )
      ),
      150
    )
    ON CONFLICT (module_id, order_index) 
    DO UPDATE SET
      title = EXCLUDED.title,
      description = EXCLUDED.description,
      content_type = EXCLUDED.content_type,
      content_text = EXCLUDED.content_text,
      starter_code = EXCLUDED.starter_code,
      solution_code = EXCLUDED.solution_code,
      validation_rules = EXCLUDED.validation_rules,
      xp_reward = EXCLUDED.xp_reward;
  END IF;
END $$;
