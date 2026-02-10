/*
  # Add Exception Handling Lessons to Intermediate Course

  1. New Lessons
    - Understanding Exceptions (video, 35 min)
    - Try-Catch Blocks (reading, 40 min)
    - Multiple Catch and Finally (video, 35 min)
    - Custom Exceptions (video, 40 min)
    - Best Practices for Error Handling (reading, 30 min)
    - Exception Handling Practice (quiz, 35 min)

  2. Security
    - No RLS changes needed

  3. Important Notes
    - All lessons follow the emoji-based pattern (checkmarks, cross marks)
    - Progressive difficulty from basic to advanced exception handling
*/

-- Lesson 1: Understanding Exceptions
INSERT INTO course_lessons (module_id, title, description, order_index, estimated_minutes, content_type, content_text)
SELECT
  id,
  'Understanding Exceptions',
  'Learn what exceptions are, how they work, and the difference between checked and unchecked exceptions.',
  1,
  35,
  'video',
  '# Understanding Exceptions

Exceptions are events that disrupt the normal flow of a program. Instead of crashing, Java gives you tools to detect and handle these problems gracefully.

## What Happens Without Exception Handling?

```java
int[] numbers = {1, 2, 3};
System.out.println(numbers[5]);
```

This crashes with: `ArrayIndexOutOfBoundsException`

## The Exception Hierarchy

```
        Throwable
       /         \
    Error      Exception
     |         /       \
 OutOfMemory  RuntimeException  IOException
              |                 |
       NullPointerException  FileNotFoundException
       ArithmeticException
       ArrayIndexOutOfBounds
```

## Checked vs Unchecked Exceptions

### Checked Exceptions
The compiler **forces** you to handle these. They represent recoverable conditions.

```java
FileReader file = new FileReader("data.txt");
```

This will not compile without a try-catch or `throws` declaration.

Examples: `IOException`, `FileNotFoundException`, `SQLException`

### Unchecked Exceptions (Runtime)
The compiler does **not** force you to handle these. They usually indicate programming errors.

```java
String text = null;
text.length();
```

Examples: `NullPointerException`, `ArithmeticException`, `ArrayIndexOutOfBoundsException`

## Errors vs Exceptions

**Errors** are serious problems that applications should not try to handle:
- `OutOfMemoryError`
- `StackOverflowError`

**Exceptions** are conditions that applications can and should handle.

## Reading a Stack Trace

```
Exception in thread "main" java.lang.ArithmeticException: / by zero
    at Calculator.divide(Calculator.java:8)
    at Calculator.main(Calculator.java:14)
```

Read from bottom to top:
1. `main` called `divide` at line 14
2. `divide` threw the exception at line 8
3. The exception type is `ArithmeticException`
4. The message is "/ by zero"

## Common Exceptions You Will Encounter

| Exception | Cause |
|-----------|-------|
| `NullPointerException` | Calling methods on null |
| `ArithmeticException` | Division by zero |
| `ArrayIndexOutOfBoundsException` | Invalid array index |
| `NumberFormatException` | Invalid string to number conversion |
| `ClassCastException` | Invalid type casting |
| `FileNotFoundException` | File does not exist |

## Common Mistakes

❌ Ignoring exceptions entirely (empty catch blocks)
❌ Catching `Exception` instead of the specific type
❌ Confusing Errors with Exceptions

## Key Takeaways

✓ Exceptions disrupt normal program flow but can be handled
✓ Checked exceptions must be handled at compile time
✓ Unchecked (runtime) exceptions indicate bugs in logic
✓ Stack traces tell you exactly where and why an exception occurred'
FROM course_modules
WHERE title = 'Exception Handling'
  AND course_id = (SELECT id FROM courses WHERE title = 'Intermediate Java Development')
ON CONFLICT DO NOTHING;

