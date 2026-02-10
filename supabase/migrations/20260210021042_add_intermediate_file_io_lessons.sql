/*
  # Add File I/O and Serialization Lessons to Intermediate Course

  1. New Lessons
    - Reading Files (video, 40 min)
    - Writing Files (reading, 35 min)
    - Buffered Streams (video, 35 min)
    - Object Serialization (video, 40 min)
    - NIO.2 Package Basics (reading, 35 min)
    - File I/O Practice (quiz, 35 min)

  2. Security
    - No RLS changes needed

  3. Important Notes
    - Follows emoji-based pattern from beginner course
    - Covers both classic I/O and modern NIO.2 approaches
*/

-- Lesson 1: Reading Files
INSERT INTO course_lessons (module_id, title, description, order_index, estimated_minutes, content_type, content_text)
SELECT
  id,
  'Reading Files',
  'Learn multiple approaches to reading text files in Java, from classic I/O to modern techniques.',
  1,
  40,
  'video',
  '# Reading Files

Java provides several ways to read files. Understanding each approach helps you choose the right tool for the job.

## FileReader and BufferedReader (Classic)

```java
import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;

try (BufferedReader reader = new BufferedReader(new FileReader("data.txt"))) {
    String line;
    while ((line = reader.readLine()) != null) {
        System.out.println(line);
    }
} catch (IOException e) {
    System.out.println("Error reading file: " + e.getMessage());
}
```

`BufferedReader` reads text efficiently by buffering chunks of data.

## Scanner for Files

```java
import java.io.File;
import java.io.FileNotFoundException;
import java.util.Scanner;

try (Scanner scanner = new Scanner(new File("data.txt"))) {
    while (scanner.hasNextLine()) {
        System.out.println(scanner.nextLine());
    }
} catch (FileNotFoundException e) {
    System.out.println("File not found: " + e.getMessage());
}
```

`Scanner` is simpler but slower for large files.

## Files.readAllLines (Java 7+)

```java
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;

try {
    List<String> lines = Files.readAllLines(Path.of("data.txt"));
    for (String line : lines) {
        System.out.println(line);
    }
} catch (IOException e) {
    System.out.println("Error: " + e.getMessage());
}
```

Reads the entire file into a List. Convenient for small files.

## Files.readString (Java 11+)

```java
try {
    String content = Files.readString(Path.of("data.txt"));
    System.out.println(content);
} catch (IOException e) {
    System.out.println("Error: " + e.getMessage());
}
```

The simplest approach — reads everything into one String.

## Comparing Approaches

| Method | Best For | Memory |
|--------|----------|--------|
| BufferedReader | Large files, line-by-line | Low |
| Scanner | Parsing mixed data types | Low |
| Files.readAllLines | Small files, need all lines | Medium |
| Files.readString | Small files, need full text | Medium |

## Common Mistakes

❌ Not closing file resources (use try-with-resources)
❌ Reading an entire large file into memory at once
❌ Not handling FileNotFoundException separately from IOException

## Key Takeaways

✓ Use BufferedReader for large files and line-by-line processing
✓ Use Files.readAllLines or readString for small files
✓ Always wrap file operations in try-with-resources
✓ Handle IOException to manage missing or unreadable files'
FROM course_modules
WHERE title = 'File I/O and Serialization'
  AND course_id = (SELECT id FROM courses WHERE title = 'Intermediate Java Development')
ON CONFLICT DO NOTHING;

-- Lesson 2: Writing Files
INSERT INTO course_lessons (module_id, title, description, order_index, estimated_minutes, content_type, content_text)
SELECT
  id,
  'Writing Files',
  'Master different techniques for writing data to text files in Java.',
  2,
  35,
  'reading',
  '# Writing Files

Writing files in Java mirrors reading — you have classic approaches and modern NIO.2 methods.

## FileWriter and BufferedWriter

```java
import java.io.BufferedWriter;
import java.io.FileWriter;
import java.io.IOException;

try (BufferedWriter writer = new BufferedWriter(new FileWriter("output.txt"))) {
    writer.write("First line");
    writer.newLine();
    writer.write("Second line");
    writer.newLine();
    writer.write("Third line");
} catch (IOException e) {
    System.out.println("Error writing file: " + e.getMessage());
}
```

## Appending to a File

Pass `true` as the second argument to `FileWriter`:

```java
try (BufferedWriter writer = new BufferedWriter(new FileWriter("log.txt", true))) {
    writer.write("New log entry");
    writer.newLine();
} catch (IOException e) {
    System.out.println("Error: " + e.getMessage());
}
```

## PrintWriter for Formatted Output

