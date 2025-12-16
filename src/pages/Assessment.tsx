import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, ChevronRight, CheckCircle, XCircle, Clock } from 'lucide-react';
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading assessment...</p>
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2 text-xl font-bold text-blue-600">
              <BookOpen className="w-7 h-7" />
              AdaptLearn
            </div>
            <div className="flex items-center gap-4">
              <Clock className="w-5 h-5 text-gray-500" />
              <span className="text-sm text-gray-600">
                Question {currentQuestionIndex + 1} of {questions.length}
              </span>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold text-blue-600 uppercase tracking-wide">
              {currentQuestion.difficulty} Level
            </span>
            <span className="text-sm text-gray-500">
              {Math.round(((currentQuestionIndex + 1) / questions.length) * 100)}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
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
                      ? 'border-green-500 bg-green-50'
                      : showIncorrect
                      ? 'border-red-500 bg-red-50'
                      : isSelected
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-400 hover:bg-blue-50'
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
                isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
              }`}
            >
              <p className={`font-semibold ${isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                {isCorrect ? 'Correct!' : 'Incorrect'}
              </p>
            </div>
          )}

          {!showFeedback && (
            <button
              onClick={handleNext}
              disabled={!selectedAnswer}
              className="mt-8 w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
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
