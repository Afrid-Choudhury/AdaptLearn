/*
  # Add Design Patterns and Architecture Lessons to Advanced Course

  1. New Lessons
    - Singleton Pattern (video, 40 min)
    - Factory Pattern (reading, 40 min)
    - Observer Pattern (video, 40 min)
    - Strategy Pattern (video, 40 min)
    - Builder Pattern (reading, 35 min)
    - Design Patterns Practice (quiz, 40 min)

  2. Security
    - No RLS changes needed

  3. Important Notes
    - Follows emoji-based pattern from beginner/intermediate courses
    - Each pattern includes motivation, implementation, and real-world use cases
*/

-- Lesson 1: Singleton Pattern
INSERT INTO course_lessons (module_id, title, description, order_index, estimated_minutes, content_type, content_text)
SELECT
  id,
  'Singleton Pattern',
  'Ensure a class has only one instance and provide a global point of access to it.',
  1,
  40,
  'video',
  '# Singleton Pattern

The Singleton pattern ensures a class has **exactly one instance** and provides a global way to access it. This is useful for shared resources like configuration managers, database connections, and loggers.

## The Problem

Without Singleton, multiple parts of your application might create separate instances:

```java
DatabaseConnection db1 = new DatabaseConnection();
DatabaseConnection db2 = new DatabaseConnection();
```

Two connections waste resources and may lead to inconsistent state.

## Basic Singleton (Eager Initialization)

```java
public class Logger {
    private static final Logger INSTANCE = new Logger();

    private Logger() {
        // private constructor prevents external instantiation
    }

    public static Logger getInstance() {
        return INSTANCE;
    }

    public void log(String message) {
        System.out.println("[LOG] " + message);
    }
}
```

Usage:
```java
Logger.getInstance().log("Application started");
Logger.getInstance().log("Processing request");
```

## Lazy Initialization

Creates the instance only when first needed:

```java
public class AppConfig {
    private static AppConfig instance;

    private AppConfig() {
        System.out.println("Loading configuration...");
    }

    public static AppConfig getInstance() {
        if (instance == null) {
            instance = new AppConfig();
        }
        return instance;
    }
}
```

## Thread-Safe Singleton

The lazy version has a race condition. Fix with `synchronized`:

```java
public class AppConfig {
    private static volatile AppConfig instance;

    private AppConfig() {}

    public static AppConfig getInstance() {
        if (instance == null) {
            synchronized (AppConfig.class) {
                if (instance == null) {
                    instance = new AppConfig();
                }
            }
        }
        return instance;
    }
}
```

This is the **Double-Checked Locking** pattern — efficient and thread-safe.

## Enum Singleton (Recommended)

The simplest and safest approach:

```java
public enum DatabaseConnection {
    INSTANCE;

    public void query(String sql) {
        System.out.println("Executing: " + sql);
    }
}
```

```java
DatabaseConnection.INSTANCE.query("SELECT * FROM users");
```

Enums are inherently thread-safe and prevent reflection attacks.

## When to Use Singleton

- Logging systems
- Configuration managers
- Connection pools
- Caches
- Thread pools

## Common Mistakes

❌ Making the constructor public (defeats the purpose)
❌ Using lazy initialization without thread safety
❌ Overusing Singleton (it can make testing harder)

## Key Takeaways

✓ Singleton ensures exactly one instance of a class exists
✓ Private constructor prevents external instantiation
✓ Enum-based Singleton is the simplest and safest approach
✓ Use Double-Checked Locking for thread-safe lazy initialization'
FROM course_modules
WHERE title = 'Design Patterns and Architecture'
  AND course_id = (SELECT id FROM courses WHERE title = 'Advanced Java and Enterprise Development')
ON CONFLICT DO NOTHING;

-- Lesson 2: Factory Pattern
INSERT INTO course_lessons (module_id, title, description, order_index, estimated_minutes, content_type, content_text)
SELECT
  id,
  'Factory Pattern',
  'Create objects without exposing instantiation logic using the Factory pattern.',
  2,
  40,
  'reading',
  '# Factory Pattern

The Factory pattern delegates object creation to a separate method or class. Instead of calling `new` directly, you ask a factory to create the right object for you.

## The Problem

Imagine creating notification objects based on type:

