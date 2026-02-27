import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Code } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useUserRole } from '../hooks/useUserRole';
import TestCaseEditor from '../components/TestCaseEditor';

interface Lesson {
  id: string;
  title: string;
  content_type: string;
  execution_enabled: boolean;
}

export default function ManageTestCases() {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isAdmin, isInstructor, loading: roleLoading } = useUserRole();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/signin');
      return;
    }

    if (!roleLoading && !isAdmin && !isInstructor) {
      navigate('/dashboard');
      return;
    }
  }, [user, isAdmin, isInstructor, roleLoading, navigate]);

  useEffect(() => {
    if (lessonId) {
      loadLesson();
    }
  }, [lessonId]);

  const loadLesson = async () => {
    if (!lessonId) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('course_lessons')
        .select('id, title, content_type, execution_enabled')
        .eq('id', lessonId)
        .single();

      if (error) throw error;

      setLesson(data);
    } catch (err) {
      if (import.meta.env.DEV) {
        console.error('Error loading lesson:', err);
      }
      navigate('/admin');
    } finally {
      setLoading(false);
    }
  };

  if (loading || roleLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Lesson not found</p>
          <Link
            to="/admin"
            className="mt-4 inline-block text-blue-600 hover:text-blue-700 font-semibold"
          >
            Return to Admin Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <Link
            to="/admin"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Admin Dashboard
          </Link>
          <div className="flex items-center gap-3">
            <Code className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Manage Test Cases</h1>
              <p className="text-gray-600 mt-1">{lesson.title}</p>
            </div>
          </div>
          {lesson.execution_enabled && (
            <div className="mt-2 inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
              Code Execution Enabled
            </div>
          )}
        </div>

        {lesson.content_type !== 'exercise' && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800">
              This lesson is not an exercise. Test cases are typically used for exercise lessons.
            </p>
          </div>
        )}

        <TestCaseEditor lessonId={lesson.id} />
      </div>
    </div>
  );
}
