/*
  # Finalize Module 3 Lessons

  ## Overview
  Adds the final 2 lessons for Module 3.

  ## Lessons
  - Getters and Setters Best Practices
  - OOP Practice Exercises
*/

-- Lesson 5: Getters and Setters
INSERT INTO course_lessons (module_id, title, description, order_index, estimated_minutes, content_type, content_text)
SELECT
  id,
  'Getters and Setters',
  'Master getters and setters for controlled data access.',
  5,
  35,
  'video',
  '# Getters and Setters

Getters and setters are methods that provide controlled access to private fields. They are essential for proper encapsulation.

## What are Getters and Setters?

**Getter**: Returns the value of a private field
**Setter**: Sets the value of a private field (with validation)

## Basic Example

```java
public class Student {
    private String name;
    private int age;
    
    // Getter for name
    public String getName() {
        return name;
    }
    
    // Setter for name
    public void setName(String name) {
        this.name = name;
    }
    
    // Getter for age
    public int getAge() {
        return age;
    }
    
    // Setter for age
    public void setAge(int age) {
        this.age = age;
    }
}

// Usage
Student student = new Student();
student.setName("Alice");
student.setAge(20);

System.out.println(student.getName());  // Alice
System.out.println(student.getAge());   // 20
```

## Why Use Getters and Setters?

### 1. Data Validation

```java
public class Person {
    private int age;
    
    public void setAge(int age) {
        if (age >= 0 && age <= 150) {
            this.age = age;
        } else {
            System.out.println("Invalid age!");
        }
    }
}

Person person = new Person();
person.setAge(25);    // OK
person.setAge(-5);    // Rejected
person.setAge(200);   // Rejected
```

### 2. Read-Only Fields

```java
public class Circle {
    private double radius;
    private final double PI = 3.14159;
    
    public double getPI() {
        return PI;  // Read-only, no setter
    }
    
    public double getRadius() {
        return radius;
    }
    
    public void setRadius(double radius) {
        if (radius > 0) {
            this.radius = radius;
        }
    }
}
```

### 3. Computed Properties

```java
public class Rectangle {
    private double length;
    private double width;
    
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
    
    // Computed property
    public double getArea() {
        return length * width;
    }
    
    // Computed property
    public double getPerimeter() {
        return 2 * (length + width);
    }
}
```

## Naming Conventions

Follow JavaBeans naming convention:

- **Getter**: `get` + FieldName (camelCase)
- **Setter**: `set` + FieldName (camelCase)
- **Boolean getter**: `is` + FieldName

```java
public class User {
    private String username;
    private boolean active;
    
    public String getUsername() {
        return username;
    }
    
    public void setUsername(String username) {
        this.username = username;
    }
    
    // Boolean getter uses "is"
    public boolean isActive() {
        return active;
    }
    
    public void setActive(boolean active) {
        this.active = active;
    }
}
```

## Practical Example: Email Validation

```java
public class User {
    private String email;
    
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        if (email != null && email.contains("@") && email.contains(".")) {
            this.email = email;
        } else {
            System.out.println("Invalid email format");
        }
    }
}

// Usage
User user = new User();
user.setEmail("alice@example.com");  // OK
user.setEmail("invalid");            // Rejected
```

## Practical Example: Temperature

```java
public class Temperature {
    private double celsius;
    
    public double getCelsius() {
        return celsius;
    }
    
    public void setCelsius(double celsius) {
        this.celsius = celsius;
    }
    
    // Computed property
    public double getFahrenheit() {
        return (celsius * 9.0 / 5.0) + 32.0;
    }
    
    // Set using fahrenheit
    public void setFahrenheit(double fahrenheit) {
        this.celsius = (fahrenheit - 32.0) * 5.0 / 9.0;
    }
}

// Usage
Temperature temp = new Temperature();
temp.setCelsius(25);
System.out.println("Celsius: " + temp.getCelsius());
System.out.println("Fahrenheit: " + temp.getFahrenheit());

temp.setFahrenheit(100);
System.out.println("Celsius: " + temp.getCelsius());
```

## Chain Setters (Fluent Interface)

Return `this` for method chaining:

```java
public class Person {
    private String name;
    private int age;
    private String city;
    
    public Person setName(String name) {
        this.name = name;
        return this;
    }
    
    public Person setAge(int age) {
        this.age = age;
        return this;
    }
    
    public Person setCity(String city) {
        this.city = city;
        return this;
    }
}

// Usage - method chaining
Person person = new Person()
    .setName("Alice")
    .setAge(25)
    .setCity("New York");
```

## When NOT to Use Getters/Setters

Sometimes direct access is OK:
- Private inner classes
- Data transfer objects (DTOs)
- When no validation needed and you trust the code

