/*
  # Add Variables Exercise Lesson

  ## Overview
  Adds an interactive coding exercise for practicing Java variables

  ## Changes
  
  1. New Exercise Lesson
    - Title: "Working with Variables"
    - Module 1, order index 7
    - Content type: exercise
    - Teaches variable declaration and initialization
    - XP reward: 200 points
  
  2. Validation Rules
    - Must contain specific variable declarations
    - Must use correct data types
    - Must initialize variables with values
*/

-- Add variables exercise lesson to Module 1
DO $$
DECLARE
  module1_id uuid;
BEGIN
  -- Get Module 1 ID
  SELECT id INTO module1_id
  FROM course_modules
  WHERE title = 'Introduction to Java'
  LIMIT 1;

  -- Insert variables exercise lesson
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
      'Working with Variables',
      'Practice declaring and initializing variables in Java with different data types.',
      7,
      25,
      'exercise',
      'In this exercise, you''ll practice working with variables in Java. Variables are containers that store data values.

## Your Task

Create a program that declares and initializes variables for the following:

1. An integer variable called `age` with value 25
2. A double variable called `price` with value 19.99
3. A String variable called `name` with your name
4. A boolean variable called `isStudent` with value true

Then print all the variables using System.out.println().

## Example Output
```
Age: 25
Price: 19.99
Name: John
Is Student: true
```

Remember:
- Use the correct data types (int, double, String, boolean)
- Initialize each variable with a value
- Use System.out.println() to print each variable',
      'public class Variables {
    public static void main(String[] args) {
        // Declare and initialize your variables here
        
        
        // Print your variables here
        
    }
}',
      'public class Variables {
    public static void main(String[] args) {
        // Declare and initialize variables
        int age = 25;
        double price = 19.99;
        String name = "John";
        boolean isStudent = true;
        
        // Print the variables
        System.out.println("Age: " + age);
        System.out.println("Price: " + price);
        System.out.println("Name: " + name);
        System.out.println("Is Student: " + isStudent);
    }
}',
      jsonb_build_object(
        'mustContain', jsonb_build_array(
          'int age',
          'double price',
          'String name',
          'boolean isStudent',
          'System.out.println'
        ),
        'regexMatch', '(int|Integer)\s+age\s*=\s*\d+',
        'methodSignatureExists', 'public\s+static\s+void\s+main\s*\(\s*String\s*\[\s*\]\s*args\s*\)'
      ),
      200
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
