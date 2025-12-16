/*
  # Add Lesson Content Field

  ## Overview
  Adds content_text column to store detailed lesson content.

  ## 1. Schema Changes
  - Add `content_text` column to `course_lessons` table

  ## 2. Important Notes
  - Column allows null values initially
  - Content will be populated in subsequent migrations
*/

-- Add content_text column to course_lessons
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'course_lessons' AND column_name = 'content_text'
  ) THEN
    ALTER TABLE course_lessons ADD COLUMN content_text text;
  END IF;
END $$;
