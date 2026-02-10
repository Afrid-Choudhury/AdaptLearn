/*
  # Create Advanced Java Course Modules and Concurrency Lessons

  1. New Tables / Data
    - Creates 3 modules for the Advanced Java and Enterprise Development course
      - `Concurrency and Multithreading` (order 1, 330 min)
      - `Design Patterns and Architecture` (order 2, 300 min)
      - `Generics, Streams, and Lambdas` (order 3, 330 min)
    - Creates 6 lessons for Module 1: Concurrency and Multithreading

  2. Lessons Added
    - Introduction to Threads (video, 45 min)
    - Creating Threads (reading, 40 min)
    - Synchronization (video, 45 min)
    - Concurrent Collections (video, 40 min)
    - ExecutorService and Thread Pools (reading, 40 min)
    - Concurrency Practice (quiz, 40 min)

  3. Security
    - No RLS changes needed

  4. Important Notes
    - Advanced content with higher complexity
    - Follows emoji-based pattern from beginner/intermediate courses
*/

-- Module 1: Concurrency and Multithreading
INSERT INTO course_modules (course_id, title, description, order_index, estimated_minutes, learning_objectives)
SELECT
  id,
  'Concurrency and Multithreading',
  'Master parallel programming in Java with threads, synchronization, concurrent collections, and executor services.',
  1,
  330,
  '["Understand threads and the thread lifecycle","Create threads with Thread and Runnable","Synchronize shared resources safely","Use concurrent collections for thread-safe data","Manage thread pools with ExecutorService"]'::jsonb
FROM courses WHERE title = 'Advanced Java and Enterprise Development'
ON CONFLICT DO NOTHING;

-- Module 2: Design Patterns and Architecture
INSERT INTO course_modules (course_id, title, description, order_index, estimated_minutes, learning_objectives)
SELECT
  id,
  'Design Patterns and Architecture',
  'Learn classic design patterns that solve recurring software problems. Apply Singleton, Factory, Observer, Strategy, and Builder patterns.',
  2,
  300,
  '["Understand why design patterns exist","Implement creational patterns: Singleton and Factory","Apply behavioral patterns: Observer and Strategy","Use the Builder pattern for complex objects","Choose the right pattern for each problem"]'::jsonb
FROM courses WHERE title = 'Advanced Java and Enterprise Development'
ON CONFLICT DO NOTHING;

-- Module 3: Generics, Streams, and Lambdas
INSERT INTO course_modules (course_id, title, description, order_index, estimated_minutes, learning_objectives)
SELECT
  id,
  'Generics, Streams, and Lambdas',
  'Harness the power of modern Java with generics for type safety, lambda expressions for concise code, and the Streams API for functional data processing.',
  3,
  330,
  '["Write generic classes and methods","Understand bounded type parameters and wildcards","Use lambda expressions and functional interfaces","Process collections with the Streams API","Chain stream operations for powerful data pipelines"]'::jsonb
FROM courses WHERE title = 'Advanced Java and Enterprise Development'
ON CONFLICT DO NOTHING;

-- =============================================
-- Module 1 Lessons: Concurrency and Multithreading
-- =============================================

-- Lesson 1: Introduction to Threads
INSERT INTO course_lessons (module_id, title, description, order_index, estimated_minutes, content_type, content_text)
SELECT
  id,
  'Introduction to Threads',
  'Understand what threads are, why they matter, and how the JVM manages concurrent execution.',
  1,
  45,
  'video',
  '# Introduction to Threads

A thread is an independent path of execution within a program. Multithreading allows your application to perform multiple tasks simultaneously.

## Why Multithreading?

Consider a web server handling 1000 requests. Without threads, it processes them one at a time. With threads, it handles many simultaneously.

**Real-world uses:**
- Web servers handling multiple requests
- GUI applications staying responsive during heavy computation
- Data processing pipelines running stages in parallel
- Game engines updating physics, AI, and rendering concurrently

## Thread vs Process

| Feature | Process | Thread |
|---------|---------|--------|
| Memory | Own memory space | Shares memory with other threads |
| Creation cost | High | Low |
| Communication | Inter-process (complex) | Shared variables (fast) |
| Crash impact | Isolated | Can affect other threads |

## The Thread Lifecycle

```
NEW  -->  RUNNABLE  -->  RUNNING  -->  TERMINATED
              |    \        |
              |     \       v
              |      -> BLOCKED/WAITING
              |              |
              +--------------+
```

