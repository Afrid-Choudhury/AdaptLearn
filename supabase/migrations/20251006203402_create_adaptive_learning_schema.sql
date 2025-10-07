/*
  # Adaptive Learning Platform Database Schema

  ## Overview
  This migration creates the complete database structure for an adaptive learning platform focused on Java programming education.

  ## 1. New Tables

  ### `profiles`
  - `id` (uuid, primary key) - References auth.users
  - `email` (text) - User email address
  - `username` (text) - Display name
  - `skill_level` (text) - Current skill level: 'beginner', 'intermediate', 'advanced'
  - `created_at` (timestamptz) - Account creation timestamp
  - `updated_at` (timestamptz) - Last profile update timestamp

  ### `assessments`
  - `id` (uuid, primary key) - Unique assessment identifier
  - `title` (text) - Assessment title
  - `description` (text) - Detailed assessment description
  - `language` (text) - Programming language (e.g., 'Java')
  - `difficulty` (text) - Overall difficulty level
  - `created_at` (timestamptz) - Creation timestamp

  ### `assessment_questions`
  - `id` (uuid, primary key) - Unique question identifier
  - `assessment_id` (uuid, foreign key) - References assessments
  - `question_text` (text) - The question content
  - `options` (jsonb) - Array of answer options
  - `correct_answer` (text) - The correct answer
  - `difficulty` (text) - Question difficulty level
  - `order_index` (integer) - Display order in assessment
  - `created_at` (timestamptz) - Creation timestamp

  ### `user_assessment_results`
  - `id` (uuid, primary key) - Unique result identifier
  - `user_id` (uuid, foreign key) - References auth.users
  - `assessment_id` (uuid, foreign key) - References assessments
  - `score` (integer) - Final score (0-100)
  - `answers` (jsonb) - User's answers with correctness
  - `completed_at` (timestamptz) - Completion timestamp

  ### `courses`
  - `id` (uuid, primary key) - Unique course identifier
  - `title` (text) - Course title
  - `description` (text) - Course description
  - `difficulty` (text) - Target difficulty level
  - `duration_hours` (integer) - Estimated completion time
  - `rating` (decimal) - Average course rating
  - `student_count` (integer) - Number of enrolled students
  - `curriculum` (jsonb) - Course modules and lessons structure
  - `created_at` (timestamptz) - Creation timestamp

  ### `user_progress`
  - `id` (uuid, primary key) - Unique progress record
  - `user_id` (uuid, foreign key) - References auth.users
  - `course_id` (uuid, foreign key) - References courses
  - `progress_percentage` (integer) - Completion percentage (0-100)
  - `time_spent_minutes` (integer) - Total time spent on course
  - `last_accessed` (timestamptz) - Last access timestamp
  - `created_at` (timestamptz) - Enrollment timestamp

  ## 2. Security

  ### Row Level Security (RLS)
  - All tables have RLS enabled
  - Profiles: Users can read/update their own profile
  - Assessment results: Users can read/insert their own results
  - User progress: Users can read/update their own progress
  - Assessments and questions: Public read access for all authenticated users
  - Courses: Public read access for all authenticated users

  ## 3. Important Notes
  - All timestamps use UTC timezone
  - JSON fields store structured data for flexibility
  - Foreign key constraints ensure data integrity
  - Indexes on frequently queried columns for performance
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email text NOT NULL,
  username text,
  skill_level text DEFAULT 'beginner' CHECK (skill_level IN ('beginner', 'intermediate', 'advanced')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create assessments table
CREATE TABLE IF NOT EXISTS assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  language text DEFAULT 'Java',
  difficulty text DEFAULT 'mixed' CHECK (difficulty IN ('beginner', 'intermediate', 'advanced', 'mixed')),
  created_at timestamptz DEFAULT now()
);

-- Create assessment_questions table
CREATE TABLE IF NOT EXISTS assessment_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id uuid NOT NULL REFERENCES assessments ON DELETE CASCADE,
  question_text text NOT NULL,
  options jsonb NOT NULL,
  correct_answer text NOT NULL,
  difficulty text DEFAULT 'intermediate' CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  order_index integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create user_assessment_results table
CREATE TABLE IF NOT EXISTS user_assessment_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  assessment_id uuid NOT NULL REFERENCES assessments ON DELETE CASCADE,
  score integer NOT NULL CHECK (score >= 0 AND score <= 100),
  answers jsonb NOT NULL,
  completed_at timestamptz DEFAULT now()
);

-- Create courses table
CREATE TABLE IF NOT EXISTS courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  difficulty text DEFAULT 'beginner' CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  duration_hours integer DEFAULT 10,
  rating decimal(3,2) DEFAULT 4.50,
  student_count integer DEFAULT 0,
  curriculum jsonb,
  created_at timestamptz DEFAULT now()
);

-- Create user_progress table
CREATE TABLE IF NOT EXISTS user_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  course_id uuid NOT NULL REFERENCES courses ON DELETE CASCADE,
  progress_percentage integer DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  time_spent_minutes integer DEFAULT 0,
  last_accessed timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, course_id)
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_assessment_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Assessments policies (public read for authenticated users)
CREATE POLICY "Authenticated users can view assessments"
  ON assessments FOR SELECT
  TO authenticated
  USING (true);

-- Assessment questions policies (public read for authenticated users)
CREATE POLICY "Authenticated users can view assessment questions"
  ON assessment_questions FOR SELECT
  TO authenticated
  USING (true);

-- User assessment results policies
CREATE POLICY "Users can view their own assessment results"
  ON user_assessment_results FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own assessment results"
  ON user_assessment_results FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Courses policies (public read for authenticated users)
CREATE POLICY "Authenticated users can view courses"
  ON courses FOR SELECT
  TO authenticated
  USING (true);

-- User progress policies
CREATE POLICY "Users can view their own progress"
  ON user_progress FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress"
  ON user_progress FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress"
  ON user_progress FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_assessment_questions_assessment_id ON assessment_questions(assessment_id);
CREATE INDEX IF NOT EXISTS idx_user_assessment_results_user_id ON user_assessment_results(user_id);
CREATE INDEX IF NOT EXISTS idx_user_assessment_results_assessment_id ON user_assessment_results(assessment_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_course_id ON user_progress(course_id);

-- Insert sample assessment
INSERT INTO assessments (id, title, description, language, difficulty) VALUES
  ('00000000-0000-0000-0000-000000000001', 'Java Skills Assessment', 'Test your Java programming knowledge across various difficulty levels', 'Java', 'mixed')
ON CONFLICT (id) DO NOTHING;

-- Insert sample assessment questions
INSERT INTO assessment_questions (assessment_id, question_text, options, correct_answer, difficulty, order_index) VALUES
  ('00000000-0000-0000-0000-000000000001', 'What is the correct syntax to output "Hello World" in Java?', 
   '["System.out.println(\"Hello World\");", "Console.WriteLine(\"Hello World\");", "print(\"Hello World\")", "echo(\"Hello World\");"]',
   'System.out.println("Hello World");', 'beginner', 1),
  
  ('00000000-0000-0000-0000-000000000001', 'Which keyword is used to create a class in Java?', 
   '["class", "Class", "create", "new"]',
   'class', 'beginner', 2),
  
  ('00000000-0000-0000-0000-000000000001', 'What is the default value of a boolean variable in Java?', 
   '["true", "false", "null", "0"]',
   'false', 'beginner', 3),
  
  ('00000000-0000-0000-0000-000000000001', 'Which of these is NOT a valid access modifier in Java?', 
   '["public", "private", "protected", "internal"]',
   'internal', 'intermediate', 4),
  
  ('00000000-0000-0000-0000-000000000001', 'What is the output of: System.out.println(10 + 20 + "30");', 
   '["102030", "3030", "60", "603"]',
   '3030', 'intermediate', 5),
  
  ('00000000-0000-0000-0000-000000000001', 'Which collection class allows you to store key-value pairs?', 
   '["ArrayList", "HashMap", "LinkedList", "HashSet"]',
   'HashMap', 'intermediate', 6),
  
  ('00000000-0000-0000-0000-000000000001', 'What does the "synchronized" keyword do in Java?', 
   '["Makes a method thread-safe", "Makes a variable constant", "Speeds up execution", "Enables garbage collection"]',
   'Makes a method thread-safe', 'advanced', 7),
  
  ('00000000-0000-0000-0000-000000000001', 'Which interface must be implemented for an object to be used in a for-each loop?', 
   '["Iterable", "Collection", "List", "Enumerable"]',
   'Iterable', 'advanced', 8),
  
  ('00000000-0000-0000-0000-000000000001', 'What is the purpose of the "transient" keyword?', 
   '["Prevents serialization of a field", "Makes a method abstract", "Creates a temporary variable", "Enables multithreading"]',
   'Prevents serialization of a field', 'advanced', 9),
  
  ('00000000-0000-0000-0000-000000000001', 'Which design pattern is used by the String class in Java?', 
   '["Flyweight", "Singleton", "Factory", "Observer"]',
   'Flyweight', 'advanced', 10)
ON CONFLICT DO NOTHING;

-- Insert sample courses
INSERT INTO courses (title, description, difficulty, duration_hours, rating, student_count, curriculum) VALUES
  ('Java Fundamentals for Beginners', 'Start your Java journey with core concepts, syntax, and object-oriented programming basics. Perfect for those new to programming.', 'beginner', 20, 4.80, 15420,
   '{"modules": [
     {"title": "Getting Started with Java", "lessons": ["Introduction to Java", "Setting up your environment", "Your first Java program", "Understanding variables and data types"]},
     {"title": "Control Flow", "lessons": ["If statements and conditions", "Loops: for, while, do-while", "Switch statements", "Break and continue"]},
     {"title": "Object-Oriented Programming Basics", "lessons": ["Classes and objects", "Methods and parameters", "Constructors", "Encapsulation"]}
   ]}'),
  
  ('Intermediate Java Development', 'Advance your Java skills with collections, exception handling, file I/O, and design patterns. Build robust, production-ready applications.', 'intermediate', 30, 4.65, 8950,
   '{"modules": [
     {"title": "Collections Framework", "lessons": ["Lists and ArrayLists", "Sets and HashSets", "Maps and HashMaps", "Iterators and streams"]},
     {"title": "Exception Handling", "lessons": ["Try-catch blocks", "Custom exceptions", "Finally and resource management", "Best practices"]},
     {"title": "File I/O and Serialization", "lessons": ["Reading and writing files", "Buffered streams", "Object serialization", "NIO package"]}
   ]}'),
  
  ('Advanced Java and Enterprise Development', 'Master advanced Java concepts including concurrency, JVM internals, microservices, and enterprise patterns for professional development.', 'advanced', 40, 4.90, 5230,
   '{"modules": [
     {"title": "Concurrency and Multithreading", "lessons": ["Threads and runnables", "Synchronization", "Concurrent collections", "ExecutorService and thread pools"]},
     {"title": "JVM and Performance", "lessons": ["JVM architecture", "Garbage collection", "Memory management", "Performance tuning"]},
     {"title": "Enterprise Java", "lessons": ["Spring Framework basics", "RESTful APIs", "Microservices architecture", "Testing and deployment"]}
   ]}')
ON CONFLICT DO NOTHING;