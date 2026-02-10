import { useLocation, useNavigate, Link } from 'react-router-dom';
import {
  CheckCircle,
  XCircle,
  Trophy,
  Clock,
  Target,
  BookOpen,
  ArrowRight,
  RotateCcw,
} from 'lucide-react';
import { UserAnswer, AssessmentQuestion } from '../lib/database.types';
import { useAuth } from '../contexts/AuthContext';

interface ResultsState {
  score: number;
  answers: UserAnswer[];
  timeTaken: number;
  questions?: AssessmentQuestion[];
}

const SKILL_CONFIG = {
  beginner: {
    label: 'Beginner',
    color: 'text-sky-700',
    bg: 'bg-sky-50',
    border: 'border-sky-200',
    description: 'You are just getting started. We have courses perfect for you.',
  },
  intermediate: {
    label: 'Intermediate',
    color: 'text-emerald-700',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    description: 'You have a solid foundation. Time to level up your skills.',
  },
  advanced: {
    label: 'Advanced',
    color: 'text-amber-700',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    description: 'Impressive knowledge! Explore advanced topics to master Java.',
  },
};

function ScoreRing({ score }: { score: number }) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const strokeColor = score <= 40 ? '#0ea5e9' : score <= 70 ? '#10b981' : '#f59e0b';

  return (
    <div className="relative w-36 h-36 mx-auto">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r={radius} fill="none" stroke="#f1f5f9" strokeWidth="8" />
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke={strokeColor}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold text-gray-900">{score}%</span>
        <span className="text-xs text-gray-500">Score</span>
      </div>
    </div>
  );
}

export default function AssessmentResults() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const state = location.state as ResultsState | null;

  if (!state || (!state.score && state.score !== 0)) {
    navigate('/assessment');
    return null;
  }

  const { score, answers, timeTaken, questions } = state;
  const correctAnswers = answers.filter(a => a.is_correct).length;
  const totalQuestions = answers.length;
  const skillKey = score <= 40 ? 'beginner' : score <= 70 ? 'intermediate' : 'advanced';
  const skill = SKILL_CONFIG[skillKey];

  const questionMap = new Map<string, AssessmentQuestion>();
  if (questions) {
    questions.forEach(q => questionMap.set(q.id, q));
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-sky-50">
      <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center h-14">
            <Link to="/" className="flex items-center gap-2 text-lg font-bold text-gray-900">
              <BookOpen className="w-5 h-5 text-sky-600" />
              AdaptLearn
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 py-8 md:py-12">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
          <div className="p-6 md:p-10 text-center">
            <div className="mb-6">
              <ScoreRing score={score} />
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Assessment Complete
            </h1>
            <p className="text-gray-500 mb-8">{skill.description}</p>

            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center justify-center gap-1.5 mb-1">
                  <Target className="w-4 h-4 text-gray-400" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{correctAnswers}</div>
                <div className="text-xs text-gray-500">of {totalQuestions} correct</div>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center justify-center gap-1.5 mb-1">
                  <Clock className="w-4 h-4 text-gray-400" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{timeTaken || '<1'}</div>
                <div className="text-xs text-gray-500">{timeTaken === 1 ? 'minute' : 'minutes'}</div>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center justify-center gap-1.5 mb-1">
                  <Trophy className="w-4 h-4 text-gray-400" />
                </div>
                <div className={`text-lg font-bold ${skill.color}`}>{skill.label}</div>
                <div className="text-xs text-gray-500">Skill level</div>
              </div>
            </div>

            <div className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full border ${skill.bg} ${skill.border}`}>
              <span className={`text-sm font-semibold ${skill.color}`}>
                Recommended path: {skill.label} courses
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
          <div className="px-6 md:px-8 py-5 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-900">Question Review</h2>
            <p className="text-sm text-gray-500 mt-0.5">
              {correctAnswers} correct, {totalQuestions - correctAnswers} incorrect
            </p>
          </div>
          <div className="divide-y divide-gray-100">
            {answers.map((answer, index) => {
              const q = questionMap.get(answer.question_id);
              return (
                <div key={index} className="px-6 md:px-8 py-5">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-0.5">
                      {answer.is_correct ? (
                        <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center">
                          <CheckCircle className="w-4 h-4 text-emerald-600" />
                        </div>
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-rose-100 flex items-center justify-center">
                          <XCircle className="w-4 h-4 text-rose-600" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-gray-900 mb-1">
                        {q ? q.question_text : `Question ${index + 1}`}
                      </div>
                      {answer.is_correct ? (
                        <div className="text-sm text-emerald-600">
                          {answer.selected_answer}
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm">
                            <span className="text-rose-600 line-through">{answer.selected_answer}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <span className="text-emerald-600 font-medium">{answer.correct_answer}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {!user ? (
          <div className="bg-gray-900 rounded-2xl p-6 md:p-8 text-center">
            <h3 className="text-xl font-bold text-white mb-2">
              Ready to start learning?
            </h3>
            <p className="text-gray-400 mb-6 text-sm">
              Create a free account to access personalized courses based on your results.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/signup"
                className="w-full sm:w-auto bg-white hover:bg-gray-50 text-gray-900 font-semibold px-6 py-3 rounded-xl transition-all flex items-center justify-center gap-2"
              >
                Create Free Account
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/assessment"
                className="w-full sm:w-auto text-gray-400 hover:text-white font-medium px-6 py-3 rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Retake Assessment
              </Link>
            </div>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/courses"
              className="w-full sm:w-auto bg-gray-900 hover:bg-gray-800 text-white font-semibold px-6 py-3 rounded-xl transition-all flex items-center justify-center gap-2"
            >
              View Recommended Courses
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/assessment"
              className="w-full sm:w-auto text-gray-500 hover:text-gray-900 font-medium px-6 py-3 rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Retake
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
