/*
  # Add Module 2: Control Flow and Logic Lessons

  ## Overview
  Creates 6 comprehensive lessons for Module 2 covering control flow structures.

  ## Lessons Added
  1. If-Else Statements (35 min)
  2. Switch Statements (30 min)
  3. For Loops (40 min)
  4. While and Do-While Loops (35 min)
  5. Break and Continue (30 min)
  6. Control Flow Practice (30 min)

  ## Important Notes
  - Each lesson includes detailed explanations and code examples
  - Progressive difficulty from basic to advanced
*/

-- Lesson 1: If-Else Statements
INSERT INTO course_lessons (module_id, title, description, order_index, estimated_minutes, content_type, content_text)
SELECT
  id,
  'If-Else Statements',
  'Learn how to make decisions in your programs using conditional statements.',
  1,
  35,
  'video',
  '# If-Else Statements

Programming requires making decisions based on conditions. If-else statements allow your program to execute different code depending on whether a condition is true or false.

## Basic If Statement

```java
if (condition) {
    // Code executes if condition is true
}
```

**Example:**
```java
int age = 18;

if (age >= 18) {
    System.out.println("You are an adult.");
}
```

## If-Else Statement

```java
if (condition) {
    // Code if true
} else {
    // Code if false
}
```

**Example:**
```java
int temperature = 25;

if (temperature > 30) {
    System.out.println("It is hot!");
} else {
    System.out.println("Weather is pleasant.");
}
```

## If-Else-If Ladder

```java
int score = 85;

if (score >= 90) {
    System.out.println("Grade: A");
} else if (score >= 80) {
    System.out.println("Grade: B");
} else if (score >= 70) {
    System.out.println("Grade: C");
} else {
    System.out.println("Grade: F");
}
```

## Comparison Operators

- `==` Equal to
- `!=` Not equal to
- `>` Greater than
- `<` Less than
- `>=` Greater than or equal
- `<=` Less than or equal

## Logical Operators

### AND (&&) - Both must be true
```java
if (age >= 18 && hasLicense) {
    System.out.println("Can drive!");
}
```

### OR (||) - At least one must be true
```java
if (isWeekend || isHoliday) {
    System.out.println("Time to relax!");
}
```

### NOT (!) - Inverts boolean
```java
if (!isRaining) {
    System.out.println("Let us go outside!");
}
```

## Practical Example: Login System

```java
String username = "admin";
String password = "secret123";

if (username.equals("admin") && password.equals("secret123")) {
    System.out.println("Login successful!");
} else {
    System.out.println("Invalid credentials.");
}
```

## Common Mistakes

❌ Using = instead of ==
❌ Missing braces for multiple statements
❌ Comparing strings with == (use .equals())

## Key Takeaways

✓ If-else controls program flow based on conditions
✓ Use comparison operators to create conditions
✓ Logical operators combine multiple conditions
✓ Always use .equals() for string comparison'
FROM course_modules
WHERE title = 'Control Flow and Logic'
  AND course_id = (SELECT id FROM courses WHERE title = 'Java Fundamentals for Beginners')
ON CONFLICT DO NOTHING;

-- Lesson 2: Switch Statements
INSERT INTO course_lessons (module_id, title, description, order_index, estimated_minutes, content_type, content_text)
SELECT
  id,
  'Switch Statements',
  'Simplify complex if-else chains with switch statements.',
  2,
  30,
  'reading',
  '# Switch Statements

When checking a variable against multiple values, a switch statement can be cleaner than if-else chains.

## Basic Syntax

```java
switch (variable) {
    case value1:
        // Code
        break;
    case value2:
        // Code
        break;
    default:
        // Default code
}
```

## Example: Days of Week

```java
int day = 3;

switch (day) {
    case 1:
        System.out.println("Monday");
        break;
    case 2:
        System.out.println("Tuesday");
        break;
    case 3:
        System.out.println("Wednesday");
        break;
    default:
        System.out.println("Invalid day");
}
```

## The Importance of Break

Without `break`, execution falls through to next case:

```java
int number = 2;

switch (number) {
    case 1:
        System.out.println("One");
    case 2:
        System.out.println("Two");
    case 3:
        System.out.println("Three");
}
// Output: Two, Three (fall-through!)
```

## Intentional Fall-Through

Group multiple cases:

```java
int month = 12;

switch (month) {
    case 12:
    case 1:
    case 2:
        System.out.println("Winter");
        break;
    case 3:
    case 4:
    case 5:
        System.out.println("Spring");
        break;
}
```

## Switch with Strings

```java
String grade = "B";

switch (grade) {
    case "A":
        System.out.println("Excellent!");
        break;
    case "B":
        System.out.println("Good job!");
        break;
    case "C":
        System.out.println("Satisfactory");
        break;
    default:
        System.out.println("Invalid grade");
}
```

## Practical Example: Calculator

```java
char operator = ''+'';
int a = 10, b = 5;

switch (operator) {
    case ''+'':
        System.out.println("Result: " + (a + b));
        break;
    case ''-'':
        System.out.println("Result: " + (a - b));
        break;
    case ''*'':
        System.out.println("Result: " + (a * b));
        break;
    case ''/'':
        System.out.println("Result: " + (a / b));
        break;
    default:
        System.out.println("Invalid operator");
}
```

## When to Use Switch vs If-Else

**Use Switch:**
- Checking one variable against multiple exact values
- Many cases (3+)
- Values are constants

**Use If-Else:**
- Comparison operators (>, <)
- Boolean expressions
- Ranges of values

## Key Takeaways

✓ Switch checks variable against specific values
✓ Always use break to prevent fall-through
✓ Default case handles unmatched values
✓ Works with int, char, String, enum'
FROM course_modules
WHERE title = 'Control Flow and Logic'
  AND course_id = (SELECT id FROM courses WHERE title = 'Java Fundamentals for Beginners')
ON CONFLICT DO NOTHING;
