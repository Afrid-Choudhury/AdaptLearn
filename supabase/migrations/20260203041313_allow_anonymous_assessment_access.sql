/*
  # Allow Anonymous Users to Access Assessment Questions
  
  1. Security Changes
    - Add SELECT policy on `assessment_questions` table for anonymous (anon) role
    - This enables non-authenticated visitors to take the free assessment
    
  2. Notes
    - The existing policy only allowed authenticated users
    - Anonymous users need read access to display assessment questions
    - This is intentional for the "Take Free Assessment" feature
*/

CREATE POLICY "Anonymous users can view assessment questions"
  ON assessment_questions
  FOR SELECT
  TO anon
  USING (true);