/*
  # Course Enrollment and Module Structure System

  ## Overview
  This migration creates a comprehensive enrollment and module-level progress tracking system
  for the adaptive learning platform.

  ## 1. New Tables

  ### `course_enrollments`
  - `id` (uuid, primary key) - Unique enrollment identifier
  - `user_id` (uuid, foreign key) - References auth.users
  - `course_id` (uuid, foreign key) - References courses
  - `status` (text) - Enrollment status: 'active', 'completed', 'dropped'
  - `enrolled_at` (timestamptz) - Enrollment timestamp
  - `completed_at` (timestamptz) - Completion timestamp (nullable)
  - `last_accessed` (timestamptz) - Last access timestamp

  ### `course_modules`
  - `id` (uuid, primary key) - Unique module identifier
  - `course_id` (uuid, foreign key) - References courses
  - `title` (text) - Module title
  - `description` (text) - Module description
  - `order_index` (integer) - Display order within course
  - `estimated_minutes` (integer) - Estimated completion time in minutes
  - `learning_objectives` (jsonb) - Array of learning objectives
  - `created_at` (timestamptz) - Creation timestamp

  ### `course_lessons`
  - `id` (uuid, primary key) - Unique lesson identifier
  - `module_id` (uuid, foreign key) - References course_modules
  - `title` (text) - Lesson title
  - `description` (text) - Lesson description
  - `order_index` (integer) - Display order within module
  - `estimated_minutes` (integer) - Estimated completion time in minutes
  - `content_type` (text) - Type: 'video', 'reading', 'exercise', 'quiz'
  - `content_url` (text) - URL or path to content (nullable)
  - `created_at` (timestamptz) - Creation timestamp

  ### `user_module_progress`
  - `id` (uuid, primary key) - Unique progress record
  - `user_id` (uuid, foreign key) - References auth.users
  - `module_id` (uuid, foreign key) - References course_modules
  - `enrollment_id` (uuid, foreign key) - References course_enrollments
  - `status` (text) - Status: 'not_started', 'in_progress', 'completed'
  - `completed_lessons` (integer) - Number of lessons completed
  - `total_lessons` (integer) - Total lessons in module
  - `started_at` (timestamptz) - First access timestamp
  - `completed_at` (timestamptz) - Completion timestamp (nullable)
  - `last_accessed` (timestamptz) - Last access timestamp

  ### `user_lesson_progress`
  - `id` (uuid, primary key) - Unique progress record
  - `user_id` (uuid, foreign key) - References auth.users
  - `lesson_id` (uuid, foreign key) - References course_lessons
  - `module_progress_id` (uuid, foreign key) - References user_module_progress
  - `completed` (boolean) - Completion status
  - `time_spent_minutes` (integer) - Time spent on lesson
  - `started_at` (timestamptz) - First access timestamp
  - `completed_at` (timestamptz) - Completion timestamp (nullable)
  - `last_accessed` (timestamptz) - Last access timestamp

  ## 2. Table Modifications

  ### `courses` table updates
  - Add `prerequisites` (jsonb) - Array of prerequisite course IDs
  - Add `learning_objectives` (jsonb) - Array of course-level objectives

  ## 3. Security

  ### Row Level Security (RLS)
  - All new tables have RLS enabled
  - Enrollments: Users can view/insert/update their own enrollments
  - Modules: Public read access for authenticated users
  - Lessons: Public read access for authenticated users
  - Module Progress: Users can view/insert/update their own progress
  - Lesson Progress: Users can view/insert/update their own progress

  ## 4. Important Notes
  - Unique constraint on (user_id, course_id) in course_enrollments
  - Unique constraint on (user_id, module_id) in user_module_progress
  - Unique constraint on (user_id, lesson_id) in user_lesson_progress
  - Cascading deletes to maintain referential integrity
  - Indexes on foreign keys for performance
  - Default values for timestamps and counters
*/

-- Create course_enrollments table
CREATE TABLE IF NOT EXISTS course_enrollments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  course_id uuid NOT NULL REFERENCES courses ON DELETE CASCADE,
  status text DEFAULT 'active' CHECK (status IN ('active', 'completed', 'dropped')),
  enrolled_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  last_accessed timestamptz DEFAULT now(),
  UNIQUE(user_id, course_id)
);

-- Create course_modules table
CREATE TABLE IF NOT EXISTS course_modules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL REFERENCES courses ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  order_index integer NOT NULL,
  estimated_minutes integer DEFAULT 30,
  learning_objectives jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Create course_lessons table
