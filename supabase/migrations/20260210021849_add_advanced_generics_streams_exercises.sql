/*
  # Add Generics, Streams, and Lambdas Exercises to Advanced Course

  1. New Lessons (Exercises)
    - `Try It: Generic Stack` (order_index 7, 600 XP)
    - `Try It: Lambda Filter` (order_index 8, 650 XP)
    - `Try It: Stream Pipeline` (order_index 9, 700 XP)

  2. Security
    - No RLS changes needed

  3. Important Notes
    - XP values bumped to 600-700 for advanced difficulty
    - Highest XP exercises in the platform
*/

-- Exercise 1: Generic Stack
INSERT INTO course_lessons (
  module_id, title, description, order_index, estimated_minutes,
  content_type, content_text, starter_code, solution_code, validation_rules, xp_reward
)
SELECT
  m.id,
  'Try It: Generic Stack',
  'Build a type-safe generic stack data structure from scratch',
  7, 35, 'exercise',
  '# Try It: Generic Stack

Build a generic `Stack<T>` class that works with any type, using an ArrayList internally.

## Your Task

1. Create a class `Stack<T>` with:
   - A private `ArrayList<T>` called `items`
   - `void push(T item)` — adds item to the top (end of list)
   - `T pop()` — removes and returns the top item. If empty, throw `RuntimeException` with message `"Stack is empty"`
   - `T peek()` — returns the top item without removing it. If empty, throw `RuntimeException`
   - `boolean isEmpty()` — returns true if the stack has no items
   - `int size()` — returns the number of items

2. In `main`, demonstrate with **two different types**:
   - Create a `Stack<String>`, push `"Java"`, `"Python"`, `"Go"`, then pop and print
   - Create a `Stack<Integer>`, push `10`, `20`, `30`, peek and print, then print size

## Expected Output

```
Popped: Go
Peek: 30
Size: 3
```

## Hints

- `items.get(items.size() - 1)` returns the last element
- `items.remove(items.size() - 1)` removes and returns the last element
- Use `items.isEmpty()` for the empty check',
  'import java.util.ArrayList;

public class Stack<T> {
    private ArrayList<T> items = new ArrayList<>();

    // push method


    // pop method


    // peek method


    // isEmpty method


    // size method


    public static void main(String[] args) {
        // String stack demo


        // Integer stack demo

    }
}',
  'import java.util.ArrayList;

public class Stack<T> {
    private ArrayList<T> items = new ArrayList<>();

    public void push(T item) {
        items.add(item);
    }

    public T pop() {
        if (items.isEmpty()) {
            throw new RuntimeException("Stack is empty");
        }
        return items.remove(items.size() - 1);
    }

    public T peek() {
        if (items.isEmpty()) {
            throw new RuntimeException("Stack is empty");
        }
        return items.get(items.size() - 1);
    }

    public boolean isEmpty() {
        return items.isEmpty();
    }

    public int size() {
        return items.size();
    }

    public static void main(String[] args) {
        Stack<String> stringStack = new Stack<>();
        stringStack.push("Java");
        stringStack.push("Python");
        stringStack.push("Go");
        System.out.println("Popped: " + stringStack.pop());

        Stack<Integer> intStack = new Stack<>();
        intStack.push(10);
        intStack.push(20);
        intStack.push(30);
        System.out.println("Peek: " + intStack.peek());
        System.out.println("Size: " + intStack.size());
    }
}',
  '{"mustContain":["class Stack<T>","ArrayList<T>","push","pop","peek","isEmpty","size","RuntimeException","System.out.println"],"regexMatch":"class\\s+Stack\\s*<\\s*T\\s*>","methodSignatureExists":"public\\s+static\\s+void\\s+main\\s*\\(\\s*String\\s*\\[\\s*\\]\\s*args\\s*\\)"}'::jsonb,
  600
FROM course_modules m
JOIN courses c ON m.course_id = c.id
WHERE c.title = 'Advanced Java and Enterprise Development' AND m.order_index = 3
ON CONFLICT DO NOTHING;

