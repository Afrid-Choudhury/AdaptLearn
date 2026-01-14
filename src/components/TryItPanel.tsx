import { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { CheckCircle, RotateCcw, Save, AlertCircle } from 'lucide-react';
import { CourseLesson } from '../lib/database.types';
import { validateCode, ValidationResult } from '../lib/code-validator';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface TryItPanelProps {
  lesson: CourseLesson;
  onSuccess: () => void;
}

export default function TryItPanel({ lesson, onSuccess }: TryItPanelProps) {
  const { user } = useAuth();
  const [code, setCode] = useState(lesson.starter_code || '');
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

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
    }

    setIsChecking(false);
  };

  const handleReset = () => {
    setCode(lesson.starter_code || '');
    setValidationResult(null);
    localStorage.removeItem(`lesson_${lesson.id}_code`);
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
          <div className="flex items-center gap-3">
            <button
              onClick={handleCheck}
              disabled={isChecking || !code.trim()}
              className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all"
            >
              <CheckCircle className="w-5 h-5" />
              {isChecking ? 'Checking...' : 'Check'}
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
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all"
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
      </div>
    </div>
  );
}
