/*
  # Add String Operations Exercise to Module 1

  1. New Lessons
    - `Try It: String Operations` (exercise) in Module 1 "Getting Started with Java"
      - Teaches string creation, concatenation, and common String methods
      - Includes starter code template, solution code, and validation rules
      - Awards 200 XP on completion

  2. Security
    - No RLS changes needed, inherits existing lesson policies
*/

INSERT INTO course_lessons (
  module_id, title, description, order_index, estimated_minutes,
  content_type, content_text, starter_code, solution_code, validation_rules, xp_reward
)
SELECT
  m.id,
  'Try It: String Operations',
  'Practice creating and manipulating strings in Java',
  8,
  25,
  'exercise',
  '# Try It: String Operations

In this exercise you will practice working with Java''s `String` class — one of the most commonly used types in any Java program.

## Your Task

Create a program that demonstrates basic string operations:

1. Declare a `String` variable called `firstName` and assign it your first name
2. Declare a `String` variable called `lastName` and assign it your last name
3. Create a `String` variable called `fullName` by **concatenating** `firstName` and `lastName` with a space between them
4. Print the full name using `System.out.println()`
5. Print the **length** of the full name using the `.length()` method
6. Print the full name converted to **uppercase** using `.toUpperCase()`

## Example Output

```
John Doe
8
JOHN DOE
```

## Hints

- Use the `+` operator to concatenate strings
- The `.length()` method returns an `int`
- The `.toUpperCase()` method returns a new `String`',
  'public class StringOperations {
    public static void main(String[] args) {
        // Step 1: Declare firstName
        String firstName = "";

        // Step 2: Declare lastName
        String lastName = "";

        // Step 3: Concatenate into fullName


        // Step 4: Print the full name


        // Step 5: Print the length


        // Step 6: Print uppercase version

    }
}',
  'public class StringOperations {
    public static void main(String[] args) {
        String firstName = "John";
        String lastName = "Doe";
        String fullName = firstName + " " + lastName;

        System.out.println(fullName);
        System.out.println(fullName.length());
        System.out.println(fullName.toUpperCase());
    }
}',
  '{
    "mustContain": [
      "String firstName",
      "String lastName",
      "String fullName",
      "System.out.println",
      ".length()",
      ".toUpperCase()"
    ],
    "methodSignatureExists": "public\\s+static\\s+void\\s+main\\s*\\(\\s*String\\s*\\[\\s*\\]\\s*args\\s*\\)"
  }'::jsonb,
  200
FROM course_modules m
JOIN courses c ON m.course_id = c.id
WHERE c.title = 'Java Fundamentals for Beginners'
  AND m.order_index = 1
ON CONFLICT DO NOTHING;
