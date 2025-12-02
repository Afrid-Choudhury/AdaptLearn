import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Bot, ChevronRight, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useAssessment } from '../hooks/useAssessment';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { UserAnswer } from '../lib/database.types';
import { checkAndAwardAchievement } from '../lib/email-service';

const ASSESSMENT_ID = '00000000-0000-0000-0000-000000000001';

export default function Assessment() {
  const { user } = useAuth();
  const { questions, loading } = useAssessment(ASSESSMENT_ID);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [answers, setAnswers] = useState<UserAnswer[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [startTime] = useState(Date.now());
  const navigate = useNavigate();

  useEffect(() => {
    if (questions.length > 0 && currentQuestionIndex >= questions.length) {
      handleComplete();
    }
  }, [currentQuestionIndex, questions.length]);

  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswerSelect = (answer: string) => {
    if (showFeedback) return;
    setSelectedAnswer(answer);
  };

  const handleNext = () => {
    if (!selectedAnswer || !currentQuestion) return;

    const correct = selectedAnswer === currentQuestion.correct_answer;
    setIsCorrect(correct);
    setShowFeedback(true);

    const userAnswer: UserAnswer = {
      question_id: currentQuestion.id,
      selected_answer: selectedAnswer,
      correct_answer: currentQuestion.correct_answer,
      is_correct: correct,
    };

    setAnswers([...answers, userAnswer]);

    setTimeout(() => {
      setShowFeedback(false);
      setSelectedAnswer('');
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }, 1500);
  };

  const handleComplete = async () => {
    const score = Math.round((answers.filter(a => a.is_correct).length / questions.length) * 100);
    const timeTaken = Math.round((Date.now() - startTime) / 1000 / 60);

    if (user) {
      try {
        await supabase.from('user_assessment_results').insert({
          user_id: user.id,
          assessment_id: ASSESSMENT_ID,
          score,
          answers: answers as any,
        });

        const skillLevel = score <= 40 ? 'beginner' : score <= 70 ? 'intermediate' : 'advanced';
        await supabase
          .from('profiles')
          .update({ skill_level: skillLevel })
          .eq('id', user.id);

        checkAndAwardAchievement(user.id, 'assessment_score', { score }).catch(err => {
          if (import.meta.env.DEV) {
            console.error('Failed to check assessment achievements:', err);
          }
        });

        navigate('/courses', { state: { score, answers, timeTaken } });
      } catch (error) {
        if (import.meta.env.DEV) {
          console.error('Error saving results:', error);
        }
      }
    } else {
      sessionStorage.setItem('guestAssessmentScore', score.toString());
      sessionStorage.setItem('guestAssessmentAnswers', JSON.stringify(answers));
      navigate('/assessment/results', { state: { score, answers, timeTaken } });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading assessment...</p>
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background text-white">
      <nav className="bg-surface/80 backdrop-blur-md border-b border-gray-800 sticky top-0 z-50">
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
            <div className="flex items-center gap-4">
              <Clock className="w-5 h-5 text-gray-400" />
              <span className="text-sm text-gray-300">
                Question {currentQuestionIndex + 1} of {questions.length}
              </span>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold text-indigo-400 uppercase tracking-wide">
              {currentQuestion.difficulty} Level
            </span>
            <span className="text-sm text-gray-400">
              {Math.round(((currentQuestionIndex + 1) / questions.length) * 100)}% Complete
            </span>
          </div>
          <div className="w-full bg-surfaceHighlight rounded-full h-2">
            <div
              className="bg-indigo-600 h-2 rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]"
              style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="bg-surface rounded-2xl shadow-xl border border-gray-800 p-8 md:p-12">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-8">
            {currentQuestion.question_text}
          </h2>

          <div className="space-y-4">
            {currentQuestion.options.map((option, index) => {
              const isSelected = selectedAnswer === option;
              const isCorrectAnswer = option === currentQuestion.correct_answer;
              const showCorrect = showFeedback && isCorrectAnswer;
              const showIncorrect = showFeedback && isSelected && !isCorrectAnswer;

              return (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(option)}
                  disabled={showFeedback}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                    showCorrect
                      ? 'border-green-600 bg-green-900/20'
                      : showIncorrect
                      ? 'border-red-600 bg-red-900/20'
                      : isSelected
                      ? 'border-indigo-600 bg-indigo-900/20'
                      : 'border-gray-700 hover:border-indigo-500 hover:bg-surfaceHighlight'
                  } ${showFeedback ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-sm md:text-base">{option}</span>
                    {showCorrect && <CheckCircle className="w-6 h-6 text-green-600" />}
                    {showIncorrect && <XCircle className="w-6 h-6 text-red-600" />}
                  </div>
                </button>
              );
            })}
          </div>

          {showFeedback && (
            <div
              className={`mt-6 p-4 rounded-lg ${
                isCorrect ? 'bg-green-900/20 border border-green-700' : 'bg-red-900/20 border border-red-700'
              }`}
            >
              <p className={`font-semibold ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                {isCorrect ? 'Correct!' : 'Incorrect'}
              </p>
            </div>
          )}

          {!showFeedback && (
            <button
              onClick={handleNext}
              disabled={!selectedAnswer}
              className="mt-8 w-full md:w-auto bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 px-8 rounded-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(99,102,241,0.3)]"
            >
              {currentQuestionIndex === questions.length - 1 ? 'Finish' : 'Next Question'}
              <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