-- Exercise 2: Lambda Filter
INSERT INTO course_lessons (
  module_id, title, description, order_index, estimated_minutes,
  content_type, content_text, starter_code, solution_code, validation_rules, xp_reward
)
SELECT
  m.id,
  'Try It: Lambda Filter',
  'Use lambda expressions and functional interfaces to filter and transform data',
  8, 35, 'exercise',
  '# Try It: Lambda Filter

Practice using lambda expressions with Predicate and Function to filter and transform a list of products.

## Your Task

1. Create a class `Product` with fields: `String name`, `double price`, `String category`
   - Constructor takes all three
   - Add a `toString()` that returns `"<name> ($<price>)"`

2. Create a class `LambdaDemo` with a generic filter method:
   ```
   static <T> List<T> filter(List<T> items, Predicate<T> condition)
   ```
   That returns a new list containing only items that match the condition.

3. In `main`:
   - Create a list of products:
     - `"Laptop"`, 999.99, `"Electronics"`
     - `"Shirt"`, 29.99, `"Clothing"`
     - `"Phone"`, 699.99, `"Electronics"`
     - `"Jeans"`, 59.99, `"Clothing"`
     - `"Tablet"`, 449.99, `"Electronics"`
   - Use your filter method with a lambda to find products under $500
   - Use your filter method to find "Electronics" products
   - Print both filtered lists

## Expected Output

```
Under $500:
Shirt ($29.99)
Jeans ($59.99)
Tablet ($449.99)

Electronics:
Laptop ($999.99)
Phone ($699.99)
Tablet ($449.99)
```

## Hints

- `Predicate<Product>` is a lambda that takes a Product and returns boolean
- `p -> p.price < 500` is a valid Predicate lambda
- Import `java.util.function.Predicate`',
  'import java.util.ArrayList;
import java.util.List;
import java.util.function.Predicate;

class Product {
    String name;
    double price;
    String category;

    // Constructor and toString

}

public class LambdaDemo {
    // Generic filter method


    public static void main(String[] args) {
        // Create product list


        // Filter under $500


        // Filter electronics

    }
}',
  'import java.util.ArrayList;
import java.util.List;
import java.util.function.Predicate;

class Product {
    String name;
    double price;
    String category;

    Product(String name, double price, String category) {
        this.name = name;
        this.price = price;
        this.category = category;
    }

    @Override
    public String toString() {
        return name + " ($" + price + ")";
    }
}

public class LambdaDemo {
    static <T> List<T> filter(List<T> items, Predicate<T> condition) {
        List<T> result = new ArrayList<>();
        for (T item : items) {
            if (condition.test(item)) {
                result.add(item);
            }
        }
        return result;
    }

    public static void main(String[] args) {
        List<Product> products = new ArrayList<>();
        products.add(new Product("Laptop", 999.99, "Electronics"));
        products.add(new Product("Shirt", 29.99, "Clothing"));
        products.add(new Product("Phone", 699.99, "Electronics"));
        products.add(new Product("Jeans", 59.99, "Clothing"));
        products.add(new Product("Tablet", 449.99, "Electronics"));

        List<Product> affordable = filter(products, p -> p.price < 500);
        System.out.println("Under $500:");
        affordable.forEach(System.out::println);

        System.out.println();

        List<Product> electronics = filter(products, p -> p.category.equals("Electronics"));
        System.out.println("Electronics:");
        electronics.forEach(System.out::println);
    }
}',
  '{"mustContain":["Predicate","filter","condition.test","lambda","List<T>","System.out.println","forEach"],"regexMatch":"Predicate<.*>\\s+condition","methodSignatureExists":"public\\s+static\\s+void\\s+main\\s*\\(\\s*String\\s*\\[\\s*\\]\\s*args\\s*\\)"}'::jsonb,
  650
FROM course_modules m
JOIN courses c ON m.course_id = c.id
WHERE c.title = 'Advanced Java and Enterprise Development' AND m.order_index = 3
ON CONFLICT DO NOTHING;