## Best Practices

✓ Always make fields private
✓ Provide getters for fields that need to be read
✓ Provide setters for fields that need to be modified
✓ Add validation in setters
✓ Consider read-only properties (getter only)
✓ Use descriptive names
✓ Return `this` for method chaining when appropriate

## Key Takeaways

✓ Getters return field values
✓ Setters modify field values with validation
✓ Follow naming conventions (get/set/is)
✓ Validate data in setters
✓ Computed properties use getters only
✓ Getters and setters enable encapsulation'
FROM course_modules
WHERE title = 'Object-Oriented Programming Basics'
  AND course_id = (SELECT id FROM courses WHERE title = 'Java Fundamentals for Beginners')
ON CONFLICT DO NOTHING;

-- Lesson 6: OOP Practice
INSERT INTO course_lessons (module_id, title, description, order_index, estimated_minutes, content_type, content_text)
SELECT
  id,
  'OOP Practice Exercises',
  'Apply everything you have learned with comprehensive OOP exercises.',
  6,
  50,
  'quiz',
  '# OOP Practice Exercises

Put your OOP knowledge to the test with these comprehensive exercises!

## Exercise 1: Book Class

Create a Book class with proper encapsulation:

```java
public class Book {
    private String title;
    private String author;
    private int pages;
    private double price;
    
    public Book(String title, String author, int pages, double price) {
        this.title = title;
        this.author = author;
        setPages(pages);
        setPrice(price);
    }
    
    public String getTitle() {
        return title;
    }
    
    public void setTitle(String title) {
        if (title != null && !title.trim().isEmpty()) {
            this.title = title;
        }
    }
    
    public String getAuthor() {
        return author;
    }
    
    public void setAuthor(String author) {
        if (author != null && !author.trim().isEmpty()) {
            this.author = author;
        }
    }
    
    public int getPages() {
        return pages;
    }
    
    public void setPages(int pages) {
        if (pages > 0) {
            this.pages = pages;
        }
    }
    
    public double getPrice() {
        return price;
    }
    
    public void setPrice(double price) {
        if (price >= 0) {
            this.price = price;
        }
    }
    
    public void displayInfo() {
        System.out.println("Title: " + title);
        System.out.println("Author: " + author);
        System.out.println("Pages: " + pages);
        System.out.println("Price: $" + price);
    }
}

// Usage
Book book = new Book("Java Programming", "John Doe", 500, 49.99);
book.displayInfo();
```

## Exercise 2: Shopping Cart

Create a ShoppingCart system:

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
    
    public String getId() {
        return id;
    }
    
    public String getName() {
        return name;
    }
    
    public double getPrice() {
        return price;
    }
}

public class CartItem {
    private Product product;
    private int quantity;
    
    public CartItem(Product product, int quantity) {
        this.product = product;
        this.quantity = quantity;
    }
    
    public double getSubtotal() {
        return product.getPrice() * quantity;
    }
    
    public void displayItem() {
        System.out.println(product.getName() + " x " + quantity + 
                          " = $" + getSubtotal());
    }
}

public class ShoppingCart {
    private CartItem[] items;
    private int itemCount;
    
    public ShoppingCart(int maxItems) {
        items = new CartItem[maxItems];
        itemCount = 0;
    }
    
    public void addItem(CartItem item) {
        if (itemCount < items.length) {
            items[itemCount] = item;
            itemCount++;
        }
    }
    
    public double getTotal() {
        double total = 0;
        for (int i = 0; i < itemCount; i++) {
            total += items[i].getSubtotal();
        }
        return total;
    }
    
    public void displayCart() {
        System.out.println("=== Shopping Cart ===");
        for (int i = 0; i < itemCount; i++) {
            items[i].displayItem();
        }
        System.out.println("Total: $" + getTotal());
    }
}

// Usage
Product p1 = new Product("001", "Laptop", 999.99);
Product p2 = new Product("002", "Mouse", 29.99);

ShoppingCart cart = new ShoppingCart(10);
cart.addItem(new CartItem(p1, 1));
cart.addItem(new CartItem(p2, 2));
cart.displayCart();
```

## Exercise 3: Bank Account System

```java
public class BankAccount {
    private String accountNumber;
    private String ownerName;
    private double balance;
    private int transactionCount;
    
    public BankAccount(String accountNumber, String ownerName) {
        this.accountNumber = accountNumber;
        this.ownerName = ownerName;
        this.balance = 0;
        this.transactionCount = 0;
    }
    
    public void deposit(double amount) {
        if (amount > 0) {
            balance += amount;
            transactionCount++;
            System.out.println("Deposited: $" + amount);
        }
    }
    