```java
if (type.equals("email")) {
    notification = new EmailNotification();
} else if (type.equals("sms")) {
    notification = new SMSNotification();
} else if (type.equals("push")) {
    notification = new PushNotification();
}
```

This code is duplicated everywhere you create notifications. Adding a new type means updating every location.

## Solution: Simple Factory

```java
public interface Notification {
    void send(String message);
}

public class EmailNotification implements Notification {
    @Override
    public void send(String message) {
        System.out.println("Email: " + message);
    }
}

public class SMSNotification implements Notification {
    @Override
    public void send(String message) {
        System.out.println("SMS: " + message);
    }
}

public class PushNotification implements Notification {
    @Override
    public void send(String message) {
        System.out.println("Push: " + message);
    }
}
```

```java
public class NotificationFactory {
    public static Notification create(String type) {
        switch (type.toLowerCase()) {
            case "email": return new EmailNotification();
            case "sms":   return new SMSNotification();
            case "push":  return new PushNotification();
            default: throw new IllegalArgumentException("Unknown type: " + type);
        }
    }
}
```

Usage:
```java
Notification n = NotificationFactory.create("email");
n.send("Hello!");
```

## Factory Method Pattern

Instead of a static factory, use an abstract method that subclasses override:

```java
public abstract class DocumentCreator {
    public abstract Document createDocument();

    public void openDocument() {
        Document doc = createDocument();
        doc.open();
    }
}

public class PDFCreator extends DocumentCreator {
    @Override
    public Document createDocument() {
        return new PDFDocument();
    }
}

public class WordCreator extends DocumentCreator {
    @Override
    public Document createDocument() {
        return new WordDocument();
    }
}
```

## Benefits of Factory Pattern

| Benefit | Description |
|---------|-------------|
| Loose coupling | Client code does not depend on concrete classes |
| Single point of change | Add new types in one place |
| Encapsulation | Creation logic is hidden |
| Testability | Easy to mock factories in tests |

## Real-World Examples

- `Calendar.getInstance()` — returns the right calendar for your locale
- `NumberFormat.getInstance()` — creates locale-specific formatters
- Database driver managers — create connections based on URL

## Common Mistakes

❌ Over-engineering with Factory when `new` is sufficient
❌ Not using an interface or abstract class for the product
❌ Putting too much logic inside the factory

## Key Takeaways

✓ Factory centralizes object creation in one place
✓ Clients work with interfaces, not concrete implementations
✓ Adding new types only requires updating the factory
✓ Use Factory when creation logic is complex or types vary at runtime'
FROM course_modules
WHERE title = 'Design Patterns and Architecture'
  AND course_id = (SELECT id FROM courses WHERE title = 'Advanced Java and Enterprise Development')
ON CONFLICT DO NOTHING;

-- Lesson 3: Observer Pattern
INSERT INTO course_lessons (module_id, title, description, order_index, estimated_minutes, content_type, content_text)
SELECT
  id,
  'Observer Pattern',
  'Implement a publish-subscribe mechanism where objects automatically react to state changes.',
  3,
  40,
  'video',
  '# Observer Pattern

The Observer pattern defines a one-to-many relationship: when one object (the **subject**) changes state, all its dependents (the **observers**) are notified automatically.

## Real-World Analogy

Think of a YouTube channel:
- The channel is the **subject**
- Subscribers are **observers**
- When a new video is uploaded, all subscribers get notified

## Defining the Observer Interface

```java
public interface Observer {
    void update(String event, Object data);
}
```

## Defining the Subject

```java
import java.util.ArrayList;
import java.util.List;

public class EventManager {
    private List<Observer> observers = new ArrayList<>();

    public void subscribe(Observer observer) {
        observers.add(observer);
    }

    public void unsubscribe(Observer observer) {
        observers.remove(observer);
    }

    public void notify(String event, Object data) {
        for (Observer observer : observers) {
            observer.update(event, data);
        }
    }
}
```

## Creating Concrete Observers

```java
public class EmailAlert implements Observer {
    @Override
    public void update(String event, Object data) {
        System.out.println("Email alert: " + event + " - " + data);
    }
}

public class LogWriter implements Observer {
    @Override
    public void update(String event, Object data) {
        System.out.println("[LOG] " + event + ": " + data);
    }
}

public class DashboardWidget implements Observer {
    @Override
    public void update(String event, Object data) {
        System.out.println("Dashboard updated: " + event);
    }
}
```