-- Exercise 3: Stream Pipeline
INSERT INTO course_lessons (
  module_id, title, description, order_index, estimated_minutes,
  content_type, content_text, starter_code, solution_code, validation_rules, xp_reward
)
SELECT
  m.id,
  'Try It: Stream Pipeline',
  'Build a complete data processing pipeline using the Streams API',
  9, 35, 'exercise',
  '# Try It: Stream Pipeline

Build a data processing pipeline using the Streams API to analyze a list of students.

## Your Task

1. Create a class `Student` with fields: `String name`, `int age`, `double gpa`
   - Constructor takes all three

2. Create a class `StreamDemo` and in `main`:
   - Create a list of students:
     - `"Alice"`, 22, 3.8
     - `"Bob"`, 20, 2.9
     - `"Charlie"`, 21, 3.5
     - `"Diana"`, 23, 3.9
     - `"Eve"`, 20, 3.2
     - `"Frank"`, 22, 2.7

3. Use streams to:
   - **Count** students with GPA above 3.0 and print the count
   - **Find** the names of honor roll students (GPA >= 3.5), sorted alphabetically, joined as a comma-separated string
   - **Calculate** the average GPA of all students
   - **Find** the student with the highest GPA and print their name

## Expected Output

```
Students above 3.0: 4
Honor roll: Alice, Charlie, Diana
Average GPA: 3.33
Top student: Diana
```

## Hints

- Use `filter().count()` for counting
- Use `filter().map().sorted().collect(Collectors.joining(", "))` for the honor roll
- Use `mapToDouble().average().orElse(0)` for average
- Use `max(Comparator.comparingDouble(...))` for the top student',
  'import java.util.List;
import java.util.Comparator;
import java.util.stream.Collectors;

class Student {
    String name;
    int age;
    double gpa;

    // Constructor

}

public class StreamDemo {
    public static void main(String[] args) {
        // Create student list


        // Count above 3.0


        // Honor roll names


        // Average GPA


        // Top student

    }
}',
  'import java.util.List;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.stream.Collectors;

class Student {
    String name;
    int age;
    double gpa;

    Student(String name, int age, double gpa) {
        this.name = name;
        this.age = age;
        this.gpa = gpa;
    }
}

public class StreamDemo {
    public static void main(String[] args) {
        List<Student> students = new ArrayList<>();
        students.add(new Student("Alice", 22, 3.8));
        students.add(new Student("Bob", 20, 2.9));
        students.add(new Student("Charlie", 21, 3.5));
        students.add(new Student("Diana", 23, 3.9));
        students.add(new Student("Eve", 20, 3.2));
        students.add(new Student("Frank", 22, 2.7));

        long above3 = students.stream()
            .filter(s -> s.gpa > 3.0)
            .count();
        System.out.println("Students above 3.0: " + above3);

        String honorRoll = students.stream()
            .filter(s -> s.gpa >= 3.5)
            .map(s -> s.name)
            .sorted()
            .collect(Collectors.joining(", "));
        System.out.println("Honor roll: " + honorRoll);

        double avgGpa = students.stream()
            .mapToDouble(s -> s.gpa)
            .average()
            .orElse(0);
        System.out.printf("Average GPA: %.2f%n", avgGpa);

        String topStudent = students.stream()
            .max(Comparator.comparingDouble(s -> s.gpa))
            .map(s -> s.name)
            .orElse("None");
        System.out.println("Top student: " + topStudent);
    }
}',
  '{"mustContain":[".stream()","filter","count","map","sorted","Collectors.joining","mapToDouble","average","max","Comparator","System.out.println"],"regexMatch":"\\.stream\\(\\)\\s*\\.filter","methodSignatureExists":"public\\s+static\\s+void\\s+main\\s*\\(\\s*String\\s*\\[\\s*\\]\\s*args\\s*\\)"}'::jsonb,
  700
FROM course_modules m
JOIN courses c ON m.course_id = c.id
WHERE c.title = 'Advanced Java and Enterprise Development' AND m.order_index = 3
ON CONFLICT DO NOTHING;