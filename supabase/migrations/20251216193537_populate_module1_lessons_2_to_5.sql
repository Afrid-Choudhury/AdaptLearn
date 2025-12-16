/*
  # Populate Module 1 Lessons 2-5 Content

  ## Overview
  Adds full content to lessons 2-5 of Module 1: Getting Started with Java.

  ## Lessons Updated
  - Setting Up Your Development Environment
  - Your First Java Program
  - Variables and Data Types
  - Practice: Variables and Data Types
*/

-- Lesson 2: Setting Up Your Development Environment
UPDATE course_lessons SET content_text = '# Setting Up Your Development Environment

Before you can start writing Java programs, you need to set up your development environment. This lesson will guide you through installing the necessary tools.

## What You Need

To develop Java applications, you need two main components:

1. **Java Development Kit (JDK)**: Contains the tools to compile and run Java programs
2. **Integrated Development Environment (IDE)**: A code editor with helpful features

## Step 1: Install the JDK

### Downloading the JDK

1. Visit the Oracle JDK download page or adopt OpenJDK
2. Download the latest LTS (Long Term Support) version for your operating system
3. Choose the appropriate installer for your system

### Installing the JDK

**Windows:**
- Run the downloaded .exe file
- Follow the installation wizard
- Note the installation directory

**macOS:**
- Open the downloaded .dmg file
- Follow the installation prompts

**Linux:**
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install default-jdk
```

### Verifying the Installation

Open a terminal or command prompt and run:

```bash
java -version
javac -version
```

You should see version information for both commands.

## Step 2: Choose and Install an IDE

### Popular IDE Options

**IntelliJ IDEA Community Edition (Recommended)**
- Free and powerful
- Excellent code completion and debugging

**Eclipse**
- Free and open-source
- Widely used in enterprises

**Visual Studio Code**
- Lightweight and customizable
- Requires Java extensions

## Step 3: Create Your First Project

1. Open your IDE
2. Create a new Java project
3. Name it "HelloJava"
4. Ensure the JDK version is selected correctly

## Key Takeaways

✓ The JDK is essential for Java development
✓ An IDE makes writing and debugging code much easier
✓ Always verify your installation

Your development environment is now ready!'
WHERE title = 'Setting Up Your Development Environment'
  AND module_id IN (SELECT id FROM course_modules WHERE title = 'Getting Started with Java');

-- Lesson 3: Your First Java Program
UPDATE course_lessons SET content_text = '# Your First Java Program

It is time to write your first Java program - the traditional "Hello World"! This simple program will introduce you to Java basic structure.

## The Hello World Program

Create a new file called `HelloWorld.java`:

```java
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}
```

## Understanding the Code

### 1. Class Declaration
```java
public class HelloWorld {
```
- `public`: This class can be accessed from anywhere
- `class`: Keyword to define a class
- `HelloWorld`: The name of the class (must match the filename)

### 2. Main Method
```java
public static void main(String[] args) {
```
- `public`: The method can be accessed from anywhere
- `static`: The method belongs to the class
- `void`: The method does not return a value
- `main`: The entry point of the program

### 3. Print Statement
```java
System.out.println("Hello, World!");
```
- Prints text to the console
- `println` adds a new line after printing

## Compiling and Running

### Using Command Line

1. **Compile:**
```bash
javac HelloWorld.java
```

2. **Run:**
```bash
java HelloWorld
```

Output: `Hello, World!`

### Using an IDE

1. Right-click on the file
2. Select "Run"
3. View output in the console

## Common Mistakes to Avoid

❌ Filename does not match class name
❌ Missing semicolon
❌ Wrong capitalization of main

## Experiment!

Try modifying the program:

```java
System.out.println("Hello, Sarah!");
System.out.println("Welcome to Java!");
```

## Key Takeaways

✓ Every Java program must have at least one class
✓ The main method is the entry point
✓ Java code must be compiled before running
✓ The filename must match the public class name

Congratulations! You have written your first Java program!'
WHERE title = 'Your First Java Program'
  AND module_id IN (SELECT id FROM course_modules WHERE title = 'Getting Started with Java');
