-- Add solution_code to Advanced Java exercises

-- Concurrency exercises
UPDATE course_lessons SET solution_code = 'class CountdownTask implements Runnable {
    private String name;
    private int count;

    public CountdownTask(String name, int count) {
        this.name = name;
        this.count = count;
    }

    @Override
    public void run() {
        for (int i = count; i > 0; i--) {
            System.out.println(name + ": " + i);
            try {
                Thread.sleep(100);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }
        System.out.println(name + ": Done!");
    }
}

public class ThreadDemo {
    public static void main(String[] args) throws InterruptedException {
        Thread t1 = new Thread(new CountdownTask("Rocket", 5));

        Thread t2 = new Thread(() -> {
            for (int i = 1; i <= 3; i++) {
                System.out.println("Lambda: Step " + i);
                try {
                    Thread.sleep(150);
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                }
            }
        });

        t1.start();
        t2.start();

        t1.join();
        t2.join();

        System.out.println("All threads completed!");
    }
}'
WHERE id = '01f12efe-06a1-45b1-bd56-bdbd7dfb780f';

UPDATE course_lessons SET solution_code = 'public class SafeCounter {
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
        System.out.println("Expected: 20000");
    }
}'
WHERE id = '95291f86-c57d-4a78-9863-71020c594d63';

UPDATE course_lessons SET solution_code = 'import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;

public class TaskRunner {
    public static void main(String[] args) {
        ExecutorService pool = Executors.newFixedThreadPool(3);

        for (int i = 1; i <= 6; i++) {
            final int taskId = i;
            pool.submit(() -> {
                String thread = Thread.currentThread().getName();
                System.out.println("Task " + taskId + " started on " + thread);
                try {
                    Thread.sleep(500);
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                }
                System.out.println("Task " + taskId + " completed on " + thread);
            });
        }

        pool.shutdown();
        try {
            pool.awaitTermination(10, TimeUnit.SECONDS);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }

        System.out.println("All tasks finished!");
    }
}'
WHERE id = 'e012c9a0-054a-40d1-ab47-906a37a79c15';

-- Design Patterns exercises
UPDATE course_lessons SET solution_code = 'public class Logger {
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
        messageCount++;
        System.out.println("[LOG #" + messageCount + "] " + message);
    }

    public int getMessageCount() {
        return messageCount;
    }

    public static void main(String[] args) {
        Logger logger1 = Logger.getInstance();
        Logger logger2 = Logger.getInstance();

        logger1.log("Application started");
        logger2.log("User logged in");
        logger1.log("Processing request");

        System.out.println("Same instance: " + (logger1 == logger2));
        System.out.println("Total messages: " + logger1.getMessageCount());
    }
}'
WHERE id = 'eb183020-3074-43cd-93ec-b776c69f8c76';

UPDATE course_lessons SET solution_code = 'interface Shape {
    double area();
}

class Circle implements Shape {
    private double radius;
    public Circle(double radius) { this.radius = radius; }
    public double area() { return Math.PI * radius * radius; }
}

class Rectangle implements Shape {
    private double width, height;
    public Rectangle(double w, double h) { this.width = w; this.height = h; }
    public double area() { return width * height; }
}

class Triangle implements Shape {
    private double base, height;
    public Triangle(double b, double h) { this.base = b; this.height = h; }
    public double area() { return 0.5 * base * height; }
}

class ShapeFactory {
    public static Shape create(String type, double... dims) {
        switch (type.toLowerCase()) {
            case "circle": return new Circle(dims[0]);
            case "rectangle": return new Rectangle(dims[0], dims[1]);
            case "triangle": return new Triangle(dims[0], dims[1]);
            default: throw new IllegalArgumentException("Unknown shape: " + type);
        }
    }
}

public class FactoryDemo {
    public static void main(String[] args) {
        Shape circle = ShapeFactory.create("circle", 5);
        Shape rect = ShapeFactory.create("rectangle", 4, 6);
        Shape tri = ShapeFactory.create("triangle", 3, 8);

        System.out.println("Circle area: " + circle.area());
        System.out.println("Rectangle area: " + rect.area());
        System.out.println("Triangle area: " + tri.area());
    }
}'
WHERE id = '17fbfdd2-3022-4391-9223-0a070e640a0e';

UPDATE course_lessons SET solution_code = 'import java.util.ArrayList;
import java.util.List;

interface Subscriber {
    void onNews(String headline);
}

class EmailSubscriber implements Subscriber {
    private String email;
    public EmailSubscriber(String email) { this.email = email; }
    public void onNews(String headline) {
        System.out.println("Email to " + email + ": " + headline);
    }
}

class PhoneSubscriber implements Subscriber {
    private String phone;
    public PhoneSubscriber(String phone) { this.phone = phone; }
    public void onNews(String headline) {
        System.out.println("SMS to " + phone + ": " + headline);
    }
}

