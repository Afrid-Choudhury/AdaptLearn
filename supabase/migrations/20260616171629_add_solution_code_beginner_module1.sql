-- Add solution_code to all beginner exercises (Module 1: Getting Started with Java)

UPDATE course_lessons SET solution_code = 'public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}'
WHERE id = '5b23ccb0-c095-4ad9-ae1e-924f95681b7e';

UPDATE course_lessons SET solution_code = 'public class Main {
    public static void main(String[] args) {
        int age = 25;
        double price = 19.99;
        String name = "Alice";
        boolean isActive = true;

        System.out.println("Name: " + name);
        System.out.println("Age: " + age);
        System.out.println("Price: " + price);
        System.out.println("Active: " + isActive);
    }
}'
WHERE id = '7df33b5b-ea93-492d-8c9a-2f980288c3de';

UPDATE course_lessons SET solution_code = 'public class Main {
    public static void main(String[] args) {
        int x = 10;
        int y = 5;

        int sum = x + y;
        int difference = x - y;
        int product = x * y;
        int quotient = x / y;

        System.out.println("Sum: " + sum);
        System.out.println("Difference: " + difference);
        System.out.println("Product: " + product);
        System.out.println("Quotient: " + quotient);
    }
}'
WHERE id = 'fb2ebafd-e8c7-48b9-a56a-99042202c9f4';

UPDATE course_lessons SET solution_code = 'public class Main {
    public static void main(String[] args) {
        String firstName = "John";
        String lastName = "Doe";
        String fullName = firstName + " " + lastName;
        int age = 30;
        String message = "My name is " + fullName + " and I am " + age + " years old.";

        System.out.println(message);
    }
}'
WHERE id = 'f37ef50c-d8e2-4bb5-a99f-6e90f40f8fc0';

UPDATE course_lessons SET solution_code = 'public class Main {
    public static void main(String[] args) {
        double largeNumber = 9.78;
        int smallNumber = (int) largeNumber;
        System.out.println("Double to int: " + largeNumber + " -> " + smallNumber);

        int wholeNumber = 42;
        double decimalNumber = (double) wholeNumber;
        System.out.println("Int to double: " + wholeNumber + " -> " + decimalNumber);
    }
}'
WHERE id = 'cc9b1972-f15c-43d0-914d-50c9693ced06';

UPDATE course_lessons SET solution_code = 'public class StringOperations {
    public static void main(String[] args) {
        String firstName = "John";
        String lastName = "Doe";
        String fullName = firstName + " " + lastName;

        System.out.println("Full name: " + fullName);
        System.out.println("Length: " + fullName.length());
        System.out.println("Uppercase: " + fullName.toUpperCase());
    }
}'
WHERE id = 'b49b1374-219d-4c00-b38a-79cc9c424348';

UPDATE course_lessons SET solution_code = 'public class Main {
    public static void main(String[] args) {
        int count = 10;
        double temperature = 98.6;
        String greeting = "Hello, Java!";
        boolean isLearning = true;

        System.out.println(count);
        System.out.println(temperature);
        System.out.println(greeting);
        System.out.println(isLearning);
    }
}'
WHERE id = '399d525b-ff9c-42c2-90c9-364cdbd99d75';