/*
  # Complete Module 3: OOP Lessons

  ## Overview
  Adds final 3 lessons for Module 3 completing the OOP basics.

  ## Lessons
  - Encapsulation and Access Modifiers
  - Getters and Setters
  - OOP Practice
*/

-- Lesson 4: Encapsulation
INSERT INTO course_lessons (module_id, title, description, order_index, estimated_minutes, content_type, content_text)
SELECT
  id,
  'Encapsulation and Access Modifiers',
  'Protect your data with encapsulation and access modifiers.',
  4,
  40,
  'reading',
  '# Encapsulation and Access Modifiers

Encapsulation is the practice of hiding internal details and providing controlled access to object data. Access modifiers control who can access fields and methods.

## Access Modifiers

Java has four access modifiers:

### 1. public
Accessible from anywhere:

```java
public class Person {
    public String name;  // Anyone can access
}

Person p = new Person();
p.name = "Alice";  // OK
```

### 2. private
Only accessible within the same class:

```java
public class BankAccount {
    private double balance;  // Hidden from outside
    
    public void deposit(double amount) {
        balance += amount;  // OK inside class
    }
}

BankAccount account = new BankAccount();
// account.balance = 1000;  // Error: balance is private
```

### 3. protected
Accessible within same package and subclasses

### 4. default (no modifier)
Accessible within same package

## Why Encapsulation?

### Problem Without Encapsulation

```java
public class BankAccount {
    public double balance;
}

BankAccount account = new BankAccount();
account.balance = 1000;
account.balance = -500;  // Invalid! But nothing stops this
```

### Solution With Encapsulation

```java
public class BankAccount {
    private double balance;
    
    public void deposit(double amount) {
        if (amount > 0) {
            balance += amount;
        }
    }
    
    public boolean withdraw(double amount) {
        if (amount > 0 && amount <= balance) {
            balance -= amount;
            return true;
        }
        return false;
    }
    
    public double getBalance() {
        return balance;
    }
}

// Usage
BankAccount account = new BankAccount();
account.deposit(1000);
// account.balance = -500;  // Error: cannot access private field
System.out.println(account.getBalance());  // 1000
```

## Practical Example: Person Class

```java
public class Person {
    private String name;
    private int age;
    private String email;
    
    public Person(String name, int age, String email) {
        this.name = name;
        setAge(age);      // Use setter for validation
        setEmail(email);
    }
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        if (name != null && !name.trim().isEmpty()) {
            this.name = name;
        }
    }
    
    public int getAge() {
        return age;
    }
    
    public void setAge(int age) {
        if (age >= 0 && age <= 150) {
            this.age = age;
        }
    }
    
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        if (email != null && email.contains("@")) {
            this.email = email;
        }
    }
}
```

## Benefits of Encapsulation

✓ **Data Protection**: Prevent invalid data
✓ **Flexibility**: Change internal implementation without affecting users
✓ **Control**: Decide what can be modified
✓ **Validation**: Ensure data integrity

## Best Practices

1. **Make fields private**
```java
private String name;
private int age;
```

2. **Provide public methods for access**
```java
public String getName() { return name; }
public void setName(String name) { this.name = name; }
```

3. **Validate in setters**
```java
public void setAge(int age) {
    if (age >= 0) {
        this.age = age;
    }
}
```

4. **Make classes as restrictive as possible**

## Practical Example: Rectangle

```java
public class Rectangle {
    private double length;
    private double width;
    
    public Rectangle(double length, double width) {
        setLength(length);
        setWidth(width);
    }
    
    public double getLength() {
        return length;
    }
    
    public void setLength(double length) {
        if (length > 0) {
            this.length = length;
        }
    }
    
    public double getWidth() {
        return width;
    }
    
    public void setWidth(double width) {
        if (width > 0) {
            this.width = width;
        }
    }
    
    public double calculateArea() {
        return length * width;
    }
}
```

## Read-Only Properties

Make fields readable but not writable:

```java
public class Product {
    private String id;
    private String name;
    private double price;
    
    public Product(String id, String name, double price) {
        this.id = id;
        this.name = name;
        this.price = price;
    }
    
    // Only getter, no setter - read-only
    public String getId() {
        return id;
    }
    
    public String getName() {
        return name;
    }
    
    // Price can be changed
    public double getPrice() {
        return price;
    }
    
    public void setPrice(double price) {
        if (price > 0) {
            this.price = price;
        }
    }
}
```

## Key Takeaways

✓ Encapsulation hides internal details
✓ Use private for fields, public for methods
✓ Provide getters and setters for controlled access
✓ Validate data in setters
✓ Encapsulation makes code more maintainable'
FROM course_modules
WHERE title = 'Object-Oriented Programming Basics'
  AND course_id = (SELECT id FROM courses WHERE title = 'Java Fundamentals for Beginners')
ON CONFLICT DO NOTHING;
