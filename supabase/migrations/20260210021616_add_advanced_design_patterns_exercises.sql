/*
  # Add Design Patterns Exercises to Advanced Course

  1. New Lessons (Exercises)
    - `Try It: Singleton Logger` (order_index 7, 550 XP)
    - `Try It: Factory Pattern` (order_index 8, 600 XP)
    - `Try It: Observer Notifications` (order_index 9, 650 XP)

  2. Security
    - No RLS changes needed

  3. Important Notes
    - XP values bumped to 550-650 for advanced difficulty
*/

-- Exercise 1: Singleton Logger
INSERT INTO course_lessons (
  module_id, title, description, order_index, estimated_minutes,
  content_type, content_text, starter_code, solution_code, validation_rules, xp_reward
)
SELECT
  m.id,
  'Try It: Singleton Logger',
  'Implement a thread-safe Singleton logger class',
  7, 30, 'exercise',
  '# Try It: Singleton Logger

Build a Singleton `Logger` class that ensures only one instance exists throughout the application.

## Your Task

1. Create a class `Logger` with:
   - A `private static Logger instance` field
   - A `private` constructor (prevent external instantiation)
   - A `public static Logger getInstance()` method that creates the instance lazily
   - A `public void log(String message)` method that prints `"[LOG] <message>"`
   - A `private int messageCount` field that tracks how many messages have been logged
   - A `public int getMessageCount()` method

2. In `main`:
   - Get the Logger instance and log `"Application started"`
   - Get the instance again in a different variable and log `"Processing data"`
   - Verify both variables point to the same instance by printing whether they are equal (`==`)
   - Print the total message count

## Expected Output

```
[LOG] Application started
[LOG] Processing data
Same instance: true
Messages logged: 2
```

## Hints

- The constructor must be `private`
- Check `if (instance == null)` in getInstance before creating
- Both variables should reference the exact same object',
  'public class Logger {
    private static Logger instance;
    private int messageCount = 0;

    // Private constructor


    // getInstance method


    // log method


    // getMessageCount method


    public static void main(String[] args) {
        // Get instance and log messages
        // Verify same instance
        // Print message count

    }
}',
  'public class Logger {
    private static Logger instance;
    private int messageCount = 0;

    private Logger() {}

    public static Logger getInstance() {
        if (instance == null) {
            instance = new Logger();
        }
        return instance;
    }

    public void log(String message) {
        System.out.println("[LOG] " + message);
        messageCount++;
    }

    public int getMessageCount() {
        return messageCount;
    }

    public static void main(String[] args) {
        Logger logger1 = Logger.getInstance();
        logger1.log("Application started");

        Logger logger2 = Logger.getInstance();
        logger2.log("Processing data");

        System.out.println("Same instance: " + (logger1 == logger2));
        System.out.println("Messages logged: " + logger1.getMessageCount());
    }
}',
  '{"mustContain":["private static Logger instance","private Logger()","getInstance","messageCount","System.out.println"],"regexMatch":"private\\s+Logger\\s*\\(\\s*\\)","methodSignatureExists":"public\\s+static\\s+void\\s+main\\s*\\(\\s*String\\s*\\[\\s*\\]\\s*args\\s*\\)"}'::jsonb,
  550
FROM course_modules m
JOIN courses c ON m.course_id = c.id
WHERE c.title = 'Advanced Java and Enterprise Development' AND m.order_index = 2
ON CONFLICT DO NOTHING;

-- Exercise 2: Factory Pattern
INSERT INTO course_lessons (
  module_id, title, description, order_index, estimated_minutes,
  content_type, content_text, starter_code, solution_code, validation_rules, xp_reward
)
SELECT
  m.id,
  'Try It: Shape Factory',
  'Build a factory that creates different shape objects based on a type string',
  8, 35, 'exercise',
  '# Try It: Shape Factory

Implement the Factory pattern to create different shape objects that calculate their area.

## Your Task

1. Create an interface `Shape` with a method `double area()`

2. Create three classes that implement `Shape`:
   - `Circle` — constructor takes `double radius`, area = `Math.PI * radius * radius`
   - `Rectangle` — constructor takes `double width, double height`, area = `width * height`
   - `Triangle` — constructor takes `double base, double height`, area = `0.5 * base * height`

3. Create a `ShapeFactory` class with a static method:
   `static Shape create(String type, double... dimensions)`
   - `"circle"` uses dimensions[0] as radius
   - `"rectangle"` uses dimensions[0] as width, dimensions[1] as height
   - `"triangle"` uses dimensions[0] as base, dimensions[1] as height
   - Unknown types throw `IllegalArgumentException`

4. In `main`, create one of each shape and print its area (formatted to 2 decimal places)

## Expected Output

```
Circle area: 78.54
Rectangle area: 24.00
Triangle area: 15.00
```

## Hints

- Use `String.format("%.2f", value)` for formatting
- The varargs `double... dimensions` lets you pass any number of doubles
- Access varargs like an array: `dimensions[0]`',
  'interface Shape {
    double area();
}

// Circle, Rectangle, Triangle classes


class ShapeFactory {
    // static create method

}

public class FactoryDemo {
    public static void main(String[] args) {
        // Create shapes using factory and print areas

    }
}',
  'interface Shape {
    double area();
}

class Circle implements Shape {
    private double radius;
    Circle(double radius) { this.radius = radius; }
    @Override
    public double area() { return Math.PI * radius * radius; }
}

class Rectangle implements Shape {
    private double width, height;
    Rectangle(double width, double height) { this.width = width; this.height = height; }
    @Override
    public double area() { return width * height; }
}

class Triangle implements Shape {
    private double base, height;
    Triangle(double base, double height) { this.base = base; this.height = height; }
    @Override
    public double area() { return 0.5 * base * height; }
}

