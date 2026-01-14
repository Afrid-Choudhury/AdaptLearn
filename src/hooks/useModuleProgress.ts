import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { UserModuleProgress, UserLessonProgress } from '../lib/database.types';
import { useAuth } from '../contexts/AuthContext';

export function useModuleProgress(enrollmentId?: string) {
  const { user } = useAuth();
  const [moduleProgress, setModuleProgress] = useState<UserModuleProgress[]>([]);
  const [lessonProgress, setLessonProgress] = useState<UserLessonProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!user || !enrollmentId) {
      setModuleProgress([]);
      setLessonProgress([]);
      setLoading(false);
      return;
    }

    fetchProgress();
  }, [user, enrollmentId]);

  const fetchProgress = async () => {
    if (!user || !enrollmentId) return;

    try {
      setLoading(true);

      const [moduleResult, lessonResult] = await Promise.all([
        supabase
          .from('user_module_progress')
          .select('*')
          .eq('user_id', user.id)
          .eq('enrollment_id', enrollmentId),
        supabase
          .from('user_lesson_progress')
          .select('*')
          .eq('user_id', user.id)
      ]);

      if (moduleResult.error) throw moduleResult.error;
      if (lessonResult.error) throw lessonResult.error;

      setModuleProgress(moduleResult.data || []);
      setLessonProgress(lessonResult.data || []);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const startModule = async (moduleId: string, enrollmentId: string, totalLessons: number) => {
    if (!user) throw new Error('User must be authenticated');

    try {
      const { data, error } = await supabase
        .from('user_module_progress')
        .upsert({
          user_id: user.id,
          module_id: moduleId,
          enrollment_id: enrollmentId,
          status: 'in_progress',
          total_lessons: totalLessons,
          started_at: new Date().toISOString(),
          last_accessed: new Date().toISOString(),
        }, { onConflict: 'user_id,module_id' })
        .select()
        .single();

      if (error) throw error;

      setModuleProgress(prev => {
        const existing = prev.find(p => p.module_id === moduleId);
        if (existing) {
          return prev.map(p => p.module_id === moduleId ? data : p);
        }
        return [...prev, data];
      });

      return data;
    } catch (err) {
      throw err;
    }
  };

  const completeLesson = async (
    lessonId: string,
    moduleId: string,
    moduleProgressId: string,
    timeSpent: number = 0,
    xpReward: number = 100,
    enrollmentId?: string
  ) => {
    if (!user) throw new Error('User must be authenticated');

    try {
      const now = new Date().toISOString();

      const { data: lessonData, error: lessonError } = await supabase
        .from('user_lesson_progress')
        .upsert({
          user_id: user.id,
          lesson_id: lessonId,
          module_progress_id: moduleProgressId,
          completed: true,
          time_spent_minutes: timeSpent,
          xp_earned: xpReward,
          started_at: now,
          completed_at: now,
          last_accessed: now,
        }, { onConflict: 'user_id,lesson_id' })
        .select()
        .single();

      if (lessonError) throw lessonError;

      const moduleProgressItem = moduleProgress.find(p => p.id === moduleProgressId);
      if (!moduleProgressItem) return;

      const completedCount = moduleProgressItem.completed_lessons + 1;
      const isModuleComplete = completedCount >= moduleProgressItem.total_lessons;

      const { data: updatedModuleProgress, error: moduleError } = await supabase
        .from('user_module_progress')
        .update({
          completed_lessons: completedCount,
          status: isModuleComplete ? 'completed' : 'in_progress',
          completed_at: isModuleComplete ? now : null,
          last_accessed: now,
        })
        .eq('id', moduleProgressId)
        .eq('user_id', user.id)
        .select()
        .single();

      if (moduleError) throw moduleError;

      if (enrollmentId) {
        await supabase
          .from('course_enrollments')
          .update({
            total_xp: supabase.sql`total_xp + ${xpReward}`
          })
          .eq('id', enrollmentId)
          .eq('user_id', user.id);
      }

      setLessonProgress(prev => {
        const existing = prev.find(p => p.lesson_id === lessonId);
        if (existing) {
          return prev.map(p => p.lesson_id === lessonId ? lessonData : p);
        }
        return [...prev, lessonData];
      });

      setModuleProgress(prev =>
        prev.map(p => p.id === moduleProgressId ? updatedModuleProgress : p)
      );

      return { lessonProgress: lessonData, moduleProgress: updatedModuleProgress };
    } catch (err) {
      throw err;
    }
  };

  const updateLessonProgress = async (
    lessonId: string,
    moduleProgressId: string,
    timeSpent: number
  ) => {
    if (!user) return;

    try {
      const now = new Date().toISOString();
      const existing = lessonProgress.find(p => p.lesson_id === lessonId);

      const { data, error } = await supabase
        .from('user_lesson_progress')
        .upsert({
          user_id: user.id,
          lesson_id: lessonId,
          module_progress_id: moduleProgressId,
          completed: existing?.completed || false,
          time_spent_minutes: (existing?.time_spent_minutes || 0) + timeSpent,
          started_at: existing?.started_at || now,
          last_accessed: now,
        }, { onConflict: 'user_id,lesson_id' })
        .select()
        .single();

      if (error) throw error;

      setLessonProgress(prev => {
        const existingIndex = prev.findIndex(p => p.lesson_id === lessonId);
        if (existingIndex >= 0) {
          const updated = [...prev];
          updated[existingIndex] = data;
          return updated;
        }
        return [...prev, data];
      });
    } catch (err) {
      if (import.meta.env.DEV) {
        console.error('Error updating lesson progress:', err);
      }
    }
  };

  const getModuleProgress = (moduleId: string) => {
    return moduleProgress.find(p => p.module_id === moduleId);
  };

  const getLessonProgress = (lessonId: string) => {
    return lessonProgress.find(p => p.lesson_id === lessonId);
  };

  const getModuleLessonsProgress = (moduleProgressId: string) => {
    return lessonProgress.filter(p => p.module_progress_id === moduleProgressId);
  };

  return {
    moduleProgress,
    lessonProgress,
    loading,
    error,
    startModule,
    completeLesson,
    updateLessonProgress,
    getModuleProgress,
    getLessonProgress,
    getModuleLessonsProgress,
    refetch: fetchProgress,
  };
}
