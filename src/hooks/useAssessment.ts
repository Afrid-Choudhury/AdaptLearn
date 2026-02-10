import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { AssessmentQuestion } from '../lib/database.types';

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

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
        .eq('assessment_id', assessmentId);

      if (error) throw error;

      const seen = new Set<string>();
      const unique = data.filter(q => {
        if (seen.has(q.id)) return false;
        seen.add(q.id);
        return true;
      });

      const typedQuestions: AssessmentQuestion[] = unique.map(q => ({
        ...q,
        options: q.options as string[],
        difficulty: q.difficulty as 'beginner' | 'intermediate' | 'advanced',
      }));

      setQuestions(shuffleArray(typedQuestions));
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  return { questions, loading, error };
}