## Using the Pattern

```java
EventManager events = new EventManager();

EmailAlert emailAlert = new EmailAlert();
LogWriter logger = new LogWriter();
DashboardWidget dashboard = new DashboardWidget();

events.subscribe(emailAlert);
events.subscribe(logger);
events.subscribe(dashboard);

events.notify("USER_SIGNUP", "alice@example.com");
events.notify("ORDER_PLACED", "Order #1234");

events.unsubscribe(dashboard);
events.notify("PAYMENT_RECEIVED", "$49.99");
```

## Event-Specific Subscriptions

A more refined version allows subscribing to specific events:

```java
public class EventManager {
    private Map<String, List<Observer>> listeners = new HashMap<>();

    public void subscribe(String event, Observer observer) {
        listeners.computeIfAbsent(event, k -> new ArrayList<>()).add(observer);
    }

    public void notify(String event, Object data) {
        List<Observer> eventListeners = listeners.getOrDefault(event, List.of());
        for (Observer observer : eventListeners) {
            observer.update(event, data);
        }
    }
}
```

## When to Use Observer

- Event handling systems
- GUI frameworks (button clicks, input changes)
- Real-time notifications
- Data binding between model and view
- Pub/sub messaging systems

## Common Mistakes

❌ Not providing an unsubscribe mechanism (memory leaks)
❌ Observers modifying the subject during notification
❌ Circular dependencies between observers

## Key Takeaways

✓ Observer defines a one-to-many notification relationship
✓ Subjects maintain a list of observers and notify them on changes
✓ Observers can be added and removed dynamically
✓ This pattern is the foundation of event-driven programming'
FROM course_modules
WHERE title = 'Design Patterns and Architecture'
  AND course_id = (SELECT id FROM courses WHERE title = 'Advanced Java and Enterprise Development')
ON CONFLICT DO NOTHING;

-- Lesson 4: Strategy Pattern
INSERT INTO course_lessons (module_id, title, description, order_index, estimated_minutes, content_type, content_text)
SELECT
  id,
  'Strategy Pattern',
  'Define a family of algorithms, encapsulate each one, and make them interchangeable at runtime.',
  4,
  40,
  'video',
  '# Strategy Pattern

The Strategy pattern lets you define a family of algorithms, put each in its own class, and swap them at runtime. The client code works with any strategy through a common interface.

## The Problem

A payment system with embedded logic:

```java
public void processPayment(String method, double amount) {
    if (method.equals("credit")) {
        // credit card logic
    } else if (method.equals("paypal")) {
        // PayPal logic
    } else if (method.equals("crypto")) {
        // crypto logic
    }
}
```

Adding a new payment method means modifying this method every time.

## Solution: Strategy Pattern

### Step 1: Define the Strategy Interface

```java
public interface PaymentStrategy {
    void pay(double amount);
}
```

### Step 2: Implement Concrete Strategies

```java
public class CreditCardPayment implements PaymentStrategy {
    private String cardNumber;

    public CreditCardPayment(String cardNumber) {
        this.cardNumber = cardNumber;
    }

    @Override
    public void pay(double amount) {
        System.out.println("Paid $" + amount + " with credit card ending in "
            + cardNumber.substring(cardNumber.length() - 4));
    }
}

public class PayPalPayment implements PaymentStrategy {
    private String email;

    public PayPalPayment(String email) {
        this.email = email;
    }

    @Override
    public void pay(double amount) {
        System.out.println("Paid $" + amount + " via PayPal (" + email + ")");
    }
}
```

### Step 3: Create the Context

```java
public class ShoppingCart {
    private PaymentStrategy paymentStrategy;

    public void setPaymentStrategy(PaymentStrategy strategy) {
        this.paymentStrategy = strategy;
    }

    public void checkout(double total) {
        if (paymentStrategy == null) {
            System.out.println("No payment method selected!");
            return;
        }
        paymentStrategy.pay(total);
    }
}
```

### Step 4: Use It

