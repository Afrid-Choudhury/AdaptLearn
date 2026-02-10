/*
  # Create Intermediate Java Course Modules and Collections Lessons

  1. New Tables / Data
    - Creates 3 modules for the Intermediate Java Development course
      - `Collections Framework` (order 1, 300 min)
      - `Exception Handling` (order 2, 270 min)
      - `File I/O and Serialization` (order 3, 300 min)
    - Creates 6 lessons for Module 1: Collections Framework

  2. Lessons Added
    - Introduction to Collections (video, 35 min)
    - Lists and ArrayLists (reading, 40 min)
    - Sets and HashSets (video, 35 min)
    - Maps and HashMaps (video, 40 min)
    - Iterators and Enhanced For Loops (reading, 30 min)
    - Collections Practice (quiz, 35 min)

  3. Security
    - No RLS changes needed (uses existing table policies)

  4. Important Notes
    - All module references use title-based subqueries (no hardcoded UUIDs)
    - Lesson content follows the emoji-based pattern from the beginner course
*/

-- Module 1: Collections Framework
INSERT INTO course_modules (course_id, title, description, order_index, estimated_minutes, learning_objectives)
SELECT
  id,
  'Collections Framework',
  'Master Java collections including Lists, Sets, Maps, and iterators to efficiently store and manipulate data.',
  1,
  300,
  '["Understand the Java Collections hierarchy","Work with Lists and ArrayLists","Use Sets for unique collections","Store key-value pairs with Maps","Iterate collections with enhanced loops and iterators"]'::jsonb
FROM courses WHERE title = 'Intermediate Java Development'
ON CONFLICT DO NOTHING;

-- Module 2: Exception Handling
INSERT INTO course_modules (course_id, title, description, order_index, estimated_minutes, learning_objectives)
SELECT
  id,
  'Exception Handling',
  'Learn to write resilient Java programs by catching, handling, and creating custom exceptions.',
  2,
  270,
  '["Understand checked vs unchecked exceptions","Use try-catch-finally blocks effectively","Create custom exception classes","Apply best practices for error handling","Manage resources with try-with-resources"]'::jsonb
FROM courses WHERE title = 'Intermediate Java Development'
ON CONFLICT DO NOTHING;

-- Module 3: File I/O and Serialization
INSERT INTO course_modules (course_id, title, description, order_index, estimated_minutes, learning_objectives)
SELECT
  id,
  'File I/O and Serialization',
  'Read, write, and manipulate files in Java. Learn serialization to persist objects to disk.',
  3,
  300,
  '["Read and write text files","Use buffered streams for performance","Serialize and deserialize Java objects","Work with the NIO.2 API","Handle file operations safely"]'::jsonb
FROM courses WHERE title = 'Intermediate Java Development'
ON CONFLICT DO NOTHING;

-- =============================================
-- Module 1 Lessons: Collections Framework
-- =============================================

-- Lesson 1: Introduction to Collections
INSERT INTO course_lessons (module_id, title, description, order_index, estimated_minutes, content_type, content_text)
SELECT
  id,
  'Introduction to Collections',
  'Explore the Java Collections Framework and understand the core interfaces that power data structures in Java.',
  1,
  35,
  'video',
  '# Introduction to Collections

The Java Collections Framework provides a unified architecture for storing and manipulating groups of objects. Instead of managing raw arrays, collections give you powerful, flexible data structures right out of the box.

## Why Collections?

Arrays have limitations:

```java
int[] numbers = new int[5];
```

- Fixed size — cannot grow or shrink
- No built-in methods for searching or sorting
- Difficult to insert or remove elements

Collections solve all of these problems.

## The Collections Hierarchy

```
          Iterable
             |
         Collection
        /    |     \
     List   Set   Queue
      |      |      |
  ArrayList HashSet PriorityQueue
  LinkedList TreeSet ArrayDeque
```

## Core Interfaces

