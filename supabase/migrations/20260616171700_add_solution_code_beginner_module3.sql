-- Add solution_code to beginner Module 3 exercises (Object-Oriented Programming)

UPDATE course_lessons SET solution_code = 'public class Dog {
    String name;
    String breed;
    int age;

    public String bark() {
        return name + " says: Woof! Woof!";
    }

    public static void main(String[] args) {
        Dog myDog = new Dog();
        myDog.name = "Buddy";
        myDog.breed = "Golden Retriever";
        myDog.age = 3;

        System.out.println(myDog.bark());
        System.out.println(myDog.name + " is a " + myDog.breed + ", age " + myDog.age);
    }
}'
WHERE id = '9ca5c5bc-30d6-40be-b961-3825f61c7916';

UPDATE course_lessons SET solution_code = 'public class Calculator {
    public int add(int a, int b) {
        return a + b;
    }

    public int subtract(int a, int b) {
        return a - b;
    }

    public int multiply(int a, int b) {
        return a * b;
    }

    public double divide(int a, int b) {
        if (b == 0) {
            return 0;
        }
        return (double) a / b;
    }

    public static void main(String[] args) {
        Calculator calc = new Calculator();

        System.out.println("10 + 5 = " + calc.add(10, 5));
        System.out.println("10 - 5 = " + calc.subtract(10, 5));
        System.out.println("10 * 5 = " + calc.multiply(10, 5));
        System.out.println("10 / 3 = " + calc.divide(10, 3));
    }
}'
WHERE id = '39bd5e73-8d03-40ea-8578-b6d49ad934d4';

UPDATE course_lessons SET solution_code = 'public class Student {
    String name;
    int age;
    String major;

    public Student(String name, int age, String major) {
        this.name = name;
        this.age = age;
        this.major = major;
    }

    public Student(String name, int age) {
        this.name = name;
        this.age = age;
        this.major = "Undeclared";
    }

    public String introduce() {
        return "Hi, I am " + name + ", age " + age + ", majoring in " + major + ".";
    }

    public static void main(String[] args) {
        Student s1 = new Student("Alice", 20, "Computer Science");
        Student s2 = new Student("Bob", 19);

        System.out.println(s1.introduce());
        System.out.println(s2.introduce());
    }
}'
WHERE id = '32d7dc87-ba2e-4e68-b61d-390c289db9b9';

UPDATE course_lessons SET solution_code = 'public class BankAccount {
    private String owner;
    private double balance;

    public BankAccount(String owner, double initialBalance) {
        this.owner = owner;
        this.balance = initialBalance;
    }

    public String getOwner() {
        return owner;
    }

    public double getBalance() {
        return balance;
    }

    public void deposit(double amount) {
        if (amount > 0) {
            balance += amount;
            System.out.println("Deposited: $" + amount);
        }
    }

    public void withdraw(double amount) {
        if (amount > 0 && amount <= balance) {
            balance -= amount;
            System.out.println("Withdrew: $" + amount);
        } else {
            System.out.println("Insufficient funds.");
        }
    }

    public static void main(String[] args) {
        BankAccount account = new BankAccount("Alice", 1000.0);
        account.deposit(500.0);
        account.withdraw(200.0);
        System.out.println(account.getOwner() + " has $" + account.getBalance());
    }
}'
WHERE id = 'ac6495bd-1b55-42fd-b51f-995f1c94d3eb';