| State | Description |
|-------|-------------|
| NEW | Thread created but not started |
| RUNNABLE | Ready to run, waiting for CPU time |
| RUNNING | Currently executing |
| BLOCKED | Waiting for a lock |
| WAITING | Waiting for another thread |
| TERMINATED | Finished execution |

## Your First Thread

```java
public class HelloThread extends Thread {
    @Override
    public void run() {
        System.out.println("Hello from " + Thread.currentThread().getName());
    }
}

public class Main {
    public static void main(String[] args) {
        HelloThread t = new HelloThread();
        t.start();
        System.out.println("Hello from main thread");
    }
}
```

The output order is **not guaranteed** — that is the nature of concurrency.

## The Main Thread

Every Java application has at least one thread: the **main thread**. When you call `main()`, it runs on this thread.

```java
System.out.println(Thread.currentThread().getName());
```

## Common Mistakes

❌ Calling `run()` instead of `start()` (runs on the current thread, not a new one)
❌ Assuming threads execute in a specific order
❌ Ignoring thread safety when sharing data

## Key Takeaways

✓ Threads enable concurrent execution within a single program
✓ Threads share memory, which is fast but requires careful synchronization
✓ Always call `start()` to launch a new thread, not `run()`
✓ Thread execution order is non-deterministic'
FROM course_modules
WHERE title = 'Concurrency and Multithreading'
  AND course_id = (SELECT id FROM courses WHERE title = 'Advanced Java and Enterprise Development')
ON CONFLICT DO NOTHING;

-- Lesson 2: Creating Threads
INSERT INTO course_lessons (module_id, title, description, order_index, estimated_minutes, content_type, content_text)
SELECT
  id,
  'Creating Threads',
  'Learn the three ways to create threads in Java: extending Thread, implementing Runnable, and using lambdas.',
  2,
  40,
  'reading',
  '# Creating Threads

Java provides three main approaches to create threads. Each has its strengths.

## Approach 1: Extending Thread

```java
public class CounterThread extends Thread {
    private String label;

    public CounterThread(String label) {
        this.label = label;
    }

    @Override
    public void run() {
        for (int i = 1; i <= 5; i++) {
            System.out.println(label + ": " + i);
        }
    }
}

public class Main {
    public static void main(String[] args) {
        CounterThread t1 = new CounterThread("Thread-A");
        CounterThread t2 = new CounterThread("Thread-B");
        t1.start();
        t2.start();
    }
}
```

**Limitation:** Java does not support multiple inheritance. If your class already extends another class, it cannot also extend Thread.

## Approach 2: Implementing Runnable

```java
public class CounterTask implements Runnable {
    private String label;

    public CounterTask(String label) {
        this.label = label;
    }

    @Override
    public void run() {
        for (int i = 1; i <= 5; i++) {
            System.out.println(label + ": " + i);
        }
    }
}

public class Main {
    public static void main(String[] args) {
        Thread t1 = new Thread(new CounterTask("Task-A"));
        Thread t2 = new Thread(new CounterTask("Task-B"));
        t1.start();
        t2.start();
    }
}
```

**Preferred** — separates the task from the thread mechanism and allows extending another class.

## Approach 3: Lambda Expressions

```java
public class Main {
    public static void main(String[] args) {
        Thread t1 = new Thread(() -> {
            for (int i = 1; i <= 5; i++) {
                System.out.println("Lambda-A: " + i);
            }
        });

        Thread t2 = new Thread(() -> {
            for (int i = 1; i <= 5; i++) {
                System.out.println("Lambda-B: " + i);
            }
        });

        t1.start();
        t2.start();
    }
}
```

The most concise option for simple tasks.

## Thread.sleep() — Pausing Execution

```java
Thread t = new Thread(() -> {
    for (int i = 1; i <= 3; i++) {
        System.out.println("Working... " + i);
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            System.out.println("Interrupted!");
        }
    }
});
t.start();
```

`sleep(1000)` pauses for 1000 milliseconds (1 second).

## Thread.join() — Waiting for Completion

```java
Thread worker = new Thread(() -> {
    System.out.println("Worker started");
    try { Thread.sleep(2000); } catch (InterruptedException e) {}
    System.out.println("Worker finished");
});

worker.start();
worker.join();
System.out.println("Main continues after worker");
```

`join()` blocks the calling thread until the target thread finishes.

## Comparing Approaches

| Approach | Flexibility | Conciseness | Best For |
|----------|-------------|-------------|----------|
| Extends Thread | Low | Medium | Simple, standalone threads |
| Implements Runnable | High | Medium | Reusable tasks |
| Lambda | High | High | Simple, inline tasks |

## Common Mistakes