### List
An ordered collection that allows duplicates.

```java
List<String> names = new ArrayList<>();
names.add("Alice");
names.add("Bob");
names.add("Alice");
System.out.println(names);
```

### Set
A collection that does **not** allow duplicates.

```java
Set<String> unique = new HashSet<>();
unique.add("Java");
unique.add("Python");
unique.add("Java");
System.out.println(unique.size());
```

### Map
Stores key-value pairs (not part of Collection interface, but part of the framework).

```java
Map<String, Integer> ages = new HashMap<>();
ages.put("Alice", 25);
ages.put("Bob", 30);
System.out.println(ages.get("Alice"));
```

## Importing Collections

```java
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
```

## Common Mistakes

❌ Using raw types instead of generics (`ArrayList` vs `ArrayList<String>`)
❌ Forgetting to import collection classes
❌ Confusing List (ordered, duplicates) with Set (unordered, unique)

## Key Takeaways

✓ The Collections Framework replaces manual array management
✓ List, Set, and Map are the three core structures
✓ Always use generics to ensure type safety
✓ Choose the right collection based on your data requirements'
FROM course_modules
WHERE title = 'Collections Framework'
  AND course_id = (SELECT id FROM courses WHERE title = 'Intermediate Java Development')
ON CONFLICT DO NOTHING;

-- Lesson 2: Lists and ArrayLists
INSERT INTO course_lessons (module_id, title, description, order_index, estimated_minutes, content_type, content_text)
SELECT
  id,
  'Lists and ArrayLists',
  'Deep dive into the List interface and its most common implementation, ArrayList.',
  2,
  40,
  'reading',
  '# Lists and ArrayLists

The `List` interface represents an ordered collection where elements can be accessed by their index. `ArrayList` is the most widely used implementation.

## Creating an ArrayList

```java
import java.util.ArrayList;
import java.util.List;

List<String> fruits = new ArrayList<>();
```

Always declare with the **interface type** (`List`) for flexibility.

## Adding Elements

```java
fruits.add("Apple");
fruits.add("Banana");
fruits.add("Cherry");
fruits.add(1, "Blueberry");
```

The last line inserts "Blueberry" at index 1, shifting other elements.

## Accessing Elements

```java
String first = fruits.get(0);
int size = fruits.size();
boolean hasApple = fruits.contains("Apple");
int index = fruits.indexOf("Cherry");
```

## Removing Elements

```java
fruits.remove("Banana");
fruits.remove(0);
```

## Iterating Over a List

### Enhanced For Loop
```java
for (String fruit : fruits) {
    System.out.println(fruit);
}
```

### Traditional For Loop
```java
for (int i = 0; i < fruits.size(); i++) {
    System.out.println(fruits.get(i));
}
```

## Useful List Methods

| Method | Description |
|--------|-------------|
| `add(element)` | Appends to end |
| `add(index, element)` | Inserts at position |
| `get(index)` | Returns element at index |
| `set(index, element)` | Replaces element at index |
| `remove(index)` | Removes by position |
| `remove(object)` | Removes first occurrence |
| `size()` | Returns number of elements |
| `isEmpty()` | Returns true if empty |
| `contains(object)` | Checks if element exists |
| `clear()` | Removes all elements |

## ArrayList vs LinkedList

**ArrayList:**
- Fast random access (`get` by index)
- Slower insertions in the middle

**LinkedList:**
- Fast insertions and deletions
- Slower random access

## Sorting a List

```java
import java.util.Collections;

List<Integer> numbers = new ArrayList<>();
numbers.add(42);
numbers.add(7);
numbers.add(19);
Collections.sort(numbers);
System.out.println(numbers);
```

## Common Mistakes

❌ Using `==` to compare list contents (use `.equals()`)
❌ Modifying a list while iterating with a for-each loop
❌ Accessing an index out of bounds

## Key Takeaways

