/*
  # Add File I/O Exercises

  1. New Lessons (Exercises)
    - `Try It: File Reader` (order_index 7, 400 XP)
    - `Try It: CSV Writer` (order_index 8, 400 XP)
    - `Try It: Serialize Objects` (order_index 9, 450 XP)

  2. Security
    - No RLS changes needed

  3. Important Notes
    - XP values bumped to 400-450 for intermediate difficulty
*/

-- Exercise 1: File Reader
INSERT INTO course_lessons (
  module_id, title, description, order_index, estimated_minutes,
  content_type, content_text, starter_code, solution_code, validation_rules, xp_reward
)
SELECT
  m.id,
  'Try It: File Reader',
  'Build a program that reads a file and counts lines and words',
  7, 30, 'exercise',
  '# Try It: File Reader

Build a simple text analysis program that reads file content and reports statistics.

## Your Task

1. Create a class called `TextAnalyzer`
2. In `main`, define a multi-line string to simulate file content:
   ```
   String content = "Java is powerful\nPython is simple\nBoth are popular\nCoding is fun";
   ```
3. Split the content into lines using `split("\n")`
4. For each line, count the words by splitting on spaces
5. Print:
   - Total number of lines
   - Total number of words
   - Each line with its word count

## Expected Output

```
Lines: 4
Words: 14
Line 1 (3 words): Java is powerful
Line 2 (3 words): Python is simple
Line 3 (3 words): Both are popular
Line 4 (3 words): Coding is fun
```

## Hints

- `content.split("\n")` gives you an array of lines
- `line.split(" ").length` counts words in a line
- Use a counter variable to track total words',
  'public class TextAnalyzer {
    public static void main(String[] args) {
        String content = "Java is powerful\nPython is simple\nBoth are popular\nCoding is fun";

        // Split into lines


        // Count and print statistics

    }
}',
  'public class TextAnalyzer {
    public static void main(String[] args) {
        String content = "Java is powerful\nPython is simple\nBoth are popular\nCoding is fun";

        String[] lines = content.split("\n");
        int totalWords = 0;

        System.out.println("Lines: " + lines.length);

        for (String line : lines) {
            totalWords += line.split(" ").length;
        }
        System.out.println("Words: " + totalWords);

        for (int i = 0; i < lines.length; i++) {
            int wordCount = lines[i].split(" ").length;
            System.out.println("Line " + (i + 1) + " (" + wordCount + " words): " + lines[i]);
        }
    }
}',
  '{"mustContain":["split","lines","totalWords","System.out.println","for"],"regexMatch":"split\\s*\\(\\s*\"\\\\n\"\\s*\\)","methodSignatureExists":"public\\s+static\\s+void\\s+main\\s*\\(\\s*String\\s*\\[\\s*\\]\\s*args\\s*\\)"}'::jsonb,
  400
FROM course_modules m
JOIN courses c ON m.course_id = c.id
WHERE c.title = 'Intermediate Java Development' AND m.order_index = 3
ON CONFLICT DO NOTHING;

-- Exercise 2: CSV Writer
INSERT INTO course_lessons (
  module_id, title, description, order_index, estimated_minutes,
  content_type, content_text, starter_code, solution_code, validation_rules, xp_reward
)
SELECT
  m.id,
  'Try It: CSV Builder',
  'Build a CSV string from structured data using StringBuilder',
  8, 30, 'exercise',
  '# Try It: CSV Builder

Practice building structured text output by creating a CSV (comma-separated values) string from data arrays.

## Your Task

1. Create a class called `CsvBuilder`
2. Define two arrays:
   - `String[] headers = {"Name", "Age", "City"}`
   - `String[][] data` with these rows:
     - `{"Alice", "25", "New York"}`
     - `{"Bob", "30", "London"}`
     - `{"Charlie", "28", "Tokyo"}`
3. Use a `StringBuilder` to build the CSV output:
   - First line: headers joined by commas
   - Following lines: each data row joined by commas
4. Print the complete CSV string

## Expected Output

```
Name,Age,City
Alice,25,New York
Bob,30,London
Charlie,28,Tokyo
```

## Hints

