/*
  # Add Module 3: OOP Basics Lessons Part 1

  ## Overview
  Creates first 3 lessons for Module 3 covering OOP fundamentals.

  ## Lessons
  1. Classes and Objects (50 min)
  2. Methods and Parameters (50 min)
  3. Constructors (45 min)
*/

-- Lesson 1: Classes and Objects
INSERT INTO course_lessons (module_id, title, description, order_index, estimated_minutes, content_type, content_text)
SELECT
  id,
  'Classes and Objects',
  'Learn the fundamentals of object-oriented programming with classes and objects.',
  1,
  50,
  'video',
  '# Classes and Objects

Object-Oriented Programming (OOP) is a programming paradigm based on the concept of "objects" which contain data and code. Classes are blueprints for creating objects.

## What is a Class?

A class is a template that defines the structure and behavior of objects.

**Syntax:**
```java
public class ClassName {
    // Fields (variables)
    // Methods (functions)
}
```

## Creating Your First Class

```java
public class Dog {
    // Fields (attributes)
    String name;
    int age;
    String breed;
}
```

## What is an Object?

An object is an instance of a class. It is a concrete entity created from the class blueprint.

## Creating Objects

```java
public class Main {
    public static void main(String[] args) {
        // Create an object
        Dog myDog = new Dog();
        
        // Set field values
        myDog.name = "Buddy";
        myDog.age = 3;
        myDog.breed = "Golden Retriever";
        
        // Access field values
        System.out.println("Name: " + myDog.name);
        System.out.println("Age: " + myDog.age);
        System.out.println("Breed: " + myDog.breed);
    }
}
```

## Multiple Objects

You can create multiple objects from the same class:

```java
Dog dog1 = new Dog();
dog1.name = "Buddy";
dog1.age = 3;

Dog dog2 = new Dog();
dog2.name = "Max";
dog2.age = 5;

System.out.println(dog1.name);  // Buddy
System.out.println(dog2.name);  // Max
```

## Adding Methods to Classes

Methods define what objects can do:

```java
public class Dog {
    String name;
    int age;
    
    void bark() {
        System.out.println(name + " says: Woof!");
    }
    
    void celebrate() {
        System.out.println(name + " is " + age + " years old!");
    }
}

// Using the methods
Dog myDog = new Dog();
myDog.name = "Buddy";
myDog.age = 3;
myDog.bark();        // Buddy says: Woof!
myDog.celebrate();   // Buddy is 3 years old!
```

## Practical Example: Person Class

```java
public class Person {
    // Fields
    String firstName;
    String lastName;
    int age;
    
    // Methods
    void introduce() {
        System.out.println("Hi, I am " + firstName + " " + lastName);
        System.out.println("I am " + age + " years old");
    }
    
    void haveBirthday() {
        age++;
        System.out.println("Happy birthday! Now " + age);
    }
}

// Using the Person class
public class Main {
    public static void main(String[] args) {
        Person person1 = new Person();
        person1.firstName = "John";
        person1.lastName = "Smith";
        person1.age = 25;
        
        person1.introduce();
        person1.haveBirthday();
    }
}
```

## Class Structure

```java
public class ClassName {
    // 1. Fields (attributes/properties)
    dataType fieldName;
    
    // 2. Constructors (special methods for creating objects)
    // We will learn about these in the next lesson
    
    // 3. Methods (behaviors/functions)
    returnType methodName() {
        // Method body
    }
}
```

## Practical Example: BankAccount

```java
public class BankAccount {
    String accountNumber;
    String ownerName;
    double balance;
    
    void deposit(double amount) {
        balance += amount;
        System.out.println("Deposited: $" + amount);
        System.out.println("New balance: $" + balance);
    }
    
    void withdraw(double amount) {
        if (amount <= balance) {
            balance -= amount;
            System.out.println("Withdrew: $" + amount);
        } else {
            System.out.println("Insufficient funds");
        }
    }
    
    void displayInfo() {
        System.out.println("Account: " + accountNumber);
        System.out.println("Owner: " + ownerName);
        System.out.println("Balance: $" + balance);
    }
}

// Using BankAccount
public class Main {
    public static void main(String[] args) {
        BankAccount account = new BankAccount();
        account.accountNumber = "123456";
        account.ownerName = "Alice Johnson";
        account.balance = 1000.0;
        
        account.displayInfo();
        account.deposit(500);
        account.withdraw(200);
        account.displayInfo();
    }
}
```

## The this Keyword

`this` refers to the current object:

```java
public class Person {
    String name;
    
    void setName(String name) {
        this.name = name;  // this.name refers to field
    }
}
```

## Benefits of OOP

✓ **Modularity**: Code is organized into reusable units
✓ **Reusability**: Classes can be reused across projects
✓ **Maintainability**: Easier to update and fix code
✓ **Abstraction**: Hide complex details, show only essentials

## Key Takeaways

✓ Classes are blueprints for objects
✓ Objects are instances of classes
✓ Fields store object data
✓ Methods define object behavior
✓ Use `new` keyword to create objects
✓ Multiple objects can exist from one class

In the next lesson, you will learn more about methods and parameters!'
FROM course_modules
WHERE title = 'Object-Oriented Programming Basics'
  AND course_id = (SELECT id FROM courses WHERE title = 'Java Fundamentals for Beginners')
ON CONFLICT DO NOTHING;