class ShapeFactory {
    static Shape create(String type, double... dimensions) {
        switch (type.toLowerCase()) {
            case "circle": return new Circle(dimensions[0]);
            case "rectangle": return new Rectangle(dimensions[0], dimensions[1]);
            case "triangle": return new Triangle(dimensions[0], dimensions[1]);
            default: throw new IllegalArgumentException("Unknown shape: " + type);
        }
    }
}

public class FactoryDemo {
    public static void main(String[] args) {
        Shape circle = ShapeFactory.create("circle", 5.0);
        Shape rectangle = ShapeFactory.create("rectangle", 4.0, 6.0);
        Shape triangle = ShapeFactory.create("triangle", 6.0, 5.0);

        System.out.println("Circle area: " + String.format("%.2f", circle.area()));
        System.out.println("Rectangle area: " + String.format("%.2f", rectangle.area()));
        System.out.println("Triangle area: " + String.format("%.2f", triangle.area()));
    }
}',
  '{"mustContain":["interface Shape","implements Shape","area()","ShapeFactory","create","switch","System.out.println"],"regexMatch":"interface\\s+Shape","methodSignatureExists":"public\\s+static\\s+void\\s+main\\s*\\(\\s*String\\s*\\[\\s*\\]\\s*args\\s*\\)"}'::jsonb,
  600
FROM course_modules m
JOIN courses c ON m.course_id = c.id
WHERE c.title = 'Advanced Java and Enterprise Development' AND m.order_index = 2
ON CONFLICT DO NOTHING;

-- Exercise 3: Observer Notifications
INSERT INTO course_lessons (
  module_id, title, description, order_index, estimated_minutes,
  content_type, content_text, starter_code, solution_code, validation_rules, xp_reward
)
SELECT
  m.id,
  'Try It: Observer Notifications',
  'Build an event notification system using the Observer pattern',
  9, 35, 'exercise',
  '# Try It: Observer Notifications

Implement the Observer pattern to build a simple news notification system.

## Your Task

1. Create an interface `Subscriber` with method `void onNews(String headline)`

2. Create a class `NewsAgency` with:
   - A `List<Subscriber>` called `subscribers`
   - `void subscribe(Subscriber s)` — adds a subscriber
   - `void unsubscribe(Subscriber s)` — removes a subscriber
   - `void publishNews(String headline)` — calls `onNews` on every subscriber

3. Create two subscriber classes:
   - `EmailSubscriber` — takes a `String email` in constructor, prints `"Email to <email>: <headline>"`
   - `PhoneSubscriber` — takes a `String phone` in constructor, prints `"SMS to <phone>: <headline>"`

4. In `main`:
   - Create a `NewsAgency`
   - Subscribe an EmailSubscriber (`"alice@mail.com"`) and a PhoneSubscriber (`"555-1234"`)
   - Publish `"Java 25 Released!"`
   - Unsubscribe the phone subscriber
   - Publish `"New Design Patterns Book Available"`

## Expected Output

```
Email to alice@mail.com: Java 25 Released!
SMS to 555-1234: Java 25 Released!
Email to alice@mail.com: New Design Patterns Book Available
```

## Hints

- Use `ArrayList` for the subscribers list
- The second headline only goes to the email subscriber (phone was unsubscribed)',
  'import java.util.ArrayList;
import java.util.List;

interface Subscriber {
    void onNews(String headline);
}

// EmailSubscriber and PhoneSubscriber classes


class NewsAgency {
    // subscribers list and methods

}

public class ObserverDemo {
    public static void main(String[] args) {
        // Create agency, subscribe, publish, unsubscribe, publish

    }
}',
  'import java.util.ArrayList;
import java.util.List;

interface Subscriber {
    void onNews(String headline);
}

class EmailSubscriber implements Subscriber {
    private String email;
    EmailSubscriber(String email) { this.email = email; }
    @Override
    public void onNews(String headline) {
        System.out.println("Email to " + email + ": " + headline);
    }
}

class PhoneSubscriber implements Subscriber {
    private String phone;
    PhoneSubscriber(String phone) { this.phone = phone; }
    @Override
    public void onNews(String headline) {
        System.out.println("SMS to " + phone + ": " + headline);
    }
}

class NewsAgency {
    private List<Subscriber> subscribers = new ArrayList<>();

    void subscribe(Subscriber s) {
        subscribers.add(s);
    }

    void unsubscribe(Subscriber s) {
        subscribers.remove(s);
    }

    void publishNews(String headline) {
        for (Subscriber s : subscribers) {
            s.onNews(headline);
        }
    }
}

public class ObserverDemo {
    public static void main(String[] args) {
        NewsAgency agency = new NewsAgency();

        EmailSubscriber email = new EmailSubscriber("alice@mail.com");
        PhoneSubscriber phone = new PhoneSubscriber("555-1234");

        agency.subscribe(email);
        agency.subscribe(phone);
        agency.publishNews("Java 25 Released!");

        agency.unsubscribe(phone);
        agency.publishNews("New Design Patterns Book Available");
    }
}',
  '{"mustContain":["interface Subscriber","implements Subscriber","onNews","List<Subscriber>","subscribe","unsubscribe","publishNews","System.out.println"],"regexMatch":"interface\\s+Subscriber","methodSignatureExists":"public\\s+static\\s+void\\s+main\\s*\\(\\s*String\\s*\\[\\s*\\]\\s*args\\s*\\)"}'::jsonb,
  650
FROM course_modules m
JOIN courses c ON m.course_id = c.id
WHERE c.title = 'Advanced Java and Enterprise Development' AND m.order_index = 2
ON CONFLICT DO NOTHING;