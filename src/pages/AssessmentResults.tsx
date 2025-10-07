import { useLocation, useNavigate, Link } from 'react-router-dom';
import { CheckCircle, XCircle, Trophy, Clock, Target, BookOpen } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center gap-2 text-xl font-bold text-blue-600">
              <BookOpen className="w-7 h-7" />
              AdaptLearn
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Trophy className="w-10 h-10 text-white" />
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-4">Assessment Complete!</h1>
          <p className="text-xl text-gray-600 mb-8">Here are your results</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Target className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-semibold text-gray-600 uppercase">Score</span>
              </div>
              <div className="text-4xl font-bold text-blue-600">{score}%</div>
            </div>

            <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
              <div className="flex items-center justify-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-sm font-semibold text-gray-600 uppercase">Correct</span>
              </div>
              <div className="text-4xl font-bold text-green-600">
                {correctAnswers}/{totalQuestions}
              </div>
            </div>

            <div className="p-6 bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Clock className="w-5 h-5 text-orange-600" />
                <span className="text-sm font-semibold text-gray-600 uppercase">Time</span>
              </div>
              <div className="text-4xl font-bold text-orange-600">{timeTaken}m</div>
            </div>
          </div>

          <div className={`inline-block px-6 py-3 ${skillBgColor} rounded-full mb-8`}>
            <span className={`text-lg font-bold ${skillColor}`}>
              Your Level: {skillLevel}
            </span>
          </div>

          <div className="border-t border-gray-200 pt-8 text-left">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Answers</h2>
            <div className="space-y-4">
              {answers.map((answer, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border-2 ${
                    answer.is_correct
                      ? 'border-green-200 bg-green-50'
                      : 'border-red-200 bg-red-50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {answer.is_correct ? (
                      <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                    ) : (
                      <XCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                    )}
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900 mb-2">Question {index + 1}</div>
                      {!answer.is_correct && (
                        <div className="text-sm space-y-1">
                          <div className="text-red-700">
                            Your answer: <code className="font-mono">{answer.selected_answer}</code>
                          </div>
                          <div className="text-green-700">
                            Correct answer: <code className="font-mono">{answer.correct_answer}</code>
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
            <div className="mt-8 p-6 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl text-white">
              <h3 className="text-2xl font-bold mb-3">Create an Account to Continue</h3>
              <p className="mb-6 text-blue-100">
                Sign up now to get personalized course recommendations and track your progress!
              </p>
              <Link
                to="/signup"
                className="inline-block bg-white hover:bg-gray-50 text-blue-600 font-semibold px-8 py-3 rounded-lg transition-all transform hover:scale-105"
              >
                Create Free Account
              </Link>
            </div>
          ) : (
            <div className="mt-8">
              <Link
                to="/courses"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition-all transform hover:scale-105"
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
