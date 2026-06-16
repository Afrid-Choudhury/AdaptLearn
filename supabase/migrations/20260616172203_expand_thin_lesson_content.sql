-- Expand thin lesson content with richer explanations and examples

-- 1. Setting Up Your Development Environment (1842 chars -> expanded)
UPDATE course_lessons SET content_text = '# Setting Up Your Development Environment

Before you can start writing Java programs, you need to set up your development environment. This lesson will guide you through installing the necessary tools.

## What You Need

To develop Java applications, you need two main components:

1. **Java Development Kit (JDK)**: Contains the tools to compile and run Java programs
2. **Integrated Development Environment (IDE)**: A code editor with helpful features

## Step 1: Install the JDK

### Downloading the JDK

Visit the official Oracle website or use an open-source alternative like OpenJDK. For beginners, we recommend **JDK 17** or later as it is a Long-Term Support (LTS) version.

### Verifying Installation

After installation, open your terminal or command prompt and type:

```java
java --version
```

You should see output like:

```java
java 17.0.1 2021-10-19 LTS
Java(TM) SE Runtime Environment (build 17.0.1+12-LTS-39)
```

Also check the compiler:

```java
javac --version
```

If both commands produce version information, the JDK is correctly installed.

## Step 2: Choose an IDE

While you can write Java in any text editor, an IDE makes development significantly easier. Here are the top choices:

### IntelliJ IDEA (Recommended)

IntelliJ IDEA Community Edition is free and provides excellent Java support including code completion, debugging, and refactoring tools. Download it from JetBrains.

### VS Code with Java Extension Pack

If you prefer a lighter editor, VS Code with the "Extension Pack for Java" provides solid Java support with faster startup times.

### Eclipse

A free, open-source IDE that has been popular with Java developers for decades. It is feature-rich but has a steeper learning curve.

## Step 3: Create Your First Project

Once your IDE is installed:

1. Open the IDE and select "New Project"
2. Choose "Java" as the project type
3. Select your installed JDK
4. Name your project (e.g., "MyFirstJavaProject")
5. Click "Create"

## Understanding Project Structure

A typical Java project has this structure:

```java
MyProject/
  src/
    Main.java
  out/
    (compiled .class files)
```

- The **src** folder contains your source code files (`.java`)
- The **out** folder (created automatically) contains compiled bytecode (`.class`)

## Key Concepts

- **Source File (.java)**: The human-readable code you write
- **Bytecode (.class)**: The compiled version that runs on the JVM
- **JVM (Java Virtual Machine)**: The engine that executes your bytecode on any operating system

## The Compile-and-Run Cycle

Every time you run a Java program, two things happen:

1. **Compilation**: `javac Main.java` translates your code into bytecode
2. **Execution**: `java Main` runs the bytecode on the JVM

Your IDE handles both steps automatically when you press the "Run" button.

## Common Setup Issues

- **"java is not recognized"**: The JDK bin folder needs to be added to your system PATH
- **"Could not find or load main class"**: Make sure your class name matches the filename exactly (case-sensitive)
- **Wrong JDK version**: Ensure your IDE points to the JDK you installed, not an older version

## Next Steps

With your development environment ready, you are all set to write your first Java program in the next lesson!'
WHERE id = 'e2ea942b-ef69-45b0-82a6-5abd0e707004';

-- 2. If-Else Statements (2034 chars -> expanded)
UPDATE course_lessons SET content_text = '# If-Else Statements

Conditional statements allow your program to make decisions. The `if-else` statement is the most fundamental control flow structure in Java.

## Basic If Statement

The simplest form checks a single condition:

```java
int temperature = 35;

if (temperature > 30) {
    System.out.println("It is hot outside!");
}
```

The code inside the braces only executes when the condition is `true`.

## If-Else Statement

Add an `else` block to handle the case when the condition is `false`:

```java
int age = 16;

if (age >= 18) {
    System.out.println("You can vote.");
} else {
    System.out.println("You cannot vote yet.");
}
```

## If-Else If-Else Chain

When you need to check multiple conditions in sequence:

```java
int score = 75;

if (score >= 90) {
    System.out.println("Grade: A");
} else if (score >= 80) {
    System.out.println("Grade: B");
} else if (score >= 70) {
    System.out.println("Grade: C");
} else if (score >= 60) {
    System.out.println("Grade: D");
} else {
    System.out.println("Grade: F");
}
```

Java evaluates each condition from top to bottom and enters the first block whose condition is true. Once a block executes, all remaining `else if` and `else` blocks are skipped.

## Comparison Operators

Use these operators to build conditions:

- `==` equal to
- `!=` not equal to
- `>` greater than
- `<` less than
- `>=` greater than or equal to
- `<=` less than or equal to

## Combining Conditions with Logical Operators

You can combine multiple conditions using logical operators:

```java
int age = 25;
boolean hasLicense = true;

if (age >= 16 && hasLicense) {
    System.out.println("You can drive.");
}

boolean isWeekend = true;
boolean isHoliday = false;

if (isWeekend || isHoliday) {
    System.out.println("No work today!");
}
```

