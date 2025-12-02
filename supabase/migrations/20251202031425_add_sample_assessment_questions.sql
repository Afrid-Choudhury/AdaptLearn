/*
  # Add Sample Assessment Questions

  1. New Data
    - Creates initial assessment for Java programming
    - Adds 15 sample questions covering beginner, intermediate, and advanced topics
    - Questions test fundamental Java concepts, OOP, collections, and best practices

  2. Security
    - No RLS changes needed
    - Questions are publicly readable by authenticated users per existing policies
*/

-- Insert the main assessment (using the ID referenced in Assessment.tsx)
INSERT INTO assessments (id, title, description, language, difficulty)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Java Programming Skills Assessment',
  'Test your Java programming knowledge across beginner, intermediate, and advanced topics. This assessment helps us personalize your learning journey.',
  'Java',
  'mixed'
)
ON CONFLICT (id) DO NOTHING;

-- Beginner questions (5 questions)
INSERT INTO assessment_questions (assessment_id, question_text, options, correct_answer, difficulty, order_index)
VALUES
  (
    '00000000-0000-0000-0000-000000000001',
    'What is the correct way to declare a variable in Java?',
    '["int x = 5;", "variable x = 5;", "x := 5;", "let x = 5;"]'::jsonb,
    'int x = 5;',
    'beginner',
    1
  ),
  (
    '00000000-0000-0000-0000-000000000001',
    'Which keyword is used to create a class in Java?',
    '["class", "Class", "define", "struct"]'::jsonb,
    'class',
    'beginner',
    2
  ),
  (
    '00000000-0000-0000-0000-000000000001',
    'What is the default value of a boolean variable in Java?',
    '["false", "true", "0", "null"]'::jsonb,
    'false',
    'beginner',
    3
  ),
  (
    '00000000-0000-0000-0000-000000000001',
    'Which method is the entry point of a Java application?',
    '["main()", "start()", "run()", "begin()"]'::jsonb,
    'main()',
    'beginner',
    4
  ),
  (
    '00000000-0000-0000-0000-000000000001',
    'What is the correct syntax for a single-line comment in Java?',
    '["// comment", "/* comment */", "# comment", "<!-- comment -->"]'::jsonb,
    '// comment',
    'beginner',
    5
  ),

-- Intermediate questions (5 questions)
  (
    '00000000-0000-0000-0000-000000000001',
    'What is the purpose of the "final" keyword when applied to a variable?',
    '["Makes the variable constant", "Makes the variable private", "Makes the variable static", "Makes the variable protected"]'::jsonb,
    'Makes the variable constant',
    'intermediate',
    6
  ),
  (
    '00000000-0000-0000-0000-000000000001',
    'Which collection type does NOT allow duplicate elements?',
    '["Set", "List", "ArrayList", "LinkedList"]'::jsonb,
    'Set',
    'intermediate',
    7
  ),
  (
    '00000000-0000-0000-0000-000000000001',
    'What is method overloading in Java?',
    '["Multiple methods with same name but different parameters", "Overriding parent class methods", "Creating static methods", "Using abstract methods"]'::jsonb,
    'Multiple methods with same name but different parameters',
    'intermediate',
    8
  ),
  (
    '00000000-0000-0000-0000-000000000001',
    'Which of these is NOT a valid access modifier in Java?',
    '["friend", "private", "protected", "public"]'::jsonb,
    'friend',
    'intermediate',
    9
  ),
  (
    '00000000-0000-0000-0000-000000000001',
    'What does the "extends" keyword do in Java?',
    '["Creates inheritance relationship", "Implements an interface", "Creates a package", "Defines a method"]'::jsonb,
    'Creates inheritance relationship',
    'intermediate',
    10
  ),

-- Advanced questions (5 questions)
  (
    '00000000-0000-0000-0000-000000000001',
    'What is the difference between "==" and ".equals()" when comparing objects?',
    '["== compares references, .equals() compares content", "They are identical", ".equals() compares references, == compares content", "Both compare content"]'::jsonb,
    '== compares references, .equals() compares content',
    'advanced',
    11
  ),
  (
    '00000000-0000-0000-0000-000000000001',
    'Which design pattern ensures a class has only one instance?',
    '["Singleton", "Factory", "Observer", "Strategy"]'::jsonb,
    'Singleton',
    'advanced',
    12
  ),
  (
    '00000000-0000-0000-0000-000000000001',
    'What is the purpose of the "volatile" keyword in Java?',
    '["Ensures visibility of variable changes across threads", "Makes variable immutable", "Increases performance", "Declares constant"]'::jsonb,
    'Ensures visibility of variable changes across threads',
    'advanced',
    13
  ),
  (
    '00000000-0000-0000-0000-000000000001',
    'What is a lambda expression in Java?',
    '["Anonymous function implementation", "Type of loop", "Exception handler", "Collection type"]'::jsonb,
    'Anonymous function implementation',
    'advanced',
    14
  ),
  (
    '00000000-0000-0000-0000-000000000001',
    'Which Java feature allows you to work with databases efficiently using streams?',
    '["Stream API", "JDBC", "Hibernate", "Collections"]'::jsonb,
    'Stream API',
    'advanced',
    15
  )
ON CONFLICT DO NOTHING;