✓ ArrayList is a resizable, ordered collection
✓ Declare variables using the List interface for flexibility
✓ Use generics to enforce type safety
✓ Collections.sort() provides easy sorting'
FROM course_modules
WHERE title = 'Collections Framework'
  AND course_id = (SELECT id FROM courses WHERE title = 'Intermediate Java Development')
ON CONFLICT DO NOTHING;

-- Lesson 3: Sets and HashSets
INSERT INTO course_lessons (module_id, title, description, order_index, estimated_minutes, content_type, content_text)
SELECT
  id,
  'Sets and HashSets',
  'Learn to store unique elements and perform set operations like union, intersection, and difference.',
  3,
  35,
  'video',
  '# Sets and HashSets

A `Set` is a collection that contains **no duplicate elements**. The most common implementation is `HashSet`.

## Creating a HashSet

```java
import java.util.HashSet;
import java.util.Set;

Set<String> languages = new HashSet<>();
languages.add("Java");
languages.add("Python");
languages.add("Java");
System.out.println(languages.size());
```

The duplicate "Java" is silently ignored. Size is 2.

## When to Use a Set

- Removing duplicates from data
- Fast membership checking ("Is this item in the collection?")
- Mathematical set operations (union, intersection)

## Set Operations

### Union (combine two sets)
```java
Set<Integer> setA = new HashSet<>(List.of(1, 2, 3));
Set<Integer> setB = new HashSet<>(List.of(3, 4, 5));

Set<Integer> union = new HashSet<>(setA);
union.addAll(setB);
System.out.println(union);
```

### Intersection (common elements)
```java
Set<Integer> intersection = new HashSet<>(setA);
intersection.retainAll(setB);
System.out.println(intersection);
```

### Difference (in A but not in B)
```java
Set<Integer> difference = new HashSet<>(setA);
difference.removeAll(setB);
System.out.println(difference);
```

## TreeSet: Sorted Order

```java
import java.util.TreeSet;

Set<String> sorted = new TreeSet<>();
sorted.add("Cherry");
sorted.add("Apple");
sorted.add("Banana");
System.out.println(sorted);
```

A `TreeSet` keeps elements in natural sorted order.

## LinkedHashSet: Insertion Order

```java
import java.util.LinkedHashSet;

Set<String> ordered = new LinkedHashSet<>();
ordered.add("First");
ordered.add("Second");
ordered.add("Third");
System.out.println(ordered);
```

Maintains the order in which elements were added.

## The equals() and hashCode() Contract

For custom objects in a HashSet, you **must** override both `equals()` and `hashCode()`:

```java
public class Student {
    String name;
    int id;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Student)) return false;
        Student s = (Student) o;
        return id == s.id && name.equals(s.name);
    }

    @Override
    public int hashCode() {
        return Objects.hash(name, id);
    }
}
```

## Common Mistakes

❌ Expecting a HashSet to maintain insertion order
❌ Not overriding `hashCode()` when overriding `equals()`
❌ Trying to access elements by index (Sets have no index)

## Key Takeaways

✓ Sets automatically prevent duplicate elements
✓ HashSet is fast but unordered; TreeSet is sorted; LinkedHashSet preserves insertion order
✓ Set operations (union, intersection, difference) are built in
✓ Custom objects need proper equals() and hashCode() implementations'
FROM course_modules
WHERE title = 'Collections Framework'
  AND course_id = (SELECT id FROM courses WHERE title = 'Intermediate Java Development')
ON CONFLICT DO NOTHING;

-- Lesson 4: Maps and HashMaps
INSERT INTO course_lessons (module_id, title, description, order_index, estimated_minutes, content_type, content_text)
SELECT
  id,
  'Maps and HashMaps',
  'Store and retrieve data using key-value pairs with the Map interface.',
  4,
  40,
  'video',
  '# Maps and HashMaps