- `&&` (AND): Both conditions must be true
- `||` (OR): At least one condition must be true
- `!` (NOT): Reverses a boolean value

## Nested If Statements

You can place if statements inside other if statements:

```java
int age = 20;
boolean isStudent = true;

if (age >= 18) {
    System.out.println("You are an adult.");
    if (isStudent) {
        System.out.println("You get a student discount!");
    }
}
```

While nesting is sometimes necessary, deeply nested code becomes hard to read. Prefer combining conditions with `&&` when possible.

## Common Mistakes to Avoid

### Using = instead of ==

```java
// WRONG: assigns 5 to x, does not compare
if (x = 5) { }

// CORRECT: compares x to 5
if (x == 5) { }
```

### Comparing Strings with ==

```java
String name = "Alice";

// WRONG: compares memory addresses
if (name == "Alice") { }

// CORRECT: compares actual string content
if (name.equals("Alice")) { }
```

### Forgetting Braces

Without braces, only the very next line is part of the if block:

```java
if (score > 90)
    System.out.println("Excellent!");
    System.out.println("Keep it up!");  // This ALWAYS runs!
```

Always use braces for clarity, even with single-line blocks.

## The Ternary Operator

For simple if-else assignments, Java offers a shorthand:

```java
int age = 20;
String status = (age >= 18) ? "adult" : "minor";
System.out.println(status);  // "adult"
```

The ternary operator is useful for concise expressions but should not replace multi-line if-else blocks.

## Practice Exercise

Try predicting the output of this code:

```java
int x = 10;
int y = 20;

if (x > y) {
    System.out.println("x is larger");
} else if (x == y) {
    System.out.println("they are equal");
} else {
    System.out.println("y is larger");
}
```

The answer is "y is larger" because `x` (10) is not greater than `y` (20), and they are not equal.'
WHERE id = '96da3a17-f122-4908-badc-f56cbcdcc481';

-- 3. Switch Statements (2109 chars -> expanded)
UPDATE course_lessons SET content_text = '# Switch Statements

When checking a variable against multiple specific values, a switch statement is often cleaner and more readable than a long if-else chain.

## Basic Syntax

```java
switch (variable) {
    case value1:
        // Code for value1
        break;
    case value2:
        // Code for value2
        break;
    default:
        // Code if no case matches
}
```

## Example: Days of the Week

```java
int day = 3;

switch (day) {
    case 1:
        System.out.println("Monday");
        break;
    case 2:
        System.out.println("Tuesday");
        break;
    case 3:
        System.out.println("Wednesday");
        break;
    case 4:
        System.out.println("Thursday");
        break;
    case 5:
        System.out.println("Friday");
        break;
    case 6:
        System.out.println("Saturday");
        break;
    case 7:
        System.out.println("Sunday");
        break;
    default:
        System.out.println("Invalid day");
}
```

## The break Statement

The `break` statement exits the switch block. Without it, execution "falls through" to the next case:

```java
int month = 3;

switch (month) {
    case 12:
    case 1:
    case 2:
        System.out.println("Winter");
        break;
    case 3:
    case 4:
    case 5:
        System.out.println("Spring");
        break;
    case 6:
    case 7:
    case 8:
        System.out.println("Summer");
        break;
    default:
        System.out.println("Fall");
}
```

Here, fall-through is intentional -- months 12, 1, and 2 all print "Winter" because they share the same code block.

## Switching on Strings

Since Java 7, you can switch on String values:

```java
String command = "start";

switch (command) {
    case "start":
        System.out.println("Starting the engine...");
        break;
    case "stop":
        System.out.println("Stopping the engine...");
        break;
    case "reset":
        System.out.println("Resetting...");
        break;
    default:
        System.out.println("Unknown command: " + command);
}
```

## When to Use Switch vs. If-Else

Use **switch** when:
- You are comparing one variable against several exact values
- Each case leads to distinct, simple logic
- Readability matters -- switch makes the branching structure obvious

Use **if-else** when:
- You need to test ranges (`score >= 90`)
- Conditions involve multiple variables (`age > 18 && hasID`)
- Logic is complex or involves method calls in the condition

## The default Case

The `default` case runs when no other case matches. It is optional but strongly recommended -- it acts as a safety net for unexpected values.

```java
char grade = ''X'';

switch (grade) {
    case ''A'':
        System.out.println("Excellent");
        break;
    case ''B'':
        System.out.println("Good");
        break;
    default:
        System.out.println("Unknown grade: " + grade);
}
```

## Enhanced Switch (Java 14+)

Modern Java offers a cleaner switch syntax using arrows:

```java
String day = "MONDAY";

String type = switch (day) {
    case "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY" -> "Weekday";
    case "SATURDAY", "SUNDAY" -> "Weekend";
    default -> "Unknown";
};

System.out.println(day + " is a " + type);
```

Benefits of the enhanced switch:
- No `break` statements needed
- Can return a value directly
- Multiple case labels separated by commas
- Prevents fall-through bugs

## Common Pitfalls

### Missing break statements

```java
int x = 1;
switch (x) {
    case 1:
        System.out.println("One");
        // forgot break -- falls through!
    case 2:
        System.out.println("Two");
        break;
}
// Prints both "One" AND "Two"
```

