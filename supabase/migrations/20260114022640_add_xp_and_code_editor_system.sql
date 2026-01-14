/*
  # Add XP System and Code Editor Features

  ## Overview
  Adds XP tracking, code validation rules, and code saving functionality for interactive lessons

  ## Changes
  
  1. XP System
    - Add `xp_earned` column to `user_lesson_progress` table
    - Add `total_xp` column to `course_enrollments` table
    - Track XP per lesson completion
  
  2. Code Validation Rules
    - Add `validation_rules` JSONB column to `course_lessons` table
    - Add `starter_code` text column to `course_lessons` table
    - Add `solution_code` text column to `course_lessons` table
    - Add `xp_reward` integer column to `course_lessons` table
  
  3. Code Saving
    - Create `lesson_code_drafts` table for saving user code
    - User ID reference
    - Lesson ID reference
    - Code content
    - Last saved timestamp
    - Auto-save tracking
  
  4. Security
    - Enable RLS on new table
    - Add policies for authenticated users to manage their own drafts
*/

-- Add XP columns to existing tables
ALTER TABLE user_lesson_progress 
ADD COLUMN IF NOT EXISTS xp_earned integer DEFAULT 0;

ALTER TABLE course_enrollments 
ADD COLUMN IF NOT EXISTS total_xp integer DEFAULT 0;

-- Add code editor columns to course_lessons
ALTER TABLE course_lessons 
ADD COLUMN IF NOT EXISTS validation_rules jsonb DEFAULT NULL,
ADD COLUMN IF NOT EXISTS starter_code text DEFAULT NULL,
ADD COLUMN IF NOT EXISTS solution_code text DEFAULT NULL,
ADD COLUMN IF NOT EXISTS xp_reward integer DEFAULT 100;

-- Create table for code drafts
CREATE TABLE IF NOT EXISTS lesson_code_drafts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  lesson_id uuid REFERENCES course_lessons(id) ON DELETE CASCADE NOT NULL,
  code text NOT NULL,
  last_saved_at timestamptz DEFAULT now() NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(user_id, lesson_id)
);

-- Enable RLS on lesson_code_drafts
ALTER TABLE lesson_code_drafts ENABLE ROW LEVEL SECURITY;

-- Policies for lesson_code_drafts
CREATE POLICY "Users can view own code drafts"
  ON lesson_code_drafts FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own code drafts"
  ON lesson_code_drafts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own code drafts"
  ON lesson_code_drafts FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own code drafts"
  ON lesson_code_drafts FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_lesson_code_drafts_user_lesson 
ON lesson_code_drafts(user_id, lesson_id);

-- Add comment to table
COMMENT ON TABLE lesson_code_drafts IS 'Stores user code drafts for interactive coding lessons';
