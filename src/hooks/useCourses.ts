import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Course, SkillLevel } from '../lib/database.types';

export function useCourses(difficulty?: SkillLevel) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchCourses();
  }, [difficulty]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      let query = supabase.from('courses').select('*');

      if (difficulty) {
        query = query.eq('difficulty', difficulty);
      }

      const { data, error } = await query;

      if (error) throw error;

      const typedCourses: Course[] = data.map(c => ({
        ...c,
        curriculum: c.curriculum as Course['curriculum'],
      }));

      setCourses(typedCourses);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  return { courses, loading, error, refetch: fetchCourses };
}
