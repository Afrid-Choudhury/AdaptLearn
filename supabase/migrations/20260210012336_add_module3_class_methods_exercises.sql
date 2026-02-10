/*
  # Add Class and Methods Exercises to Module 3

  1. New Lessons
    - `Try It: Create a Class` (order_index 7, 250 XP)
    - `Try It: Methods in Action` (order_index 8, 250 XP)

  2. Security
    - No RLS changes needed
*/

INSERT INTO course_lessons (
  module_id, title, description, order_index, estimated_minutes,
  content_type, content_text, starter_code, solution_code, validation_rules, xp_reward
)
SELECT
  m.id,
  'Try It: Create a Class',
  'Define your first custom Java class with fields and a method',
  7, 25, 'exercise',
  '# Try It: Create a Class

Put your OOP knowledge into practice by creating a `Dog` class from scratch.

## Your Task

1. Create a class called `Dog` with these **fields**:
   - `String name`
   - `String breed`
   - `int age`

2. Add a method called `bark()` that returns a `String`:
   - It should return `"<name> says: Woof!"` (replace `<name>` with the dog''s name)

3. In the `main` method:
   - Create a `Dog` object
   - Set its `name` to `"Buddy"`, `breed` to `"Golden Retriever"`, and `age` to `3`
   - Call `bark()` and print the result
   - Print: `"Buddy is a 3 year old Golden Retriever"`

## Expected Output

```
Buddy says: Woof!
Buddy is a 3 year old Golden Retriever
```

## Hints

- Access fields with dot notation: `myDog.name`
- Use `return` to send a value back from a method',
  'public class Dog {
    // Declare fields here


    // Create the bark() method


    public static void main(String[] args) {
        // Create a Dog object and set its fields


        // Print bark result


        // Print dog info

    }
}',
  'public class Dog {
    String name;
    String breed;
    int age;

    String bark() {
        return name + " says: Woof!";
    }

    public static void main(String[] args) {
        Dog myDog = new Dog();
        myDog.name = "Buddy";
        myDog.breed = "Golden Retriever";
        myDog.age = 3;

        System.out.println(myDog.bark());
        System.out.println(myDog.name + " is a " + myDog.age + " year old " + myDog.breed);
    }
}',
  '{"mustContain":["String name","String breed","int age","bark","new Dog","System.out.println"],"regexMatch":"(String|string)\\s+bark\\s*\\(","methodSignatureExists":"public\\s+static\\s+void\\s+main\\s*\\(\\s*String\\s*\\[\\s*\\]\\s*args\\s*\\)"}'::jsonb,
  250
FROM course_modules m
JOIN courses c ON m.course_id = c.id
WHERE c.title = 'Java Fundamentals for Beginners' AND m.order_index = 3
ON CONFLICT DO NOTHING;

INSERT INTO course_lessons (
  module_id, title, description, order_index, estimated_minutes,
  content_type, content_text, starter_code, solution_code, validation_rules, xp_reward
)
SELECT
  m.id,
  'Try It: Methods in Action',
  'Practice writing methods with parameters and return values',
  8, 25, 'exercise',
  '# Try It: Methods in Action

Practice creating methods that accept parameters and return values by building a simple `Calculator` class.

## Your Task

1. Create a class called `Calculator` with these methods:
   - `int add(int a, int b)` — returns the sum
   - `int subtract(int a, int b)` — returns the difference
   - `int multiply(int a, int b)` — returns the product
   - `double divide(int a, int b)` — returns the quotient as a double

2. In `main`, create a `Calculator` object and test each method:
   - Print `add(10, 5)` — should output `15`
   - Print `subtract(10, 5)` — should output `5`
   - Print `multiply(10, 5)` — should output `50`
   - Print `divide(10, 4)` — should output `2.5`

## Expected Output

```
15
5
50
2.5
```

## Hints

- For `divide`, cast one operand to `double`: `(double) a / b`
- Each method should use `return` to send back its result',
  'public class Calculator {
    // Create add method


    // Create subtract method


    // Create multiply method


    // Create divide method


    public static void main(String[] args) {
        Calculator calc = new Calculator();

        // Test each method and print results

    }
}',
  'public class Calculator {
    int add(int a, int b) {
        return a + b;
    }

    int subtract(int a, int b) {
        return a - b;
    }

    int multiply(int a, int b) {
        return a * b;
    }

    double divide(int a, int b) {
        return (double) a / b;
    }

    public static void main(String[] args) {
        Calculator calc = new Calculator();
        System.out.println(calc.add(10, 5));
        System.out.println(calc.subtract(10, 5));
        System.out.println(calc.multiply(10, 5));
        System.out.println(calc.divide(10, 4));
    }
}',
  '{"mustContain":["int add","int subtract","int multiply","double divide","return","new Calculator","System.out.println"],"methodSignatureExists":"public\\s+static\\s+void\\s+main\\s*\\(\\s*String\\s*\\[\\s*\\]\\s*args\\s*\\)"}'::jsonb,
  250
FROM course_modules m
JOIN courses c ON m.course_id = c.id
WHERE c.title = 'Java Fundamentals for Beginners' AND m.order_index = 3
ON CONFLICT DO NOTHING;