CREATE TABLE IF NOT EXISTS course_lessons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id uuid NOT NULL REFERENCES course_modules ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  order_index integer NOT NULL,
  estimated_minutes integer DEFAULT 15,
  content_type text DEFAULT 'reading' CHECK (content_type IN ('video', 'reading', 'exercise', 'quiz')),
  content_url text,
  created_at timestamptz DEFAULT now()
);

-- Create user_module_progress table
CREATE TABLE IF NOT EXISTS user_module_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  module_id uuid NOT NULL REFERENCES course_modules ON DELETE CASCADE,
  enrollment_id uuid NOT NULL REFERENCES course_enrollments ON DELETE CASCADE,
  status text DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed')),
  completed_lessons integer DEFAULT 0,
  total_lessons integer DEFAULT 0,
  started_at timestamptz,
  completed_at timestamptz,
  last_accessed timestamptz DEFAULT now(),
  UNIQUE(user_id, module_id)
);

-- Create user_lesson_progress table
CREATE TABLE IF NOT EXISTS user_lesson_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  lesson_id uuid NOT NULL REFERENCES course_lessons ON DELETE CASCADE,
  module_progress_id uuid NOT NULL REFERENCES user_module_progress ON DELETE CASCADE,
  completed boolean DEFAULT false,
  time_spent_minutes integer DEFAULT 0,
  started_at timestamptz,
  completed_at timestamptz,
  last_accessed timestamptz DEFAULT now(),
  UNIQUE(user_id, lesson_id)
);

-- Add new columns to courses table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'courses' AND column_name = 'prerequisites'
  ) THEN
    ALTER TABLE courses ADD COLUMN prerequisites jsonb DEFAULT '[]'::jsonb;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'courses' AND column_name = 'learning_objectives'
  ) THEN
    ALTER TABLE courses ADD COLUMN learning_objectives jsonb DEFAULT '[]'::jsonb;
  END IF;
END $$;

-- Enable Row Level Security
ALTER TABLE course_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_module_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_lesson_progress ENABLE ROW LEVEL SECURITY;

-- Course enrollments policies
CREATE POLICY "Users can view their own enrollments"
  ON course_enrollments FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own enrollments"
  ON course_enrollments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own enrollments"
  ON course_enrollments FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Course modules policies (public read)
CREATE POLICY "Authenticated users can view course modules"
  ON course_modules FOR SELECT
  TO authenticated
  USING (true);

-- Course lessons policies (public read)
CREATE POLICY "Authenticated users can view course lessons"
  ON course_lessons FOR SELECT
  TO authenticated
  USING (true);

-- User module progress policies
CREATE POLICY "Users can view their own module progress"
  ON user_module_progress FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own module progress"
  ON user_module_progress FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own module progress"
  ON user_module_progress FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- User lesson progress policies
CREATE POLICY "Users can view their own lesson progress"
  ON user_lesson_progress FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own lesson progress"
  ON user_lesson_progress FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own lesson progress"
  ON user_lesson_progress FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_course_enrollments_user_id ON course_enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_course_enrollments_course_id ON course_enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_course_modules_course_id ON course_modules(course_id);
CREATE INDEX IF NOT EXISTS idx_course_lessons_module_id ON course_lessons(module_id);
CREATE INDEX IF NOT EXISTS idx_user_module_progress_user_id ON user_module_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_module_progress_module_id ON user_module_progress(module_id);
CREATE INDEX IF NOT EXISTS idx_user_module_progress_enrollment_id ON user_module_progress(enrollment_id);
CREATE INDEX IF NOT EXISTS idx_user_lesson_progress_user_id ON user_lesson_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_lesson_progress_lesson_id ON user_lesson_progress(lesson_id);
CREATE INDEX IF NOT EXISTS idx_user_lesson_progress_module_progress_id ON user_lesson_progress(module_progress_id);

-- Insert sample course learning objectives and prerequisites
UPDATE courses 
SET learning_objectives = '[
  "Master fundamental Java syntax and programming concepts",
  "Understand object-oriented programming principles",
  "Build confidence to write simple Java programs independently",
  "Prepare for intermediate Java development topics"
]'::jsonb
WHERE title = 'Java Fundamentals for Beginners';

UPDATE courses 
SET learning_objectives = '[
  "Master Java collections framework and data structures",
  "Implement robust exception handling strategies",
  "Work with file I/O and serialization",
  "Apply design patterns in real-world scenarios"
]'::jsonb,
prerequisites = '[]'::jsonb
WHERE title = 'Intermediate Java Development';

