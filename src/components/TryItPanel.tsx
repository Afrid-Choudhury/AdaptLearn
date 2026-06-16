import { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { CheckCircle, RotateCcw, Save, AlertCircle, Play, Clock, Award, Eye, EyeOff } from 'lucide-react';
import { CourseLesson } from '../lib/database.types';
import { validateCode, ValidationResult } from '../lib/code-validator';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useCodeExecution, ExecutionResult } from '../hooks/useCodeExecution';
import SubmissionHistory from './SubmissionHistory';

interface TryItPanelProps {
  lesson: CourseLesson;
  enrollmentId?: string;
  onSuccess: () => void;
}

export default function TryItPanel({ lesson, enrollmentId, onSuccess }: TryItPanelProps) {
  const { user } = useAuth();
  const [code, setCode] = useState(lesson.starter_code || '');
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [showSolution, setShowSolution] = useState(false);
  const [attemptCount, setAttemptCount] = useState(0);
  const { executeCode, isExecuting, executionResult, error: executionError, clearResults } = useCodeExecution();

  useEffect(() => {
    loadSavedCode();
  }, [lesson.id, user]);

  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      if (code && code !== lesson.starter_code) {
        saveToLocalStorage();
      }
    }, 10000);

    return () => clearInterval(autoSaveInterval);
  }, [code, lesson.id]);

  const loadSavedCode = async () => {
    const localCode = localStorage.getItem(`lesson_${lesson.id}_code`);

    if (user) {
      try {
        const { data } = await supabase
          .from('lesson_code_drafts')
          .select('code')
          .eq('user_id', user.id)
          .eq('lesson_id', lesson.id)
          .maybeSingle();

        if (data) {
          setCode(data.code);
          return;
        }
      } catch (err) {
        if (import.meta.env.DEV) {
          console.error('Error loading saved code:', err);
        }
      }
    }

    if (localCode) {
      setCode(localCode);
    }
  };

  const saveToLocalStorage = () => {
    localStorage.setItem(`lesson_${lesson.id}_code`, code);
  };

  const saveToSupabase = async () => {
    if (!user) return;

    setIsSaving(true);
    setSaveMessage('');

    try {
      const { error } = await supabase
        .from('lesson_code_drafts')
        .upsert({
          user_id: user.id,
          lesson_id: lesson.id,
          code,
          last_saved_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id,lesson_id'
        });

      if (error) throw error;

      saveToLocalStorage();
      setSaveMessage('Saved successfully!');
      setTimeout(() => setSaveMessage(''), 2000);
    } catch (err) {
      if (import.meta.env.DEV) {
        console.error('Error saving code:', err);
      }
      setSaveMessage('Failed to save');
      setTimeout(() => setSaveMessage(''), 2000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCheck = async () => {
    setIsChecking(true);
    setValidationResult(null);

    await new Promise(resolve => setTimeout(resolve, 500));

    const result = validateCode(code, lesson.validation_rules);
    setValidationResult(result);

    if (result.passed) {
      setTimeout(() => {
        onSuccess();
      }, 1000);
    } else {
      setAttemptCount(prev => prev + 1);
    }

    setIsChecking(false);
  };

  const handleReset = () => {
    setCode(lesson.starter_code || '');
    setValidationResult(null);
    clearResults();
    localStorage.removeItem(`lesson_${lesson.id}_code`);
  };

  const handleRunCode = async () => {
    if (!user) {
      alert('Please sign in to run code');
      return;
    }

    clearResults();
    setValidationResult(null);

    const result = await executeCode(code, lesson.id, enrollmentId);

    if (result?.passedAllTests && result.xpAwarded > 0) {
      setTimeout(() => {
        onSuccess();
      }, 2000);
    } else if (result && !result.passedAllTests) {
      setAttemptCount(prev => prev + 1);
    }
  };

  const handleSave = () => {
    if (user) {
      saveToSupabase();
    } else {
      saveToLocalStorage();
      setSaveMessage('Saved locally!');
      setTimeout(() => setSaveMessage(''), 2000);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-4">
        <h3 className="text-xl font-bold text-white">Try It Yourself</h3>
        <p className="text-blue-100 text-sm mt-1">Write and test your Java code</p>
      </div>

      <div className="p-6">
        <div className="border-2 border-gray-200 rounded-lg overflow-hidden mb-4">
          <Editor
            height="400px"
            defaultLanguage="java"
            value={code}
            onChange={(value) => setCode(value || '')}
            theme="vs-light"
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              lineNumbers: 'on',
              scrollBeyondLastLine: false,
              automaticLayout: true,
              tabSize: 2,
              wordWrap: 'on',
            }}
          />
        </div>

        {executionError && (
          <div className="mb-4 p-4 rounded-lg bg-red-50 border-2 border-red-500">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-semibold text-red-900">Execution Error</h4>
                <p className="text-red-700 text-sm mt-1">{executionError}</p>
              </div>
            </div>
          </div>
        )}

        {executionResult && (
          <div className="mb-4 space-y-4">
            {executionResult.compilationErrors && (
              <div className="p-4 rounded-lg bg-red-50 border-2 border-red-500">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-red-900">Compilation Error</h4>
                    <pre className="text-red-700 text-sm mt-2 whitespace-pre-wrap font-mono">
                      {executionResult.compilationErrors}
                    </pre>
                  </div>
                </div>
              </div>
            )}

            {executionResult.testResults.length > 0 && (
              <div className={`p-4 rounded-lg border-2 ${executionResult.passedAllTests ? 'bg-green-50 border-green-500' : 'bg-yellow-50 border-yellow-500'}`}>
                <div className="flex items-center justify-between mb-3">
                  <h4 className={`font-semibold ${executionResult.passedAllTests ? 'text-green-900' : 'text-yellow-900'}`}>
                    Test Results: {executionResult.earnedPoints}/{executionResult.totalPoints} points
                  </h4>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="flex items-center gap-1 text-gray-600">
                      <Clock className="w-4 h-4" />
                      {executionResult.executionTimeMs}ms
                    </span>
                    {executionResult.xpAwarded > 0 && (
                      <span className="flex items-center gap-1 text-green-600 font-semibold">
                        <Award className="w-4 h-4" />
                        +{executionResult.xpAwarded} XP
                      </span>
                    )}
                  </div>
                </div>

                {executionResult.passedAllTests && (
                  <div className="mb-3 p-3 bg-green-100 rounded-lg">
                    <p className="text-green-800 font-semibold flex items-center gap-2">
                      <CheckCircle className="w-5 h-5" />
                      Congratulations! All tests passed!
                    </p>
                    {executionResult.alreadyCompleted && (
                      <p className="text-green-700 text-sm mt-1">
                        You've already completed this lesson, so no additional XP was awarded.
                      </p>
                    )}
                  </div>
                )}

                <div className="space-y-2">
                  {executionResult.testResults.map((test, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-lg border ${test.passed ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300'}`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className={`font-semibold ${test.passed ? 'text-green-900' : 'text-red-900'}`}>
                          Test {test.testNumber} {test.isHidden && '(Hidden)'}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600">{test.executionTime}ms</span>
                          {test.passed ? (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          ) : (
                            <AlertCircle className="w-5 h-5 text-red-600" />
                          )}
                        </div>
                      </div>

                      {!test.isHidden && (
                        <div className="space-y-2 text-sm">
                          {test.input && test.input !== '[Hidden]' && (
                            <div>
                              <span className="font-semibold text-gray-700">Input:</span>
                              <pre className="mt-1 p-2 bg-gray-100 rounded font-mono text-xs overflow-x-auto">
                                {test.input}
                              </pre>
                            </div>
                          )}
                          <div>
                            <span className="font-semibold text-gray-700">Expected Output:</span>
                            <pre className="mt-1 p-2 bg-gray-100 rounded font-mono text-xs overflow-x-auto">
                              {test.expectedOutput}
                            </pre>
                          </div>
                          <div>
                            <span className="font-semibold text-gray-700">Your Output:</span>
                            <pre className={`mt-1 p-2 rounded font-mono text-xs overflow-x-auto ${test.passed ? 'bg-green-100' : 'bg-red-100'}`}>
                              {test.actualOutput || '(no output)'}
                            </pre>
                          </div>
                          {test.error && (
                            <div>
                              <span className="font-semibold text-red-700">Error:</span>
                              <pre className="mt-1 p-2 bg-red-100 rounded font-mono text-xs overflow-x-auto">
                                {test.error}
                              </pre>
                            </div>
                          )}
                        </div>
                      )}

                      {test.isHidden && !executionResult.passedAllTests && (
                        <p className="text-gray-600 text-sm">
                          Hidden test case details will be revealed after passing all tests.
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {validationResult && (
          <div className={`mb-4 p-4 rounded-lg ${validationResult.passed ? 'bg-green-50 border-2 border-green-500' : 'bg-red-50 border-2 border-red-500'}`}>
            <div className="flex items-start gap-3">
              {validationResult.passed ? (
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <h4 className={`font-semibold ${validationResult.passed ? 'text-green-900' : 'text-red-900'}`}>
                  {validationResult.passed ? 'Great job!' : 'Not quite right'}
                </h4>
                {validationResult.passed ? (
                  <p className="text-green-700 text-sm mt-1">Your code passed all validation checks!</p>
                ) : (
                  <ul className="text-red-700 text-sm mt-2 space-y-1">
                    {validationResult.errors.map((error, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-red-600">•</span>
                        <span>{error}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={handleRunCode}
              disabled={isExecuting || !code.trim() || !user}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all shadow-lg"
            >
              <Play className="w-5 h-5" />
              {isExecuting ? 'Running...' : 'Run Code'}
            </button>

            <button
              onClick={handleCheck}
              disabled={isChecking || !code.trim()}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all"
            >
              <CheckCircle className="w-5 h-5" />
              {isChecking ? 'Checking...' : 'Check Syntax'}
            </button>

            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-all"
            >
              <RotateCcw className="w-5 h-5" />
              Reset
            </button>

            <button
              onClick={handleSave}
              disabled={isSaving || !code.trim()}
              className="flex items-center gap-2 px-6 py-3 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all"
            >
              <Save className="w-5 h-5" />
              {isSaving ? 'Saving...' : 'Save'}
            </button>
          </div>

          {saveMessage && (
            <span className={`text-sm font-semibold ${saveMessage.includes('success') || saveMessage.includes('locally') ? 'text-green-600' : 'text-red-600'}`}>
              {saveMessage}
            </span>
          )}
        </div>

        {!user && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-800 text-sm">
              Sign in to run your code and earn XP!
            </p>
          </div>
        )}

        {lesson.solution_code && (
          <div className="mt-6 border-t border-gray-200 pt-6">
            {!showSolution ? (
              <button
                onClick={() => {
                  if (attemptCount >= 2) {
                    setShowSolution(true);
                  } else {
                    const confirmed = window.confirm(
                      'Are you sure you want to see the solution? Try solving it yourself first for the best learning experience.'
                    );
                    if (confirmed) setShowSolution(true);
                  }
                }}
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-800 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-all"
              >
                <Eye className="w-4 h-4" />
                {attemptCount >= 2 ? 'Show Solution' : 'Peek at Solution'}
              </button>
            ) : (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    Reference Solution
                  </h4>
                  <button
                    onClick={() => setShowSolution(false)}
                    className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    <EyeOff className="w-3.5 h-3.5" />
                    Hide
                  </button>
                </div>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-2 bg-slate-800 border-b border-slate-700">
                    <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">java</span>
                  </div>
                  <pre className="bg-slate-900 p-4 overflow-x-auto text-sm leading-relaxed font-mono text-slate-200 whitespace-pre">
                    {lesson.solution_code}
                  </pre>
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  This is one possible solution. Your approach may differ and still be correct.
                </p>
              </div>
            )}
          </div>
        )}

        {user && <SubmissionHistory lessonId={lesson.id} />}
      </div>
    </div>
  );
}