❌ Extending Thread when Runnable would be more flexible
❌ Forgetting to handle InterruptedException in sleep/join
❌ Not calling start() (calling run() executes synchronously)

## Key Takeaways

✓ Implementing Runnable is generally preferred over extending Thread
✓ Lambdas provide the most concise thread creation
✓ Use sleep() for delays and join() to wait for thread completion
✓ Always handle InterruptedException in blocking operations'
FROM course_modules
WHERE title = 'Concurrency and Multithreading'
  AND course_id = (SELECT id FROM courses WHERE title = 'Advanced Java and Enterprise Development')
ON CONFLICT DO NOTHING;

-- Lesson 3: Synchronization
INSERT INTO course_lessons (module_id, title, description, order_index, estimated_minutes, content_type, content_text)
SELECT
  id,
  'Synchronization',
  'Learn how to safely share data between threads using synchronized blocks and methods.',
  3,
  45,
  'video',
  '# Synchronization

When multiple threads access shared data, things can go wrong. Synchronization ensures that only one thread can access a critical section at a time.

## The Race Condition Problem

```java
public class Counter {
    private int count = 0;

    public void increment() {
        count++;
    }

    public int getCount() {
        return count;
    }
}
```

If two threads call `increment()` simultaneously, `count++` is not atomic — it reads, adds, and writes in three steps. Both threads might read the same value, and one increment is lost.

## Synchronized Methods

```java
public class Counter {
    private int count = 0;

    public synchronized void increment() {
        count++;
    }

    public synchronized int getCount() {
        return count;
    }
}
```

The `synchronized` keyword ensures only one thread can execute the method at a time.

## Synchronized Blocks

For finer control, synchronize only the critical section:

```java
public class Counter {
    private int count = 0;
    private final Object lock = new Object();

    public void increment() {
        synchronized (lock) {
            count++;
        }
    }
}
```

This is more efficient when only part of the method needs protection.

## Demonstrating the Race Condition

```java
public class RaceDemo {
    static int counter = 0;

    public static void main(String[] args) throws InterruptedException {
        Thread t1 = new Thread(() -> {
            for (int i = 0; i < 100000; i++) counter++;
        });
        Thread t2 = new Thread(() -> {
            for (int i = 0; i < 100000; i++) counter++;
        });

        t1.start();
        t2.start();
        t1.join();
        t2.join();

        System.out.println("Expected: 200000");
        System.out.println("Actual: " + counter);
    }
}
```

The actual value will likely be less than 200000 due to lost updates.

## Volatile Keyword

`volatile` ensures visibility across threads but does **not** provide atomicity:

```java
private volatile boolean running = true;

public void stop() {
    running = false;
}

public void run() {
    while (running) {
        // do work
    }
}
```

Use `volatile` for flags that one thread writes and others read.

## Deadlock

A deadlock occurs when two threads each hold a lock the other needs:

```java
synchronized (lockA) {
    synchronized (lockB) {
        // Thread 1
    }
}

synchronized (lockB) {
    synchronized (lockA) {
        // Thread 2 — potential deadlock!
    }
}
```

**Prevention:** Always acquire locks in the same order.

## Common Mistakes

❌ Forgetting to synchronize all access points to shared data
❌ Over-synchronizing (hurts performance)
❌ Using `volatile` when you need atomicity
❌ Acquiring locks in inconsistent order (causes deadlocks)

## Key Takeaways

✓ Race conditions occur when threads access shared data without synchronization
✓ Use synchronized methods or blocks to protect critical sections
✓ volatile ensures visibility but not atomicity
✓ Prevent deadlocks by acquiring locks in a consistent order'
FROM course_modules
WHERE title = 'Concurrency and Multithreading'
  AND course_id = (SELECT id FROM courses WHERE title = 'Advanced Java and Enterprise Development')
ON CONFLICT DO NOTHING;

-- Lesson 4: Concurrent Collections
INSERT INTO course_lessons (module_id, title, description, order_index, estimated_minutes, content_type, content_text)
SELECT
  id,
  'Concurrent Collections',
  'Use thread-safe collection classes from java.util.concurrent for high-performance concurrent programming.',
  4,
  40,
  'video',
  '# Concurrent Collections

Standard collections like `ArrayList` and `HashMap` are not thread-safe. The `java.util.concurrent` package provides high-performance, thread-safe alternatives.

## The Problem with Regular Collections

```java
Map<String, Integer> map = new HashMap<>();

Thread t1 = new Thread(() -> {
    for (int i = 0; i < 1000; i++) map.put("key" + i, i);
});
Thread t2 = new Thread(() -> {
    for (int i = 0; i < 1000; i++) map.put("other" + i, i);
});

t1.start();
t2.start();
```

