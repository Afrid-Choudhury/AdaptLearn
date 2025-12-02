import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { AssessmentQuestion } from '../lib/database.types';

export function useAssessment(assessmentId: string) {
  const [questions, setQuestions] = useState<AssessmentQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchQuestions();
  }, [assessmentId]);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('assessment_questions')
        .select('*')
        .eq('assessment_id', assessmentId)
        .order('order_index', { ascending: true });

      if (error) throw error;

      const typedQuestions: AssessmentQuestion[] = (data || []).map((q: any) => ({
        ...q,
        options: q.options as string[],
        difficulty: q.difficulty as 'beginner' | 'intermediate' | 'advanced',
      }));

      setQuestions(typedQuestions);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  return { questions, loading, error };
}
