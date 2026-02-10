/*
  # Add Concurrency Exercises to Advanced Course

  1. New Lessons (Exercises)
    - `Try It: Thread Creation` (order_index 7, 500 XP)
    - `Try It: Synchronized Counter` (order_index 8, 550 XP)
    - `Try It: Thread Pool Task Runner` (order_index 9, 600 XP)

  2. Security
    - No RLS changes needed

  3. Important Notes
    - XP values bumped to 500-600 for advanced difficulty
*/

-- Exercise 1: Thread Creation
INSERT INTO course_lessons (
  module_id, title, description, order_index, estimated_minutes,
  content_type, content_text, starter_code, solution_code, validation_rules, xp_reward
)
SELECT
  m.id,
  'Try It: Thread Creation',
  'Create threads using both Runnable and lambda approaches',
  7, 30, 'exercise',
  '# Try It: Thread Creation

Practice creating threads using multiple approaches and coordinating their execution.

## Your Task

1. Create a class called `ThreadDemo`
2. Create a class `CountdownTask` that implements `Runnable`:
   - Constructor takes a `String label`
   - `run()` prints `"<label>: 3"`, `"<label>: 2"`, `"<label>: 1"`, `"<label>: Done!"`
3. In `main`:
   - Create and start a thread using `CountdownTask` with label `"Runnable"`
   - Create and start a thread using a **lambda** that prints `"Lambda: Go!"`
   - Use `join()` on both threads to wait for them to finish
   - Print `"All threads complete"` at the end

## Expected Output (order of Runnable and Lambda lines may vary)

```
Runnable: 3
Runnable: 2
Runnable: 1
Runnable: Done!
Lambda: Go!
All threads complete
```

## Hints

- Wrap `join()` calls in try-catch for `InterruptedException`
- Call `start()`, not `run()`',
  'class CountdownTask implements Runnable {
    // Constructor and run method

}

public class ThreadDemo {
    public static void main(String[] args) {
        // Create Runnable thread


        // Create Lambda thread


        // Wait for both to finish


        // Print completion message

    }
}',
  'class CountdownTask implements Runnable {
    private String label;

    CountdownTask(String label) {
        this.label = label;
    }

    @Override
    public void run() {
        for (int i = 3; i >= 1; i--) {
            System.out.println(label + ": " + i);
        }
        System.out.println(label + ": Done!");
    }
}

public class ThreadDemo {
    public static void main(String[] args) {
        Thread t1 = new Thread(new CountdownTask("Runnable"));
        Thread t2 = new Thread(() -> System.out.println("Lambda: Go!"));

        t1.start();
        t2.start();

        try {
            t1.join();
            t2.join();
        } catch (InterruptedException e) {
            System.out.println("Interrupted!");
        }

        System.out.println("All threads complete");
    }
}',
  '{"mustContain":["implements Runnable","run()","new Thread","start()","join()","InterruptedException","System.out.println"],"regexMatch":"class\\s+CountdownTask\\s+implements\\s+Runnable","methodSignatureExists":"public\\s+static\\s+void\\s+main\\s*\\(\\s*String\\s*\\[\\s*\\]\\s*args\\s*\\)"}'::jsonb,
  500
FROM course_modules m
JOIN courses c ON m.course_id = c.id
WHERE c.title = 'Advanced Java and Enterprise Development' AND m.order_index = 1
ON CONFLICT DO NOTHING;

-- Exercise 2: Synchronized Counter
INSERT INTO course_lessons (
  module_id, title, description, order_index, estimated_minutes,
  content_type, content_text, starter_code, solution_code, validation_rules, xp_reward
)
SELECT
  m.id,
  'Try It: Synchronized Counter',
  'Fix a race condition using synchronized methods',
  8, 35, 'exercise',
  '# Try It: Synchronized Counter

Experience and fix a race condition by adding synchronization to a shared counter.

## Your Task

1. Create a class `SafeCounter` with:
   - A private `int count` field initialized to 0
   - A **synchronized** method `increment()` that increases count by 1
   - A **synchronized** method `getCount()` that returns the count

2. In `main`:
   - Create one `SafeCounter` instance
   - Create two threads, each calling `increment()` 10,000 times
   - Start both threads, then `join()` both
   - Print the final count (should always be exactly 20,000)

## Expected Output

```
Final count: 20000
```

## Hints