    public boolean withdraw(double amount) {
        if (amount > 0 && amount <= balance) {
            balance -= amount;
            transactionCount++;
            System.out.println("Withdrew: $" + amount);
            return true;
        }
        System.out.println("Insufficient funds");
        return false;
    }
    
    public boolean transfer(BankAccount toAccount, double amount) {
        if (amount > 0 && amount <= balance) {
            this.withdraw(amount);
            toAccount.deposit(amount);
            System.out.println("Transferred $" + amount + " to " + 
                             toAccount.getOwnerName());
            return true;
        }
        return false;
    }
    
    public double getBalance() {
        return balance;
    }
    
    public String getOwnerName() {
        return ownerName;
    }
    
    public void displayStatement() {
        System.out.println("Account: " + accountNumber);
        System.out.println("Owner: " + ownerName);
        System.out.println("Balance: $" + balance);
        System.out.println("Transactions: " + transactionCount);
    }
}

// Usage
BankAccount account1 = new BankAccount("12345", "Alice");
BankAccount account2 = new BankAccount("67890", "Bob");

account1.deposit(1000);
account1.withdraw(200);
account1.transfer(account2, 300);

account1.displayStatement();
account2.displayStatement();
```

## Exercise 4: Student Grade System

```java
public class Student {
    private String id;
    private String name;
    private double[] grades;
    private int gradeCount;
    
    public Student(String id, String name, int maxGrades) {
        this.id = id;
        this.name = name;
        this.grades = new double[maxGrades];
        this.gradeCount = 0;
    }
    
    public void addGrade(double grade) {
        if (gradeCount < grades.length && grade >= 0 && grade <= 100) {
            grades[gradeCount] = grade;
            gradeCount++;
        }
    }
    
    public double calculateAverage() {
        if (gradeCount == 0) return 0;
        
        double sum = 0;
        for (int i = 0; i < gradeCount; i++) {
            sum += grades[i];
        }
        return sum / gradeCount;
    }
    
    public char getLetterGrade() {
        double avg = calculateAverage();
        if (avg >= 90) return ''A'';
        if (avg >= 80) return ''B'';
        if (avg >= 70) return ''C'';
        if (avg >= 60) return ''D'';
        return ''F'';
    }
    
    public double getHighestGrade() {
        if (gradeCount == 0) return 0;
        
        double highest = grades[0];
        for (int i = 1; i < gradeCount; i++) {
            if (grades[i] > highest) {
                highest = grades[i];
            }
        }
        return highest;
    }
    
    public void displayReport() {
        System.out.println("Student ID: " + id);
        System.out.println("Name: " + name);
        System.out.println("Average: " + calculateAverage());
        System.out.println("Letter Grade: " + getLetterGrade());
        System.out.println("Highest Grade: " + getHighestGrade());
    }
}

// Usage
Student student = new Student("S001", "Alice", 5);
student.addGrade(85);
student.addGrade(90);
student.addGrade(88);
student.addGrade(92);
student.displayReport();
```

## Challenge: Library Management

Create a complete library system with Book and Library classes:

```java
public class Library {
    private Book[] books;
    private int bookCount;
    
    public Library(int capacity) {
        books = new Book[capacity];
        bookCount = 0;
    }
    
    public void addBook(Book book) {
        if (bookCount < books.length) {
            books[bookCount] = book;
            bookCount++;
            System.out.println("Added: " + book.getTitle());
        }
    }
    
    public Book searchByTitle(String title) {
        for (int i = 0; i < bookCount; i++) {
            if (books[i].getTitle().equalsIgnoreCase(title)) {
                return books[i];
            }
        }
        return null;
    }
    
    public void displayAllBooks() {
        System.out.println("=== Library Books ===");
        for (int i = 0; i < bookCount; i++) {
            books[i].displayInfo();
            System.out.println("---");
        }
    }
}

// Usage
Library library = new Library(100);
library.addBook(new Book("Java Basics", "John Doe", 300, 39.99));
library.addBook(new Book("OOP Principles", "Jane Smith", 400, 49.99));
library.displayAllBooks();

Book found = library.searchByTitle("Java Basics");
if (found != null) {
    found.displayInfo();
}
```

## Key Takeaways

✓ Classes model real-world entities
✓ Encapsulation protects data
✓ Methods define behavior
✓ Constructors initialize objects
✓ Getters and setters provide controlled access
✓ OOP makes code organized and maintainable

Congratulations! You have completed the Java Fundamentals for Beginners course. You now have a solid foundation in Java programming and are ready to tackle more advanced topics!'
FROM course_modules
WHERE title = 'Object-Oriented Programming Basics'
  AND course_id = (SELECT id FROM courses WHERE title = 'Java Fundamentals for Beginners')
ON CONFLICT DO NOTHING;
