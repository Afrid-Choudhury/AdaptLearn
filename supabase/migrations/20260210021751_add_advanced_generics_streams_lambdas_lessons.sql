/*
  # Add Generics, Streams, and Lambdas Lessons to Advanced Course

  1. New Lessons
    - Introduction to Generics (video, 45 min)
    - Generic Classes and Methods (reading, 40 min)
    - Lambda Expressions (video, 45 min)
    - Streams API (video, 45 min)
    - Functional Interfaces (reading, 40 min)
    - Advanced Java Practice (quiz, 40 min)

  2. Security
    - No RLS changes needed

  3. Important Notes
    - Follows emoji-based pattern from beginner/intermediate courses
    - Covers modern Java features (generics, lambdas, streams)
*/

-- Lesson 1: Introduction to Generics
INSERT INTO course_lessons (module_id, title, description, order_index, estimated_minutes, content_type, content_text)
SELECT
  id,
  'Introduction to Generics',
  'Understand how generics provide compile-time type safety and eliminate casting.',
  1,
  45,
  'video',
  '# Introduction to Generics

Generics enable you to write classes, interfaces, and methods that work with any type while maintaining compile-time type safety.

## The Problem Without Generics

```java
List names = new ArrayList();
names.add("Alice");
names.add(42);
String name = (String) names.get(1);
```

This compiles fine but crashes at runtime with `ClassCastException`. The list accepts anything and forces you to cast.

## The Solution: Generics

```java
List<String> names = new ArrayList<>();
names.add("Alice");
names.add(42);
```

The last line now fails at **compile time** — the error is caught immediately.

## Generic Classes

```java
public class Box<T> {
    private T content;

    public void set(T content) {
        this.content = content;
    }

    public T get() {
        return content;
    }
}
```

Usage:
```java
Box<String> stringBox = new Box<>();
stringBox.set("Hello");
String value = stringBox.get();

Box<Integer> intBox = new Box<>();
intBox.set(42);
int number = intBox.get();
```

`T` is a **type parameter** — a placeholder that gets replaced with a real type when you create an instance.

## Multiple Type Parameters

```java
public class Pair<K, V> {
    private K key;
    private V value;

    public Pair(K key, V value) {
        this.key = key;
        this.value = value;
    }

    public K getKey() { return key; }
    public V getValue() { return value; }
}
```

```java
Pair<String, Integer> score = new Pair<>("Alice", 95);
System.out.println(score.getKey() + ": " + score.getValue());
```

## Type Parameter Naming Conventions

| Letter | Convention |
|--------|-----------|
| T | Type |
| E | Element (collections) |
| K | Key |
| V | Value |
| N | Number |
| S, U | Additional types |

## The Diamond Operator

Java 7 introduced type inference:

```java
List<String> names = new ArrayList<>();
Map<String, List<Integer>> data = new HashMap<>();
```

The `<>` diamond operator infers the type from the left side.

## Generic Methods

```java
public static <T> void printArray(T[] array) {
    for (T element : array) {
        System.out.print(element + " ");
    }
    System.out.println();
}
```

```java
Integer[] nums = {1, 2, 3};
String[] words = {"Hello", "World"};
printArray(nums);
printArray(words);
```

## Common Mistakes

❌ Using raw types (`List` instead of `List<String>`)
❌ Trying to create generic arrays (`new T[10]` does not work)
❌ Ignoring compiler warnings about unchecked operations

## Key Takeaways

✓ Generics provide compile-time type safety, catching errors early
✓ Type parameters like T are placeholders replaced with real types
✓ The diamond operator `<>` simplifies generic instantiation
✓ Always use generics instead of raw types to avoid ClassCastException'
FROM course_modules
WHERE title = 'Generics, Streams, and Lambdas'
  AND course_id = (SELECT id FROM courses WHERE title = 'Advanced Java and Enterprise Development')
ON CONFLICT DO NOTHING;

-- Lesson 2: Generic Classes and Methods
INSERT INTO course_lessons (module_id, title, description, order_index, estimated_minutes, content_type, content_text)
SELECT
  id,
  'Generic Classes and Methods',
  'Dive deeper into bounded type parameters, wildcards, and writing flexible generic code.',
  2,
  40,
  'reading',
  '# Generic Classes and Methods

