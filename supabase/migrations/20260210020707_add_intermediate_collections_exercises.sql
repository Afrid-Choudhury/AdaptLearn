/*
  # Add Collections Framework Exercises

  1. New Lessons (Exercises)
    - `Try It: ArrayList Manager` (order_index 7, 350 XP)
    - `Try It: HashMap Phonebook` (order_index 8, 350 XP)
    - `Try It: Set Operations` (order_index 9, 400 XP)

  2. Security
    - No RLS changes needed

  3. Important Notes
    - XP values bumped to 350-400 for intermediate difficulty
    - Uses emoji-based pattern from beginner course
*/

-- Exercise 1: ArrayList Manager
INSERT INTO course_lessons (
  module_id, title, description, order_index, estimated_minutes,
  content_type, content_text, starter_code, solution_code, validation_rules, xp_reward
)
SELECT
  m.id,
  'Try It: ArrayList Manager',
  'Build a task manager using ArrayList operations',
  7, 25, 'exercise',
  '# Try It: ArrayList Manager

Put your ArrayList skills to work by building a simple task manager that adds, removes, and displays tasks.

## Your Task

1. Create an `ArrayList<String>` called `tasks`
2. Add these tasks in order: `"Write code"`, `"Review PR"`, `"Fix bugs"`, `"Write tests"`, `"Deploy"`
3. Remove the task `"Fix bugs"` using the `remove()` method
4. Insert `"Code review"` at index 1 using `add(index, element)`
5. Print the total number of tasks
6. Print each task on its own line using an enhanced for loop

## Expected Output

```
Total tasks: 5
Write code
Code review
Review PR
Write tests
Deploy
```

## Hints

- Use `tasks.remove("Fix bugs")` to remove by value
- Use `tasks.add(1, "Code review")` to insert at a position
- Use `tasks.size()` to get the count',
  'import java.util.ArrayList;
import java.util.List;

public class TaskManager {
    public static void main(String[] args) {
        // Create your ArrayList


        // Add tasks


        // Remove "Fix bugs"


        // Insert "Code review" at index 1


        // Print total and each task

    }
}',
  'import java.util.ArrayList;
import java.util.List;

public class TaskManager {
    public static void main(String[] args) {
        List<String> tasks = new ArrayList<>();
        tasks.add("Write code");
        tasks.add("Review PR");
        tasks.add("Fix bugs");
        tasks.add("Write tests");
        tasks.add("Deploy");

        tasks.remove("Fix bugs");
        tasks.add(1, "Code review");

        System.out.println("Total tasks: " + tasks.size());
        for (String task : tasks) {
            System.out.println(task);
        }
    }
}',
  '{"mustContain":["ArrayList","tasks.add","tasks.remove","tasks.size","System.out.println","for"],"regexMatch":"List<String>\\s+tasks|ArrayList<String>\\s+tasks","methodSignatureExists":"public\\s+static\\s+void\\s+main\\s*\\(\\s*String\\s*\\[\\s*\\]\\s*args\\s*\\)"}'::jsonb,
  350
FROM course_modules m
JOIN courses c ON m.course_id = c.id
WHERE c.title = 'Intermediate Java Development' AND m.order_index = 1
ON CONFLICT DO NOTHING;

-- Exercise 2: HashMap Phonebook
INSERT INTO course_lessons (
  module_id, title, description, order_index, estimated_minutes,
  content_type, content_text, starter_code, solution_code, validation_rules, xp_reward
)
SELECT
  m.id,
  'Try It: HashMap Phonebook',
  'Create a phonebook application using HashMap',
  8, 30, 'exercise',
  '# Try It: HashMap Phonebook

Build a simple phonebook that stores names and phone numbers using a `HashMap`.

## Your Task

1. Create a `HashMap<String, String>` called `phonebook`
2. Add these contacts:
   - `"Alice"` -> `"555-0101"`
   - `"Bob"` -> `"555-0202"`
   - `"Charlie"` -> `"555-0303"`
   - `"Diana"` -> `"555-0404"`
3. Update Bob''s number to `"555-9999"` (just use `put` again)
4. Look up Alice''s number using `get()` and print it
5. Check if `"Eve"` exists using `containsKey()` and print the result
6. Print all contacts using `entrySet()` in a for-each loop

## Expected Output

```
Alice: 555-0101
Eve exists: false
--- All Contacts ---
Alice: 555-0101
Bob: 555-9999
Charlie: 555-0303
Diana: 555-0404
```

## Hints

- `put` with an existing key replaces the value
- `getOrDefault` is safer than `get` for missing keys
- Iterate entries with `Map.Entry<String, String>`',
  'import java.util.HashMap;
