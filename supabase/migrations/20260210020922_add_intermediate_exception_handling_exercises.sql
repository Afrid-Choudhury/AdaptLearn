/*
  # Add Exception Handling Exercises

  1. New Lessons (Exercises)
    - `Try It: Safe Division` (order_index 7, 350 XP)
    - `Try It: Custom Exception` (order_index 8, 400 XP)
    - `Try It: Input Validator` (order_index 9, 400 XP)

  2. Security
    - No RLS changes needed

  3. Important Notes
    - XP values bumped to 350-400 for intermediate difficulty
*/

-- Exercise 1: Safe Division
INSERT INTO course_lessons (
  module_id, title, description, order_index, estimated_minutes,
  content_type, content_text, starter_code, solution_code, validation_rules, xp_reward
)
SELECT
  m.id,
  'Try It: Safe Division',
  'Build a safe calculator that handles division errors gracefully',
  7, 25, 'exercise',
  '# Try It: Safe Division

Build a calculator method that divides two numbers safely, handling every error case.

## Your Task

1. Create a class called `SafeCalculator`
2. Add a method `static double divide(int a, int b)` that:
   - Returns the result of `a / b` as a double
   - Catches `ArithmeticException` if `b` is zero
   - Prints `"Error: Cannot divide by zero"` and returns `0.0` on error
3. In `main`, test with these calls and print results:
   - `divide(10, 3)` — prints the result
   - `divide(10, 0)` — prints error, then `0.0`
   - `divide(100, 4)` — prints the result

## Expected Output

```
10 / 3 = 3.3333333333333335
Error: Cannot divide by zero
10 / 0 = 0.0
100 / 4 = 25.0
```

## Hints

- Cast to double before dividing: `(double) a / b`
- Use try-catch inside the divide method',
  'public class SafeCalculator {
    static double divide(int a, int b) {
        // Implement safe division with try-catch

    }

    public static void main(String[] args) {
        // Test divide(10, 3)

        // Test divide(10, 0)

        // Test divide(100, 4)

    }
}',
  'public class SafeCalculator {
    static double divide(int a, int b) {
        try {
            return (double) a / b;
        } catch (ArithmeticException e) {
            System.out.println("Error: Cannot divide by zero");
            return 0.0;
        }
    }

    public static void main(String[] args) {
        System.out.println("10 / 3 = " + divide(10, 3));
        System.out.println("10 / 0 = " + divide(10, 0));
        System.out.println("100 / 4 = " + divide(100, 4));
    }
}',
  '{"mustContain":["try","catch","ArithmeticException","divide","return","System.out.println"],"regexMatch":"catch\\s*\\(\\s*ArithmeticException","methodSignatureExists":"public\\s+static\\s+void\\s+main\\s*\\(\\s*String\\s*\\[\\s*\\]\\s*args\\s*\\)"}'::jsonb,
  350
FROM course_modules m
JOIN courses c ON m.course_id = c.id
WHERE c.title = 'Intermediate Java Development' AND m.order_index = 2
ON CONFLICT DO NOTHING;

-- Exercise 2: Custom Exception
INSERT INTO course_lessons (
  module_id, title, description, order_index, estimated_minutes,
  content_type, content_text, starter_code, solution_code, validation_rules, xp_reward
)
SELECT
  m.id,
  'Try It: Custom Exception',
  'Create and throw your own custom exception class',
  8, 30, 'exercise',
  '# Try It: Custom Exception

Create a custom exception and use it to enforce business rules in a simple age verification system.

## Your Task

1. Create a class called `InvalidAgeException` that extends `Exception`:
   - Constructor takes an `int age` and passes a message to `super()`:
     `"Invalid age: " + age + ". Must be between 0 and 120."`

2. Create a class called `AgeVerifier` with:
   - A method `static void verifyAge(int age) throws InvalidAgeException`
   - If age is less than 0 or greater than 120, throw `InvalidAgeException`
   - Otherwise print `"Age " + age + " is valid."`

3. In `main`, test with ages `25`, `-5`, and `200` — wrap each in try-catch and print the error message

## Expected Output

```
Age 25 is valid.
Error: Invalid age: -5. Must be between 0 and 120.
Error: Invalid age: 200. Must be between 0 and 120.
```

## Hints

- Use `throw new InvalidAgeException(age)` to throw
- Catch with `catch (InvalidAgeException e)` and print `e.getMessage()`',
  'class InvalidAgeException extends Exception {
    // Constructor that takes age and sets message

}

public class AgeVerifier {
    static void verifyAge(int age) throws InvalidAgeException {
        // Throw InvalidAgeException if age is invalid

    }