Beyond basic generics, Java provides bounded types and wildcards for more precise type constraints.

## Bounded Type Parameters

Restrict the types a generic can accept:

```java
public class NumberBox<T extends Number> {
    private T value;

    public NumberBox(T value) {
        this.value = value;
    }

    public double doubleValue() {
        return value.doubleValue();
    }
}
```

```java
NumberBox<Integer> intBox = new NumberBox<>(42);
NumberBox<Double> dblBox = new NumberBox<>(3.14);
NumberBox<String> strBox = new NumberBox<>("oops");
```

The last line fails — String does not extend Number.

## Multiple Bounds

```java
public <T extends Comparable<T> & Serializable> T findMax(T a, T b) {
    return a.compareTo(b) >= 0 ? a : b;
}
```

`T` must implement **both** `Comparable` and `Serializable`.

## Wildcards

### Unbounded: `<?>`
Accepts any type:

```java
public void printList(List<?> list) {
    for (Object item : list) {
        System.out.println(item);
    }
}
```

### Upper Bounded: `<? extends Number>`
Accepts Number or any subclass (for reading):

```java
public double sum(List<? extends Number> numbers) {
    double total = 0;
    for (Number n : numbers) {
        total += n.doubleValue();
    }
    return total;
}
```

Works with `List<Integer>`, `List<Double>`, or `List<Number>`.

### Lower Bounded: `<? super Integer>`
Accepts Integer or any superclass (for writing):

```java
public void addNumbers(List<? super Integer> list) {
    list.add(1);
    list.add(2);
    list.add(3);
}
```

## The PECS Principle

**P**roducer **E**xtends, **C**onsumer **S**uper:

- If you **read** from a collection, use `<? extends T>` (producer)
- If you **write** to a collection, use `<? super T>` (consumer)
- If you do both, use exact type `<T>`

```java
public <T> void copy(List<? extends T> source, List<? super T> dest) {
    for (T item : source) {
        dest.add(item);
    }
}
```

## Generic Methods in Non-Generic Classes

```java
public class Utility {
    public static <T> List<T> listOf(T... items) {
        List<T> list = new ArrayList<>();
        for (T item : items) {
            list.add(item);
        }
        return list;
    }

    public static <T extends Comparable<T>> T max(T a, T b) {
        return a.compareTo(b) >= 0 ? a : b;
    }
}
```

```java
List<String> names = Utility.listOf("Alice", "Bob");
String bigger = Utility.max("Apple", "Banana");
```

## Type Erasure

Generics are a compile-time feature. At runtime, all type information is erased:

```java
List<String> strings = new ArrayList<>();
List<Integer> integers = new ArrayList<>();
System.out.println(strings.getClass() == integers.getClass());
```

This prints `true` — both are just `ArrayList` at runtime.

## Common Mistakes

❌ Using `List<Object>` when you mean `List<?>` (they are different)
❌ Trying to instantiate type parameters (`new T()` does not work)
❌ Ignoring PECS and using exact types everywhere

## Key Takeaways

✓ Bounded types restrict generics to specific type hierarchies
✓ Wildcards (`?`) provide flexibility when exact types are unknown
✓ PECS: use extends for reading, super for writing
✓ Type erasure means generics are enforced at compile time only'
FROM course_modules
WHERE title = 'Generics, Streams, and Lambdas'
  AND course_id = (SELECT id FROM courses WHERE title = 'Advanced Java and Enterprise Development')
ON CONFLICT DO NOTHING;

-- Lesson 3: Lambda Expressions
INSERT INTO course_lessons (module_id, title, description, order_index, estimated_minutes, content_type, content_text)
SELECT
  id,
  'Lambda Expressions',
  'Write concise, functional-style code using Java lambda expressions.',
  3,
  45,
  'video',
  '# Lambda Expressions

Lambda expressions (Java 8+) let you pass behavior as a parameter. They are anonymous functions — code blocks you can store in a variable and pass around.

## Before Lambdas

```java
Collections.sort(names, new Comparator<String>() {
    @Override
    public int compare(String a, String b) {
        return a.compareTo(b);
    }
});
```

## With Lambdas

```java
Collections.sort(names, (a, b) -> a.compareTo(b));
```

Same result, far less boilerplate.

## Lambda Syntax

