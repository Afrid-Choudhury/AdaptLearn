/*
  # Complete Module 2 Lessons

  ## Overview
  Adds final two lessons for Module 2: Break/Continue and Practice.
*/

-- Lesson 5: Break and Continue
INSERT INTO course_lessons (module_id, title, description, order_index, estimated_minutes, content_type, content_text)
SELECT
  id,
  'Break and Continue Statements',
  'Control loop execution with break and continue statements.',
  5,
  30,
  'video',
  '# Break and Continue Statements

Break and continue give you fine control over loop execution.

## Break Statement

Exits the loop immediately:

```java
for (int i = 0; i < 10; i++) {
    if (i == 5) {
        break;  // Exit loop when i is 5
    }
    System.out.println(i);
}
// Output: 0, 1, 2, 3, 4
```

## Break with While Loop

```java
int count = 0;

while (true) {
    System.out.println(count);
    count++;
    
    if (count >= 5) {
        break;  // Exit infinite loop
    }
}
```

## Continue Statement

Skips the current iteration:

```java
for (int i = 0; i < 10; i++) {
    if (i % 2 == 0) {
        continue;  // Skip even numbers
    }
    System.out.println(i);
}
// Output: 1, 3, 5, 7, 9
```

## Break vs Continue

**Break**: Exits loop completely
**Continue**: Skips to next iteration

```java
// Break example
for (int i = 0; i < 5; i++) {
    if (i == 3) break;
    System.out.print(i + " ");
}
// Output: 0 1 2

// Continue example
for (int i = 0; i < 5; i++) {
    if (i == 3) continue;
    System.out.print(i + " ");
}
// Output: 0 1 2 4
```

## Practical Examples

### Example 1: Search for Value
```java
int[] numbers = {10, 20, 30, 40, 50};
int target = 30;
boolean found = false;

for (int num : numbers) {
    if (num == target) {
        found = true;
        System.out.println("Found: " + target);
        break;  // Stop searching
    }
}

if (!found) {
    System.out.println("Not found");
}
```

### Example 2: Skip Invalid Values
```java
int[] scores = {85, -1, 92, 0, 78, -5, 88};

for (int score : scores) {
    if (score < 0) {
        continue;  // Skip negative scores
    }
    System.out.println("Valid score: " + score);
}
```

### Example 3: Menu System
```java
boolean running = true;
int choice = 0;

while (running) {
    System.out.println("1. Start");
    System.out.println("2. Settings");
    System.out.println("3. Exit");
    
    choice = 3;  // Example
    
    if (choice == 3) {
        System.out.println("Goodbye!");
        break;  // Exit program
    }
    
    if (choice < 1 || choice > 3) {
        System.out.println("Invalid choice");
        continue;  // Ask again
    }
    
    System.out.println("You chose: " + choice);
}
```

## Break with Nested Loops

Break only exits the innermost loop:

```java
for (int i = 0; i < 3; i++) {
    for (int j = 0; j < 3; j++) {
        if (j == 1) {
            break;  // Only breaks inner loop
        }
        System.out.println("i=" + i + ", j=" + j);
    }
}
```

## Labeled Break

To break outer loop, use labels:

```java
outerLoop:
for (int i = 0; i < 3; i++) {
    for (int j = 0; j < 3; j++) {
        if (i == 1 && j == 1) {
            break outerLoop;  // Breaks outer loop
        }
        System.out.println("i=" + i + ", j=" + j);
    }
}
```

## When to Use

**Use Break:**
- Exit loop when condition is met
- Exit infinite loops
- Stop searching when item found

**Use Continue:**
- Skip invalid data
- Skip certain iterations
- Filter loop iterations

## Common Mistakes

❌ Using break outside a loop
```java
if (x > 5) {
    break;  // Error: not in a loop!
}
```

❌ Forgetting break in switch statements
```java
switch (x) {
    case 1:
        System.out.println("One");
        // Missing break causes fall-through
    case 2:
        System.out.println("Two");
}
```

## Key Takeaways

✓ Break exits loop immediately
✓ Continue skips to next iteration
✓ Useful for controlling loop flow
✓ Break only affects innermost loop (unless labeled)
✓ Use sparingly for code clarity'
FROM course_modules
WHERE title = 'Control Flow and Logic'
  AND course_id = (SELECT id FROM courses WHERE title = 'Java Fundamentals for Beginners')
ON CONFLICT DO NOTHING;

