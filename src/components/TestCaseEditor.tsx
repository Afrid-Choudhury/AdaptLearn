import { useState, useEffect } from 'react';
import { Plus, Trash2, Save, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface TestCase {
  id?: string;
  test_case_number: number;
  input_data: string;
  expected_output: string;
  is_hidden: boolean;
  points: number;
  timeout_seconds: number;
}

interface TestCaseEditorProps {
  lessonId: string;
}

export default function TestCaseEditor({ lessonId }: TestCaseEditorProps) {
  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadTestCases();
  }, [lessonId]);

  const loadTestCases = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('lesson_test_cases')
        .select('*')
        .eq('lesson_id', lessonId)
        .order('test_case_number');

      if (error) throw error;

      if (data && data.length > 0) {
        setTestCases(data);
      } else {
        setTestCases([createEmptyTestCase(1)]);
      }
    } catch (err) {
      if (import.meta.env.DEV) {
        console.error('Error loading test cases:', err);
      }
      setTestCases([createEmptyTestCase(1)]);
    } finally {
      setLoading(false);
    }
  };

  const createEmptyTestCase = (number: number): TestCase => ({
    test_case_number: number,
    input_data: '',
    expected_output: '',
    is_hidden: false,
    points: 10,
    timeout_seconds: 5,
  });

  const addTestCase = () => {
    const nextNumber = testCases.length > 0
      ? Math.max(...testCases.map(tc => tc.test_case_number)) + 1
      : 1;
    setTestCases([...testCases, createEmptyTestCase(nextNumber)]);
  };

  const removeTestCase = (index: number) => {
    const newTestCases = testCases.filter((_, i) => i !== index);
    setTestCases(newTestCases);
  };

  const updateTestCase = (index: number, field: keyof TestCase, value: any) => {
    const newTestCases = [...testCases];
    newTestCases[index] = { ...newTestCases[index], [field]: value };
    setTestCases(newTestCases);
  };

  const saveTestCases = async () => {
    setSaving(true);
    setMessage('');

    try {
      const testCasesToDelete = testCases.filter(tc => tc.id).map(tc => tc.id!);

      if (testCasesToDelete.length > 0) {
        const { error: deleteError } = await supabase
          .from('lesson_test_cases')
          .delete()
          .eq('lesson_id', lessonId);

        if (deleteError) throw deleteError;
      }

      const testCasesToInsert = testCases.map(tc => ({
        lesson_id: lessonId,
        test_case_number: tc.test_case_number,
        input_data: tc.input_data,
        expected_output: tc.expected_output,
        is_hidden: tc.is_hidden,
        points: tc.points,
        timeout_seconds: tc.timeout_seconds,
      }));

      const { error: insertError } = await supabase
        .from('lesson_test_cases')
        .insert(testCasesToInsert);

      if (insertError) throw insertError;

      const { error: updateError } = await supabase
        .from('course_lessons')
        .update({ execution_enabled: true })
        .eq('id', lessonId);

      if (updateError) throw updateError;

      setMessage('Test cases saved successfully!');
      await loadTestCases();

      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      if (import.meta.env.DEV) {
        console.error('Error saving test cases:', err);
      }
      setMessage('Error saving test cases');
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <p className="text-gray-600">Loading test cases...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-gray-900">Test Case Editor</h3>
        <div className="flex items-center gap-3">
          <button
            onClick={addTestCase}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all"
          >
            <Plus className="w-4 h-4" />
            Add Test Case
          </button>
          <button
            onClick={saveTestCases}
            disabled={saving || testCases.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save All'}
          </button>
        </div>
      </div>

      {message && (
        <div className={`mb-4 p-3 rounded-lg ${message.includes('success') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
          {message}
        </div>
      )}

      <div className="space-y-6">
        {testCases.map((testCase, index) => (
          <div key={index} className="border-2 border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-lg text-gray-900">
                Test Case #{testCase.test_case_number}
              </h4>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateTestCase(index, 'is_hidden', !testCase.is_hidden)}
                  className={`flex items-center gap-2 px-3 py-1 rounded-lg font-semibold text-sm ${
                    testCase.is_hidden
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {testCase.is_hidden ? (
                    <>
                      <EyeOff className="w-4 h-4" />
                      Hidden
                    </>
                  ) : (
                    <>
                      <Eye className="w-4 h-4" />
                      Visible
                    </>
                  )}
                </button>
                {testCases.length > 1 && (
                  <button
                    onClick={() => removeTestCase(index)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Points
                </label>
                <input
                  type="number"
                  value={testCase.points}
                  onChange={(e) => updateTestCase(index, 'points', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Timeout (seconds)
                </label>
                <input
                  type="number"
                  value={testCase.timeout_seconds}
                  onChange={(e) => updateTestCase(index, 'timeout_seconds', parseInt(e.target.value) || 5)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="1"
                  max="30"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Input Data (stdin)
                </label>
                <textarea
                  value={testCase.input_data}
                  onChange={(e) => updateTestCase(index, 'input_data', e.target.value)}
                  placeholder="Leave empty if no input is needed"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Expected Output (stdout)
                </label>
                <textarea
                  value={testCase.expected_output}
                  onChange={(e) => updateTestCase(index, 'expected_output', e.target.value)}
                  placeholder="Enter the exact expected output"
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                />
              </div>
            </div>
          </div>
        ))}

        {testCases.length === 0 && (
          <div className="text-center py-8 text-gray-600">
            No test cases yet. Click "Add Test Case" to create one.
          </div>
        )}
      </div>
    </div>
  );
}
