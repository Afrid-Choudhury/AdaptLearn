/*
  # Add Module 2 Loop Lessons

  ## Overview
  Adds lessons 3-6 for Module 2 covering loops and control flow.

  ## Lessons
  - For Loops
  - While and Do-While Loops
  - Break and Continue
  - Control Flow Practice
*/

-- Lesson 3: For Loops
INSERT INTO course_lessons (module_id, title, description, order_index, estimated_minutes, content_type, content_text)
SELECT
  id,
  'For Loops',
  'Master repetition with for loops to execute code multiple times.',
  3,
  40,
  'video',
  '# For Loops

Loops allow you to execute code repeatedly. The for loop is perfect when you know how many times you want to iterate.

## Basic For Loop Syntax

```java
for (initialization; condition; update) {
    // Code to repeat
}
```

## Simple Example

```java
for (int i = 0; i < 5; i++) {
    System.out.println("Count: " + i);
}
// Output: 0, 1, 2, 3, 4
```

## Understanding the Parts

1. **Initialization**: `int i = 0` - Runs once at start
2. **Condition**: `i < 5` - Checked before each iteration
3. **Update**: `i++` - Runs after each iteration

## Counting Up

```java
for (int i = 1; i <= 10; i++) {
    System.out.println(i);
}
// Output: 1, 2, 3, ..., 10
```

## Counting Down

```java
for (int i = 10; i >= 1; i--) {
    System.out.println(i);
}
// Output: 10, 9, 8, ..., 1
```

## Counting by Different Steps

```java
// Count by 2s
for (int i = 0; i <= 10; i += 2) {
    System.out.println(i);
}
// Output: 0, 2, 4, 6, 8, 10

// Count by 5s
for (int i = 0; i <= 50; i += 5) {
    System.out.println(i);
}
```

## Practical Examples

### Example 1: Multiplication Table
```java
int number = 5;

for (int i = 1; i <= 10; i++) {
    System.out.println(number + " x " + i + " = " + (number * i));
}
```

### Example 2: Sum Numbers
```java
int sum = 0;

for (int i = 1; i <= 100; i++) {
    sum += i;
}

System.out.println("Sum of 1-100: " + sum);
// Output: 5050
```

### Example 3: Print Pattern
```java
for (int i = 1; i <= 5; i++) {
    for (int j = 1; j <= i; j++) {
        System.out.print("* ");
    }
    System.out.println();
}
// Output:
// *
// * *
// * * *
// * * * *
// * * * * *
```

## Nested For Loops

```java
for (int i = 1; i <= 3; i++) {
    for (int j = 1; j <= 3; j++) {
        System.out.print("(" + i + "," + j + ") ");
    }
    System.out.println();
}
```

## Enhanced For Loop (For-Each)

Used with arrays and collections:

```java
int[] numbers = {10, 20, 30, 40, 50};

for (int num : numbers) {
    System.out.println(num);
}
```

## Common Mistakes

❌ Off-by-one errors
```java
for (int i = 0; i <= 5; i++) {  // Runs 6 times, not 5!
```

❌ Infinite loops
```java
for (int i = 0; i < 10; i--) {  // Never ends!
```

❌ Modifying loop variable inside loop
```java
for (int i = 0; i < 10; i++) {
    i = i + 2;  // Confusing and error-prone
}
```

## Key Takeaways

✓ For loops repeat code a specific number of times
✓ Three parts: initialization, condition, update
✓ Perfect when you know iteration count
✓ Can nest loops for complex patterns
✓ Watch for off-by-one errors'
FROM course_modules
WHERE title = 'Control Flow and Logic'
  AND course_id = (SELECT id FROM courses WHERE title = 'Java Fundamentals for Beginners')
ON CONFLICT DO NOTHING;

-- Lesson 4: While and Do-While Loops
INSERT INTO course_lessons (module_id, title, description, order_index, estimated_minutes, content_type, content_text)
SELECT
  id,
  'While and Do-While Loops',
  'Learn alternative looping structures for flexible repetition.',
  4,
  35,
  'reading',
  '# While and Do-While Loops

While loops continue executing as long as a condition is true. They are ideal when you do not know how many iterations you need in advance.

## While Loop Syntax

```java
while (condition) {
    // Code to repeat
}
```

## Basic While Loop

```java
int count = 0;

while (count < 5) {
    System.out.println("Count: " + count);
    count++;
}
// Output: 0, 1, 2, 3, 4
```

## While vs For Loop

**For loop**: Known number of iterations
```java
for (int i = 0; i < 5; i++) {
    System.out.println(i);
}
```

**While loop**: Unknown number of iterations
```java
int i = 0;
while (i < 5) {
    System.out.println(i);
    i++;
}
```

## Practical Examples

### Example 1: User Input Validation
```java
int userInput = -1;

while (userInput < 0 || userInput > 100) {
    System.out.println("Enter a number between 0-100:");
    // Read user input
    userInput = 50; // Example value
}
```

### Example 2: Finding a Value
```java
int number = 1;

while (number * number < 100) {
    System.out.println(number + " squared is " + (number * number));
    number++;
}
```

## Do-While Loop

Executes at least once, then checks condition:

```java
do {
    // Code to repeat
} while (condition);
```

## Do-While Example

```java
int count = 0;

do {
    System.out.println("Count: " + count);
    count++;
} while (count < 5);
```

## When to Use Do-While

When you need to run code at least once:

```java
String password;

do {
    System.out.println("Enter password:");
    password = "secret"; // Example
} while (!password.equals("secret"));

System.out.println("Access granted!");
```

## Infinite Loops

Be careful! These never end:

```java
while (true) {
    System.out.println("Forever!");
}

// To exit, use break:
while (true) {
    System.out.println("Enter quit to exit:");
    String input = "quit";
    if (input.equals("quit")) {
        break;
    }
}
```

## Practical Example: Number Guessing Game

```java
int secretNumber = 7;
int guess = 0;
int attempts = 0;

while (guess != secretNumber) {
    System.out.println("Guess the number (1-10):");
    guess = 5; // Example guess
    attempts++;
    
    if (guess < secretNumber) {
        System.out.println("Too low!");
    } else if (guess > secretNumber) {
        System.out.println("Too high!");
    }
}

System.out.println("Correct! Attempts: " + attempts);
```

## Common Mistakes

❌ Forgetting to update loop variable
```java
int i = 0;
while (i < 5) {
    System.out.println(i);
    // Missing i++; causes infinite loop!
}
```

❌ Wrong condition
```java
int i = 10;
while (i > 0) {
    System.out.println(i);
    i++;  // i keeps increasing!
}
```

## Key Takeaways

✓ While loops run as long as condition is true
✓ Do-while loops always run at least once
✓ Use when iteration count is unknown
✓ Always ensure loop can terminate
✓ Watch for infinite loops'
FROM course_modules
WHERE title = 'Control Flow and Logic'
  AND course_id = (SELECT id FROM courses WHERE title = 'Java Fundamentals for Beginners')
ON CONFLICT DO NOTHING;