```java
ShoppingCart cart = new ShoppingCart();

cart.setPaymentStrategy(new CreditCardPayment("4111111111111234"));
cart.checkout(99.99);

cart.setPaymentStrategy(new PayPalPayment("user@email.com"));
cart.checkout(49.50);
```

## Another Example: Sorting Strategies

```java
public interface SortStrategy {
    void sort(int[] array);
}

public class BubbleSort implements SortStrategy {
    @Override
    public void sort(int[] array) {
        System.out.println("Sorting with Bubble Sort");
        // bubble sort implementation
    }
}

public class QuickSort implements SortStrategy {
    @Override
    public void sort(int[] array) {
        System.out.println("Sorting with Quick Sort");
        // quick sort implementation
    }
}
```

## Strategy with Lambdas (Java 8+)

Since the strategy interface has a single method, you can use lambdas:

```java
ShoppingCart cart = new ShoppingCart();
cart.setPaymentStrategy(amount ->
    System.out.println("Paid $" + amount + " with Bitcoin")
);
cart.checkout(75.00);
```

## When to Use Strategy

- Multiple algorithms for the same task
- Need to switch behavior at runtime
- Avoiding long if-else or switch chains
- Different variations of an algorithm

## Common Mistakes

❌ Creating strategies for behavior that never changes
❌ Having the context depend on concrete strategies
❌ Not using lambdas when strategies are simple single-method interfaces

## Key Takeaways

✓ Strategy encapsulates algorithms behind a common interface
✓ The context delegates to the current strategy without knowing its details
✓ Strategies can be swapped at runtime for flexible behavior
✓ Lambdas provide a concise way to define simple strategies'
FROM course_modules
WHERE title = 'Design Patterns and Architecture'
  AND course_id = (SELECT id FROM courses WHERE title = 'Advanced Java and Enterprise Development')
ON CONFLICT DO NOTHING;

-- Lesson 5: Builder Pattern
INSERT INTO course_lessons (module_id, title, description, order_index, estimated_minutes, content_type, content_text)
SELECT
  id,
  'Builder Pattern',
  'Construct complex objects step by step with a fluent, readable API.',
  5,
  35,
  'reading',
  '# Builder Pattern

The Builder pattern separates the construction of a complex object from its representation, allowing you to create different configurations step by step.

## The Problem: Telescoping Constructors

```java
public class Pizza {
    Pizza(String size) { }
    Pizza(String size, boolean cheese) { }
    Pizza(String size, boolean cheese, boolean pepperoni) { }
    Pizza(String size, boolean cheese, boolean pepperoni, boolean mushrooms) { }
}

new Pizza("Large", true, false, true);
```

What does `true, false, true` mean? Impossible to read.

## Solution: Builder Pattern

```java
public class Pizza {
    private final String size;
    private final boolean cheese;
    private final boolean pepperoni;
    private final boolean mushrooms;
    private final boolean onions;

    private Pizza(Builder builder) {
        this.size = builder.size;
        this.cheese = builder.cheese;
        this.pepperoni = builder.pepperoni;
        this.mushrooms = builder.mushrooms;
        this.onions = builder.onions;
    }

    @Override
    public String toString() {
        return size + " pizza" +
            (cheese ? " + cheese" : "") +
            (pepperoni ? " + pepperoni" : "") +
            (mushrooms ? " + mushrooms" : "") +
            (onions ? " + onions" : "");
    }

    public static class Builder {
        private final String size;
        private boolean cheese;
        private boolean pepperoni;
        private boolean mushrooms;
        private boolean onions;

        public Builder(String size) {
            this.size = size;
        }

        public Builder cheese() {
            this.cheese = true;
            return this;
        }

        public Builder pepperoni() {
            this.pepperoni = true;
            return this;
        }

        public Builder mushrooms() {
            this.mushrooms = true;
            return this;
        }

        public Builder onions() {
            this.onions = true;
            return this;
        }

        public Pizza build() {
            return new Pizza(this);
        }
    }
}
```

## Fluent Usage

```java
Pizza veggie = new Pizza.Builder("Medium")
    .cheese()
    .mushrooms()
    .onions()
    .build();

Pizza meat = new Pizza.Builder("Large")
    .cheese()
    .pepperoni()
    .build();

System.out.println(veggie);
System.out.println(meat);
```

Each method call reads like natural language.