A `Map` stores data as **key-value pairs**. Each key maps to exactly one value. Think of it like a dictionary: look up a word (key) to find its definition (value).

## Creating a HashMap

```java
import java.util.HashMap;
import java.util.Map;

Map<String, Integer> scores = new HashMap<>();
scores.put("Alice", 95);
scores.put("Bob", 87);
scores.put("Charlie", 92);
```

## Accessing Values

```java
int aliceScore = scores.get("Alice");
System.out.println(aliceScore);

int missing = scores.getOrDefault("Dave", 0);
System.out.println(missing);
```

`getOrDefault` returns a fallback if the key does not exist — safer than `get`.

## Checking Keys and Values

```java
boolean hasAlice = scores.containsKey("Alice");
boolean has100 = scores.containsValue(100);
```

## Updating and Removing

```java
scores.put("Alice", 98);
scores.remove("Bob");
```

Calling `put` with an existing key replaces its value.

## Iterating Over a Map

### Loop through entries
```java
for (Map.Entry<String, Integer> entry : scores.entrySet()) {
    System.out.println(entry.getKey() + ": " + entry.getValue());
}
```

### Loop through keys only
```java
for (String name : scores.keySet()) {
    System.out.println(name);
}
```

### Loop through values only
```java
for (int score : scores.values()) {
    System.out.println(score);
}
```

## TreeMap: Sorted Keys

```java
import java.util.TreeMap;

Map<String, Integer> sorted = new TreeMap<>(scores);
System.out.println(sorted);
```

A `TreeMap` maintains keys in natural sorted order.

## Practical Example: Word Counter

```java
String text = "the cat sat on the mat the cat";
String[] words = text.split(" ");

Map<String, Integer> wordCount = new HashMap<>();
for (String word : words) {
    wordCount.put(word, wordCount.getOrDefault(word, 0) + 1);
}
System.out.println(wordCount);
```

## Common Mistakes

❌ Calling `get()` on a nonexistent key without checking (returns null)
❌ Using mutable objects as map keys
❌ Forgetting that HashMap does not maintain insertion order

## Key Takeaways

✓ Maps store key-value pairs where each key is unique
✓ Use `getOrDefault` to avoid null pointer issues
✓ Iterate with `entrySet()`, `keySet()`, or `values()`
✓ TreeMap sorts by key; LinkedHashMap preserves insertion order'
FROM course_modules
WHERE title = 'Collections Framework'
  AND course_id = (SELECT id FROM courses WHERE title = 'Intermediate Java Development')
ON CONFLICT DO NOTHING;

-- Lesson 5: Iterators and Enhanced For Loops
INSERT INTO course_lessons (module_id, title, description, order_index, estimated_minutes, content_type, content_text)
SELECT
  id,
  'Iterators and Enhanced For Loops',
  'Master different ways to traverse collections safely and efficiently.',
  5,
  30,
  'reading',
  '# Iterators and Enhanced For Loops

Java provides multiple ways to traverse collections. Understanding each approach helps you choose the right one for each situation.

## The Enhanced For Loop

The simplest way to iterate:

```java
List<String> colors = List.of("Red", "Green", "Blue");

for (String color : colors) {
    System.out.println(color);
}
```

Works with any class that implements `Iterable`.

## The Iterator Interface

For more control, use an `Iterator` directly:

```java
import java.util.Iterator;

List<String> names = new ArrayList<>(List.of("Alice", "Bob", "Charlie"));
Iterator<String> it = names.iterator();

while (it.hasNext()) {
    String name = it.next();
    System.out.println(name);
}
```

## Safe Removal During Iteration

You **cannot** remove elements with a for-each loop:

```java
for (String name : names) {
    if (name.equals("Bob")) {
        names.remove(name);
    }
}
```

This throws `ConcurrentModificationException`.

Use an Iterator instead:

```java
Iterator<String> it = names.iterator();
while (it.hasNext()) {
    if (it.next().equals("Bob")) {
        it.remove();
    }
}
```