```
(parameters) -> expression
(parameters) -> { statements; }
```

Examples:
```java
() -> System.out.println("Hello")

(x) -> x * 2

(x, y) -> x + y

(String s) -> {
    String upper = s.toUpperCase();
    return upper;
}
```

## Lambdas with Collections

### Sorting
```java
List<String> names = new ArrayList<>(List.of("Charlie", "Alice", "Bob"));
names.sort((a, b) -> a.compareTo(b));
```

### Filtering with removeIf
```java
List<Integer> numbers = new ArrayList<>(List.of(1, 2, 3, 4, 5, 6));
numbers.removeIf(n -> n % 2 == 0);
```

### Iterating with forEach
```java
names.forEach(name -> System.out.println("Hello, " + name));
```

## Method References

When a lambda just calls an existing method, use a method reference:

```java
names.forEach(System.out::println);

names.sort(String::compareTo);

List<Integer> lengths = names.stream()
    .map(String::length)
    .collect(Collectors.toList());
```

| Type | Lambda | Method Reference |
|------|--------|-----------------|
| Static | `x -> Math.abs(x)` | `Math::abs` |
| Instance | `s -> s.length()` | `String::length` |
| Object | `x -> obj.process(x)` | `obj::process` |
| Constructor | `s -> new Person(s)` | `Person::new` |

## Variable Capture

Lambdas can use local variables, but they must be **effectively final**:

```java
String greeting = "Hello";
names.forEach(name -> System.out.println(greeting + " " + name));

greeting = "Hi";
```

The reassignment causes a compilation error.

## Lambdas vs Anonymous Classes

| Feature | Lambda | Anonymous Class |
|---------|--------|----------------|
| Syntax | Concise | Verbose |
| `this` reference | Enclosing class | Anonymous class itself |
| Interfaces | Single abstract method only | Any interface |
| Performance | Slightly better | Slightly slower |

## Common Mistakes

❌ Using lambdas with interfaces that have multiple abstract methods
❌ Modifying captured variables (must be effectively final)
❌ Writing complex logic in lambdas (extract to a method instead)

## Key Takeaways

✓ Lambdas are concise anonymous functions for single-method interfaces
✓ Method references are even shorter when a lambda just delegates
✓ Captured variables must be effectively final
✓ Lambdas enable a functional programming style in Java'
FROM course_modules
WHERE title = 'Generics, Streams, and Lambdas'
  AND course_id = (SELECT id FROM courses WHERE title = 'Advanced Java and Enterprise Development')
ON CONFLICT DO NOTHING;

-- Lesson 4: Streams API
INSERT INTO course_lessons (module_id, title, description, order_index, estimated_minutes, content_type, content_text)
SELECT
  id,
  'Streams API',
  'Process collections declaratively using the powerful Streams API pipeline operations.',
  4,
  45,
  'video',
  '# Streams API

The Streams API (Java 8+) lets you process collections declaratively — saying **what** you want rather than **how** to do it. Think of it as a pipeline: data flows through a series of transformations.

## Creating a Stream

```java
List<String> names = List.of("Alice", "Bob", "Charlie", "Diana", "Eve");

names.stream()
    .filter(name -> name.length() > 3)
    .map(String::toUpperCase)
    .forEach(System.out::println);
```

Output:
```
ALICE
CHARLIE
DIANA
```

## Stream Pipeline Structure

```
Source  ->  Intermediate Operations  ->  Terminal Operation
(List)      (filter, map, sorted)       (forEach, collect, count)
```

## Intermediate Operations (Lazy)

These return a new stream and are not executed until a terminal operation is called.

### filter — keep elements matching a condition
```java
List<Integer> evens = numbers.stream()
    .filter(n -> n % 2 == 0)
    .collect(Collectors.toList());
```

### map — transform each element
```java
List<Integer> lengths = names.stream()
    .map(String::length)
    .collect(Collectors.toList());
```

### sorted — sort elements
```java
List<String> sorted = names.stream()
    .sorted()
    .collect(Collectors.toList());
```

### distinct — remove duplicates
```java
List<Integer> unique = List.of(1, 2, 2, 3, 3, 3).stream()
    .distinct()
    .collect(Collectors.toList());
```

