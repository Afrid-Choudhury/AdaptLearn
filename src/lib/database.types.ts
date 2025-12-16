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
      course_enrollments: {
        Row: {
          id: string;
          user_id: string;
          course_id: string;
          status: 'active' | 'completed' | 'dropped';
          enrolled_at: string;
          completed_at: string | null;
          last_accessed: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          course_id: string;
          status?: 'active' | 'completed' | 'dropped';
          enrolled_at?: string;
          completed_at?: string | null;
          last_accessed?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          course_id?: string;
          status?: 'active' | 'completed' | 'dropped';
          enrolled_at?: string;
          completed_at?: string | null;
          last_accessed?: string;
        };
      };
      course_modules: {
        Row: {
          id: string;
          course_id: string;
          title: string;
          description: string | null;
          order_index: number;
          estimated_minutes: number;
          learning_objectives: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          course_id: string;
          title: string;
          description?: string | null;
          order_index: number;
          estimated_minutes?: number;
          learning_objectives?: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          course_id?: string;
          title?: string;
          description?: string | null;
          order_index?: number;
          estimated_minutes?: number;
          learning_objectives?: Json;
          created_at?: string;
        };
      };
      course_lessons: {
        Row: {
          id: string;
          module_id: string;
          title: string;
          description: string | null;
          order_index: number;
          estimated_minutes: number;
          content_type: 'video' | 'reading' | 'exercise' | 'quiz';
          content_url: string | null;
          content_text: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          module_id: string;
          title: string;
          description?: string | null;
          order_index: number;
          estimated_minutes?: number;
          content_type?: 'video' | 'reading' | 'exercise' | 'quiz';
          content_url?: string | null;
          content_text?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          module_id?: string;
          title?: string;
          description?: string | null;
          order_index?: number;
          estimated_minutes?: number;
          content_type?: 'video' | 'reading' | 'exercise' | 'quiz';
          content_url?: string | null;
          content_text?: string | null;
          created_at?: string;
        };
      };
      user_module_progress: {
        Row: {
          id: string;
          user_id: string;
          module_id: string;
          enrollment_id: string;
          status: 'not_started' | 'in_progress' | 'completed';
          completed_lessons: number;
          total_lessons: number;
          started_at: string | null;
          completed_at: string | null;
          last_accessed: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          module_id: string;
          enrollment_id: string;
          status?: 'not_started' | 'in_progress' | 'completed';
          completed_lessons?: number;
          total_lessons?: number;
          started_at?: string | null;
          completed_at?: string | null;
          last_accessed?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          module_id?: string;
          enrollment_id?: string;
          status?: 'not_started' | 'in_progress' | 'completed';
          completed_lessons?: number;
          total_lessons?: number;
          started_at?: string | null;
          completed_at?: string | null;
          last_accessed?: string;
        };
      };
      user_lesson_progress: {
        Row: {
          id: string;
          user_id: string;
          lesson_id: string;
          module_progress_id: string;
          completed: boolean;
          time_spent_minutes: number;
          started_at: string | null;
          completed_at: string | null;
          last_accessed: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          lesson_id: string;
          module_progress_id: string;
          completed?: boolean;
          time_spent_minutes?: number;
          started_at?: string | null;
          completed_at?: string | null;
          last_accessed?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          lesson_id?: string;
          module_progress_id?: string;
          completed?: boolean;
          time_spent_minutes?: number;
          started_at?: string | null;
          completed_at?: string | null;
          last_accessed?: string;
        };
      };
      user_roles: {
        Row: {
          id: string;
          user_id: string;
          role: 'admin' | 'instructor' | 'student';
          created_at: string;
          assigned_by: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          role?: 'admin' | 'instructor' | 'student';
          created_at?: string;
          assigned_by?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          role?: 'admin' | 'instructor' | 'student';
          created_at?: string;
          assigned_by?: string | null;
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
  prerequisites?: string[];
  learning_objectives?: string[];
}

export interface CourseModule {
  id: string;
  course_id: string;
  title: string;
  description: string | null;
  order_index: number;
  estimated_minutes: number;
  learning_objectives: string[];
  created_at: string;
}

export interface CourseLesson {
  id: string;
  module_id: string;
  title: string;
  description: string | null;
  order_index: number;
  estimated_minutes: number;
  content_type: 'video' | 'reading' | 'exercise' | 'quiz';
  content_url: string | null;
  content_text: string | null;
  created_at: string;
}

export interface CourseEnrollment {
  id: string;
  user_id: string;
  course_id: string;
  status: 'active' | 'completed' | 'dropped';
  enrolled_at: string;
  completed_at: string | null;
  last_accessed: string;
}

export interface UserModuleProgress {
  id: string;
  user_id: string;
  module_id: string;
  enrollment_id: string;
  status: 'not_started' | 'in_progress' | 'completed';
  completed_lessons: number;
  total_lessons: number;
  started_at: string | null;
  completed_at: string | null;
  last_accessed: string;
}

export interface UserLessonProgress {
  id: string;
  user_id: string;
  lesson_id: string;
  module_progress_id: string;
  completed: boolean;
  time_spent_minutes: number;
  started_at: string | null;
  completed_at: string | null;
  last_accessed: string;
}

export interface ModuleWithLessons extends CourseModule {
  lessons: CourseLesson[];
}

export interface ModuleWithProgress extends CourseModule {
  lessons: CourseLesson[];
  progress?: UserModuleProgress;
  lessonProgress?: UserLessonProgress[];
}

export interface CourseWithDetails extends Course {
  modules: ModuleWithLessons[];
  enrollment?: CourseEnrollment;
  moduleProgress?: UserModuleProgress[];
}

export interface UserRole {
  id: string;
  user_id: string;
  role: 'admin' | 'instructor' | 'student';
  created_at: string;
  assigned_by: string | null;
}

export type UserRoleType = 'admin' | 'instructor' | 'student';
