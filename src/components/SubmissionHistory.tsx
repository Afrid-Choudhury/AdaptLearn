import { useEffect, useState } from 'react';
import { Clock, CheckCircle, XCircle, AlertTriangle, Code } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface Submission {
  id: string;
  submitted_at: string;
  execution_status: string;
  passed_all_tests: boolean;
  execution_time_ms: number;
  xp_awarded: number;
  test_results: any[];
}

interface SubmissionHistoryProps {
  lessonId: string;
}

export default function SubmissionHistory({ lessonId }: SubmissionHistoryProps) {
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    if (user && lessonId) {
      loadSubmissions();
    }
  }, [user, lessonId]);

  const loadSubmissions = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('code_submissions')
        .select('id, submitted_at, execution_status, passed_all_tests, execution_time_ms, xp_awarded, test_results')
        .eq('user_id', user.id)
        .eq('lesson_id', lessonId)
        .order('submitted_at', { ascending: false })
        .limit(10);

      if (error) throw error;

      setSubmissions(data || []);
    } catch (err) {
      if (import.meta.env.DEV) {
        console.error('Error loading submissions:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string, passed: boolean) => {
    if (passed) return <CheckCircle className="w-5 h-5 text-green-600" />;
    if (status === 'compilation_error') return <XCircle className="w-5 h-5 text-red-600" />;
    if (status === 'timeout') return <Clock className="w-5 h-5 text-orange-600" />;
    return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
  };

  const getStatusText = (status: string, passed: boolean) => {
    if (passed) return 'All tests passed';
    if (status === 'compilation_error') return 'Compilation error';
    if (status === 'runtime_error') return 'Runtime error';
    if (status === 'timeout') return 'Timeout';
    if (status === 'security_violation') return 'Security violation';
    return 'Some tests failed';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;

    return date.toLocaleDateString();
  };

  if (loading || submissions.length === 0) {
    return null;
  }

  return (
    <div className="mt-6">
      <button
        onClick={() => setShowHistory(!showHistory)}
        className="flex items-center gap-2 text-gray-700 hover:text-gray-900 font-semibold"
      >
        <Code className="w-5 h-5" />
        Submission History ({submissions.length})
      </button>

      {showHistory && (
        <div className="mt-4 space-y-2">
          {submissions.map((submission) => {
            const passedTests = submission.test_results?.filter((t: any) => t.passed).length || 0;
            const totalTests = submission.test_results?.length || 0;

            return (
              <div
                key={submission.id}
                className={`p-4 rounded-lg border-2 ${
                  submission.passed_all_tests
                    ? 'bg-green-50 border-green-200'
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(submission.execution_status, submission.passed_all_tests)}
                    <div>
                      <p className="font-semibold text-gray-900">
                        {getStatusText(submission.execution_status, submission.passed_all_tests)}
                      </p>
                      <p className="text-sm text-gray-600">
                        {passedTests}/{totalTests} tests passed
                        {submission.xp_awarded > 0 && ` • +${submission.xp_awarded} XP`}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">{formatDate(submission.submitted_at)}</p>
                    <p className="text-xs text-gray-500">{submission.execution_time_ms}ms</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
