import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { CourseWithDetails, CourseModule, CourseLesson, ModuleWithLessons } from '../lib/database.types';
import { useAuth } from '../contexts/AuthContext';

export function useCourseDetails(courseId: string | undefined) {
  const { user } = useAuth();
  const [courseDetails, setCourseDetails] = useState<CourseWithDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!courseId) {
      setCourseDetails(null);
      setLoading(false);
      return;
    }

    fetchCourseDetails();
  }, [courseId, user]);

  const fetchCourseDetails = async () => {
    if (!courseId) return;

    try {
      setLoading(true);

      const { data: course, error: courseError } = await supabase
        .from('courses')
        .select('*')
        .eq('id', courseId)
        .single();

      if (courseError) throw courseError;

      const { data: modules, error: modulesError } = await supabase
        .from('course_modules')
        .select('*')
        .eq('course_id', courseId)
        .order('order_index', { ascending: true });

      if (modulesError) throw modulesError;

      const moduleIds = modules?.map(m => m.id) || [];
      let lessons: CourseLesson[] = [];

      if (moduleIds.length > 0) {
        const { data: lessonsData, error: lessonsError } = await supabase
          .from('course_lessons')
          .select('*')
          .in('module_id', moduleIds)
          .order('order_index', { ascending: true });

        if (lessonsError) throw lessonsError;
        lessons = lessonsData || [];
      }

      const modulesWithLessons: ModuleWithLessons[] = (modules || []).map(module => ({
        ...module,
        learning_objectives: Array.isArray(module.learning_objectives)
          ? module.learning_objectives as string[]
          : [],
        lessons: lessons.filter(l => l.module_id === module.id),
      }));

      let enrollment = undefined;
      let moduleProgress = undefined;

      if (user) {
        const { data: enrollmentData } = await supabase
          .from('course_enrollments')
          .select('*')
          .eq('user_id', user.id)
          .eq('course_id', courseId)
          .eq('status', 'active')
          .maybeSingle();

        enrollment = enrollmentData || undefined;

        if (enrollment && moduleIds.length > 0) {
          const { data: progressData } = await supabase
            .from('user_module_progress')
            .select('*')
            .eq('user_id', user.id)
            .eq('enrollment_id', enrollment.id);

          moduleProgress = progressData || undefined;
        }
      }

      const courseWithDetails: CourseWithDetails = {
        ...course,
        curriculum: course.curriculum as CourseWithDetails['curriculum'],
        prerequisites: Array.isArray(course.prerequisites)
          ? course.prerequisites as string[]
          : [],
        learning_objectives: Array.isArray(course.learning_objectives)
          ? course.learning_objectives as string[]
          : [],
        modules: modulesWithLessons,
        enrollment,
        moduleProgress,
      };

      setCourseDetails(courseWithDetails);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const calculateProgress = () => {
    if (!courseDetails?.moduleProgress || !courseDetails?.modules) {
      return 0;
    }

    const totalLessons = courseDetails.modules.reduce((sum, module) => {
      return sum + module.lessons.length;
    }, 0);

    if (totalLessons === 0) return 0;

    const completedLessons = courseDetails.moduleProgress.reduce((sum, progress) => {
      return sum + progress.completed_lessons;
    }, 0);

    return Math.round((completedLessons / totalLessons) * 100);
  };

  const getTotalEstimatedMinutes = () => {
    if (!courseDetails?.modules) return 0;

    return courseDetails.modules.reduce((sum, module) => {
      return sum + module.estimated_minutes;
    }, 0);
  };

  return {
    courseDetails,
    loading,
    error,
    refetch: fetchCourseDetails,
    calculateProgress,
    getTotalEstimatedMinutes,
  };
}