### Duplicate case values

Each case value must be unique. The compiler will reject duplicate cases.

### Variables in case labels

Case labels must be compile-time constants (literals or `final` variables). You cannot use regular variables:

```java
int threshold = 10;
// WRONG: case threshold: -- not a compile-time constant
```

## Summary

- Switch is ideal for matching one value against many options
- Always include `break` unless you intentionally want fall-through
- Include a `default` case as a safety net
- Consider the enhanced switch syntax for cleaner modern code'
WHERE id = '749ca22f-6863-46fe-be79-aabe6aa86feb';

-- 4. Introduction to Collections (1963 chars -> expanded)
UPDATE course_lessons SET content_text = '# Introduction to Collections

The Java Collections Framework provides a unified architecture for storing and manipulating groups of objects. Instead of managing raw arrays, collections give you powerful, flexible data structures right out of the box.

## Why Collections?

Arrays have significant limitations:

```java
int[] numbers = new int[5];
```

- **Fixed size**: Cannot grow or shrink after creation
- **No built-in methods**: No searching, sorting, or filtering without writing your own code
- **Difficult manipulation**: Inserting or removing elements requires shifting everything manually
- **No type flexibility**: Cannot mix types or use generics easily

Collections solve all of these problems while providing consistent APIs.

## The Collections Hierarchy

```
Iterable
  |
Collection
/     |      \
List    Set    Queue
|       |       |
ArrayList HashSet PriorityQueue
LinkedList TreeSet  ArrayDeque
```

Each interface defines a contract:

- **Collection**: The root interface for all collections
- **List**: Ordered, allows duplicates, accessible by index
- **Set**: Unordered (usually), no duplicates
- **Queue**: Designed for holding elements before processing (FIFO)

## Core Interfaces

### List

An ordered collection that allows duplicate elements. Elements are accessible by their position (index).

```java
List<String> names = new ArrayList<>();
names.add("Alice");
names.add("Bob");
names.add("Alice");  // Duplicates allowed
System.out.println(names.get(0));  // "Alice"
System.out.println(names.size());   // 3
```

Common implementations:
- **ArrayList**: Fast random access, backed by a resizable array
- **LinkedList**: Fast insertions and deletions, uses nodes with pointers

### Set

A collection that does not allow duplicate elements. Useful when you need to ensure uniqueness.

```java
Set<String> languages = new HashSet<>();
languages.add("Java");
languages.add("Python");
languages.add("Java");  // Ignored! Already exists
System.out.println(languages.size());  // 2
```

Common implementations:
- **HashSet**: Fastest, no guaranteed order
- **TreeSet**: Sorted in natural order
- **LinkedHashSet**: Maintains insertion order

### Map (Key-Value Pairs)

While not technically under the Collection interface, Maps are part of the framework. They store key-value pairs.

```java
Map<String, Integer> ages = new HashMap<>();
ages.put("Alice", 25);
ages.put("Bob", 30);
System.out.println(ages.get("Alice"));  // 25
```

Common implementations:
- **HashMap**: Fastest, no guaranteed order
- **TreeMap**: Keys sorted in natural order
- **LinkedHashMap**: Maintains insertion order

## Choosing the Right Collection

| Need | Use |
|------|-----|
| Ordered list with duplicates | ArrayList |
| Fast add/remove at both ends | LinkedList or ArrayDeque |
| Unique elements, no order needed | HashSet |
| Unique elements, sorted | TreeSet |
| Key-value lookup | HashMap |
| Key-value lookup, sorted keys | TreeMap |
| First-in-first-out processing | Queue / ArrayDeque |

## Common Operations

All collections share these basic operations:

```java
List<String> items = new ArrayList<>();

items.add("Apple");          // Add element
items.remove("Apple");       // Remove element
items.contains("Apple");     // Check existence
items.size();                // Get count
items.isEmpty();             // Check if empty
items.clear();               // Remove all elements
```

## Iterating Over Collections

### For-Each Loop (Preferred)

```java
List<String> fruits = List.of("Apple", "Banana", "Cherry");

for (String fruit : fruits) {
    System.out.println(fruit);
}
```

### Using Iterator

```java
Iterator<String> it = fruits.iterator();
while (it.hasNext()) {
    System.out.println(it.next());
}
```

### forEach with Lambda (Java 8+)

```java
fruits.forEach(fruit -> System.out.println(fruit));
```

## Generics and Type Safety

Collections use generics to enforce type safety at compile time:

```java
// Without generics (dangerous - no type checking)
List raw = new ArrayList();
raw.add("hello");
raw.add(42);  // No error at compile time!

// With generics (safe - compiler catches errors)
List<String> safe = new ArrayList<>();
safe.add("hello");
// safe.add(42);  // Compile error!
```

Always specify the type parameter when declaring a collection.

## Next Steps

In the following lessons, you will work hands-on with Lists, Sets, and Maps to build practical programs that manage, search, sort, and transform data.'
WHERE id = '82cd6f25-2890-4bd5-a578-03a49aef9b91';