import { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { Code, RotateCcw, Save, Copy, Check } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface CodePlaygroundProps {
  lessonId: string;
}

const DEFAULT_CODE = `public class Main {
    public static void main(String[] args) {
        // Write your code here

    }
}`;

export default function CodePlayground({ lessonId }: CodePlaygroundProps) {
  const { user } = useAuth();
  const [code, setCode] = useState(DEFAULT_CODE);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    loadSavedCode();
  }, [lessonId, user]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (code && code !== DEFAULT_CODE) {
        localStorage.setItem(`playground_${lessonId}`, code);
      }
    }, 10000);
    return () => clearInterval(interval);
  }, [code, lessonId]);

  const loadSavedCode = async () => {
    if (user) {
      try {
        const { data } = await supabase
          .from('lesson_code_drafts')
          .select('code')
          .eq('user_id', user.id)
          .eq('lesson_id', lessonId)
          .maybeSingle();

        if (data) {
          setCode(data.code);
          return;
        }
      } catch {
        // fall through to localStorage
      }
    }

    const local = localStorage.getItem(`playground_${lessonId}`);
    if (local) {
      setCode(local);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage('');

    if (user) {
      try {
        const { error } = await supabase
          .from('lesson_code_drafts')
          .upsert({
            user_id: user.id,
            lesson_id: lessonId,
            code,
            last_saved_at: new Date().toISOString(),
          }, { onConflict: 'user_id,lesson_id' });

        if (error) throw error;
        localStorage.setItem(`playground_${lessonId}`, code);
        setSaveMessage('Saved!');
      } catch {
        setSaveMessage('Failed to save');
      }
    } else {
      localStorage.setItem(`playground_${lessonId}`, code);
      setSaveMessage('Saved locally!');
    }

    setTimeout(() => setSaveMessage(''), 2000);
    setIsSaving(false);
  };

  const handleReset = () => {
    setCode(DEFAULT_CODE);
    localStorage.removeItem(`playground_${lessonId}`);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full bg-gradient-to-r from-gray-800 to-gray-900 px-6 py-4 flex items-center justify-between group hover:from-gray-700 hover:to-gray-800 transition-all"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-teal-500/20 flex items-center justify-center">
            <Code className="w-5 h-5 text-teal-400" />
          </div>
          <div className="text-left">
            <h3 className="text-lg font-bold text-white">Code Playground</h3>
            <p className="text-gray-400 text-sm">Try the exercises above in a live editor</p>
          </div>
        </div>
        <div className={`w-8 h-8 rounded-full bg-white/10 flex items-center justify-center transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${isExpanded ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <div className="p-6">
          <div className="border-2 border-gray-200 rounded-lg overflow-hidden mb-4">
            <Editor
              height="350px"
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

          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={handleCopy}
                className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-all text-sm"
              >
                {copied ? <Check className="w-4 h-4 text-teal-600" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied' : 'Copy'}
              </button>

              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-all text-sm"
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </button>

              <button
                onClick={handleSave}
                disabled={isSaving || !code.trim()}
                className="flex items-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-all text-sm"
              >
                <Save className="w-4 h-4" />
                {isSaving ? 'Saving...' : 'Save'}
              </button>
            </div>

            {saveMessage && (
              <span className={`text-sm font-semibold ${saveMessage.includes('Saved') ? 'text-teal-600' : 'text-red-600'}`}>
                {saveMessage}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
