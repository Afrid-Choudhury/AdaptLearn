import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  BookOpen, Clock, Users, Star, ChevronDown, ChevronUp,
  PlayCircle, FileText, Code, ClipboardCheck, Target, CheckCircle, Lock
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCourseDetails } from '../hooks/useCourseDetails';
import { useEnrollments } from '../hooks/useEnrollments';
import { useModuleProgress } from '../hooks/useModuleProgress';
import { useContinueLearning } from '../hooks/useContinueLearning';

export default function CourseDetail() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { courseDetails, loading, calculateProgress, getTotalEstimatedMinutes } = useCourseDetails(courseId);
  const { enrollCourse, isEnrolled, getEnrollment } = useEnrollments();
  const enrollment = getEnrollment(courseId || '');
  const { moduleProgress } = useModuleProgress(enrollment?.id);
  const { nextLesson } = useContinueLearning(courseDetails, enrollment?.id);
  const [enrolling, setEnrolling] = useState(false);
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());

  const handleContinueLearning = () => {
    console.log('Continue Learning clicked');
    console.log('courseDetails:', courseDetails);
    console.log('nextLesson:', nextLesson);
    console.log('courseId:', courseId);

    if (!courseDetails || !courseDetails.modules || courseDetails.modules.length === 0) {
      console.log('No course details, navigating to dashboard');
      navigate('/dashboard');
      return;
    }

    if (nextLesson) {
      console.log('Navigating to next lesson:', nextLesson.id);
      navigate(`/courses/${courseId}/lessons/${nextLesson.id}`);
      return;
    }

    const firstModule = courseDetails.modules[0];
    console.log('First module:', firstModule);

    if (firstModule && firstModule.lessons && firstModule.lessons.length > 0) {
      const firstLesson = firstModule.lessons[0];
      console.log('Navigating to first lesson:', firstLesson.id);
      navigate(`/courses/${courseId}/lessons/${firstLesson.id}`);
    } else {
      console.log('No lessons found, navigating to dashboard');
      navigate('/dashboard');
    }
  };

  useEffect(() => {
    if (!user) {
      navigate('/signin');
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev => {
      const next = new Set(prev);
      if (next.has(moduleId)) {
        next.delete(moduleId);
      } else {
        next.add(moduleId);
      }
      return next;
    });
  };

  const handleEnroll = async () => {
    if (!courseId) return;

    try {
      setEnrolling(true);
      await enrollCourse(courseId);
      window.location.reload();
    } catch (err) {
      if (import.meta.env.DEV) {
        console.error('Error enrolling:', err);
      }
      alert('Failed to enroll in course. Please try again.');
    } finally {
      setEnrolling(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-blue-100 text-blue-700';
      case 'intermediate':
        return 'bg-green-100 text-green-700';
      case 'advanced':
        return 'bg-orange-100 text-orange-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getContentIcon = (contentType: string) => {
    switch (contentType) {
      case 'video':
        return <PlayCircle className="w-4 h-4" />;
      case 'reading':
        return <FileText className="w-4 h-4" />;
      case 'exercise':
        return <Code className="w-4 h-4" />;
      case 'quiz':
        return <ClipboardCheck className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getModuleProgressInfo = (moduleId: string, lessonCount: number) => {
    const progress = moduleProgress?.find(p => p.module_id === moduleId);
    if (!progress) return { completed: 0, total: lessonCount, percentage: 0 };

    const percentage = progress.total_lessons > 0
      ? Math.round((progress.completed_lessons / progress.total_lessons) * 100)
      : 0;

    return {
      completed: progress.completed_lessons,
      total: progress.total_lessons,
      percentage,
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading course details...</p>
        </div>
      </div>
    );
  }

  if (!courseDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Course not found</p>
          <Link to="/courses" className="text-blue-600 hover:text-blue-700 font-semibold">
            Back to Courses
          </Link>
        </div>
      </div>
    );
  }

  const isUserEnrolled = isEnrolled(courseId || '');
  const progress = isUserEnrolled ? calculateProgress() : 0;
  const totalMinutes = getTotalEstimatedMinutes();
  const totalHours = Math.floor(totalMinutes / 60);
  const remainingMinutes = totalMinutes % 60;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center gap-2 text-xl font-bold text-blue-600">
              <BookOpen className="w-7 h-7" />
              AdaptLearn
            </Link>
            <div className="flex gap-6">
              <Link
                to="/courses"
                className="text-gray-700 hover:text-blue-600 font-semibold transition-colors"
              >
                Courses
              </Link>
              <Link
                to="/dashboard"
                className="text-gray-700 hover:text-blue-600 font-semibold transition-colors"
              >
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-8">
          <Link to="/courses" className="text-blue-600 hover:text-blue-700 font-semibold mb-4 inline-block">
            &larr; Back to Courses
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getDifficultyColor(courseDetails.difficulty)} mb-4`}>
                {courseDetails.difficulty.charAt(0).toUpperCase() + courseDetails.difficulty.slice(1)}
              </span>

              <h1 className="text-4xl font-bold text-gray-900 mb-4">{courseDetails.title}</h1>

              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                {courseDetails.description}
              </p>

              <div className="flex flex-wrap gap-6 pb-6 border-b border-gray-200">
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="w-5 h-5" />
                  <span>
                    {totalHours > 0 && `${totalHours}h `}
                    {remainingMinutes > 0 && `${remainingMinutes}m`}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Star className="w-5 h-5 text-yellow-500" />
                  <span>{courseDetails.rating.toFixed(1)} rating</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Users className="w-5 h-5" />
                  <span>{courseDetails.student_count.toLocaleString()} students</span>
                </div>
              </div>

              {isUserEnrolled && progress > 0 && (
                <div className="mt-6">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-semibold text-gray-700">Your Progress</span>
                    <span className="font-semibold text-blue-600">{progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>

            {courseDetails.learning_objectives && courseDetails.learning_objectives.length > 0 && (
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <div className="flex items-center gap-3 mb-6">
                  <Target className="w-6 h-6 text-blue-600" />
                  <h2 className="text-2xl font-bold text-gray-900">What You'll Learn</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {courseDetails.learning_objectives.map((objective, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{objective}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <BookOpen className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-900">Course Curriculum</h2>
              </div>

              <div className="space-y-4">
                {courseDetails.modules.map((module, moduleIdx) => {
                  const isExpanded = expandedModules.has(module.id);
                  const progressInfo = getModuleProgressInfo(module.id, module.lessons.length);

                  return (
                    <div key={module.id} className="border border-gray-200 rounded-lg overflow-hidden">
                      <button
                        onClick={() => toggleModule(module.id)}
                        className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex-1 text-left">
                          <div className="flex items-center gap-3 mb-1">
                            <span className="font-semibold text-gray-900">
                              Module {moduleIdx + 1}: {module.title}
                            </span>
                            {isUserEnrolled && progressInfo.total > 0 && (
                              <span className="text-sm text-green-600 font-semibold">
                                {progressInfo.completed}/{progressInfo.total} completed
                              </span>
                            )}
                          </div>
                          {module.description && (
                            <p className="text-sm text-gray-600 mb-2">{module.description}</p>
                          )}
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>{module.lessons.length} lessons</span>
                            <span>{module.estimated_minutes} minutes</span>
                          </div>
                        </div>
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5 text-gray-600 flex-shrink-0" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-600 flex-shrink-0" />
                        )}
                      </button>

                      {isExpanded && (
                        <div className="border-t border-gray-200 bg-white">
                          {module.learning_objectives && module.learning_objectives.length > 0 && (
                            <div className="p-4 border-b border-gray-100 bg-blue-50">
                              <h4 className="font-semibold text-gray-900 text-sm mb-2">Learning Objectives:</h4>
                              <ul className="space-y-1">
                                {module.learning_objectives.map((objective, idx) => (
                                  <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                                    <span className="text-blue-600 mt-1">•</span>
                                    <span>{objective}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          <div className="divide-y divide-gray-100">
                            {module.lessons.map((lesson, lessonIdx) => (
                              <div key={lesson.id} className="p-4 hover:bg-gray-50 transition-colors">
                                <div className="flex items-center gap-3">
                                  {getContentIcon(lesson.content_type)}
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                      <span className="font-medium text-gray-900">
                                        {lessonIdx + 1}. {lesson.title}
                                      </span>
                                      {!isUserEnrolled && (
                                        <Lock className="w-4 h-4 text-gray-400" />
                                      )}
                                    </div>
                                    {lesson.description && (
                                      <p className="text-sm text-gray-600 mt-1">{lesson.description}</p>
                                    )}
                                  </div>
                                  <span className="text-sm text-gray-500">{lesson.estimated_minutes} min</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-xl p-8 sticky top-24">
              {isUserEnrolled ? (
                <div>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                    <div className="flex items-center gap-2 text-green-700 font-semibold">
                      <CheckCircle className="w-5 h-5" />
                      <span>You're enrolled in this course</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleContinueLearning();
                    }}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-lg text-center transition-all transform hover:scale-105 mb-3"
                  >
                    Continue Learning
                  </button>
                  <p className="text-center text-sm text-gray-600">
                    {nextLesson ? 'Continue where you left off' : 'Start from the beginning'}
                  </p>
                </div>
              ) : (
                <div>
                  <button
                    onClick={handleEnroll}
                    disabled={enrolling}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-4 px-6 rounded-lg transition-all transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed mb-4"
                  >
                    {enrolling ? 'Enrolling...' : 'Enroll Now'}
                  </button>
                  <p className="text-center text-sm text-gray-600 mb-4">
                    Free enrollment - Start learning immediately
                  </p>
                  <div className="border-t border-gray-200 pt-4">
                    <h3 className="font-semibold text-gray-900 mb-3">This course includes:</h3>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>{courseDetails.modules.length} comprehensive modules</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>Hands-on exercises and quizzes</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>Progress tracking</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>Lifetime access</span>
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