-- Lesson 2: Try-Catch Blocks
INSERT INTO course_lessons (module_id, title, description, order_index, estimated_minutes, content_type, content_text)
SELECT
  id,
  'Try-Catch Blocks',
  'Master the fundamental mechanism for catching and handling exceptions in Java.',
  2,
  40,
  'reading',
  '# Try-Catch Blocks

The `try-catch` block is Java''s primary mechanism for handling exceptions. Code that might throw an exception goes in the `try` block, and your response goes in the `catch` block.

## Basic Syntax

```java
try {
    // Code that might throw an exception
} catch (ExceptionType e) {
    // Handle the exception
}
```

## Simple Example

```java
try {
    int result = 10 / 0;
    System.out.println(result);
} catch (ArithmeticException e) {
    System.out.println("Cannot divide by zero!");
}
System.out.println("Program continues...");
```

Without the try-catch, the program would crash. With it, the error is handled and execution continues.

## Accessing Exception Information

The caught exception object provides useful methods:

```java
try {
    int[] arr = new int[3];
    arr[10] = 5;
} catch (ArrayIndexOutOfBoundsException e) {
    System.out.println("Message: " + e.getMessage());
    e.printStackTrace();
}
```

| Method | Returns |
|--------|---------|
| `getMessage()` | Human-readable error description |
| `toString()` | Exception type + message |
| `printStackTrace()` | Full stack trace to console |
| `getClass().getName()` | Fully qualified exception name |

## Try-Catch with User Input

```java
import java.util.Scanner;

Scanner scanner = new Scanner(System.in);
System.out.print("Enter a number: ");

try {
    int number = Integer.parseInt(scanner.nextLine());
    System.out.println("You entered: " + number);
} catch (NumberFormatException e) {
    System.out.println("That is not a valid number!");
}
```

## Nested Try-Catch

```java
try {
    try {
        int result = 10 / 0;
    } catch (ArithmeticException e) {
        System.out.println("Inner: " + e.getMessage());
    }
    System.out.println("Outer block continues");
} catch (Exception e) {
    System.out.println("Outer: " + e.getMessage());
}
```

The inner catch handles the arithmetic error, and the outer block continues normally.

## Try-Catch in Loops (Retry Pattern)

```java
Scanner scanner = new Scanner(System.in);
int number = 0;
boolean valid = false;

while (!valid) {
    try {
        System.out.print("Enter a number: ");
        number = Integer.parseInt(scanner.nextLine());
        valid = true;
    } catch (NumberFormatException e) {
        System.out.println("Invalid! Try again.");
    }
}
System.out.println("You entered: " + number);
```

## Common Mistakes

❌ Using an empty catch block (silently swallowing errors)
❌ Catching `Exception` when you know the specific type
❌ Putting too much code in the try block

## Key Takeaways

✓ Try-catch prevents crashes by handling exceptions gracefully
✓ Always catch the most specific exception type possible
✓ Use getMessage() and printStackTrace() for debugging
✓ The retry pattern combines try-catch with loops for robust input handling'
FROM course_modules
WHERE title = 'Exception Handling'
  AND course_id = (SELECT id FROM courses WHERE title = 'Intermediate Java Development')
ON CONFLICT DO NOTHING;

-- Lesson 3: Multiple Catch and Finally
INSERT INTO course_lessons (module_id, title, description, order_index, estimated_minutes, content_type, content_text)
SELECT
  id,
  'Multiple Catch and Finally',
  'Handle different exception types and guarantee cleanup code runs with finally.',
  3,
  35,
  'video',
  '# Multiple Catch and Finally

Real programs can throw many types of exceptions. Java lets you handle each one differently with multiple catch blocks, and `finally` guarantees cleanup code always runs.

## Multiple Catch Blocks

```java
try {
    String text = "abc";
    int number = Integer.parseInt(text);
    int[] arr = new int[3];
    arr[number] = 10;
} catch (NumberFormatException e) {
    System.out.println("Not a valid number: " + e.getMessage());
} catch (ArrayIndexOutOfBoundsException e) {
    System.out.println("Index out of range: " + e.getMessage());
}
```