UPDATE courses 
SET learning_objectives = '[
  "Master concurrent programming and multithreading",
  "Understand JVM internals and performance optimization",
  "Build enterprise-grade applications with Spring",
  "Design and implement microservices architectures"
]'::jsonb,
prerequisites = '[]'::jsonb
WHERE title = 'Advanced Java and Enterprise Development';

-- Insert sample modules for "Java Fundamentals for Beginners"
INSERT INTO course_modules (course_id, title, description, order_index, estimated_minutes, learning_objectives)
SELECT 
  id,
  'Getting Started with Java',
  'Learn the basics of Java programming, set up your development environment, and write your first programs.',
  1,
  180,
  '[
    "Understand what Java is and its key features",
    "Set up JDK and IDE on your computer",
    "Write and run your first Java program",
    "Learn about variables, data types, and basic syntax"
  ]'::jsonb
FROM courses WHERE title = 'Java Fundamentals for Beginners'
ON CONFLICT DO NOTHING;

INSERT INTO course_modules (course_id, title, description, order_index, estimated_minutes, learning_objectives)
SELECT 
  id,
  'Control Flow and Logic',
  'Master decision-making and repetition in Java using conditional statements and loops.',
  2,
  240,
  '[
    "Use if-else statements for conditional logic",
    "Implement loops for repetitive tasks",
    "Understand switch statements and when to use them",
    "Apply break and continue for loop control"
  ]'::jsonb
FROM courses WHERE title = 'Java Fundamentals for Beginners'
ON CONFLICT DO NOTHING;

INSERT INTO course_modules (course_id, title, description, order_index, estimated_minutes, learning_objectives)
SELECT 
  id,
  'Object-Oriented Programming Basics',
  'Dive into OOP concepts including classes, objects, methods, and encapsulation.',
  3,
  300,
  '[
    "Create classes and instantiate objects",
    "Define methods and work with parameters",
    "Understand constructors and object initialization",
    "Apply encapsulation to protect data"
  ]'::jsonb
FROM courses WHERE title = 'Java Fundamentals for Beginners'
ON CONFLICT DO NOTHING;

-- Insert sample lessons for first module
INSERT INTO course_lessons (module_id, title, description, order_index, estimated_minutes, content_type)
SELECT 
  id,
  'Introduction to Java',
  'Discover the history of Java, its key features, and why it remains one of the most popular programming languages.',
  1,
  20,
  'video'
FROM course_modules 
WHERE title = 'Getting Started with Java' 
  AND course_id = (SELECT id FROM courses WHERE title = 'Java Fundamentals for Beginners')
ON CONFLICT DO NOTHING;

INSERT INTO course_lessons (module_id, title, description, order_index, estimated_minutes, content_type)
SELECT 
  id,
  'Setting Up Your Development Environment',
  'Step-by-step guide to installing JDK, choosing an IDE, and configuring your workspace.',
  2,
  45,
  'reading'
FROM course_modules 
WHERE title = 'Getting Started with Java' 
  AND course_id = (SELECT id FROM courses WHERE title = 'Java Fundamentals for Beginners')
ON CONFLICT DO NOTHING;

INSERT INTO course_lessons (module_id, title, description, order_index, estimated_minutes, content_type)
SELECT 
  id,
  'Your First Java Program',
  'Write, compile, and run your first "Hello World" program in Java.',
  3,
  30,
  'exercise'
FROM course_modules 
WHERE title = 'Getting Started with Java' 
  AND course_id = (SELECT id FROM courses WHERE title = 'Java Fundamentals for Beginners')
ON CONFLICT DO NOTHING;

INSERT INTO course_lessons (module_id, title, description, order_index, estimated_minutes, content_type)
SELECT 
  id,
  'Variables and Data Types',
  'Learn about primitive data types, variables, and how to store and manipulate data in Java.',
  4,
  40,
  'video'
FROM course_modules 
WHERE title = 'Getting Started with Java' 
  AND course_id = (SELECT id FROM courses WHERE title = 'Java Fundamentals for Beginners')
ON CONFLICT DO NOTHING;

INSERT INTO course_lessons (module_id, title, description, order_index, estimated_minutes, content_type)
SELECT 
  id,
  'Practice: Variables and Data Types',
  'Test your understanding with hands-on exercises working with different data types.',
  5,
  45,
  'quiz'
FROM course_modules 
WHERE title = 'Getting Started with Java' 
  AND course_id = (SELECT id FROM courses WHERE title = 'Java Fundamentals for Beginners')
ON CONFLICT DO NOTHING;