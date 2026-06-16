-- Add solution_code to beginner Module 2 exercises (Control Flow and Logic)

UPDATE course_lessons SET solution_code = 'public class GradeCalculator {
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
}'
WHERE id IN ('68376e57-a5d5-4b5c-9059-afb2dccea22b', 'd49f01a2-a5ce-4356-941d-a87248833e5c');

UPDATE course_lessons SET solution_code = 'public class DayPlanner {
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
                activity = "Deep work session";
                break;
            case "Thursday":
                activity = "Sprint planning";
                break;
            case "Friday":
                activity = "Demo and retrospective";
                break;
            case "Saturday":
            case "Sunday":
                activity = "Rest day";
                break;
            default:
                activity = "Unknown day";
                break;
        }

        System.out.println(day + ": " + activity);
    }
}'
WHERE id IN ('77f26ddd-68eb-47a7-92ee-1c5f4dfeadec', '7c495158-9a64-4b65-b6a9-32daa728bb30');

UPDATE course_lessons SET solution_code = 'public class LoopPatterns {
    public static void main(String[] args) {
        // Part 1: Count from 1 to 5
        for (int i = 1; i <= 5; i++) {
            System.out.println("Count: " + i);
        }

        // Part 2: Even numbers from 2 to 10
        for (int i = 2; i <= 10; i += 2) {
            System.out.println("Even: " + i);
        }

        // Part 3: Sum of 1 to 10
        int sum = 0;
        for (int i = 1; i <= 10; i++) {
            sum += i;
        }
        System.out.println("Sum: " + sum);
    }
}'
WHERE id IN ('c8755d1f-b2cd-464a-a2be-56375ceb9596', 'ea1d383d-d6e9-4043-b90b-b67218b09b6f');

UPDATE course_lessons SET solution_code = 'public class WhileLoops {
    public static void main(String[] args) {
        // Part 1: Countdown from 10 to 1
        int count = 10;
        while (count >= 1) {
            System.out.println(count);
            count--;
        }
        System.out.println("Liftoff!");

        // Part 2: Double until over 100
        int number = 1;
        do {
            System.out.println(number);
            number *= 2;
        } while (number <= 100);
    }
}'
WHERE id IN ('be9eb92e-d68d-4ab5-823a-9e87697404a0', 'a8576ac4-eb3c-4a6f-9d0b-23d5ac3e7236');