Java checks catch blocks in order and executes the **first** one that matches.

## Order Matters

Catch specific exceptions before general ones:

```java
try {
    // risky code
} catch (FileNotFoundException e) {
    System.out.println("File not found");
} catch (IOException e) {
    System.out.println("I/O error");
} catch (Exception e) {
    System.out.println("Something else went wrong");
}
```

If you put `Exception` first, the compiler will report an error because the more specific catches become unreachable.

## Multi-Catch (Java 7+)

Handle multiple exception types in one block:

```java
try {
    // risky code
} catch (NumberFormatException | ArithmeticException e) {
    System.out.println("Math or format error: " + e.getMessage());
}
```

Use this when you want the same response for different exception types.

## The Finally Block

Code in `finally` **always runs**, whether an exception occurred or not:

```java
Scanner scanner = null;
try {
    scanner = new Scanner(System.in);
    int num = scanner.nextInt();
    System.out.println("You entered: " + num);
} catch (Exception e) {
    System.out.println("Error: " + e.getMessage());
} finally {
    if (scanner != null) {
        scanner.close();
    }
    System.out.println("Cleanup complete.");
}
```

## When Does Finally Run?

| Scenario | Finally Runs? |
|----------|--------------|
| No exception thrown | Yes |
| Exception caught | Yes |
| Exception NOT caught | Yes |
| Return statement in try | Yes |
| System.exit() called | No |

## Try-With-Resources (Java 7+)

A cleaner alternative for auto-closeable resources:

```java
try (Scanner scanner = new Scanner(System.in)) {
    int num = scanner.nextInt();
    System.out.println("You entered: " + num);
} catch (Exception e) {
    System.out.println("Error: " + e.getMessage());
}
```

The resource is automatically closed — no `finally` needed.

## Common Mistakes

❌ Catching general Exception before specific types
❌ Forgetting that finally always runs (even after return)
❌ Not closing resources in finally (use try-with-resources instead)

## Key Takeaways

✓ Multiple catch blocks handle different exception types independently
✓ Always order catches from most specific to most general
✓ Finally guarantees cleanup code runs regardless of exceptions
✓ Try-with-resources is the modern way to manage closeable resources'
FROM course_modules
WHERE title = 'Exception Handling'
  AND course_id = (SELECT id FROM courses WHERE title = 'Intermediate Java Development')
ON CONFLICT DO NOTHING;

-- Lesson 4: Custom Exceptions
INSERT INTO course_lessons (module_id, title, description, order_index, estimated_minutes, content_type, content_text)
SELECT
  id,
  'Custom Exceptions',
  'Create your own exception classes to represent domain-specific errors.',
  4,
  40,
  'video',
  '# Custom Exceptions

Java''s built-in exceptions do not cover every situation. Custom exceptions let you create meaningful error types specific to your application.

## Why Custom Exceptions?

Consider a banking application. Instead of throwing a generic `Exception`, you can throw:
- `InsufficientFundsException`
- `AccountNotFoundException`
- `InvalidTransactionException`

This makes error handling clearer and debugging easier.

## Creating a Custom Exception

Extend `Exception` for a checked exception:

```java
public class InsufficientFundsException extends Exception {
    private double amount;

    public InsufficientFundsException(double amount) {
        super("Insufficient funds. Short by: $" + amount);
        this.amount = amount;
    }

    public double getAmount() {
        return amount;
    }
}
```

## Using Your Custom Exception

```java
public class BankAccount {
    private double balance;

    public BankAccount(double balance) {
        this.balance = balance;
    }

    public void withdraw(double amount) throws InsufficientFundsException {
        if (amount > balance) {
            throw new InsufficientFundsException(amount - balance);
        }
        balance -= amount;
    }
}
```

