-- Add solution_code to Intermediate Java exercises

-- Collections Framework exercises
UPDATE course_lessons SET solution_code = 'import java.util.ArrayList;
import java.util.List;

public class TaskManager {
    public static void main(String[] args) {
        List<String> tasks = new ArrayList<>();

        tasks.add("Write code");
        tasks.add("Fix bugs");
        tasks.add("Write tests");
        tasks.add("Deploy app");

        tasks.remove("Fix bugs");

        tasks.add(1, "Code review");

        System.out.println("Total tasks: " + tasks.size());
        for (String task : tasks) {
            System.out.println("- " + task);
        }
    }
}'
WHERE id = '7e120d4e-387a-4cff-a38e-4111b97cc26d';

UPDATE course_lessons SET solution_code = 'import java.util.HashMap;
import java.util.Map;

public class Phonebook {
    public static void main(String[] args) {
        Map<String, String> contacts = new HashMap<>();

        contacts.put("Alice", "555-0101");
        contacts.put("Bob", "555-0102");
        contacts.put("Charlie", "555-0103");

        contacts.put("Bob", "555-9999");

        String aliceNumber = contacts.get("Alice");
        System.out.println("Alice: " + aliceNumber);

        boolean hasEve = contacts.containsKey("Eve");
        System.out.println("Eve exists: " + hasEve);

        System.out.println("\nAll contacts:");
        for (Map.Entry<String, String> entry : contacts.entrySet()) {
            System.out.println(entry.getKey() + " -> " + entry.getValue());
        }
    }
}'
WHERE id = '84c60685-1658-4f0d-adfe-753201f26a91';

UPDATE course_lessons SET solution_code = 'import java.util.HashSet;
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
        teamB.add("Kubernetes");

        Set<String> union = new HashSet<>(teamA);
        union.addAll(teamB);
        System.out.println("Union: " + union);

        Set<String> intersection = new HashSet<>(teamA);
        intersection.retainAll(teamB);
        System.out.println("Intersection: " + intersection);

        Set<String> difference = new HashSet<>(teamA);
        difference.removeAll(teamB);
        System.out.println("Only in Team A: " + difference);
    }
}'
WHERE id = 'f6258662-b2f7-47b9-aae2-5f7e389101d8';

-- Exception Handling exercises
UPDATE course_lessons SET solution_code = 'public class SafeCalculator {
    static double divide(int a, int b) {
        try {
            return (double) a / b;
        } catch (ArithmeticException e) {
            System.out.println("Error: Cannot divide by zero!");
            return 0;
        }
    }

    public static void main(String[] args) {
        System.out.println("10 / 3 = " + divide(10, 3));
        System.out.println("10 / 0 = " + divide(10, 0));
        System.out.println("100 / 4 = " + divide(100, 4));
    }
}'
WHERE id = 'd3ffa229-b7b1-45f0-ba77-d878079e63e3';

UPDATE course_lessons SET solution_code = 'class InvalidAgeException extends Exception {
    public InvalidAgeException(int age) {
        super("Invalid age: " + age + ". Age must be between 0 and 150.");
    }
}

public class AgeVerifier {
    static void verifyAge(int age) throws InvalidAgeException {
        if (age < 0 || age > 150) {
            throw new InvalidAgeException(age);
        }
        System.out.println("Age " + age + " is valid.");
    }

    public static void main(String[] args) {
        try {
            verifyAge(25);
        } catch (InvalidAgeException e) {
            System.out.println(e.getMessage());
        }

        try {
            verifyAge(-5);
        } catch (InvalidAgeException e) {
            System.out.println(e.getMessage());
        }

        try {
            verifyAge(200);
        } catch (InvalidAgeException e) {
            System.out.println(e.getMessage());
        }
    }
}'
WHERE id = 'af35bc07-4f62-44f1-8b53-82dca64e9674';

UPDATE course_lessons SET solution_code = 'public class InputValidator {
    static int parseAndValidate(String input) {
        if (input == null) {
            throw new IllegalArgumentException("Input cannot be null");
        }
        try {
            int value = Integer.parseInt(input);
            if (value < 0) {
                throw new IllegalArgumentException("Value must be positive: " + value);
            }
            return value;
        } catch (NumberFormatException e) {
            throw new IllegalArgumentException("Not a valid number: " + input);
        }
    }

    public static void main(String[] args) {
        String[] testInputs = {"42", "hello", "-7", null};

        for (String input : testInputs) {
            try {
                int result = parseAndValidate(input);
                System.out.println("\"" + input + "\" -> " + result);
            } catch (IllegalArgumentException e) {
                System.out.println("Error: " + e.getMessage());
            }
        }
    }
}'
WHERE id = 'f8623ea5-042d-4230-82b4-8f083fe20b06';

-- File I/O exercises
UPDATE course_lessons SET solution_code = 'public class TextAnalyzer {
    public static void main(String[] args) {
        String content = "Java is powerful\nPython is simple\nBoth are popular\nCoding is fun";

        String[] lines = content.split("\n");

        int totalLines = lines.length;
        int totalWords = 0;
        int totalChars = content.length();

        for (String line : lines) {
            String[] words = line.split("\\s+");
            totalWords += words.length;
        }

        System.out.println("Lines: " + totalLines);
        System.out.println("Words: " + totalWords);
        System.out.println("Characters: " + totalChars);

        System.out.println("\nLine by line:");
        for (int i = 0; i < lines.length; i++) {
            System.out.println((i + 1) + ": " + lines[i]);
        }
    }
}'
WHERE id = 'b016f89b-a4f6-47a7-bab6-67997e47ce4c';

UPDATE course_lessons SET solution_code = 'public class CsvBuilder {
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

        System.out.println(csv.toString());
    }
}'
WHERE id = '6ee8593e-9f97-46d4-96c9-6de1b2371076';

UPDATE course_lessons SET solution_code = 'import java.io.Serializable;

class GameSave implements Serializable {
    private static final long serialVersionUID = 1L;

    private String playerName;
    private int level;
    private int score;
    private transient String sessionId;

    public GameSave(String playerName, int level, int score, String sessionId) {
        this.playerName = playerName;
        this.level = level;
        this.score = score;
        this.sessionId = sessionId;
    }

    @Override
    public String toString() {
        return "GameSave{player=" + playerName + ", level=" + level +
               ", score=" + score + ", session=" + sessionId + "}";
    }
}

public class SerializeDemo {
    public static void main(String[] args) {
        GameSave save = new GameSave("Hero42", 15, 98500, "abc-123-xyz");
        System.out.println("Before serialize: " + save);
        System.out.println("Note: sessionId is transient and would be null after deserialization");
    }
}'
WHERE id = 'ce78bc65-60d5-4c64-a652-e8ed879f982d';