```java
import java.io.PrintWriter;

try (PrintWriter pw = new PrintWriter("report.txt")) {
    pw.println("Sales Report");
    pw.println("============");
    pw.printf("Total: $%,.2f%n", 15432.50);
    pw.printf("Items: %d%n", 127);
} catch (IOException e) {
    System.out.println("Error: " + e.getMessage());
}
```

`PrintWriter` supports `println`, `printf`, and `print` — just like `System.out`.

## Files.writeString (Java 11+)

```java
import java.nio.file.Files;
import java.nio.file.Path;

try {
    Files.writeString(Path.of("simple.txt"), "Hello, File!");
} catch (IOException e) {
    System.out.println("Error: " + e.getMessage());
}
```

## Files.write with a List

```java
import java.util.List;

List<String> lines = List.of("Line 1", "Line 2", "Line 3");

try {
    Files.write(Path.of("lines.txt"), lines);
} catch (IOException e) {
    System.out.println("Error: " + e.getMessage());
}
```

## Comparing Write Approaches

| Method | Best For | Append Support |
|--------|----------|----------------|
| BufferedWriter | Large output, line-by-line | Yes (FileWriter flag) |
| PrintWriter | Formatted output | Yes |
| Files.writeString | Simple small writes | With OpenOption |
| Files.write(List) | Writing a list of lines | With OpenOption |

## Common Mistakes

❌ Forgetting to flush or close the writer (use try-with-resources)
❌ Overwriting a file when you meant to append
❌ Not creating parent directories before writing

## Key Takeaways

✓ BufferedWriter is efficient for large amounts of text
✓ PrintWriter offers convenient formatting methods
✓ Files.writeString is the simplest approach for small writes
✓ Always use try-with-resources to ensure files are properly closed'
FROM course_modules
WHERE title = 'File I/O and Serialization'
  AND course_id = (SELECT id FROM courses WHERE title = 'Intermediate Java Development')
ON CONFLICT DO NOTHING;

-- Lesson 3: Buffered Streams
INSERT INTO course_lessons (module_id, title, description, order_index, estimated_minutes, content_type, content_text)
SELECT
  id,
  'Buffered Streams',
  'Understand how buffering improves I/O performance and when to use byte streams vs character streams.',
  3,
  35,
  'video',
  '# Buffered Streams

Buffering is the key to efficient I/O. Instead of reading or writing one byte at a time, buffered streams work with chunks of data.

## Why Buffering Matters

Without buffering, every `read()` or `write()` call hits the disk. With buffering, data is transferred in larger blocks.

```
Without buffer: read() -> disk -> read() -> disk -> read() -> disk
With buffer:    read() -> buffer [disk fills buffer once] -> read() -> buffer -> read() -> buffer
```

## Byte Streams vs Character Streams

### Byte Streams (Binary Data)
For images, audio, compiled files, and any binary data:

```java
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;

try (
    BufferedInputStream in = new BufferedInputStream(new FileInputStream("input.dat"));
    BufferedOutputStream out = new BufferedOutputStream(new FileOutputStream("output.dat"))
) {
    int byteData;
    while ((byteData = in.read()) != -1) {
        out.write(byteData);
    }
} catch (IOException e) {
    System.out.println("Error: " + e.getMessage());
}
```

### Character Streams (Text Data)
For text files, CSV, JSON, and human-readable content:

```java
import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.FileReader;
import java.io.FileWriter;

try (
    BufferedReader reader = new BufferedReader(new FileReader("input.txt"));
    BufferedWriter writer = new BufferedWriter(new FileWriter("output.txt"))
) {
    String line;
    while ((line = reader.readLine()) != null) {
        writer.write(line);
        writer.newLine();
    }
} catch (IOException e) {
    System.out.println("Error: " + e.getMessage());
}
```

## Buffer Size

The default buffer size is 8KB. You can customize it:

```java
BufferedReader reader = new BufferedReader(new FileReader("big.txt"), 32768);
```

## Copying Files Efficiently

```java
try (
    BufferedInputStream in = new BufferedInputStream(new FileInputStream("source.bin"));
    BufferedOutputStream out = new BufferedOutputStream(new FileOutputStream("dest.bin"))
) {
    byte[] buffer = new byte[4096];
    int bytesRead;
    while ((bytesRead = in.read(buffer)) != -1) {
        out.write(buffer, 0, bytesRead);
    }
} catch (IOException e) {
    System.out.println("Copy failed: " + e.getMessage());
}
```

Reading into a byte array is significantly faster than reading one byte at a time.

## Stream Hierarchy

