import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen,
  ChevronRight,
  CheckCircle,
  XCircle,
  Clock,
  Brain,
  Zap,
  ArrowRight,
  BarChart3,
} from 'lucide-react';
import { useAssessment } from '../hooks/useAssessment';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { UserAnswer, AssessmentQuestion } from '../lib/database.types';
import { checkAndAwardAchievement } from '../lib/email-service';

const ASSESSMENT_ID = '00000000-0000-0000-0000-000000000001';

const OPTION_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];

const DIFFICULTY_CONFIG = {
  beginner: { label: 'Beginner', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200', dot: 'bg-emerald-500' },
  intermediate: { label: 'Intermediate', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', dot: 'bg-amber-500' },
  advanced: { label: 'Advanced', color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-200', dot: 'bg-rose-500' },
};

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function IntroScreen({ questionCount, onStart }: { questionCount: number; onStart: () => void }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-sky-50 flex items-center justify-center px-4">
      <div className="max-w-lg w-full">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-sky-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-sky-500/20">
            <Brain className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Skills Assessment
          </h1>
          <p className="text-lg text-gray-500">
            Discover your Java proficiency level
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center p-3 bg-gray-50 rounded-xl">
              <div className="text-2xl font-bold text-gray-900">{questionCount}</div>
              <div className="text-xs text-gray-500 mt-1">Questions</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-xl">
              <div className="text-2xl font-bold text-gray-900">3</div>
              <div className="text-xs text-gray-500 mt-1">Difficulty Levels</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-xl">
              <div className="text-2xl font-bold text-gray-900">~10</div>
              <div className="text-xs text-gray-500 mt-1">Minutes</div>
            </div>
          </div>

          <div className="space-y-3 mb-6">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Zap className="w-3.5 h-3.5 text-emerald-600" />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900">Adaptive difficulty</div>
                <div className="text-xs text-gray-500">Questions span beginner to advanced</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-sky-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <BarChart3 className="w-3.5 h-3.5 text-sky-600" />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900">Personalized results</div>
                <div className="text-xs text-gray-500">Get course recommendations based on your score</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900">No time limit per question</div>
                <div className="text-xs text-gray-500">Take your time and answer thoughtfully</div>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={onStart}
          className="w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold py-4 px-8 rounded-xl transition-all flex items-center justify-center gap-2 group"
        >
          Start Assessment
          <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
}

function QuestionCard({
  question,
  questionNumber,
  totalQuestions,
  onAnswer,
}: {
  question: AssessmentQuestion;
  questionNumber: number;
  totalQuestions: number;
  onAnswer: (answer: string) => void;
}) {
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const diffConfig = DIFFICULTY_CONFIG[question.difficulty as keyof typeof DIFFICULTY_CONFIG] || DIFFICULTY_CONFIG.beginner;

  const handleSelect = (option: string) => {
    if (showFeedback) return;
    setSelectedAnswer(option);
  };

  const handleSubmit = () => {
    if (!selectedAnswer || showFeedback) return;
    const correct = selectedAnswer === question.correct_answer;
    setIsCorrect(correct);
    setShowFeedback(true);

    setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => {
        onAnswer(selectedAnswer);
      }, 300);
    }, 1200);
  };

  const progress = ((questionNumber) / totalQuestions) * 100;

  return (
    <div
      ref={cardRef}
      className={`transition-all duration-300 ${isExiting ? 'opacity-0 translate-x-8' : 'opacity-100 translate-x-0'}`}
    >
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${diffConfig.bg} ${diffConfig.color} ${diffConfig.border} border`}>
            <span className={`w-1.5 h-1.5 rounded-full ${diffConfig.dot}`} />
            {diffConfig.label}
          </div>
          <span className="text-sm font-medium text-gray-400">
            {questionNumber} / {totalQuestions}
          </span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700 ease-out bg-gradient-to-r from-sky-500 to-teal-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 md:p-8">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 leading-snug mb-8">
            {question.question_text}
          </h2>

          <div className="space-y-3">
            {question.options.map((option, index) => {
              const isSelected = selectedAnswer === option;
              const isCorrectAnswer = option === question.correct_answer;
              const showCorrect = showFeedback && isCorrectAnswer;
              const showIncorrect = showFeedback && isSelected && !isCorrectAnswer;

              let cardStyle = 'border-gray-150 hover:border-gray-300 hover:bg-gray-50';
              if (showCorrect) cardStyle = 'border-emerald-400 bg-emerald-50 ring-1 ring-emerald-400';
              else if (showIncorrect) cardStyle = 'border-rose-400 bg-rose-50 ring-1 ring-rose-400';
              else if (isSelected) cardStyle = 'border-sky-400 bg-sky-50 ring-1 ring-sky-400';

              let letterStyle = 'bg-gray-100 text-gray-500';
              if (showCorrect) letterStyle = 'bg-emerald-500 text-white';
              else if (showIncorrect) letterStyle = 'bg-rose-500 text-white';
              else if (isSelected) letterStyle = 'bg-sky-500 text-white';

              return (
                <button
                  key={index}
                  onClick={() => handleSelect(option)}
                  disabled={showFeedback}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 flex items-center gap-4 ${cardStyle} ${showFeedback ? 'cursor-default' : 'cursor-pointer'}`}
                >
                  <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0 transition-all duration-200 ${letterStyle}`}>
                    {OPTION_LETTERS[index]}
                  </span>
                  <span className="text-sm md:text-base font-medium text-gray-800 flex-1">
                    {option}
                  </span>
                  {showCorrect && <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />}
                  {showIncorrect && <XCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        {showFeedback && (
          <div className={`px-6 md:px-8 py-4 border-t ${isCorrect ? 'bg-emerald-50 border-emerald-100' : 'bg-rose-50 border-rose-100'}`}>
            <div className="flex items-center gap-2">
              {isCorrect ? (
                <CheckCircle className="w-5 h-5 text-emerald-600" />
              ) : (
                <XCircle className="w-5 h-5 text-rose-600" />
              )}
              <span className={`font-semibold text-sm ${isCorrect ? 'text-emerald-700' : 'text-rose-700'}`}>
                {isCorrect ? 'Correct!' : `Incorrect -- the answer is: ${question.correct_answer}`}
              </span>
            </div>
          </div>
        )}

        {!showFeedback && (
          <div className="px-6 md:px-8 py-4 border-t border-gray-50 bg-gray-50/50">
            <button
              onClick={handleSubmit}
              disabled={!selectedAnswer}
              className="w-full bg-gray-900 hover:bg-gray-800 disabled:bg-gray-200 disabled:text-gray-400 text-white font-semibold py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2"
            >
              {questionNumber === totalQuestions ? 'Finish Assessment' : 'Submit Answer'}
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Assessment() {
  const { user } = useAuth();
  const { questions, loading } = useAssessment(ASSESSMENT_ID);
  const [started, setStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<UserAnswer[]>([]);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [completed, setCompleted] = useState(false);
  const startTimeRef = useRef(Date.now());
  const navigate = useNavigate();

  useEffect(() => {
    if (!started || completed) return;
    const interval = setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - startTimeRef.current) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [started, completed]);

  const handleStart = () => {
    setStarted(true);
    startTimeRef.current = Date.now();
  };

  const handleComplete = useCallback(async (finalAnswers: UserAnswer[]) => {
    setCompleted(true);
    const score = Math.round((finalAnswers.filter(a => a.is_correct).length / questions.length) * 100);
    const timeTaken = Math.round((Date.now() - startTimeRef.current) / 1000 / 60);

    if (user) {
      try {
        await supabase.from('user_assessment_results').insert({
          user_id: user.id,
          assessment_id: ASSESSMENT_ID,
          score,
          answers: finalAnswers as any,
        });

        const skillLevel = score <= 40 ? 'beginner' : score <= 70 ? 'intermediate' : 'advanced';
        await supabase
          .from('profiles')
          .update({ skill_level: skillLevel })
          .eq('id', user.id);

        checkAndAwardAchievement(user.id, 'assessment_score', { score }).catch(() => {});

        navigate('/courses', { state: { score, answers: finalAnswers, timeTaken, questions } });
      } catch {
        navigate('/courses', { state: { score, answers: finalAnswers, timeTaken, questions } });
      }
    } else {
      sessionStorage.setItem('guestAssessmentScore', score.toString());
      sessionStorage.setItem('guestAssessmentAnswers', JSON.stringify(finalAnswers));
      navigate('/assessment/results', { state: { score, answers: finalAnswers, timeTaken, questions } });
    }
  }, [questions, user, navigate]);

  const handleAnswer = useCallback((answer: string) => {
    const currentQuestion = questions[currentQuestionIndex];
    if (!currentQuestion) return;

    const correct = answer === currentQuestion.correct_answer;
    const userAnswer: UserAnswer = {
      question_id: currentQuestion.id,
      selected_answer: answer,
      correct_answer: currentQuestion.correct_answer,
      is_correct: correct,
    };

    const newAnswers = [...answers, userAnswer];
    setAnswers(newAnswers);

    if (currentQuestionIndex + 1 >= questions.length) {
      handleComplete(newAnswers);
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  }, [questions, currentQuestionIndex, answers, handleComplete]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-sky-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-gray-200 border-t-gray-900 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 text-sm">Preparing your assessment...</p>
        </div>
      </div>
    );
  }

  if (!started) {
    return <IntroScreen questionCount={questions.length} onStart={handleStart} />;
  }

  const currentQuestion = questions[currentQuestionIndex];
  if (!currentQuestion || completed) return null;

  const correctSoFar = answers.filter(a => a.is_correct).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-sky-50">
      <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center h-14">
            <div className="flex items-center gap-2 text-lg font-bold text-gray-900">
              <BookOpen className="w-5 h-5 text-sky-600" />
              <span className="hidden sm:inline">AdaptLearn</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-sm text-gray-500">
                <Clock className="w-4 h-4" />
                <span className="font-mono tabular-nums">{formatTime(elapsedSeconds)}</span>
              </div>
              <div className="w-px h-5 bg-gray-200" />
              <div className="flex items-center gap-1.5 text-sm">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                <span className="font-medium text-gray-700">{correctSoFar}</span>
                <span className="text-gray-400">/ {answers.length}</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 py-8 md:py-12">
        <QuestionCard
          key={currentQuestion.id}
          question={currentQuestion}
          questionNumber={currentQuestionIndex + 1}
          totalQuestions={questions.length}
          onAnswer={handleAnswer}
        />
      </div>
    </div>
  );
}
