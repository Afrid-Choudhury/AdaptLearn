import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { CourseEnrollment } from '../lib/database.types';
import { useAuth } from '../contexts/AuthContext';
import { checkAndAwardAchievement } from '../lib/email-service';

export function useEnrollments() {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState<CourseEnrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!user) {
      setEnrollments([]);
      setLoading(false);
      return;
    }

    fetchEnrollments();
  }, [user]);

  const fetchEnrollments = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('course_enrollments')
        .select('*')
        .eq('user_id', user.id)
        .order('enrolled_at', { ascending: false });

      if (error) throw error;
      setEnrollments(data || []);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const enrollCourse = async (courseId: string) => {
    if (!user) throw new Error('User must be authenticated');

    try {
      const { data, error } = await supabase
        .from('course_enrollments')
        .insert({
          user_id: user.id,
          course_id: courseId,
          status: 'active',
          enrolled_at: new Date().toISOString(),
          last_accessed: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      await supabase
        .from('courses')
        .update({ student_count: supabase.sql`student_count + 1` })
        .eq('id', courseId);

      setEnrollments(prev => [data, ...prev]);

      const activeEnrollments = await supabase
        .from('course_enrollments')
        .select('id')
        .eq('user_id', user.id)
        .eq('status', 'active');

      const enrollmentCount = activeEnrollments.data?.length || 0;
      checkAndAwardAchievement(user.id, 'enrollment', { count: enrollmentCount }).catch(err => {
        if (import.meta.env.DEV) {
          console.error('Failed to check enrollment achievements:', err);
        }
      });

      return data;
    } catch (err) {
      if (import.meta.env.DEV) {
        console.error('Enrollment error:', err);
      }
      throw err;
    }
  };

  const unenrollCourse = async (enrollmentId: string, courseId: string) => {
    if (!user) throw new Error('User must be authenticated');

    try {
      const { error } = await supabase
        .from('course_enrollments')
        .update({ status: 'dropped' })
        .eq('id', enrollmentId)
        .eq('user_id', user.id);

      if (error) throw error;

      await supabase
        .from('courses')
        .update({ student_count: supabase.sql`GREATEST(student_count - 1, 0)` })
        .eq('id', courseId);

      setEnrollments(prev =>
        prev.map(e => e.id === enrollmentId ? { ...e, status: 'dropped' as const } : e)
      );
    } catch (err) {
      if (import.meta.env.DEV) {
        console.error('Unenrollment error:', err);
      }
      throw err;
    }
  };

  const updateLastAccessed = async (enrollmentId: string) => {
    if (!user) return;

    try {
      await supabase
        .from('course_enrollments')
        .update({ last_accessed: new Date().toISOString() })
        .eq('id', enrollmentId)
        .eq('user_id', user.id);
    } catch (err) {
      if (import.meta.env.DEV) {
        console.error('Error updating last accessed:', err);
      }
    }
  };

  const isEnrolled = (courseId: string) => {
    return enrollments.some(e => e.course_id === courseId && e.status === 'active');
  };

  const getEnrollment = (courseId: string) => {
    return enrollments.find(e => e.course_id === courseId && e.status === 'active');
  };

  return {
    enrollments,
    loading,
    error,
    enrollCourse,
    unenrollCourse,
    updateLastAccessed,
    isEnrolled,
    getEnrollment,
    refetch: fetchEnrollments,
  };
}