### limit and skip
```java
List<Integer> firstThree = numbers.stream()
    .limit(3)
    .collect(Collectors.toList());

List<Integer> skipTwo = numbers.stream()
    .skip(2)
    .collect(Collectors.toList());
```

## Terminal Operations (Trigger Execution)

### collect — gather results into a collection
```java
List<String> result = stream.collect(Collectors.toList());
Set<String> resultSet = stream.collect(Collectors.toSet());
String joined = stream.collect(Collectors.joining(", "));
```

### forEach — perform an action on each element
```java
names.stream().forEach(System.out::println);
```

### count, min, max
```java
long count = names.stream().count();

Optional<String> shortest = names.stream()
    .min(Comparator.comparingInt(String::length));

Optional<Integer> max = numbers.stream().max(Integer::compareTo);
```

### reduce — combine elements into a single result
```java
int sum = List.of(1, 2, 3, 4, 5).stream()
    .reduce(0, Integer::sum);

String concatenated = names.stream()
    .reduce("", (a, b) -> a + " " + b);
```

## Practical Examples

### Filter and transform
```java
List<String> upperLongNames = names.stream()
    .filter(n -> n.length() > 3)
    .map(String::toUpperCase)
    .sorted()
    .collect(Collectors.toList());
```

### Sum with mapToInt
```java
int totalLength = names.stream()
    .mapToInt(String::length)
    .sum();
```

### Grouping
```java
Map<Integer, List<String>> byLength = names.stream()
    .collect(Collectors.groupingBy(String::length));
```

## Streams Are Single-Use

```java
Stream<String> stream = names.stream();
stream.forEach(System.out::println);
stream.forEach(System.out::println);
```

The second call throws `IllegalStateException`. Create a new stream each time.

## Common Mistakes

❌ Reusing a stream after a terminal operation
❌ Using streams for simple loops (over-engineering)
❌ Performing side effects in intermediate operations

## Key Takeaways

✓ Streams provide a declarative way to process collections
✓ Intermediate operations are lazy; terminal operations trigger execution
✓ filter, map, sorted are the most common intermediate operations
✓ collect, forEach, reduce are the most common terminal operations'
FROM course_modules
WHERE title = 'Generics, Streams, and Lambdas'
  AND course_id = (SELECT id FROM courses WHERE title = 'Advanced Java and Enterprise Development')
ON CONFLICT DO NOTHING;

-- Lesson 5: Functional Interfaces
INSERT INTO course_lessons (module_id, title, description, order_index, estimated_minutes, content_type, content_text)
SELECT
  id,
  'Functional Interfaces',
  'Master the built-in functional interfaces that power lambdas and the Streams API.',
  5,
  40,
  'reading',
  '# Functional Interfaces

A functional interface has exactly one abstract method. They are the foundation for lambda expressions — every lambda targets a functional interface.

## The @FunctionalInterface Annotation

```java
@FunctionalInterface
public interface Transformer<T, R> {
    R transform(T input);
}
```

The annotation is optional but recommended — it causes a compile error if someone adds a second abstract method.

## Built-in Functional Interfaces

Java provides these in `java.util.function`:

### Predicate<T> — tests a condition
```java
Predicate<String> isLong = s -> s.length() > 5;
System.out.println(isLong.test("Hello"));
System.out.println(isLong.test("Hello World"));
```

Used by: `filter()`, `removeIf()`

### Function<T, R> — transforms input to output
```java
Function<String, Integer> toLength = String::length;
System.out.println(toLength.apply("Hello"));
```

Used by: `map()`

### Consumer<T> — accepts input, returns nothing
```java
Consumer<String> printer = System.out::println;
printer.accept("Hello!");
```

Used by: `forEach()`

### Supplier<T> — returns a value, takes no input
```java
Supplier<Double> random = Math::random;
System.out.println(random.get());
```

Used by: `orElseGet()`

### UnaryOperator<T> — transforms T to T
```java
UnaryOperator<String> shout = s -> s.toUpperCase() + "!";
System.out.println(shout.apply("hello"));
```

### BinaryOperator<T> — combines two T values into one
```java
BinaryOperator<Integer> add = Integer::sum;
System.out.println(add.apply(3, 4));
```

Used by: `reduce()`

## Chaining with Default Methods

