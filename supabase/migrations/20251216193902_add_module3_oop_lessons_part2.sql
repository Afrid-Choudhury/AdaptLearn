/*
  # Add Module 3: OOP Lessons Part 2

  ## Overview
  Adds lessons 2-3 for Module 3.

  ## Lessons
  - Methods and Parameters
  - Constructors
*/

-- Lesson 2: Methods and Parameters
INSERT INTO course_lessons (module_id, title, description, order_index, estimated_minutes, content_type, content_text)
SELECT
  id,
  'Methods and Parameters',
  'Master methods with parameters and return values for powerful object behavior.',
  2,
  50,
  'reading',
  '# Methods and Parameters

Methods are functions that belong to a class. They define what objects can do. Parameters allow you to pass data to methods.

## Method Syntax

```java
accessModifier returnType methodName(parameters) {
    // Method body
    return value;  // if returnType is not void
}
```

## Methods Without Parameters

```java
public class Calculator {
    void sayHello() {
        System.out.println("Hello!");
    }
}

// Usage
Calculator calc = new Calculator();
calc.sayHello();  // Hello!
```

## Methods With Parameters

```java
public class Calculator {
    void greet(String name) {
        System.out.println("Hello, " + name + "!");
    }
}

// Usage
Calculator calc = new Calculator();
calc.greet("Alice");  // Hello, Alice!
```

## Multiple Parameters

```java
public class Calculator {
    void add(int a, int b) {
        int sum = a + b;
        System.out.println(a + " + " + b + " = " + sum);
    }
}

// Usage
Calculator calc = new Calculator();
calc.add(5, 3);  // 5 + 3 = 8
```

## Return Values

Methods can return values:

```java
public class Calculator {
    int add(int a, int b) {
        return a + b;
    }
    
    double divide(double a, double b) {
        return a / b;
    }
    
    boolean isEven(int number) {
        return number % 2 == 0;
    }
}

// Usage
Calculator calc = new Calculator();
int result = calc.add(5, 3);
System.out.println("Result: " + result);  // 8

double quotient = calc.divide(10, 3);
System.out.println("Quotient: " + quotient);  // 3.333...

boolean even = calc.isEven(4);
System.out.println("Is 4 even? " + even);  // true
```

## Practical Example: Rectangle Class

```java
public class Rectangle {
    double length;
    double width;
    
    double calculateArea() {
        return length * width;
    }
    
    double calculatePerimeter() {
        return 2 * (length + width);
    }
    
    boolean isSquare() {
        return length == width;
    }
    
    void scale(double factor) {
        length *= factor;
        width *= factor;
    }
}

// Usage
Rectangle rect = new Rectangle();
rect.length = 5.0;
rect.width = 3.0;

System.out.println("Area: " + rect.calculateArea());
System.out.println("Perimeter: " + rect.calculatePerimeter());
System.out.println("Is square? " + rect.isSquare());

rect.scale(2);
System.out.println("New area: " + rect.calculateArea());
```

## Method Overloading

Same method name, different parameters:

```java
public class Calculator {
    int add(int a, int b) {
        return a + b;
    }
    
    double add(double a, double b) {
        return a + b;
    }
    
    int add(int a, int b, int c) {
        return a + b + c;
    }
}

// Usage
Calculator calc = new Calculator();
System.out.println(calc.add(2, 3));           // 5
System.out.println(calc.add(2.5, 3.7));       // 6.2
System.out.println(calc.add(1, 2, 3));        // 6
```

## Pass by Value

Java passes parameters by value (copies):

```java
public class Example {
    void changeValue(int x) {
        x = 100;
    }
    
    void changeObject(Rectangle r) {
        r.length = 10;
    }
}

// Primitives
int num = 5;
example.changeValue(num);
System.out.println(num);  // Still 5

// Objects (reference is copied)
Rectangle rect = new Rectangle();
rect.length = 5;
example.changeObject(rect);
System.out.println(rect.length);  // Now 10
```

## Practical Example: Student Class

```java
public class Student {
    String name;
    int[] scores;
    
    double calculateAverage() {
        if (scores == null || scores.length == 0) {
            return 0;
        }
        
        int sum = 0;
        for (int score : scores) {
            sum += score;
        }
        return (double) sum / scores.length;
    }
    
    char getLetterGrade() {
        double avg = calculateAverage();
        
        if (avg >= 90) return ''A'';
        if (avg >= 80) return ''B'';
        if (avg >= 70) return ''C'';
        if (avg >= 60) return ''D'';
        return ''F'';
    }
    
    void displayReport() {
        System.out.println("Student: " + name);
        System.out.println("Average: " + calculateAverage());
        System.out.println("Grade: " + getLetterGrade());
    }
}

// Usage
Student student = new Student();
student.name = "Alice";
student.scores = new int[]{85, 90, 88, 92};
student.displayReport();
```

## Return Multiple Values

Use arrays or objects to return multiple values:

```java
public class MathOperations {
    int[] divideWithRemainder(int dividend, int divisor) {
        int quotient = dividend / divisor;
        int remainder = dividend % divisor;
        return new int[]{quotient, remainder};
    }
}

// Usage
MathOperations math = new MathOperations();
int[] result = math.divideWithRemainder(17, 5);
System.out.println("Quotient: " + result[0]);   // 3
System.out.println("Remainder: " + result[1]);  // 2
```

## Key Takeaways

✓ Methods define object behavior
✓ Parameters pass data to methods
✓ Return types specify what methods give back
✓ Method overloading allows same name, different parameters
✓ Java passes parameters by value
✓ Use descriptive method names (verbs)'
FROM course_modules
WHERE title = 'Object-Oriented Programming Basics'
  AND course_id = (SELECT id FROM courses WHERE title = 'Java Fundamentals for Beginners')
ON CONFLICT DO NOTHING;

-- Lesson 3: Constructors
INSERT INTO course_lessons (module_id, title, description, order_index, estimated_minutes, content_type, content_text)
SELECT
  id,
  'Constructors',
  'Learn how constructors initialize objects when they are created.',
  3,
  45,
  'video',
  '# Constructors

Constructors are special methods that initialize objects when they are created. They have the same name as the class and no return type.

## Default Constructor

If you do not write a constructor, Java provides one:

```java
public class Dog {
    String name;
    int age;
}

// Java provides this automatically:
// public Dog() { }

Dog myDog = new Dog();  // Uses default constructor
```

## Creating Your Own Constructor

```java
public class Dog {
    String name;
    int age;
    
    // Constructor
    public Dog(String dogName, int dogAge) {
        name = dogName;
        age = dogAge;
    }
}

// Usage
Dog myDog = new Dog("Buddy", 3);
System.out.println(myDog.name);  // Buddy
System.out.println(myDog.age);   // 3
```

## Using this Keyword

```java
public class Dog {
    String name;
    int age;
    
    public Dog(String name, int age) {
        this.name = name;  // this refers to field
        this.age = age;
    }
}
```

## Multiple Constructors (Overloading)

```java
public class Person {
    String name;
    int age;
    String city;
    
    // Constructor 1
    public Person(String name) {
        this.name = name;
        this.age = 0;
        this.city = "Unknown";
    }
    
    // Constructor 2
    public Person(String name, int age) {
        this.name = name;
        this.age = age;
        this.city = "Unknown";
    }
    
    // Constructor 3
    public Person(String name, int age, String city) {
        this.name = name;
        this.age = age;
        this.city = city;
    }
}

// Usage
Person p1 = new Person("Alice");
Person p2 = new Person("Bob", 30);
Person p3 = new Person("Charlie", 25, "New York");
```

## Constructor Chaining

Call one constructor from another:

```java
public class Person {
    String name;
    int age;
    String city;
    
    public Person(String name) {
        this(name, 0);  // Call 2-parameter constructor
    }
    
    public Person(String name, int age) {
        this(name, age, "Unknown");  // Call 3-parameter constructor
    }
    
    public Person(String name, int age, String city) {
        this.name = name;
        this.age = age;
        this.city = city;
    }
}
```

## Practical Example: BankAccount

```java
public class BankAccount {
    String accountNumber;
    String ownerName;
    double balance;
    
    // Constructor
    public BankAccount(String accountNumber, String ownerName, double initialBalance) {
        this.accountNumber = accountNumber;
        this.ownerName = ownerName;
        this.balance = initialBalance;
    }
    
    // Overloaded constructor
    public BankAccount(String accountNumber, String ownerName) {
        this(accountNumber, ownerName, 0.0);
    }
    
    void displayInfo() {
        System.out.println("Account: " + accountNumber);
        System.out.println("Owner: " + ownerName);
        System.out.println("Balance: $" + balance);
    }
}

// Usage
BankAccount account1 = new BankAccount("12345", "Alice", 1000);
BankAccount account2 = new BankAccount("67890", "Bob");

account1.displayInfo();
account2.displayInfo();
```

## Why Use Constructors?

✓ **Initialize fields**: Set initial values when object is created
✓ **Ensure validity**: Make sure objects start in valid state
✓ **Convenience**: Create ready-to-use objects
✓ **Required values**: Force users to provide necessary data

## Common Mistakes

❌ Adding return type to constructor
```java
public void Person(String name) {  // Wrong!
```

❌ Wrong constructor name
```java
public person(String name) {  // Wrong! Must match class name
```

## Key Takeaways

✓ Constructors initialize objects
✓ Same name as class, no return type
✓ Called automatically with `new`
✓ Can have multiple constructors (overloading)
✓ Use `this()` for constructor chaining
✓ Constructors ensure objects start in valid state'
FROM course_modules
WHERE title = 'Object-Oriented Programming Basics'
  AND course_id = (SELECT id FROM courses WHERE title = 'Java Fundamentals for Beginners')
ON CONFLICT DO NOTHING;