## The forEach Method

Java 8 introduced a functional approach:

```java
names.forEach(name -> System.out.println(name));

names.forEach(System.out::println);
```

## ListIterator: Bidirectional Traversal

```java
import java.util.ListIterator;

List<String> items = new ArrayList<>(List.of("A", "B", "C"));
ListIterator<String> lit = items.listIterator();

while (lit.hasNext()) {
    System.out.println(lit.next());
}

while (lit.hasPrevious()) {
    System.out.println(lit.previous());
}
```

`ListIterator` can move both forward and backward, and can also **add** or **set** elements during iteration.

## Comparing Approaches

| Approach | Remove Safe | Index Access | Direction |
|----------|-------------|--------------|-----------|
| Enhanced for | No | No | Forward |
| Iterator | Yes | No | Forward |
| ListIterator | Yes | Yes | Both |
| forEach | No | No | Forward |
| Traditional for | Manual care | Yes | Both |

## Common Mistakes

❌ Modifying a collection inside a for-each loop
❌ Calling `next()` without checking `hasNext()`
❌ Using the wrong iteration approach for your needs

## Key Takeaways

✓ Enhanced for loops are the simplest for read-only traversal
✓ Use Iterator when you need to remove elements during iteration
✓ ListIterator supports bidirectional traversal and modification
✓ forEach with lambdas provides a concise, functional style'
FROM course_modules
WHERE title = 'Collections Framework'
  AND course_id = (SELECT id FROM courses WHERE title = 'Intermediate Java Development')
ON CONFLICT DO NOTHING;

-- Lesson 6: Collections Practice
INSERT INTO course_lessons (module_id, title, description, order_index, estimated_minutes, content_type, content_text)
SELECT
  id,
  'Collections Practice',
  'Review and reinforce your knowledge of the Java Collections Framework.',
  6,
  35,
  'quiz',
  '# Collections Practice

Test your understanding of Lists, Sets, Maps, and iterators with these review exercises.

## Review Questions

### 1. List Basics
What is the output?

```java
List<Integer> nums = new ArrayList<>();
nums.add(10);
nums.add(20);
nums.add(10);
System.out.println(nums.size());
```

**Answer:** `3` — Lists allow duplicates.

### 2. Set Uniqueness
What is the output?

```java
Set<Integer> nums = new HashSet<>();
nums.add(10);
nums.add(20);
nums.add(10);
System.out.println(nums.size());
```

**Answer:** `2` — Sets reject duplicates.

### 3. Map Overwrite
What is the output?

```java
Map<String, Integer> map = new HashMap<>();
map.put("a", 1);
map.put("b", 2);
map.put("a", 3);
System.out.println(map.get("a"));
```

**Answer:** `3` — Putting with an existing key replaces the value.

### 4. Safe Removal
Which approach safely removes elements during iteration?

- A) Enhanced for loop with `remove()`
- B) `Iterator` with `it.remove()`
- C) `forEach` with `remove()`

**Answer:** B — Only `Iterator.remove()` is safe during iteration.

### 5. Choosing the Right Collection

Match each scenario to the best collection:

| Scenario | Best Collection |
|----------|----------------|
| Maintain insertion order, allow duplicates | ArrayList |
| Store unique usernames | HashSet |
| Map student IDs to grades | HashMap |
| Keep elements in sorted order, no duplicates | TreeSet |

## Concepts Checklist

✓ Lists are ordered and allow duplicates
✓ Sets are unordered and reject duplicates
✓ Maps store key-value pairs with unique keys
✓ Use Iterator for safe removal during traversal
✓ Choose TreeSet or TreeMap when you need sorted order'
FROM course_modules
WHERE title = 'Collections Framework'
  AND course_id = (SELECT id FROM courses WHERE title = 'Intermediate Java Development')
ON CONFLICT DO NOTHING;