This can throw `ConcurrentModificationException` or produce corrupted data.

## ConcurrentHashMap

```java
import java.util.concurrent.ConcurrentHashMap;

Map<String, Integer> scores = new ConcurrentHashMap<>();
scores.put("Alice", 95);
scores.put("Bob", 87);

scores.compute("Alice", (key, val) -> val + 5);
```

Thread-safe without external synchronization. Uses internal segmented locking for high throughput.

## CopyOnWriteArrayList

```java
import java.util.concurrent.CopyOnWriteArrayList;

List<String> logs = new CopyOnWriteArrayList<>();
logs.add("Server started");
logs.add("Connection opened");

for (String log : logs) {
    System.out.println(log);
}
```

Creates a fresh copy of the array on every write. Best when reads vastly outnumber writes.

## BlockingQueue

```java
import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.BlockingQueue;

BlockingQueue<String> queue = new ArrayBlockingQueue<>(10);

Thread producer = new Thread(() -> {
    try {
        queue.put("Task 1");
        queue.put("Task 2");
        queue.put("Task 3");
    } catch (InterruptedException e) {
        Thread.currentThread().interrupt();
    }
});

Thread consumer = new Thread(() -> {
    try {
        while (true) {
            String task = queue.take();
            System.out.println("Processing: " + task);
        }
    } catch (InterruptedException e) {
        Thread.currentThread().interrupt();
    }
});
```

`put()` blocks if the queue is full. `take()` blocks if the queue is empty. This is the classic producer-consumer pattern.

## Choosing the Right Collection

| Need | Use | Instead Of |
|------|-----|-----------|
| Thread-safe map | `ConcurrentHashMap` | `HashMap` |
| Thread-safe list (read-heavy) | `CopyOnWriteArrayList` | `ArrayList` |
| Thread-safe list (write-heavy) | `Collections.synchronizedList` | `ArrayList` |
| Producer-consumer queue | `ArrayBlockingQueue` | `LinkedList` |
| Thread-safe set | `ConcurrentHashMap.newKeySet()` | `HashSet` |

## Atomic Variables

For simple counters, use atomic classes instead of synchronization:

```java
import java.util.concurrent.atomic.AtomicInteger;

AtomicInteger counter = new AtomicInteger(0);
counter.incrementAndGet();
counter.addAndGet(5);
int value = counter.get();
```

Atomic operations are faster than synchronized blocks for simple operations.

## Common Mistakes

❌ Using regular collections in multi-threaded code
❌ Using CopyOnWriteArrayList for write-heavy workloads
❌ Wrapping concurrent collections in additional synchronization

## Key Takeaways

✓ ConcurrentHashMap is the go-to thread-safe map
✓ CopyOnWriteArrayList is ideal for read-heavy, write-light scenarios
✓ BlockingQueue elegantly solves the producer-consumer problem
✓ AtomicInteger and friends provide lock-free thread-safe counters'
FROM course_modules
WHERE title = 'Concurrency and Multithreading'
  AND course_id = (SELECT id FROM courses WHERE title = 'Advanced Java and Enterprise Development')
ON CONFLICT DO NOTHING;

-- Lesson 5: ExecutorService and Thread Pools
INSERT INTO course_lessons (module_id, title, description, order_index, estimated_minutes, content_type, content_text)
SELECT
  id,
  'ExecutorService and Thread Pools',
  'Manage threads efficiently with the Executor framework instead of creating threads manually.',
  5,
  40,
  'reading',
  '# ExecutorService and Thread Pools

Creating threads manually is expensive and hard to manage. The `ExecutorService` framework provides a pool of reusable threads that efficiently execute your tasks.

## Why Thread Pools?

**Without pools:** Creating 1000 threads for 1000 tasks wastes resources.
**With pools:** A pool of 10 threads handles all 1000 tasks by reusing threads.

## Creating a Thread Pool

```java
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

ExecutorService executor = Executors.newFixedThreadPool(4);

for (int i = 1; i <= 10; i++) {
    final int taskId = i;
    executor.submit(() -> {
        System.out.println("Task " + taskId + " on " + Thread.currentThread().getName());
    });
}

executor.shutdown();
```

Four threads handle all ten tasks. When one finishes, it picks up the next.

## Pool Types

```java
ExecutorService fixed = Executors.newFixedThreadPool(4);

ExecutorService cached = Executors.newCachedThreadPool();

ExecutorService single = Executors.newSingleThreadExecutor();

ScheduledExecutorService scheduled = Executors.newScheduledThreadPool(2);
```