### Predicate chaining
```java
Predicate<String> isShort = s -> s.length() < 4;
Predicate<String> startsWithA = s -> s.startsWith("A");

Predicate<String> shortAndStartsWithA = isShort.and(startsWithA);
Predicate<String> shortOrStartsWithA = isShort.or(startsWithA);
Predicate<String> notShort = isShort.negate();
```

### Function chaining
```java
Function<String, String> trim = String::trim;
Function<String, String> upper = String::toUpperCase;

Function<String, String> cleanUp = trim.andThen(upper);
System.out.println(cleanUp.apply("  hello  "));
```

## Summary Table

| Interface | Method | Input | Output |
|-----------|--------|-------|--------|
| Predicate<T> | test(T) | T | boolean |
| Function<T,R> | apply(T) | T | R |
| Consumer<T> | accept(T) | T | void |
| Supplier<T> | get() | none | T |
| UnaryOperator<T> | apply(T) | T | T |
| BinaryOperator<T> | apply(T,T) | T, T | T |

## Creating Custom Functional Interfaces

```java
@FunctionalInterface
public interface Validator<T> {
    boolean isValid(T item);
}

Validator<String> emailValidator = email -> email.contains("@");
System.out.println(emailValidator.isValid("test@mail.com"));
```

## Common Mistakes

❌ Creating custom functional interfaces when a built-in one exists
❌ Forgetting that functional interfaces have exactly one abstract method
❌ Not using `@FunctionalInterface` annotation (allows accidental breakage)

## Key Takeaways

✓ Functional interfaces have exactly one abstract method
✓ Java provides Predicate, Function, Consumer, and Supplier out of the box
✓ Chaining with and(), or(), andThen() builds complex logic from simple parts
✓ Every lambda expression targets a functional interface'
FROM course_modules
WHERE title = 'Generics, Streams, and Lambdas'
  AND course_id = (SELECT id FROM courses WHERE title = 'Advanced Java and Enterprise Development')
ON CONFLICT DO NOTHING;

-- Lesson 6: Advanced Java Practice
INSERT INTO course_lessons (module_id, title, description, order_index, estimated_minutes, content_type, content_text)
SELECT
  id,
  'Advanced Java Practice',
  'Review and test your understanding of generics, lambdas, streams, and functional interfaces.',
  6,
  40,
  'quiz',
  '# Advanced Java Practice

Test your mastery of generics, lambda expressions, the Streams API, and functional interfaces.

## Review Questions

### 1. Generic Bounds
What does `<T extends Comparable<T>>` mean?

**Answer:** T must be a type that implements the Comparable interface for its own type. This ensures you can compare objects of type T with each other.

### 2. PECS
Given this method signature, should the parameter use `extends` or `super`?

```java
public void addIntegers(List<???> list) {
    list.add(1);
    list.add(2);
}
```

**Answer:** `<? super Integer>` — you are **writing** to the list, so use `super` (Consumer).

### 3. Lambda to Method Reference
Convert this lambda to a method reference:

```java
names.stream().map(s -> s.toUpperCase())
```

**Answer:** `names.stream().map(String::toUpperCase)`

### 4. Stream Pipeline
What does this produce?

```java
List.of(1, 2, 3, 4, 5, 6).stream()
    .filter(n -> n % 2 == 0)
    .map(n -> n * n)
    .reduce(0, Integer::sum);
```

**Answer:** `56` — filters to [2, 4, 6], squares to [4, 16, 36], sums to 56.

### 5. Functional Interface Match
Match each lambda to its functional interface:

| Lambda | Interface |
|--------|-----------|
| `s -> s.length() > 5` | Predicate<String> |
| `s -> s.toUpperCase()` | Function<String, String> |
| `s -> System.out.println(s)` | Consumer<String> |
| `() -> new ArrayList<>()` | Supplier<List> |

## Concepts Checklist

✓ Generics provide compile-time type safety with type parameters
✓ Bounded types and wildcards control which types are accepted
✓ Lambdas are concise anonymous functions for functional interfaces
✓ Streams process collections with filter, map, reduce pipelines
✓ Java provides Predicate, Function, Consumer, Supplier as core interfaces'
FROM course_modules
WHERE title = 'Generics, Streams, and Lambdas'
  AND course_id = (SELECT id FROM courses WHERE title = 'Advanced Java and Enterprise Development')
ON CONFLICT DO NOTHING;