-- Lesson 6: Control Flow Practice
INSERT INTO course_lessons (module_id, title, description, order_index, estimated_minutes, content_type, content_text)
SELECT
  id,
  'Control Flow Practice',
  'Apply what you have learned with hands-on control flow exercises.',
  6,
  40,
  'quiz',
  '# Control Flow Practice

Practice makes perfect! Work through these exercises to master control flow.

## Exercise 1: Grade Calculator

Calculate letter grade from numeric score:

```java
public class GradeCalculator {
    public static void main(String[] args) {
        int score = 85;
        char grade;
        
        if (score >= 90) {
            grade = ''A'';
        } else if (score >= 80) {
            grade = ''B'';
        } else if (score >= 70) {
            grade = ''C'';
        } else if (score >= 60) {
            grade = ''D'';
        } else {
            grade = ''F'';
        }
        
        System.out.println("Score: " + score);
        System.out.println("Grade: " + grade);
    }
}
```

## Exercise 2: Fizz Buzz

Print numbers 1-100, but:
- Print "Fizz" for multiples of 3
- Print "Buzz" for multiples of 5
- Print "FizzBuzz" for multiples of both

```java
public class FizzBuzz {
    public static void main(String[] args) {
        for (int i = 1; i <= 100; i++) {
            if (i % 15 == 0) {
                System.out.println("FizzBuzz");
            } else if (i % 3 == 0) {
                System.out.println("Fizz");
            } else if (i % 5 == 0) {
                System.out.println("Buzz");
            } else {
                System.out.println(i);
            }
        }
    }
}
```

## Exercise 3: Factorial Calculator

Calculate factorial using a loop:

```java
public class Factorial {
    public static void main(String[] args) {
        int number = 5;
        int factorial = 1;
        
        for (int i = 1; i <= number; i++) {
            factorial *= i;
        }
        
        System.out.println(number + "! = " + factorial);
        // Output: 5! = 120
    }
}
```

## Exercise 4: Prime Number Checker

Check if a number is prime:

```java
public class PrimeChecker {
    public static void main(String[] args) {
        int number = 17;
        boolean isPrime = true;
        
        if (number <= 1) {
            isPrime = false;
        } else {
            for (int i = 2; i <= number / 2; i++) {
                if (number % i == 0) {
                    isPrime = false;
                    break;
                }
            }
        }
        
        if (isPrime) {
            System.out.println(number + " is prime");
        } else {
            System.out.println(number + " is not prime");
        }
    }
}
```

## Exercise 5: Pattern Printing

Create a pyramid pattern:

```java
public class PyramidPattern {
    public static void main(String[] args) {
        int rows = 5;
        
        for (int i = 1; i <= rows; i++) {
            // Print spaces
            for (int j = 1; j <= rows - i; j++) {
                System.out.print(" ");
            }
            
            // Print stars
            for (int j = 1; j <= 2 * i - 1; j++) {
                System.out.print("*");
            }
            
            System.out.println();
        }
    }
}
// Output:
//     *
//    ***
//   *****
//  *******
// *********
```

## Exercise 6: Sum of Digits

Calculate sum of digits in a number:

```java
public class SumOfDigits {
    public static void main(String[] args) {
        int number = 12345;
        int sum = 0;
        
        while (number > 0) {
            sum += number % 10;  // Add last digit
            number /= 10;         // Remove last digit
        }
        
        System.out.println("Sum of digits: " + sum);
        // Output: 15
    }
}
```

## Challenge: Palindrome Checker

Check if a number is a palindrome:

```java
public class PalindromeChecker {
    public static void main(String[] args) {
        int number = 12321;
        int original = number;
        int reversed = 0;
        
        while (number > 0) {
            int digit = number % 10;
            reversed = reversed * 10 + digit;
            number /= 10;
        }
        
        if (original == reversed) {
            System.out.println(original + " is a palindrome");
        } else {
            System.out.println(original + " is not a palindrome");
        }
    }
}
```

## Key Takeaways

✓ Control flow is essential for program logic
✓ Practice helps solidify understanding
✓ Combine loops and conditionals effectively
✓ Break down complex problems into steps

Congratulations on completing Module 2! You now understand control flow in Java.'
FROM course_modules
WHERE title = 'Control Flow and Logic'
  AND course_id = (SELECT id FROM courses WHERE title = 'Java Fundamentals for Beginners')
ON CONFLICT DO NOTHING;