- Both threads share the **same** counter object
- Without `synchronized`, the result would be less than 20,000
- The `synchronized` keyword on both methods ensures thread safety',
  'public class SafeCounter {
    private int count = 0;

    // Add synchronized increment method


    // Add synchronized getCount method


    public static void main(String[] args) throws InterruptedException {
        SafeCounter counter = new SafeCounter();

        // Create two threads that each increment 10000 times


        // Start and join both threads


        // Print the result

    }
}',
  'public class SafeCounter {
    private int count = 0;

    public synchronized void increment() {
        count++;
    }

    public synchronized int getCount() {
        return count;
    }

    public static void main(String[] args) throws InterruptedException {
        SafeCounter counter = new SafeCounter();

        Thread t1 = new Thread(() -> {
            for (int i = 0; i < 10000; i++) {
                counter.increment();
            }
        });

        Thread t2 = new Thread(() -> {
            for (int i = 0; i < 10000; i++) {
                counter.increment();
            }
        });

        t1.start();
        t2.start();
        t1.join();
        t2.join();

        System.out.println("Final count: " + counter.getCount());
    }
}',
  '{"mustContain":["synchronized","increment","getCount","new Thread","start()","join()","System.out.println"],"regexMatch":"public\\s+synchronized\\s+(void\\s+increment|int\\s+getCount)","methodSignatureExists":"public\\s+static\\s+void\\s+main\\s*\\(\\s*String\\s*\\[\\s*\\]\\s*args\\s*\\)"}'::jsonb,
  550
FROM course_modules m
JOIN courses c ON m.course_id = c.id
WHERE c.title = 'Advanced Java and Enterprise Development' AND m.order_index = 1
ON CONFLICT DO NOTHING;

-- Exercise 3: Thread Pool Task Runner
INSERT INTO course_lessons (
  module_id, title, description, order_index, estimated_minutes,
  content_type, content_text, starter_code, solution_code, validation_rules, xp_reward
)
SELECT
  m.id,
  'Try It: Thread Pool Task Runner',
  'Use ExecutorService to run multiple tasks through a fixed thread pool',
  9, 35, 'exercise',
  '# Try It: Thread Pool Task Runner

Use `ExecutorService` to efficiently execute multiple tasks through a fixed-size thread pool.

## Your Task

1. Create a class `TaskRunner`
2. In `main`:
   - Create a `FixedThreadPool` with 3 threads using `Executors.newFixedThreadPool(3)`
   - Submit 6 tasks using a loop. Each task should:
     - Print `"Task <number> started on <threadName>"`
     - Simulate work with `Thread.sleep(500)`
     - Print `"Task <number> completed"`
   - Call `shutdown()` on the executor
   - Call `awaitTermination(10, TimeUnit.SECONDS)` to wait
   - Print `"All tasks finished"`

## Expected Output (thread names may vary)

```
Task 1 started on pool-1-thread-1
Task 2 started on pool-1-thread-2
Task 3 started on pool-1-thread-3
Task 1 completed
Task 4 started on pool-1-thread-1
Task 2 completed
Task 5 started on pool-1-thread-2
Task 3 completed
Task 6 started on pool-1-thread-3
Task 4 completed
Task 5 completed
Task 6 completed
All tasks finished
```

## Hints

- Use `final int taskId = i` inside the loop to capture the value for the lambda
- Always shut down the executor to prevent the program from hanging
- `awaitTermination` blocks until all tasks finish or the timeout expires',
  'import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;

public class TaskRunner {
    public static void main(String[] args) {
        // Create a fixed thread pool with 3 threads


        // Submit 6 tasks


        // Shut down and wait for completion


        // Print final message

    }
}',
  'import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;

public class TaskRunner {
    public static void main(String[] args) {
        ExecutorService executor = Executors.newFixedThreadPool(3);

        for (int i = 1; i <= 6; i++) {
            final int taskId = i;
            executor.submit(() -> {
                System.out.println("Task " + taskId + " started on " + Thread.currentThread().getName());
                try {
                    Thread.sleep(500);
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                }
                System.out.println("Task " + taskId + " completed");
            });
        }

        executor.shutdown();
        try {
            executor.awaitTermination(10, TimeUnit.SECONDS);
        } catch (InterruptedException e) {
            executor.shutdownNow();
        }

        System.out.println("All tasks finished");
    }
}',
  '{"mustContain":["ExecutorService","Executors.newFixedThreadPool","submit","shutdown","awaitTermination","Thread.currentThread().getName","System.out.println"],"regexMatch":"Executors\\.newFixedThreadPool\\s*\\(\\s*3\\s*\\)","methodSignatureExists":"public\\s+static\\s+void\\s+main\\s*\\(\\s*String\\s*\\[\\s*\\]\\s*args\\s*\\)"}'::jsonb,
  600
FROM course_modules m
JOIN courses c ON m.course_id = c.id
WHERE c.title = 'Advanced Java and Enterprise Development' AND m.order_index = 1
ON CONFLICT DO NOTHING;