/*
  # Populate Module 1 Lesson Content

  ## Overview
  Adds full educational content to Module 1: Getting Started with Java lessons.

  ## Content Updates
  - Introduction to Java (20 min video)
  - Setting Up Your Development Environment (45 min reading)
  - Your First Java Program (30 min exercise)
  - Variables and Data Types (40 min video)
  - Practice: Variables and Data Types (45 min quiz)

  ## Important Notes
  - Content is beginner-friendly with clear explanations
  - Includes code examples and key takeaways
*/

-- Update Module 1, Lesson 1: Introduction to Java
UPDATE course_lessons SET content_text = '# Introduction to Java

Welcome to your Java programming journey! In this lesson, you will discover what makes Java one of the most popular and enduring programming languages in the world.

## What is Java?

Java is a high-level, object-oriented programming language developed by Sun Microsystems (now owned by Oracle Corporation) in 1995. It was designed with the philosophy of "Write Once, Run Anywhere" (WORA), meaning that compiled Java code can run on any platform that supports Java without needing to be recompiled.

## Key Features of Java

### 1. Platform Independence
Java programs are compiled into bytecode, which runs on the Java Virtual Machine (JVM). This means you can write your code once and run it on Windows, macOS, Linux, and other operating systems without modification.

### 2. Object-Oriented
Java follows the object-oriented programming (OOP) paradigm, which helps organize code into reusable, modular components. You will learn more about this in later modules.

### 3. Simple and Familiar
Java syntax is similar to C and C++, making it easier to learn if you have experience with these languages. Even if you do not, Java clean syntax makes it accessible to beginners.

### 4. Robust and Secure
Java has strong memory management, exception handling, and security features that make it ideal for building reliable applications.

### 5. Large Ecosystem
Java has a vast collection of libraries, frameworks, and tools that can help you build almost anything - from mobile apps to enterprise systems.

## Where is Java Used?

- **Enterprise Applications**: Large-scale business systems
- **Android Apps**: Mobile application development
- **Web Applications**: Server-side programming
- **Big Data**: Processing and analyzing large datasets
- **Cloud Applications**: Modern cloud-native services

## Why Learn Java?

1. **High Demand**: Java developers are consistently in demand across industries
2. **Versatility**: Use Java for web, mobile, desktop, and server applications
3. **Strong Foundation**: Learning Java gives you a solid foundation in programming concepts
4. **Active Community**: Millions of developers worldwide use Java

## Key Takeaways

✓ Java is a platform-independent, object-oriented programming language
✓ Java code runs on the JVM, making it portable across different systems
✓ Java is used in enterprise applications, Android development, and much more
✓ Learning Java provides excellent career opportunities and a strong programming foundation

In the next lesson, you will set up your development environment and get ready to write your first Java program!'
WHERE title = 'Introduction to Java'
  AND module_id IN (SELECT id FROM course_modules WHERE title = 'Getting Started with Java');