class NewsAgency {
    private List<Subscriber> subscribers = new ArrayList<>();

    public void subscribe(Subscriber s) { subscribers.add(s); }
    public void unsubscribe(Subscriber s) { subscribers.remove(s); }

    public void publish(String headline) {
        System.out.println("Publishing: " + headline);
        for (Subscriber s : subscribers) {
            s.onNews(headline);
        }
    }
}

public class ObserverDemo {
    public static void main(String[] args) {
        NewsAgency agency = new NewsAgency();
        Subscriber email = new EmailSubscriber("alice@mail.com");
        Subscriber phone = new PhoneSubscriber("555-0101");

        agency.subscribe(email);
        agency.subscribe(phone);
        agency.publish("Java 22 Released!");

        System.out.println();
        agency.unsubscribe(phone);
        agency.publish("Spring Boot 4 Announced!");
    }
}'
WHERE id = 'bc531a4a-056e-42b1-9a81-bd4926fb0349';

-- Generics, Streams, and Lambdas exercises
UPDATE course_lessons SET solution_code = 'import java.util.ArrayList;

public class Stack<T> {
    private ArrayList<T> items = new ArrayList<>();

    public void push(T item) {
        items.add(item);
    }

    public T pop() {
        if (isEmpty()) throw new RuntimeException("Stack is empty");
        return items.remove(items.size() - 1);
    }

    public T peek() {
        if (isEmpty()) throw new RuntimeException("Stack is empty");
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
        stringStack.push("Hello");
        stringStack.push("World");
        System.out.println("Peek: " + stringStack.peek());
        System.out.println("Pop: " + stringStack.pop());
        System.out.println("Size: " + stringStack.size());

        Stack<Integer> intStack = new Stack<>();
        intStack.push(10);
        intStack.push(20);
        intStack.push(30);
        System.out.println("\nInteger pop: " + intStack.pop());
        System.out.println("Integer peek: " + intStack.peek());
    }
}'
WHERE id = '0dc1fa1b-99a8-4b70-b5de-786e8cb623e2';

UPDATE course_lessons SET solution_code = 'import java.util.ArrayList;
import java.util.List;
import java.util.function.Predicate;

class Product {
    String name;
    double price;
    String category;

    public Product(String name, double price, String category) {
        this.name = name;
        this.price = price;
        this.category = category;
    }

    @Override
    public String toString() {
        return name + " ($" + price + ", " + category + ")";
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
        products.add(new Product("Book", 29.99, "Education"));
        products.add(new Product("Phone", 699.99, "Electronics"));
        products.add(new Product("Pen", 4.99, "Office"));
        products.add(new Product("Tablet", 449.99, "Electronics"));

        List<Product> affordable = filter(products, p -> p.price < 500);
        System.out.println("Under $500:");
        affordable.forEach(p -> System.out.println("  " + p));

        List<Product> electronics = filter(products, p -> p.category.equals("Electronics"));
        System.out.println("\nElectronics:");
        electronics.forEach(p -> System.out.println("  " + p));
    }
}'
WHERE id = '501e092c-74a2-4e70-a375-3b80165046f8';

UPDATE course_lessons SET solution_code = 'import java.util.List;
import java.util.Comparator;
import java.util.stream.Collectors;

class Student {
    String name;
    int age;
    double gpa;

    public Student(String name, int age, double gpa) {
        this.name = name;
        this.age = age;
        this.gpa = gpa;
    }
}

public class StreamDemo {
    public static void main(String[] args) {
        List<Student> students = List.of(
            new Student("Alice", 20, 3.8),
            new Student("Bob", 22, 2.9),
            new Student("Charlie", 21, 3.5),
            new Student("Diana", 20, 3.9),
            new Student("Eve", 23, 2.7)
        );

        long aboveThree = students.stream()
            .filter(s -> s.gpa > 3.0)
            .count();
        System.out.println("Students above 3.0: " + aboveThree);

        List<String> honorRoll = students.stream()
            .filter(s -> s.gpa >= 3.5)
            .sorted(Comparator.comparingDouble((Student s) -> s.gpa).reversed())
            .map(s -> s.name + " (" + s.gpa + ")")
            .collect(Collectors.toList());
        System.out.println("Honor roll: " + honorRoll);

        double avgGpa = students.stream()
            .mapToDouble(s -> s.gpa)
            .average()
            .orElse(0.0);
        System.out.println("Average GPA: " + String.format("%.2f", avgGpa));

        Student top = students.stream()
            .max(Comparator.comparingDouble(s -> s.gpa))
            .orElse(null);
        System.out.println("Top student: " + top.name + " (" + top.gpa + ")");
    }
}'
WHERE id = 'd0f5d576-17a2-4dab-a9d3-3aff85dc1089';