import java.util.Map;

public class Phonebook {
    public static void main(String[] args) {
        // Create the HashMap


        // Add contacts


        // Update Bob


        // Look up Alice


        // Check if Eve exists


        // Print all contacts

    }
}',
  'import java.util.HashMap;
import java.util.Map;

public class Phonebook {
    public static void main(String[] args) {
        Map<String, String> phonebook = new HashMap<>();

        phonebook.put("Alice", "555-0101");
        phonebook.put("Bob", "555-0202");
        phonebook.put("Charlie", "555-0303");
        phonebook.put("Diana", "555-0404");

        phonebook.put("Bob", "555-9999");

        System.out.println("Alice: " + phonebook.get("Alice"));
        System.out.println("Eve exists: " + phonebook.containsKey("Eve"));

        System.out.println("--- All Contacts ---");
        for (Map.Entry<String, String> entry : phonebook.entrySet()) {
            System.out.println(entry.getKey() + ": " + entry.getValue());
        }
    }
}',
  '{"mustContain":["HashMap","phonebook.put","phonebook.get","containsKey","entrySet","Map.Entry","System.out.println"],"regexMatch":"Map<String,\\s*String>\\s+phonebook","methodSignatureExists":"public\\s+static\\s+void\\s+main\\s*\\(\\s*String\\s*\\[\\s*\\]\\s*args\\s*\\)"}'::jsonb,
  350
FROM course_modules m
JOIN courses c ON m.course_id = c.id
WHERE c.title = 'Intermediate Java Development' AND m.order_index = 1
ON CONFLICT DO NOTHING;

-- Exercise 3: Set Operations
INSERT INTO course_lessons (
  module_id, title, description, order_index, estimated_minutes,
  content_type, content_text, starter_code, solution_code, validation_rules, xp_reward
)
SELECT
  m.id,
  'Try It: Set Operations',
  'Perform union, intersection, and difference operations on Sets',
  9, 25, 'exercise',
  '# Try It: Set Operations

Practice mathematical set operations by finding common and unique skills between two teams.

## Your Task

1. Create a `HashSet<String>` called `teamA` with: `"Java"`, `"Python"`, `"SQL"`, `"Docker"`
2. Create a `HashSet<String>` called `teamB` with: `"Python"`, `"JavaScript"`, `"SQL"`, `"AWS"`
3. Find the **union** (all skills from both teams) and print it
4. Find the **intersection** (skills both teams share) and print it
5. Find the **difference** (skills only in Team A) and print it

## Expected Output

```
Union: [Java, Python, SQL, Docker, JavaScript, AWS]
Intersection: [Python, SQL]
Only Team A: [Java, Docker]
```

## Hints

- Create new sets for each operation to avoid modifying originals
- `addAll` for union
- `retainAll` for intersection
- `removeAll` for difference',
  'import java.util.HashSet;
import java.util.Set;

public class SetOps {
    public static void main(String[] args) {
        // Create Team A skills


        // Create Team B skills


        // Find union


        // Find intersection


        // Find difference (only in Team A)

    }
}',
  'import java.util.HashSet;
import java.util.Set;

public class SetOps {
    public static void main(String[] args) {
        Set<String> teamA = new HashSet<>();
        teamA.add("Java");
        teamA.add("Python");
        teamA.add("SQL");
        teamA.add("Docker");

        Set<String> teamB = new HashSet<>();
        teamB.add("Python");
        teamB.add("JavaScript");
        teamB.add("SQL");
        teamB.add("AWS");

        Set<String> union = new HashSet<>(teamA);
        union.addAll(teamB);
        System.out.println("Union: " + union);

        Set<String> intersection = new HashSet<>(teamA);
        intersection.retainAll(teamB);
        System.out.println("Intersection: " + intersection);

        Set<String> difference = new HashSet<>(teamA);
        difference.removeAll(teamB);
        System.out.println("Only Team A: " + difference);
    }
}',
  '{"mustContain":["HashSet","teamA","teamB","addAll","retainAll","removeAll","System.out.println"],"regexMatch":"Set<String>\\s+(teamA|union|intersection|difference)","methodSignatureExists":"public\\s+static\\s+void\\s+main\\s*\\(\\s*String\\s*\\[\\s*\\]\\s*args\\s*\\)"}'::jsonb,
  400
FROM course_modules m
JOIN courses c ON m.course_id = c.id
WHERE c.title = 'Intermediate Java Development' AND m.order_index = 1
ON CONFLICT DO NOTHING;