- Use `String.join(",", array)` to join array elements with commas
- `StringBuilder` is more efficient than string concatenation in loops
- Add `"\n"` after each line',
  'public class CsvBuilder {
    public static void main(String[] args) {
        String[] headers = {"Name", "Age", "City"};
        String[][] data = {
            {"Alice", "25", "New York"},
            {"Bob", "30", "London"},
            {"Charlie", "28", "Tokyo"}
        };

        // Build CSV string using StringBuilder


        // Print the result

    }
}',
  'public class CsvBuilder {
    public static void main(String[] args) {
        String[] headers = {"Name", "Age", "City"};
        String[][] data = {
            {"Alice", "25", "New York"},
            {"Bob", "30", "London"},
            {"Charlie", "28", "Tokyo"}
        };

        StringBuilder csv = new StringBuilder();
        csv.append(String.join(",", headers));
        csv.append("\n");

        for (String[] row : data) {
            csv.append(String.join(",", row));
            csv.append("\n");
        }

        System.out.print(csv.toString());
    }
}',
  '{"mustContain":["StringBuilder","String.join","headers","data","append","System.out"],"regexMatch":"StringBuilder\\s+csv|new\\s+StringBuilder","methodSignatureExists":"public\\s+static\\s+void\\s+main\\s*\\(\\s*String\\s*\\[\\s*\\]\\s*args\\s*\\)"}'::jsonb,
  400
FROM course_modules m
JOIN courses c ON m.course_id = c.id
WHERE c.title = 'Intermediate Java Development' AND m.order_index = 3
ON CONFLICT DO NOTHING;

-- Exercise 3: Serialize Objects
INSERT INTO course_lessons (
  module_id, title, description, order_index, estimated_minutes,
  content_type, content_text, starter_code, solution_code, validation_rules, xp_reward
)
SELECT
  m.id,
  'Try It: Serialize Objects',
  'Create a serializable class and demonstrate the serialization concept',
  9, 35, 'exercise',
  '# Try It: Serialize Objects

Practice the concept of serialization by creating a class that implements `Serializable` and simulating save/load operations.

## Your Task

1. Create a class `GameSave` that implements `Serializable`:
   - Fields: `String playerName`, `int level`, `int score`, `transient String sessionId`
   - Constructor that takes all four parameters
   - A `toString()` method that shows all fields

2. In `main`:
   - Create a `GameSave` with: `"Hero"`, level `15`, score `28500`, sessionId `"abc123"`
   - Print the object before "saving"
   - Simulate what happens after deserialization by creating a new object with the same values but `null` for sessionId
   - Print the "loaded" object to show transient field behavior

## Expected Output

```
Before save: Hero | Level 15 | Score 28500 | Session: abc123
After load:  Hero | Level 15 | Score 28500 | Session: null
```

## Hints

- `transient` fields become their default value (null for objects) after deserialization
- `implements Serializable` is a marker interface (no methods to implement)
- Include `private static final long serialVersionUID = 1L;`',
  'import java.io.Serializable;

class GameSave implements Serializable {
    private static final long serialVersionUID = 1L;

    // Declare fields (remember transient for sessionId)


    // Constructor


    // toString method


}

public class SerializeDemo {
    public static void main(String[] args) {
        // Create a GameSave and show before/after behavior

    }
}',
  'import java.io.Serializable;

class GameSave implements Serializable {
    private static final long serialVersionUID = 1L;

    String playerName;
    int level;
    int score;
    transient String sessionId;

    GameSave(String playerName, int level, int score, String sessionId) {
        this.playerName = playerName;
        this.level = level;
        this.score = score;
        this.sessionId = sessionId;
    }

    @Override
    public String toString() {
        return playerName + " | Level " + level + " | Score " + score + " | Session: " + sessionId;
    }
}

public class SerializeDemo {
    public static void main(String[] args) {
        GameSave original = new GameSave("Hero", 15, 28500, "abc123");
        System.out.println("Before save: " + original);

        GameSave loaded = new GameSave("Hero", 15, 28500, null);
        System.out.println("After load:  " + loaded);
    }
}',
  '{"mustContain":["implements Serializable","serialVersionUID","transient","playerName","level","score","sessionId","toString","System.out.println"],"regexMatch":"class\\s+GameSave\\s+implements\\s+Serializable","methodSignatureExists":"public\\s+static\\s+void\\s+main\\s*\\(\\s*String\\s*\\[\\s*\\]\\s*args\\s*\\)"}'::jsonb,
  450
FROM course_modules m
JOIN courses c ON m.course_id = c.id
WHERE c.title = 'Intermediate Java Development' AND m.order_index = 3
ON CONFLICT DO NOTHING;