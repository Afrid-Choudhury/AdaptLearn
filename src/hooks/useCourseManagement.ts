import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Course, CourseModule, CourseLesson } from '../lib/database.types';
import { useAuth } from '../contexts/AuthContext';

export interface CreateCourseData {
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration_hours: number;
  learning_objectives?: string[];
  prerequisites?: string[];
}

export interface CreateModuleData {
  course_id: string;
  title: string;
  description: string;
  order_index: number;
  estimated_minutes: number;
  learning_objectives?: string[];
}

export interface CreateLessonData {
  module_id: string;
  title: string;
  description: string;
  order_index: number;
  estimated_minutes: number;
  content_type: 'video' | 'reading' | 'exercise' | 'quiz';
  content_url?: string;
}

export function useCourseManagement() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createCourse = async (courseData: CreateCourseData): Promise<Course | null> => {
    if (!user) throw new Error('User must be authenticated');

    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('courses')
        .insert({
          title: courseData.title,
          description: courseData.description,
          difficulty: courseData.difficulty,
          duration_hours: courseData.duration_hours,
          rating: 0,
          student_count: 0,
          learning_objectives: courseData.learning_objectives || [],
          prerequisites: courseData.prerequisites || [],
        })
        .select()
        .single();

      if (error) throw error;
      return data as Course;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateCourse = async (courseId: string, courseData: Partial<CreateCourseData>): Promise<Course | null> => {
    if (!user) throw new Error('User must be authenticated');

    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('courses')
        .update({
          ...courseData,
        })
        .eq('id', courseId)
        .select()
        .single();

      if (error) throw error;
      return data as Course;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteCourse = async (courseId: string): Promise<void> => {
    if (!user) throw new Error('User must be authenticated');

    try {
      setLoading(true);
      setError(null);

      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', courseId);

      if (error) throw error;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createModule = async (moduleData: CreateModuleData): Promise<CourseModule | null> => {
    if (!user) throw new Error('User must be authenticated');

    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('course_modules')
        .insert({
          course_id: moduleData.course_id,
          title: moduleData.title,
          description: moduleData.description,
          order_index: moduleData.order_index,
          estimated_minutes: moduleData.estimated_minutes,
          learning_objectives: moduleData.learning_objectives || [],
        })
        .select()
        .single();

      if (error) throw error;
      return data as CourseModule;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateModule = async (moduleId: string, moduleData: Partial<CreateModuleData>): Promise<CourseModule | null> => {
    if (!user) throw new Error('User must be authenticated');

    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('course_modules')
        .update({
          ...moduleData,
        })
        .eq('id', moduleId)
        .select()
        .single();

      if (error) throw error;
      return data as CourseModule;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteModule = async (moduleId: string): Promise<void> => {
    if (!user) throw new Error('User must be authenticated');

    try {
      setLoading(true);
      setError(null);

      const { error } = await supabase
        .from('course_modules')
        .delete()
        .eq('id', moduleId);

      if (error) throw error;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createLesson = async (lessonData: CreateLessonData): Promise<CourseLesson | null> => {
    if (!user) throw new Error('User must be authenticated');

    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('course_lessons')
        .insert({
          module_id: lessonData.module_id,
          title: lessonData.title,
          description: lessonData.description,
          order_index: lessonData.order_index,
          estimated_minutes: lessonData.estimated_minutes,
          content_type: lessonData.content_type,
          content_url: lessonData.content_url || null,
        })
        .select()
        .single();

      if (error) throw error;
      return data as CourseLesson;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateLesson = async (lessonId: string, lessonData: Partial<CreateLessonData>): Promise<CourseLesson | null> => {
    if (!user) throw new Error('User must be authenticated');

    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('course_lessons')
        .update({
          ...lessonData,
        })
        .eq('id', lessonId)
        .select()
        .single();

      if (error) throw error;
      return data as CourseLesson;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteLesson = async (lessonId: string): Promise<void> => {
    if (!user) throw new Error('User must be authenticated');

    try {
      setLoading(true);
      setError(null);

      const { error } = await supabase
        .from('course_lessons')
        .delete()
        .eq('id', lessonId);

      if (error) throw error;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    createCourse,
    updateCourse,
    deleteCourse,
    createModule,
    updateModule,
    deleteModule,
    createLesson,
    updateLesson,
    deleteLesson,
  };
}
