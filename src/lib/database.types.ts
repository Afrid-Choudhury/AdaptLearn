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
        Relationships: [];
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
        Relationships: [];
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
        Relationships: [];
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
        Relationships: [];
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
          prerequisites: Json;
          learning_objectives: Json;
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
          prerequisites?: Json;
          learning_objectives?: Json;
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
          prerequisites?: Json;
          learning_objectives?: Json;
        };
        Relationships: [];
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
        Relationships: [];
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
          total_xp: number;
        };
        Insert: {
          id?: string;
          user_id: string;
          course_id: string;
          status?: 'active' | 'completed' | 'dropped';
          enrolled_at?: string;
          completed_at?: string | null;
          last_accessed?: string;
          total_xp?: number;
        };
        Update: {
          id?: string;
          user_id?: string;
          course_id?: string;
          status?: 'active' | 'completed' | 'dropped';
          enrolled_at?: string;
          completed_at?: string | null;
          last_accessed?: string;
          total_xp?: number;
        };
        Relationships: [];
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
        Relationships: [];
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
          validation_rules: Json | null;
          starter_code: string | null;
          solution_code: string | null;
          xp_reward: number;
          created_at: string;
          execution_enabled: boolean;
          test_case_mode: 'output_match' | 'unit_test' | 'custom_validator';
          max_execution_time: number;
          max_memory_mb: number;
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
          validation_rules?: Json | null;
          starter_code?: string | null;
          solution_code?: string | null;
          xp_reward?: number;
          created_at?: string;
          execution_enabled?: boolean;
          test_case_mode?: 'output_match' | 'unit_test' | 'custom_validator';
          max_execution_time?: number;
          max_memory_mb?: number;
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
          validation_rules?: Json | null;
          starter_code?: string | null;
          solution_code?: string | null;
          xp_reward?: number;
          created_at?: string;
          execution_enabled?: boolean;
          test_case_mode?: 'output_match' | 'unit_test' | 'custom_validator';
          max_execution_time?: number;
          max_memory_mb?: number;
        };
        Relationships: [];
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
        Relationships: [];
      };
      user_lesson_progress: {
        Row: {
          id: string;
          user_id: string;
          lesson_id: string;
          module_progress_id: string;
          completed: boolean;
          time_spent_minutes: number;
          xp_earned: number;
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
          xp_earned?: number;
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
          xp_earned?: number;
          started_at?: string | null;
          completed_at?: string | null;
          last_accessed?: string;
        };
        Relationships: [];
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
        Relationships: [];
      };
      lesson_code_drafts: {
        Row: {
          id: string;
          user_id: string;
          lesson_id: string;
          code: string;
          last_saved_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          lesson_id: string;
          code: string;
          last_saved_at?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          lesson_id?: string;
          code?: string;
          last_saved_at?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      achievements: {
        Row: {
          id: string;
          name: string;
          description: string;
          icon: string;
          criteria_type: 'enrollment' | 'completion' | 'assessment_score' | 'streak' | 'custom';
          criteria_value: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description: string;
          icon: string;
          criteria_type: 'enrollment' | 'completion' | 'assessment_score' | 'streak' | 'custom';
          criteria_value?: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          icon?: string;
          criteria_type?: 'enrollment' | 'completion' | 'assessment_score' | 'streak' | 'custom';
          criteria_value?: Json;
          created_at?: string;
        };
        Relationships: [];
      };
      user_achievements: {
        Row: {
          id: string;
          user_id: string;
          achievement_id: string;
          unlocked_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          achievement_id: string;
          unlocked_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          achievement_id?: string;
          unlocked_at?: string;
        };
        Relationships: [];
      };
      code_submissions: {
        Row: {
          id: string;
          user_id: string;
          lesson_id: string;
          enrollment_id: string | null;
          submitted_code: string;
          execution_status: 'success' | 'compilation_error' | 'runtime_error' | 'timeout' | 'memory_exceeded' | 'security_violation';
          compilation_errors: string | null;
          stdout: string | null;
          stderr: string | null;
          execution_time_ms: number;
          memory_used_kb: number;
          test_results: Json;
          passed_all_tests: boolean;
          xp_awarded: number;
          submitted_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          lesson_id: string;
          enrollment_id?: string | null;
          submitted_code: string;
          execution_status: 'success' | 'compilation_error' | 'runtime_error' | 'timeout' | 'memory_exceeded' | 'security_violation';
          compilation_errors?: string | null;
          stdout?: string | null;
          stderr?: string | null;
          execution_time_ms?: number;
          memory_used_kb?: number;
          test_results?: Json;
          passed_all_tests?: boolean;
          xp_awarded?: number;
          submitted_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          lesson_id?: string;
          enrollment_id?: string | null;
          submitted_code?: string;
          execution_status?: 'success' | 'compilation_error' | 'runtime_error' | 'timeout' | 'memory_exceeded' | 'security_violation';
          compilation_errors?: string | null;
          stdout?: string | null;
          stderr?: string | null;
          execution_time_ms?: number;
          memory_used_kb?: number;
          test_results?: Json;
          passed_all_tests?: boolean;
          xp_awarded?: number;
          submitted_at?: string;
        };
        Relationships: [];
      };
      email_log: {
        Row: {
          id: string;
          user_id: string;
          email_type: string;
          recipient_email: string;
          subject: string;
          status: 'sent' | 'failed' | 'pending';
          resend_id: string | null;
          error_message: string | null;
          sent_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          email_type: string;
          recipient_email: string;
          subject: string;
          status?: 'sent' | 'failed' | 'pending';
          resend_id?: string | null;
          error_message?: string | null;
          sent_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          email_type?: string;
          recipient_email?: string;
          subject?: string;
          status?: 'sent' | 'failed' | 'pending';
          resend_id?: string | null;
          error_message?: string | null;
          sent_at?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      lesson_test_cases: {
        Row: {
          id: string;
          lesson_id: string;
          test_case_number: number;
          input_data: string;
          expected_output: string;
          is_hidden: boolean;
          points: number;
          timeout_seconds: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          lesson_id: string;
          test_case_number: number;
          input_data?: string;
          expected_output: string;
          is_hidden?: boolean;
          points?: number;
          timeout_seconds?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          lesson_id?: string;
          test_case_number?: number;
          input_data?: string;
          expected_output?: string;
          is_hidden?: boolean;
          points?: number;
          timeout_seconds?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      user_notification_preferences: {
        Row: {
          id: string;
          user_id: string;
          email_welcome: boolean;
          email_password_recovery: boolean;
          email_achievements: boolean;
          email_assessment_reminder: boolean;
          email_course_updates: boolean;
          email_weekly_digest: boolean;
          unsubscribe_token: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          email_welcome?: boolean;
          email_password_recovery?: boolean;
          email_achievements?: boolean;
          email_assessment_reminder?: boolean;
          email_course_updates?: boolean;
          email_weekly_digest?: boolean;
          unsubscribe_token?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          email_welcome?: boolean;
          email_password_recovery?: boolean;
          email_achievements?: boolean;
          email_assessment_reminder?: boolean;
          email_course_updates?: boolean;
          email_weekly_digest?: boolean;
          unsubscribe_token?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    // supabase-js v2 needs these keys (and Relationships on every table);
    // without them every typed query resolves to `never`.
    Views: { [_ in never]: never };
    Functions: {
      check_all_achievements: { Args: { p_user_id: string }; Returns: undefined };
      check_assessment_achievements: { Args: { p_user_id: string; p_score: number }; Returns: undefined };
      check_completion_achievements: { Args: { p_user_id: string }; Returns: undefined };
      check_enrollment_achievements: { Args: { p_user_id: string }; Returns: undefined };
      increment_course_student_count: { Args: { course_uuid: string }; Returns: undefined };
      decrement_course_student_count: { Args: { course_uuid: string }; Returns: undefined };
      increment_enrollment_xp: { Args: { enrollment_uuid: string; xp_amount: number }; Returns: undefined };
      get_platform_stats: { Args: Record<PropertyKey, never>; Returns: Json };
      get_leaderboard: {
        Args: { p_limit?: number; p_offset?: number };
        Returns: {
          rank: number;
          user_id: string;
          username: string;
          total_xp: number;
          course_count: number;
          completed_courses: number;
        }[];
      };
      get_user_rank: {
        Args: { p_user_id: string };
        Returns: { rank: number; total_xp: number; course_count: number; completed_courses: number }[];
      };
    };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
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

export interface ValidationRule {
  mustContain?: string[];
  regexMatch?: string;
  mustNotContain?: string[];
  methodSignatureExists?: string;
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
  validation_rules: ValidationRule | null;
  starter_code: string | null;
  solution_code: string | null;
  xp_reward: number;
  execution_enabled: boolean;
  test_case_mode: 'output_match' | 'unit_test' | 'custom_validator';
  max_execution_time: number;
  max_memory_mb: number;
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
  total_xp: number;
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
  xp_earned: number;
  started_at: string | null;
  completed_at: string | null;
  last_accessed: string;
}

export interface LessonCodeDraft {
  id: string;
  user_id: string;
  lesson_id: string;
  code: string;
  last_saved_at: string;
  created_at: string;
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