| Base | Buffered | Use For |
|------|----------|---------|
| FileInputStream | BufferedInputStream | Binary reading |
| FileOutputStream | BufferedOutputStream | Binary writing |
| FileReader | BufferedReader | Text reading |
| FileWriter | BufferedWriter | Text writing |

## Common Mistakes

❌ Using byte streams for text (causes encoding issues)
❌ Not buffering large file operations
❌ Forgetting to flush the output buffer before closing

## Key Takeaways

✓ Buffering dramatically improves I/O performance
✓ Use byte streams for binary data, character streams for text
✓ Read into byte arrays for maximum throughput
✓ Try-with-resources handles flushing and closing automatically'
FROM course_modules
WHERE title = 'File I/O and Serialization'
  AND course_id = (SELECT id FROM courses WHERE title = 'Intermediate Java Development')
ON CONFLICT DO NOTHING;

-- Lesson 4: Object Serialization
INSERT INTO course_lessons (module_id, title, description, order_index, estimated_minutes, content_type, content_text)
SELECT
  id,
  'Object Serialization',
  'Learn to save and restore Java objects to and from files using serialization.',
  4,
  40,
  'video',
  '# Object Serialization

Serialization converts a Java object into a byte stream that can be saved to a file, sent over a network, or stored in a database. Deserialization reverses the process.

## Making a Class Serializable

Implement the `Serializable` interface:

```java
import java.io.Serializable;

public class Student implements Serializable {
    private static final long serialVersionUID = 1L;

    private String name;
    private int age;
    private double gpa;

    public Student(String name, int age, double gpa) {
        this.name = name;
        this.age = age;
        this.gpa = gpa;
    }

    @Override
    public String toString() {
        return name + " (age " + age + ", GPA: " + gpa + ")";
    }
}
```

## Serializing (Writing) an Object

```java
import java.io.FileOutputStream;
import java.io.ObjectOutputStream;

Student student = new Student("Alice", 20, 3.85);

try (ObjectOutputStream oos = new ObjectOutputStream(new FileOutputStream("student.ser"))) {
    oos.writeObject(student);
    System.out.println("Student saved!");
} catch (IOException e) {
    System.out.println("Error saving: " + e.getMessage());
}
```

## Deserializing (Reading) an Object

```java
import java.io.FileInputStream;
import java.io.ObjectInputStream;

try (ObjectInputStream ois = new ObjectInputStream(new FileInputStream("student.ser"))) {
    Student loaded = (Student) ois.readObject();
    System.out.println("Loaded: " + loaded);
} catch (IOException | ClassNotFoundException e) {
    System.out.println("Error loading: " + e.getMessage());
}
```

## The serialVersionUID

```java
private static final long serialVersionUID = 1L;
```

This unique ID ensures the sender and receiver have compatible versions of the class. If you change the class structure and forget to update this ID, deserialization may fail.

## The transient Keyword

Fields marked `transient` are **not** serialized:

```java
public class User implements Serializable {
    private String username;
    private transient String password;
}
```

When deserialized, `password` will be `null`.

## Serializing Collections

```java
List<Student> students = new ArrayList<>();
students.add(new Student("Alice", 20, 3.85));
students.add(new Student("Bob", 22, 3.40));

try (ObjectOutputStream oos = new ObjectOutputStream(new FileOutputStream("students.ser"))) {
    oos.writeObject(students);
}
```

## Common Mistakes

❌ Forgetting to implement `Serializable`
❌ Not declaring `serialVersionUID`
❌ Serializing sensitive data (use `transient` for passwords)

## Key Takeaways

✓ Serialization converts objects to bytes for storage or transmission
✓ Implement `Serializable` and define `serialVersionUID`
✓ Use `transient` to exclude sensitive or unnecessary fields
✓ Both single objects and collections can be serialized'
FROM course_modules
WHERE title = 'File I/O and Serialization'
  AND course_id = (SELECT id FROM courses WHERE title = 'Intermediate Java Development')
ON CONFLICT DO NOTHING;

-- Lesson 5: NIO.2 Package Basics
INSERT INTO course_lessons (module_id, title, description, order_index, estimated_minutes, content_type, content_text)
SELECT
  id,
  'NIO.2 Package Basics',
  'Explore the modern NIO.2 API for file and directory operations.',
  5,
  35,
  'reading',
  '# NIO.2 Package Basics

Java NIO.2 (introduced in Java 7) provides a modern, powerful alternative to the classic `java.io` package. The key classes are `Path`, `Paths`, and `Files`.

## Path: Representing File Locations

```java
import java.nio.file.Path;

Path path = Path.of("documents", "report.txt");
System.out.println(path);
System.out.println("Filename: " + path.getFileName());
System.out.println("Parent: " + path.getParent());
System.out.println("Absolute: " + path.toAbsolutePath());
```

