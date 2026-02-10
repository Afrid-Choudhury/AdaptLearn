/*
  # Add If-Else and Switch Exercises to Module 2

  1. New Lessons
    - `Try It: If-Else Grading System` (order_index 7, 200 XP)
    - `Try It: Switch Day Planner` (order_index 8, 200 XP)

  2. Security
    - No RLS changes needed
*/

INSERT INTO course_lessons (
  module_id, title, description, order_index, estimated_minutes,
  content_type, content_text, starter_code, solution_code, validation_rules, xp_reward
)
SELECT
  m.id,
  'Try It: If-Else Grading System',
  'Build a grade calculator using if-else statements',
  7, 20, 'exercise',
  '# Try It: If-Else Grading System

Time to put your if-else knowledge to work! You will build a simple grade calculator.

## Your Task

Write a program that assigns a letter grade based on a numeric score:

1. Declare an `int` variable called `score` and set it to `85`
2. Declare a `String` variable called `grade`
3. Use **if-else if-else** statements to assign the grade:
   - 90 and above: `"A"`
   - 80 to 89: `"B"`
   - 70 to 79: `"C"`
   - 60 to 69: `"D"`
   - Below 60: `"F"`
4. Print the result: `"Score: 85 - Grade: B"`

## Hints

- Remember to check conditions from highest to lowest
- Use `>=` for range comparisons',
  'public class GradeCalculator {
    public static void main(String[] args) {
        int score = 85;
        String grade;

        // Write your if-else statements here


        // Print the result
        System.out.println("Score: " + score + " - Grade: " + grade);
    }
}',
  'public class GradeCalculator {
    public static void main(String[] args) {
        int score = 85;
        String grade;

        if (score >= 90) {
            grade = "A";
        } else if (score >= 80) {
            grade = "B";
        } else if (score >= 70) {
            grade = "C";
        } else if (score >= 60) {
            grade = "D";
        } else {
            grade = "F";
        }

        System.out.println("Score: " + score + " - Grade: " + grade);
    }
}',
  '{"mustContain":["int score","String grade","if","else","System.out.println"],"regexMatch":"if\\s*\\(.*score.*\\)","methodSignatureExists":"public\\s+static\\s+void\\s+main\\s*\\(\\s*String\\s*\\[\\s*\\]\\s*args\\s*\\)"}'::jsonb,
  200
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
  'Try It: Switch Day Planner',
  'Use switch statements to map days to activities',
  8, 20, 'exercise',
  '# Try It: Switch Day Planner

Practice using `switch` statements by building a day planner that suggests an activity for each day.

## Your Task

1. Declare a `String` variable called `day` set to `"Wednesday"`
2. Declare a `String` variable called `activity`
3. Use a **switch** statement on `day` to assign activities:
   - `"Monday"` assigns `"Team meeting"`
   - `"Tuesday"` assigns `"Code review"`
   - `"Wednesday"` assigns `"Deep work"`
   - `"Thursday"` assigns `"Testing"`
   - `"Friday"` assigns `"Deployment"`
   - `default` assigns `"Rest day"`
4. Print: `"Wednesday: Deep work"`

## Hints

- Do not forget the `break` statement after each case
- The `default` case catches anything not matched',
  'public class DayPlanner {
    public static void main(String[] args) {
        String day = "Wednesday";
        String activity;

        // Write your switch statement here


        // Print the result
        System.out.println(day + ": " + activity);
    }
}',
  'public class DayPlanner {
    public static void main(String[] args) {
        String day = "Wednesday";
        String activity;

        switch (day) {
            case "Monday":
                activity = "Team meeting";
                break;
            case "Tuesday":
                activity = "Code review";
                break;
            case "Wednesday":
                activity = "Deep work";
                break;
            case "Thursday":
                activity = "Testing";
                break;
            case "Friday":
                activity = "Deployment";
                break;
            default:
                activity = "Rest day";
                break;
        }

        System.out.println(day + ": " + activity);
    }
}',
  '{"mustContain":["switch","case","break","default","String day","String activity","System.out.println"],"regexMatch":"switch\\s*\\(\\s*day\\s*\\)","methodSignatureExists":"public\\s+static\\s+void\\s+main\\s*\\(\\s*String\\s*\\[\\s*\\]\\s*args\\s*\\)"}'::jsonb,
  200
FROM course_modules m
JOIN courses c ON m.course_id = c.id
WHERE c.title = 'Java Fundamentals for Beginners' AND m.order_index = 2
ON CONFLICT DO NOTHING;