| Type | Threads | Best For |
|------|---------|----------|
| Fixed | Fixed count | Known workload, CPU-bound tasks |
| Cached | Grows as needed | Many short-lived tasks |
| Single | One | Sequential task execution |
| Scheduled | Fixed count | Periodic or delayed tasks |

## Getting Results with Future

```java
import java.util.concurrent.Future;

ExecutorService executor = Executors.newFixedThreadPool(2);

Future<Integer> future = executor.submit(() -> {
    Thread.sleep(1000);
    return 42;
});

System.out.println("Doing other work...");
Integer result = future.get();
System.out.println("Result: " + result);

executor.shutdown();
```

`submit()` returns a `Future` that holds the result. `get()` blocks until the result is ready.

## Scheduled Execution

```java
ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);

scheduler.scheduleAtFixedRate(() -> {
    System.out.println("Heartbeat: " + System.currentTimeMillis());
}, 0, 2, TimeUnit.SECONDS);
```

Runs the task every 2 seconds.

## Proper Shutdown

```java
executor.shutdown();

try {
    if (!executor.awaitTermination(5, TimeUnit.SECONDS)) {
        executor.shutdownNow();
    }
} catch (InterruptedException e) {
    executor.shutdownNow();
}
```

1. `shutdown()` — stops accepting new tasks, finishes existing ones
2. `awaitTermination()` — waits for tasks to finish
3. `shutdownNow()` — interrupts running tasks

## Common Mistakes

❌ Forgetting to call `shutdown()` (application hangs)
❌ Creating a new executor for each task
❌ Using `get()` without timeout (can block forever)
❌ Choosing the wrong pool type for your workload

## Key Takeaways

✓ Thread pools reuse threads for better performance and resource management
✓ Use FixedThreadPool for predictable workloads
✓ Future lets you retrieve results from asynchronous tasks
✓ Always shut down executors when done to prevent resource leaks'
FROM course_modules
WHERE title = 'Concurrency and Multithreading'
  AND course_id = (SELECT id FROM courses WHERE title = 'Advanced Java and Enterprise Development')
ON CONFLICT DO NOTHING;

-- Lesson 6: Concurrency Practice
INSERT INTO course_lessons (module_id, title, description, order_index, estimated_minutes, content_type, content_text)
SELECT
  id,
  'Concurrency Practice',
  'Review and test your understanding of threads, synchronization, and concurrent programming.',
  6,
  40,
  'quiz',
  '# Concurrency Practice

Test your mastery of threads, synchronization, concurrent collections, and executor services.

## Review Questions

### 1. Thread Creation
What is the output of calling `run()` vs `start()`?

```java
Thread t = new Thread(() -> System.out.println("Hello from " + Thread.currentThread().getName()));
t.run();
t.start();
```

**Answer:** `run()` prints "Hello from main" (runs on the calling thread). `start()` prints "Hello from Thread-0" (runs on a new thread).

### 2. Race Condition
Two threads each increment a shared counter 100,000 times. The expected result is 200,000. Why might the actual result be lower?

**Answer:** `count++` is not atomic. Both threads can read the same value, increment it, and write back — losing one update. This is a race condition.

### 3. Synchronized vs Volatile
When would you use `volatile` instead of `synchronized`?

**Answer:** Use `volatile` for simple flags where one thread writes and others read. Use `synchronized` when you need atomicity (read-modify-write operations).

### 4. Thread Pool Choice
Which pool type is best for a web server handling unpredictable request volume?

- A) `newFixedThreadPool(4)`
- B) `newCachedThreadPool()`
- C) `newSingleThreadExecutor()`

**Answer:** B — CachedThreadPool dynamically creates threads as needed and reclaims idle ones, ideal for variable workloads.

### 5. Deadlock Prevention
Two methods each acquire locks A and B but in different orders. How do you prevent deadlock?

**Answer:** Always acquire locks in the same order. If method 1 acquires A then B, method 2 must also acquire A then B.

## Concepts Checklist

✓ Threads enable concurrent execution within a program
✓ Synchronization prevents race conditions on shared data
✓ Concurrent collections are thread-safe without external locking
✓ ExecutorService manages thread pools efficiently
✓ Always shut down executors and handle InterruptedException'
FROM course_modules
WHERE title = 'Concurrency and Multithreading'
  AND course_id = (SELECT id FROM courses WHERE title = 'Advanced Java and Enterprise Development')
ON CONFLICT DO NOTHING;