## Checking File Properties

```java
import java.nio.file.Files;

Path path = Path.of("data.txt");

System.out.println("Exists: " + Files.exists(path));
System.out.println("Is file: " + Files.isRegularFile(path));
System.out.println("Is directory: " + Files.isDirectory(path));
System.out.println("Readable: " + Files.isReadable(path));
System.out.println("Size: " + Files.size(path) + " bytes");
```

## Creating Directories

```java
Path dir = Path.of("output", "reports", "2024");
Files.createDirectories(dir);
```

`createDirectories` creates the full path, including any missing parent directories.

## Copying and Moving Files

```java
Path source = Path.of("original.txt");
Path target = Path.of("backup", "original.txt");

Files.copy(source, target);

Files.move(source, Path.of("archive", "original.txt"));
```

## Deleting Files

```java
Files.deleteIfExists(Path.of("temp.txt"));
```

## Listing Directory Contents

```java
try (var stream = Files.list(Path.of("."))) {
    stream.forEach(System.out::println);
}
```

## Walking a Directory Tree

```java
try (var stream = Files.walk(Path.of("src"))) {
    stream
        .filter(Files::isRegularFile)
        .filter(p -> p.toString().endsWith(".java"))
        .forEach(System.out::println);
}
```

Recursively finds all `.java` files under the `src` directory.

## NIO.2 vs Classic I/O

| Feature | Classic I/O | NIO.2 |
|---------|------------|-------|
| File representation | `File` | `Path` |
| File operations | Manual | `Files` utility class |
| Directory walking | Recursive manual | `Files.walk()` |
| Symbolic links | Limited | Full support |
| Atomic operations | No | Yes |

## Common Mistakes

❌ Mixing `java.io.File` and `java.nio.file.Path` without converting
❌ Not using `createDirectories` (singular `createDirectory` fails if parents are missing)
❌ Forgetting to close directory streams

## Key Takeaways

✓ NIO.2 is the modern approach to file operations in Java
✓ Path replaces File; Files provides utility methods
✓ Files.walk() enables powerful recursive directory traversal
✓ Always close directory streams (use try-with-resources)'
FROM course_modules
WHERE title = 'File I/O and Serialization'
  AND course_id = (SELECT id FROM courses WHERE title = 'Intermediate Java Development')
ON CONFLICT DO NOTHING;

-- Lesson 6: File I/O Practice
INSERT INTO course_lessons (module_id, title, description, order_index, estimated_minutes, content_type, content_text)
SELECT
  id,
  'File I/O Practice',
  'Review and test your understanding of file operations and serialization.',
  6,
  35,
  'quiz',
  '# File I/O Practice

Test your knowledge of reading files, writing files, buffered streams, serialization, and NIO.2.

## Review Questions

### 1. Best Approach for Large Files
Which method is most memory-efficient for reading a 2GB text file?

- A) `Files.readString()`
- B) `Files.readAllLines()`
- C) `BufferedReader` with `readLine()`
- D) `Scanner`

**Answer:** C — BufferedReader processes one line at a time without loading the entire file into memory.

### 2. Append vs Overwrite
What happens when you run this code twice?

```java
Files.writeString(Path.of("log.txt"), "Hello\n");
```

**Answer:** The file contains only "Hello" — it overwrites each time. To append, use `StandardOpenOption.APPEND`.

### 3. Serialization
What does `transient` do?

**Answer:** It excludes a field from serialization. When the object is deserialized, transient fields are set to their default values (null for objects, 0 for numbers, false for booleans).

### 4. Resource Cleanup
What is wrong with this code?

```java
BufferedReader reader = new BufferedReader(new FileReader("file.txt"));
String line = reader.readLine();
System.out.println(line);
```

**Answer:** The reader is never closed. Use try-with-resources to ensure cleanup.

### 5. NIO.2 Path
What does `Path.of("a", "b", "c.txt")` produce?

**Answer:** The path `a/b/c.txt` (or `a\b\c.txt` on Windows). Path.of joins segments with the system file separator.

## Concepts Checklist

✓ BufferedReader for efficient line-by-line reading
✓ BufferedWriter and PrintWriter for efficient writing
✓ Byte streams for binary data, character streams for text
✓ Serialization saves objects; transient excludes fields
✓ NIO.2 provides modern file operations with Path and Files'
FROM course_modules
WHERE title = 'File I/O and Serialization'
  AND course_id = (SELECT id FROM courses WHERE title = 'Intermediate Java Development')
ON CONFLICT DO NOTHING;