```java
public class Main {
    public static void main(String[] args) {
        BankAccount account = new BankAccount(500.0);
        try {
            account.withdraw(800.0);
        } catch (InsufficientFundsException e) {
            System.out.println(e.getMessage());
            System.out.println("Amount short: $" + e.getAmount());
        }
    }
}
```

## Custom Runtime Exception

Extend `RuntimeException` for unchecked exceptions:

```java
public class InvalidAgeException extends RuntimeException {
    public InvalidAgeException(int age) {
        super("Invalid age: " + age + ". Must be between 0 and 150.");
    }
}
```

```java
public void setAge(int age) {
    if (age < 0 || age > 150) {
        throw new InvalidAgeException(age);
    }
    this.age = age;
}
```

## Checked vs Unchecked Custom Exceptions

| Feature | Checked (extends Exception) | Unchecked (extends RuntimeException) |
|---------|----------------------------|--------------------------------------|
| Compiler enforces handling | Yes | No |
| Use for | Recoverable conditions | Programming errors |
| Must declare with throws | Yes | No |
| Examples | Business rule violations | Invalid arguments |

## Exception Chaining

Wrap a lower-level exception inside a custom one:

```java
public class DataAccessException extends Exception {
    public DataAccessException(String message, Throwable cause) {
        super(message, cause);
    }
}
```

```java
try {
    // database operation
} catch (SQLException e) {
    throw new DataAccessException("Failed to load user data", e);
}
```

## Common Mistakes

❌ Creating custom exceptions when built-in ones suffice
❌ Not including a meaningful message
❌ Forgetting to declare checked exceptions with `throws`

## Key Takeaways

✓ Custom exceptions make error handling domain-specific and clear
✓ Extend Exception for checked; RuntimeException for unchecked
✓ Include meaningful messages and relevant data fields
✓ Use exception chaining to preserve the original cause'
FROM course_modules
WHERE title = 'Exception Handling'
  AND course_id = (SELECT id FROM courses WHERE title = 'Intermediate Java Development')
ON CONFLICT DO NOTHING;

-- Lesson 5: Best Practices for Error Handling
INSERT INTO course_lessons (module_id, title, description, order_index, estimated_minutes, content_type, content_text)
SELECT
  id,
  'Best Practices for Error Handling',
  'Learn industry-standard patterns and anti-patterns for exception handling.',
  5,
  30,
  'reading',
  '# Best Practices for Error Handling

Writing correct exception handling code is just the beginning. Following best practices ensures your code is maintainable, debuggable, and robust.

## Rule 1: Catch Specific Exceptions

```java
try {
    int num = Integer.parseInt(input);
} catch (NumberFormatException e) {
    System.out.println("Please enter a valid number");
}
```

❌ Avoid this:
```java
try {
    int num = Integer.parseInt(input);
} catch (Exception e) {
    System.out.println("Something went wrong");
}
```

Catching `Exception` hides the real problem.

## Rule 2: Never Swallow Exceptions

```java
try {
    riskyOperation();
} catch (IOException e) {
    // empty — the error is silently ignored
}
```

At minimum, log the exception:

```java
try {
    riskyOperation();
} catch (IOException e) {
    System.err.println("Operation failed: " + e.getMessage());
}
```

## Rule 3: Use Try-With-Resources

```java
try (BufferedReader reader = new BufferedReader(new FileReader("file.txt"))) {
    String line = reader.readLine();
    System.out.println(line);
} catch (IOException e) {
    System.out.println("Could not read file: " + e.getMessage());
}
```

Resources are automatically closed, even if an exception occurs.

## Rule 4: Throw Early, Catch Late

Validate inputs as early as possible:

```java
public void setEmail(String email) {
    if (email == null || !email.contains("@")) {
        throw new IllegalArgumentException("Invalid email: " + email);
    }
    this.email = email;
}
```

Handle exceptions at the level that can take meaningful action.

## Rule 5: Include Context in Exception Messages

