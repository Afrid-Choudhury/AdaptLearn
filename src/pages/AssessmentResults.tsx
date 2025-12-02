import { useLocation, useNavigate, Link } from 'react-router-dom';
import { CheckCircle, XCircle, Trophy, Clock, Target, Bot } from 'lucide-react';
import { UserAnswer } from '../lib/database.types';
import { useAuth } from '../contexts/AuthContext';

export default function AssessmentResults() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { score, answers, timeTaken } = location.state as { score: number; answers: UserAnswer[]; timeTaken: number };

  if (!score && score !== 0) {
    navigate('/assessment');
    return null;
  }

  const correctAnswers = answers.filter(a => a.is_correct).length;
  const totalQuestions = answers.length;
  const skillLevel = score <= 40 ? 'Beginner' : score <= 70 ? 'Intermediate' : 'Advanced';
  const skillColor = score <= 40 ? 'text-blue-600' : score <= 70 ? 'text-green-600' : 'text-orange-600';
  const skillBgColor = score <= 40 ? 'bg-blue-100' : score <= 70 ? 'bg-green-100' : 'bg-orange-100';

  return (
    <div className="min-h-screen bg-background text-white">
      <nav className="bg-surface/80 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-100 to-white">
                AdaptLearn
              </span>
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-surface rounded-2xl shadow-xl border border-gray-800 p-8 md:p-12 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_rgba(99,102,241,0.4)]">
            <Trophy className="w-10 h-10 text-white" />
          </div>

          <h1 className="text-4xl font-bold text-white mb-4">Assessment Complete!</h1>
          <p className="text-xl text-gray-400 mb-8">Here are your results</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="p-6 bg-blue-900/30 rounded-xl border border-blue-800/50">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Target className="w-5 h-5 text-blue-400" />
                <span className="text-sm font-semibold text-gray-400 uppercase">Score</span>
              </div>
              <div className="text-4xl font-bold text-blue-400">{score}%</div>
            </div>

            <div className="p-6 bg-green-900/30 rounded-xl border border-green-800/50">
              <div className="flex items-center justify-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-sm font-semibold text-gray-400 uppercase">Correct</span>
              </div>
              <div className="text-4xl font-bold text-green-400">
                {correctAnswers}/{totalQuestions}
              </div>
            </div>

            <div className="p-6 bg-orange-900/30 rounded-xl border border-orange-800/50">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Clock className="w-5 h-5 text-orange-400" />
                <span className="text-sm font-semibold text-gray-400 uppercase">Time</span>
              </div>
              <div className="text-4xl font-bold text-orange-400">{timeTaken}m</div>
            </div>
          </div>

          <div className="inline-block px-6 py-3 bg-surfaceHighlight border border-gray-700 rounded-full mb-8">
            <span className={`text-lg font-bold ${
              score <= 40 ? 'text-blue-400' : score <= 70 ? 'text-green-400' : 'text-orange-400'
            }`}>
              Your Level: {skillLevel}
            </span>
          </div>

          <div className="border-t border-gray-800 pt-8 text-left">
            <h2 className="text-2xl font-bold text-white mb-6">Your Answers</h2>
            <div className="space-y-4">
              {answers.map((answer, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border-2 ${
                    answer.is_correct
                      ? 'border-green-800/50 bg-green-900/20'
                      : 'border-red-800/50 bg-red-900/20'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {answer.is_correct ? (
                      <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                    ) : (
                      <XCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                    )}
                    <div className="flex-1">
                      <div className="font-semibold text-white mb-2">Question {index + 1}</div>
                      {!answer.is_correct && (
                        <div className="text-sm space-y-1">
                          <div className="text-red-300">
                            Your answer: <code className="font-mono bg-red-900/30 px-2 py-1 rounded">{answer.selected_answer}</code>
                          </div>
                          <div className="text-green-300">
                            Correct answer: <code className="font-mono bg-green-900/30 px-2 py-1 rounded">{answer.correct_answer}</code>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {!user ? (
            <div className="mt-8 p-6 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl text-white border border-indigo-500/50 shadow-[0_0_30px_rgba(99,102,241,0.3)]">
              <h3 className="text-2xl font-bold mb-3">Create an Account to Continue</h3>
              <p className="mb-6 text-blue-100">
                Sign up now to get personalized course recommendations and track your progress!
              </p>
              <Link
                to="/signup"
                className="inline-block bg-white hover:bg-gray-50 text-indigo-600 font-semibold px-8 py-3 rounded-lg transition-all transform hover:scale-105 shadow-lg"
              >
                Create Free Account
              </Link>
            </div>
          ) : (
            <div className="mt-8">
              <Link
                to="/courses"
                className="inline-block bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold px-8 py-3 rounded-lg transition-all transform hover:scale-105 shadow-[0_0_15px_rgba(99,102,241,0.3)]"
              >
                View Recommended Courses
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
