/*
  # Add Constructor and Encapsulation Exercises to Module 3

  1. New Lessons
    - `Try It: Build a Constructor` (order_index 9, 250 XP)
    - `Try It: Encapsulation Practice` (order_index 10, 300 XP)

  2. Security
    - No RLS changes needed
*/

INSERT INTO course_lessons (
  module_id, title, description, order_index, estimated_minutes,
  content_type, content_text, starter_code, solution_code, validation_rules, xp_reward
)
SELECT
  m.id,
  'Try It: Build a Constructor',
  'Create a class with constructors to initialize objects',
  9, 25, 'exercise',
  '# Try It: Build a Constructor

Practice writing constructors to initialize objects when they are created.

## Your Task

Create a `Student` class with:

1. **Fields**: `String name`, `int age`, `String major`

2. **Two constructors**:
   - A constructor that takes all three parameters: `name`, `age`, `major`
   - A constructor that takes only `name` and `age`, and sets `major` to `"Undeclared"`

3. **A method** `introduce()` that returns:
   `"Hi, I am <name>, age <age>, majoring in <major>"`

4. In `main`, create two students and print their introductions:
   - `Student("Alice", 20, "Computer Science")`
   - `Student("Bob", 19)` (should default to "Undeclared")

## Expected Output

```
Hi, I am Alice, age 20, majoring in Computer Science
Hi, I am Bob, age 19, majoring in Undeclared
```

## Hints

- Use `this.name = name` inside constructors to assign parameters to fields
- Constructor overloading means having multiple constructors with different parameter lists',
  'public class Student {
    String name;
    int age;
    String major;

    // Constructor with all three parameters


    // Constructor with name and age only (major defaults to "Undeclared")


    // introduce() method


    public static void main(String[] args) {
        // Create two students and print introductions

    }
}',
  'public class Student {
    String name;
    int age;
    String major;

    Student(String name, int age, String major) {
        this.name = name;
        this.age = age;
        this.major = major;
    }

    Student(String name, int age) {
        this.name = name;
        this.age = age;
        this.major = "Undeclared";
    }

    String introduce() {
        return "Hi, I am " + name + ", age " + age + ", majoring in " + major;
    }

    public static void main(String[] args) {
        Student s1 = new Student("Alice", 20, "Computer Science");
        Student s2 = new Student("Bob", 19);
        System.out.println(s1.introduce());
        System.out.println(s2.introduce());
    }
}',
  '{"mustContain":["this.name","this.age","String name","int age","String major","introduce","new Student","System.out.println","Undeclared"],"methodSignatureExists":"public\\s+static\\s+void\\s+main\\s*\\(\\s*String\\s*\\[\\s*\\]\\s*args\\s*\\)"}'::jsonb,
  250
FROM course_modules m
JOIN courses c ON m.course_id = c.id
WHERE c.title = 'Java Fundamentals for Beginners' AND m.order_index = 3
ON CONFLICT DO NOTHING;

INSERT INTO course_lessons (
  module_id, title, description, order_index, estimated_minutes,
  content_type, content_text, starter_code, solution_code, validation_rules, xp_reward
)
SELECT
  m.id,
  'Try It: Encapsulation Practice',
  'Apply encapsulation with private fields, getters, and setters',
  10, 30, 'exercise',
  '# Try It: Encapsulation Practice

Practice one of the core OOP principles: **encapsulation**. You will protect data using `private` fields and control access through getters and setters.

## Your Task

Create a `BankAccount` class with:

1. **Private fields**:
   - `private String owner`
   - `private double balance`

2. **A constructor** that takes `owner` and initial `balance`

3. **Getter methods**:
   - `getOwner()` returns the owner name
   - `getBalance()` returns the balance

4. **Methods**:
   - `deposit(double amount)` — adds to balance only if amount is positive
   - `withdraw(double amount)` — subtracts from balance only if amount is positive and does not exceed current balance

5. In `main`:
   - Create an account for `"Alice"` with balance `1000.0`
   - Deposit `500.0`
   - Withdraw `200.0`
   - Print: `"Alice''s balance: 1300.0"`

## Expected Output

```
Alice''s balance: 1300.0
```

## Hints

- Use `private` to hide fields from direct access
- Getters simply return the field value
- Always validate input in setters and modifier methods',
  'public class BankAccount {
    // Declare private fields


    // Constructor


    // Getter for owner


    // Getter for balance


    // deposit method


    // withdraw method


    public static void main(String[] args) {
        // Create account, deposit, withdraw, and print balance

    }
}',
  'public class BankAccount {
    private String owner;
    private double balance;

    BankAccount(String owner, double balance) {
        this.owner = owner;
        this.balance = balance;
    }

    String getOwner() {
        return owner;
    }

    double getBalance() {
        return balance;
    }

    void deposit(double amount) {
        if (amount > 0) {
            balance += amount;
        }
    }

    void withdraw(double amount) {
        if (amount > 0 && amount <= balance) {
            balance -= amount;
        }
    }

    public static void main(String[] args) {
        BankAccount account = new BankAccount("Alice", 1000.0);
        account.deposit(500.0);
        account.withdraw(200.0);
        System.out.println(account.getOwner() + "''s balance: " + account.getBalance());
    }
}',
  '{"mustContain":["private String owner","private double balance","getOwner","getBalance","deposit","withdraw","new BankAccount","System.out.println"],"regexMatch":"private\\s+(String|double)\\s+","methodSignatureExists":"public\\s+static\\s+void\\s+main\\s*\\(\\s*String\\s*\\[\\s*\\]\\s*args\\s*\\)"}'::jsonb,
  300
FROM course_modules m
JOIN courses c ON m.course_id = c.id
WHERE c.title = 'Java Fundamentals for Beginners' AND m.order_index = 3
ON CONFLICT DO NOTHING;