```java
throw new IllegalArgumentException(
    "User age must be between 0 and 150, but was: " + age
);
```

Good messages include: what went wrong, what the value was, and what was expected.

## Rule 6: Do Not Use Exceptions for Flow Control

❌ Bad — exceptions as logic:
```java
try {
    while (true) {
        array[i++] = 0;
    }
} catch (ArrayIndexOutOfBoundsException e) {
    // loop finished
}
```

✓ Better — normal control flow:
```java
for (int i = 0; i < array.length; i++) {
    array[i] = 0;
}
```

## Rule 7: Document Thrown Exceptions

```java
/**
 * Withdraws money from the account.
 *
 * @param amount the amount to withdraw
 * @throws InsufficientFundsException if amount exceeds balance
 * @throws IllegalArgumentException if amount is negative
 */
public void withdraw(double amount) throws InsufficientFundsException {
    // implementation
}
```

## Summary of Anti-Patterns

| Anti-Pattern | Problem |
|-------------|---------|
| Empty catch block | Silently hides errors |
| Catching Exception | Too broad, hides specific issues |
| Exceptions for flow control | Slow, confusing |
| Not closing resources | Memory leaks |
| Generic error messages | Hard to debug |

## Key Takeaways

✓ Catch specific exceptions, not generic ones
✓ Never swallow exceptions silently
✓ Use try-with-resources for auto-closeable objects
✓ Throw early with meaningful messages, catch late where you can respond'
FROM course_modules
WHERE title = 'Exception Handling'
  AND course_id = (SELECT id FROM courses WHERE title = 'Intermediate Java Development')
ON CONFLICT DO NOTHING;

-- Lesson 6: Exception Handling Practice
INSERT INTO course_lessons (module_id, title, description, order_index, estimated_minutes, content_type, content_text)
SELECT
  id,
  'Exception Handling Practice',
  'Review and test your understanding of exception handling concepts.',
  6,
  35,
  'quiz',
  '# Exception Handling Practice

Test your understanding of try-catch, finally, custom exceptions, and best practices.

## Review Questions

### 1. What Happens Here?
```java
try {
    String text = null;
    text.length();
} catch (NullPointerException e) {
    System.out.println("Caught it!");
} finally {
    System.out.println("Always runs");
}
```

**Answer:** Prints "Caught it!" then "Always runs". The NullPointerException is caught, and finally always executes.

### 2. Exception Order
Which catch block order is correct?

```java
// Option A
catch (IOException e) { }
catch (FileNotFoundException e) { }

// Option B
catch (FileNotFoundException e) { }
catch (IOException e) { }
```

**Answer:** Option B. FileNotFoundException is more specific and must come first.

### 3. Checked vs Unchecked
Classify each exception:

| Exception | Type |
|-----------|------|
| `NullPointerException` | Unchecked |
| `IOException` | Checked |
| `ArithmeticException` | Unchecked |
| `FileNotFoundException` | Checked |
| `ArrayIndexOutOfBoundsException` | Unchecked |

### 4. Try-With-Resources
What happens to the resource if an exception is thrown inside a try-with-resources block?

**Answer:** The resource is still automatically closed before the catch block executes.

### 5. Custom Exception
When should you create a custom exception?

**Answer:** When built-in exceptions do not adequately describe your domain-specific error condition. For example, `InsufficientFundsException` in a banking app.

## Concepts Checklist

✓ Exceptions disrupt normal flow and can be caught with try-catch
✓ Checked exceptions must be handled; unchecked are optional
✓ Finally blocks always execute for cleanup
✓ Custom exceptions extend Exception or RuntimeException
✓ Follow best practices: specific catches, meaningful messages, no empty catch blocks'
FROM course_modules
WHERE title = 'Exception Handling'
  AND course_id = (SELECT id FROM courses WHERE title = 'Intermediate Java Development')
ON CONFLICT DO NOTHING;