## Builder for HTTP Requests

```java
public class HttpRequest {
    private final String url;
    private final String method;
    private final Map<String, String> headers;
    private final String body;

    // ... private constructor from Builder

    public static class Builder {
        private final String url;
        private String method = "GET";
        private Map<String, String> headers = new HashMap<>();
        private String body;

        public Builder(String url) {
            this.url = url;
        }

        public Builder method(String method) {
            this.method = method;
            return this;
        }

        public Builder header(String key, String value) {
            this.headers.put(key, value);
            return this;
        }

        public Builder body(String body) {
            this.body = body;
            return this;
        }

        public HttpRequest build() {
            return new HttpRequest(this);
        }
    }
}
```

```java
HttpRequest request = new HttpRequest.Builder("https://api.example.com/users")
    .method("POST")
    .header("Content-Type", "application/json")
    .body("{\"name\": \"Alice\"}")
    .build();
```

## When to Use Builder

- Objects with many optional parameters
- Objects that should be immutable after creation
- Complex construction that requires validation
- When constructor readability suffers

## Common Mistakes

❌ Using Builder for simple objects with few parameters
❌ Making the built object mutable (use `final` fields)
❌ Forgetting the `build()` method call

## Key Takeaways

✓ Builder eliminates confusing constructors with many parameters
✓ The fluent API makes object creation readable and self-documenting
✓ Built objects should be immutable (all fields final)
✓ Builder is ideal when objects have many optional configurations'
FROM course_modules
WHERE title = 'Design Patterns and Architecture'
  AND course_id = (SELECT id FROM courses WHERE title = 'Advanced Java and Enterprise Development')
ON CONFLICT DO NOTHING;

-- Lesson 6: Design Patterns Practice
INSERT INTO course_lessons (module_id, title, description, order_index, estimated_minutes, content_type, content_text)
SELECT
  id,
  'Design Patterns Practice',
  'Review and test your understanding of the five design patterns covered in this module.',
  6,
  40,
  'quiz',
  '# Design Patterns Practice

Test your understanding of Singleton, Factory, Observer, Strategy, and Builder patterns.

## Review Questions

### 1. Pattern Identification
Match each scenario to the correct pattern:

| Scenario | Pattern |
|----------|---------|
| A logging system that should have one global instance | Singleton |
| Creating different notification types based on user preference | Factory |
| Dashboard widgets that update when data changes | Observer |
| Switching between payment methods at checkout | Strategy |
| Creating complex configuration objects with many optional fields | Builder |

### 2. Singleton Safety
Why is this Singleton implementation not thread-safe?

```java
public static AppConfig getInstance() {
    if (instance == null) {
        instance = new AppConfig();
    }
    return instance;
}
```

**Answer:** Two threads could both see `instance == null` simultaneously and each create a new instance. Use double-checked locking with `volatile` or an enum.

### 3. Factory vs Strategy
What is the key difference between Factory and Strategy?

**Answer:** Factory focuses on **creating** the right object. Strategy focuses on **swapping behavior** at runtime. Factory chooses which class to instantiate; Strategy chooses which algorithm to use.

### 4. Observer Cleanup
Why is it important to provide an `unsubscribe` method?

**Answer:** Without unsubscribe, observers that are no longer needed remain in the list, preventing garbage collection (memory leak) and receiving unwanted notifications.

### 5. Builder Immutability
Why should the built object have `final` fields?

**Answer:** Final fields ensure the object cannot be modified after construction, making it immutable and thread-safe.

## Pattern Selection Guide

| When You Need | Use |
|---------------|-----|
| One global instance | Singleton |
| Object creation based on type | Factory |
| Automatic notifications on state change | Observer |
| Swappable algorithms | Strategy |
| Complex object construction | Builder |

## Concepts Checklist

✓ Singleton ensures one instance with private constructor
✓ Factory centralizes and encapsulates object creation
✓ Observer enables publish-subscribe notification
✓ Strategy makes algorithms interchangeable at runtime
✓ Builder provides fluent, readable object construction'
FROM course_modules
WHERE title = 'Design Patterns and Architecture'
  AND course_id = (SELECT id FROM courses WHERE title = 'Advanced Java and Enterprise Development')
ON CONFLICT DO NOTHING;