/*
  # Populate Module 1 Lessons 4-5 Content

  ## Overview
  Completes Module 1 with Variables/Data Types and Practice lessons.
*/

-- Lesson 4: Variables and Data Types
UPDATE course_lessons SET content_text = '# Variables and Data Types

Variables are containers that hold data, and data types specify what kind of data can be stored.

## What is a Variable?

A variable is a named storage location in memory.

### Variable Declaration
```java
dataType variableName = value;
```

Example:
```java
int age = 25;
String name = "John";
double price = 19.99;
```

## Primitive Data Types

### Integer Types

**int**: Most commonly used integer type
```java
int age = 25;
int population = 1000000;
```

**long**: For very large numbers
```java
long bigNumber = 9999999999L;
```

**byte**: Small integers (-128 to 127)
```java
byte smallNumber = 100;
```

**short**: Medium integers
```java
short mediumNumber = 20000;
```

### Floating-Point Types

**double**: Most commonly used for decimals
```java
double price = 19.99;
double pi = 3.14159;
```

**float**: Less precision than double
```java
float temperature = 98.6f;
```

### Character Type

**char**: Single character
```java
char grade = ''A'';
char symbol = ''$'';
```

### Boolean Type

**boolean**: true or false
```java
boolean isStudent = true;
boolean hasLicense = false;
```

## Reference Types

### String
```java
String firstName = "John";
String lastName = "Doe";
String fullName = firstName + " " + lastName;
```

## Variable Naming Rules

**Must Follow:**
- Start with letter, underscore, or dollar sign
- Can contain letters, digits, underscores
- Cannot be a Java keyword
- Are case-sensitive

**Best Practices:**
- Use camelCase: `firstName`, `totalPrice`
- Choose descriptive names
- Constants use UPPER_CASE: `final double PI = 3.14159;`

## Type Conversion

### Implicit (Widening)
```java
int myInt = 100;
double myDouble = myInt;  // Automatic
```

### Explicit (Narrowing)
```java
double myDouble = 9.99;
int myInt = (int) myDouble;  // Result: 9
```

## Practical Examples

### Calculate Area
```java
double length = 10.5;
double width = 5.5;
double area = length * width;
System.out.println("Area: " + area);
```

### Store Student Info
```java
String studentName = "Alice";
int studentAge = 20;
char grade = ''A'';
boolean isEnrolled = true;

System.out.println("Student: " + studentName);
System.out.println("Age: " + studentAge);
```

## Common Mistakes

❌ Uninitialized variables
❌ Type mismatch
❌ Integer division returns integer

## Key Takeaways

✓ Variables store data in named memory locations
✓ Java has 8 primitive data types
✓ Choose appropriate data type for your needs
✓ Use meaningful variable names
✓ Be aware of type conversion rules'
WHERE title = 'Variables and Data Types'
  AND module_id IN (SELECT id FROM course_modules WHERE title = 'Getting Started with Java');

-- Lesson 5: Practice
UPDATE course_lessons SET content_text = '# Practice: Variables and Data Types

Time to practice! Complete these exercises to reinforce your understanding.

## Exercise 1: About Me

Create a program that stores your information:

```java
public class AboutMe {
    public static void main(String[] args) {
        String name = "Alex";
        int age = 22;
        double height = 1.75;
        boolean isStudent = true;
        
        System.out.println("Name: " + name);
        System.out.println("Age: " + age);
        System.out.println("Height: " + height + " meters");
        System.out.println("Student: " + isStudent);
    }
}
```

## Exercise 2: Rectangle Calculator

Calculate area and perimeter:

```java
public class Rectangle {
    public static void main(String[] args) {
        double length = 15.5;
        double width = 8.3;
        
        double area = length * width;
        double perimeter = 2 * (length + width);
        
        System.out.println("Area: " + area);
        System.out.println("Perimeter: " + perimeter);
    }
}
```

## Exercise 3: Type Conversion

Practice converting between types:

```java
public class TypeConversion {
    public static void main(String[] args) {
        int myInt = 100;
        double intToDouble = myInt;
        
        double myDouble = 99.99;
        int doubleToInt = (int) myDouble;
        
        System.out.println("Int to double: " + intToDouble);
        System.out.println("Double to int: " + doubleToInt);
    }
}
```

## Exercise 4: Shopping Cart

Calculate total with tax:

```java
public class ShoppingCart {
    public static void main(String[] args) {
        double item1 = 29.99;
        double item2 = 15.50;
        double item3 = 42.00;
        final double TAX_RATE = 0.08;
        
        double subtotal = item1 + item2 + item3;
        double tax = subtotal * TAX_RATE;
        double total = subtotal + tax;
        
        System.out.println("Subtotal: $" + subtotal);
        System.out.println("Tax: $" + tax);
        System.out.println("Total: $" + total);
    }
}
```

## Challenge: Temperature Converter

Convert between Celsius and Fahrenheit:

```java
public class TemperatureConverter {
    public static void main(String[] args) {
        double celsius = 25.0;
        double fahrenheit = (celsius * 9.0 / 5.0) + 32.0;
        
        System.out.println(celsius + "°C = " + fahrenheit + "°F");
    }
}
```

## Key Takeaways

✓ Practice is essential for mastering programming
✓ Always initialize variables before using them
✓ Use appropriate data types
✓ Be careful with type conversions

Congratulations on completing Module 1!'
WHERE title = 'Practice: Variables and Data Types'
  AND module_id IN (SELECT id FROM course_modules WHERE title = 'Getting Started with Java');
