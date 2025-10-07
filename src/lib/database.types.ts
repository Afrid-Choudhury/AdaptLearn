export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          username: string | null;
          skill_level: 'beginner' | 'intermediate' | 'advanced';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          username?: string | null;
          skill_level?: 'beginner' | 'intermediate' | 'advanced';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          username?: string | null;
          skill_level?: 'beginner' | 'intermediate' | 'advanced';
          created_at?: string;
          updated_at?: string;
        };
      };
      assessments: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          language: string;
          difficulty: 'beginner' | 'intermediate' | 'advanced' | 'mixed';
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          language?: string;
          difficulty?: 'beginner' | 'intermediate' | 'advanced' | 'mixed';
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          language?: string;
          difficulty?: 'beginner' | 'intermediate' | 'advanced' | 'mixed';
          created_at?: string;
        };
      };
      assessment_questions: {
        Row: {
          id: string;
          assessment_id: string;
          question_text: string;
          options: Json;
          correct_answer: string;
          difficulty: 'beginner' | 'intermediate' | 'advanced';
          order_index: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          assessment_id: string;
          question_text: string;
          options: Json;
          correct_answer: string;
          difficulty?: 'beginner' | 'intermediate' | 'advanced';
          order_index: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          assessment_id?: string;
          question_text?: string;
          options?: Json;
          correct_answer?: string;
          difficulty?: 'beginner' | 'intermediate' | 'advanced';
          order_index?: number;
          created_at?: string;
        };
      };
      user_assessment_results: {
        Row: {
          id: string;
          user_id: string;
          assessment_id: string;
          score: number;
          answers: Json;
          completed_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          assessment_id: string;
          score: number;
          answers: Json;
          completed_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          assessment_id?: string;
          score?: number;
          answers?: Json;
          completed_at?: string;
        };
      };
      courses: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          difficulty: 'beginner' | 'intermediate' | 'advanced';
          duration_hours: number;
          rating: number;
          student_count: number;
          curriculum: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          difficulty?: 'beginner' | 'intermediate' | 'advanced';
          duration_hours?: number;
          rating?: number;
          student_count?: number;
          curriculum?: Json | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          difficulty?: 'beginner' | 'intermediate' | 'advanced';
          duration_hours?: number;
          rating?: number;
          student_count?: number;
          curriculum?: Json | null;
          created_at?: string;
        };
      };
      user_progress: {
        Row: {
          id: string;
          user_id: string;
          course_id: string;
          progress_percentage: number;
          time_spent_minutes: number;
          last_accessed: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          course_id: string;
          progress_percentage?: number;
          time_spent_minutes?: number;
          last_accessed?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          course_id?: string;
          progress_percentage?: number;
          time_spent_minutes?: number;
          last_accessed?: string;
          created_at?: string;
        };
      };
    };
  };
}

export type SkillLevel = 'beginner' | 'intermediate' | 'advanced';
export type Difficulty = 'beginner' | 'intermediate' | 'advanced' | 'mixed';

export interface AssessmentQuestion {
  id: string;
  assessment_id: string;
  question_text: string;
  options: string[];
  correct_answer: string;
  difficulty: Difficulty;
  order_index: number;
}

export interface UserAnswer {
  question_id: string;
  selected_answer: string;
  correct_answer: string;
  is_correct: boolean;
}

export interface Course {
  id: string;
  title: string;
  description: string | null;
  difficulty: SkillLevel;
  duration_hours: number;
  rating: number;
  student_count: number;
  curriculum: {
    modules: {
      title: string;
      lessons: string[];
    }[];
  } | null;
}