    public static void main(String[] args) {
        // Test with 25, -5, and 200

    }
}',
  'class InvalidAgeException extends Exception {
    InvalidAgeException(int age) {
        super("Invalid age: " + age + ". Must be between 0 and 120.");
    }
}

public class AgeVerifier {
    static void verifyAge(int age) throws InvalidAgeException {
        if (age < 0 || age > 120) {
            throw new InvalidAgeException(age);
        }
        System.out.println("Age " + age + " is valid.");
    }

    public static void main(String[] args) {
        try {
            verifyAge(25);
        } catch (InvalidAgeException e) {
            System.out.println("Error: " + e.getMessage());
        }

        try {
            verifyAge(-5);
        } catch (InvalidAgeException e) {
            System.out.println("Error: " + e.getMessage());
        }

        try {
            verifyAge(200);
        } catch (InvalidAgeException e) {
            System.out.println("Error: " + e.getMessage());
        }
    }
}',
  '{"mustContain":["extends Exception","throw new InvalidAgeException","throws InvalidAgeException","try","catch","getMessage","System.out.println"],"regexMatch":"class\\s+InvalidAgeException\\s+extends\\s+Exception","methodSignatureExists":"public\\s+static\\s+void\\s+main\\s*\\(\\s*String\\s*\\[\\s*\\]\\s*args\\s*\\)"}'::jsonb,
  400
FROM course_modules m
JOIN courses c ON m.course_id = c.id
WHERE c.title = 'Intermediate Java Development' AND m.order_index = 2
ON CONFLICT DO NOTHING;

-- Exercise 3: Input Validator
INSERT INTO course_lessons (
  module_id, title, description, order_index, estimated_minutes,
  content_type, content_text, starter_code, solution_code, validation_rules, xp_reward
)
SELECT
  m.id,
  'Try It: Input Validator',
  'Build a robust input validator using multiple exception types',
  9, 30, 'exercise',
  '# Try It: Input Validator

Build an input validator that catches multiple exception types and provides friendly error messages.

## Your Task

1. Create a class called `InputValidator` with a method:
   `static int parseAndValidate(String input)` that:
   - Parses the string to an integer using `Integer.parseInt()`
   - If the number is negative, throw an `IllegalArgumentException` with message `"Number must be positive"`
   - Returns the number if valid

2. In `main`, test with these inputs and wrap each in try-catch:
   - `"42"` — valid number
   - `"hello"` — triggers NumberFormatException
   - `"-7"` — triggers IllegalArgumentException
   - `null` — triggers NullPointerException

3. For each test, catch the specific exception and print a message

## Expected Output

```
Result: 42
Error: "hello" is not a number
Error: Number must be positive
Error: Input cannot be null
```

## Hints

- `Integer.parseInt(null)` throws `NumberFormatException`
- Check for null before parsing to throw a more specific error
- Use multiple catch blocks for each exception type',
  'public class InputValidator {
    static int parseAndValidate(String input) {
        // Check for null, parse, and validate positive

    }

    public static void main(String[] args) {
        // Test with "42", "hello", "-7", null

    }
}',
  'public class InputValidator {
    static int parseAndValidate(String input) {
        if (input == null) {
            throw new NullPointerException("Input cannot be null");
        }
        int number = Integer.parseInt(input);
        if (number < 0) {
            throw new IllegalArgumentException("Number must be positive");
        }
        return number;
    }

    public static void main(String[] args) {
        try {
            System.out.println("Result: " + parseAndValidate("42"));
        } catch (Exception e) {
            System.out.println("Error: " + e.getMessage());
        }

        try {
            parseAndValidate("hello");
        } catch (NumberFormatException e) {
            System.out.println("Error: \"hello\" is not a number");
        }

        try {
            parseAndValidate("-7");
        } catch (IllegalArgumentException e) {
            System.out.println("Error: " + e.getMessage());
        }

        try {
            parseAndValidate(null);
        } catch (NullPointerException e) {
            System.out.println("Error: " + e.getMessage());
        }
    }
}',
  '{"mustContain":["Integer.parseInt","throw new","NullPointerException","IllegalArgumentException","try","catch","System.out.println"],"regexMatch":"static\\s+int\\s+parseAndValidate","methodSignatureExists":"public\\s+static\\s+void\\s+main\\s*\\(\\s*String\\s*\\[\\s*\\]\\s*args\\s*\\)"}'::jsonb,
  400
FROM course_modules m
JOIN courses c ON m.course_id = c.id
WHERE c.title = 'Intermediate Java Development' AND m.order_index = 2
ON CONFLICT DO NOTHING;