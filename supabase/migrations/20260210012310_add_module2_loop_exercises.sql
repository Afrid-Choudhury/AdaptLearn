/*
  # Add Loop Exercises to Module 2

  1. New Lessons
    - `Try It: For Loop Patterns` (order_index 9, 250 XP)
    - `Try It: While Loop Countdown` (order_index 10, 250 XP)

  2. Security
    - No RLS changes needed
*/

INSERT INTO course_lessons (
  module_id, title, description, order_index, estimated_minutes,
  content_type, content_text, starter_code, solution_code, validation_rules, xp_reward
)
SELECT
  m.id,
  'Try It: For Loop Patterns',
  'Print number patterns using for loops',
  9, 25, 'exercise',
  '# Try It: For Loop Patterns

Practice using `for` loops to generate and print number sequences.

## Your Task

### Part 1: Count Up
Print the numbers 1 through 5, each on its own line.

### Part 2: Even Numbers
Print all **even** numbers from 2 to 10, each on its own line.

### Part 3: Sum
Calculate the **sum** of numbers from 1 to 10, then print `"Sum: 55"`.

## Expected Output

```
1
2
3
4
5
2
4
6
8
10
Sum: 55
```

## Hints

- Use `i += 2` to step by 2 in a for loop
- Declare a `sum` variable before the loop and add to it inside',
  'public class LoopPatterns {
    public static void main(String[] args) {
        // Part 1: Count from 1 to 5


        // Part 2: Even numbers from 2 to 10


        // Part 3: Sum of 1 to 10
        int sum = 0;


        System.out.println("Sum: " + sum);
    }
}',
  'public class LoopPatterns {
    public static void main(String[] args) {
        for (int i = 1; i <= 5; i++) {
            System.out.println(i);
        }

        for (int i = 2; i <= 10; i += 2) {
            System.out.println(i);
        }

        int sum = 0;
        for (int i = 1; i <= 10; i++) {
            sum += i;
        }
        System.out.println("Sum: " + sum);
    }
}',
  '{"mustContain":["for","int sum","System.out.println","Sum:"],"regexMatch":"for\\s*\\(.*int\\s+i","methodSignatureExists":"public\\s+static\\s+void\\s+main\\s*\\(\\s*String\\s*\\[\\s*\\]\\s*args\\s*\\)"}'::jsonb,
  250
FROM course_modules m
JOIN courses c ON m.course_id = c.id
WHERE c.title = 'Java Fundamentals for Beginners' AND m.order_index = 2
ON CONFLICT DO NOTHING;

INSERT INTO course_lessons (
  module_id, title, description, order_index, estimated_minutes,
  content_type, content_text, starter_code, solution_code, validation_rules, xp_reward
)
SELECT
  m.id,
  'Try It: While Loop Countdown',
  'Build a countdown timer using while and do-while loops',
  10, 20, 'exercise',
  '# Try It: While Loop Countdown

Practice using `while` and `do-while` loops to control program flow.

## Your Task

### Part 1: Countdown
Use a **while** loop to count down from 10 to 1, printing each number. After the loop, print `"Liftoff!"`.

### Part 2: Double It
Use a **do-while** loop that starts with `number` at 1 and doubles it each iteration. Stop when `number` exceeds 100. Print each value inside the loop.

## Expected Output

```
10
9
8
7
6
5
4
3
2
1
Liftoff!
1
2
4
8
16
32
64
128
```

## Hints

- A `while` loop checks its condition **before** each iteration
- A `do-while` loop checks its condition **after** each iteration
- Use `number *= 2` to double a value',
  'public class WhileLoops {
    public static void main(String[] args) {
        // Part 1: Countdown from 10 to 1
        int count = 10;



        System.out.println("Liftoff!");

        // Part 2: Double until over 100
        int number = 1;


    }
}',
  'public class WhileLoops {
    public static void main(String[] args) {
        int count = 10;
        while (count >= 1) {
            System.out.println(count);
            count--;
        }
        System.out.println("Liftoff!");

        int number = 1;
        do {
            System.out.println(number);
            number *= 2;
        } while (number <= 100);
    }
}',
  '{"mustContain":["while","int count","int number","Liftoff!","System.out.println"],"regexMatch":"do\\s*\\{","methodSignatureExists":"public\\s+static\\s+void\\s+main\\s*\\(\\s*String\\s*\\[\\s*\\]\\s*args\\s*\\)"}'::jsonb,
  250
FROM course_modules m
JOIN courses c ON m.course_id = c.id
WHERE c.title = 'Java Fundamentals for Beginners' AND m.order_index = 2
ON CONFLICT DO NOTHING;
