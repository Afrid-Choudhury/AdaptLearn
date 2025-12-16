import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { BookOpen, ChevronLeft, ChevronRight, CheckCircle, Clock, FileText, PlayCircle, Code, ClipboardCheck } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCourseDetails } from '../hooks/useCourseDetails';
import { useEnrollments } from '../hooks/useEnrollments';
import { useModuleProgress } from '../hooks/useModuleProgress';
import { CourseLesson, ModuleWithLessons } from '../lib/database.types';

export default function LessonViewer() {
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { courseDetails, loading } = useCourseDetails(courseId);
  const { getEnrollment, loading: enrollmentsLoading } = useEnrollments();
  const enrollment = getEnrollment(courseId || '');
  const { moduleProgress, lessonProgress, startModule, completeLesson, getLessonProgress } = useModuleProgress(enrollment?.id);

  const [currentLesson, setCurrentLesson] = useState<CourseLesson | null>(null);
  const [currentModule, setCurrentModule] = useState<ModuleWithLessons | null>(null);
  const [allLessons, setAllLessons] = useState<CourseLesson[]>([]);
  const [completingLesson, setCompletingLesson] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/signin');
      return;
    }

    if (!enrollmentsLoading && !enrollment) {
      navigate(`/courses/${courseId}`);
      return;
    }
  }, [user, enrollment, enrollmentsLoading, navigate, courseId]);

  useEffect(() => {
    if (!courseDetails || !lessonId) return;

    const lessons: CourseLesson[] = [];
    let foundLesson: CourseLesson | null = null;
    let foundModule: ModuleWithLessons | null = null;

    for (const module of courseDetails.modules) {
      for (const lesson of module.lessons) {
        lessons.push(lesson);
        if (lesson.id === lessonId) {
          foundLesson = lesson;
          foundModule = module;
        }
      }
    }

    setAllLessons(lessons);
    setCurrentLesson(foundLesson);
    setCurrentModule(foundModule);

    if (foundModule && enrollment) {
      const modProgress = moduleProgress.find(p => p.module_id === foundModule.id);
      if (!modProgress) {
        startModule(foundModule.id, enrollment.id, foundModule.lessons.length).catch(err => {
          if (import.meta.env.DEV) {
            console.error('Error starting module:', err);
          }
        });
      }
    }
  }, [courseDetails, lessonId, enrollment, moduleProgress]);

  const getCurrentLessonIndex = () => {
    return allLessons.findIndex(l => l.id === lessonId);
  };

  const handlePreviousLesson = () => {
    const currentIndex = getCurrentLessonIndex();
    if (currentIndex > 0) {
      const prevLesson = allLessons[currentIndex - 1];
      navigate(`/courses/${courseId}/lessons/${prevLesson.id}`);
    }
  };

  const handleNextLesson = () => {
    const currentIndex = getCurrentLessonIndex();
    if (currentIndex < allLessons.length - 1) {
      const nextLesson = allLessons[currentIndex + 1];
      navigate(`/courses/${courseId}/lessons/${nextLesson.id}`);
    }
  };

  const handleCompleteLesson = async () => {
    if (!currentLesson || !currentModule || !enrollment) return;

    const modProgress = moduleProgress.find(p => p.module_id === currentModule.id);
    if (!modProgress) return;

    try {
      setCompletingLesson(true);
      await completeLesson(currentLesson.id, currentModule.id, modProgress.id, currentLesson.estimated_minutes);

      const currentIndex = getCurrentLessonIndex();
      if (currentIndex < allLessons.length - 1) {
        setTimeout(() => handleNextLesson(), 500);
      }
    } catch (err) {
      if (import.meta.env.DEV) {
        console.error('Error completing lesson:', err);
      }
      alert('Failed to mark lesson as complete. Please try again.');
    } finally {
      setCompletingLesson(false);
    }
  };

  const getContentIcon = (contentType: string) => {
    switch (contentType) {
      case 'video':
        return <PlayCircle className="w-5 h-5" />;
      case 'reading':
        return <FileText className="w-5 h-5" />;
      case 'exercise':
        return <Code className="w-5 h-5" />;
      case 'quiz':
        return <ClipboardCheck className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  const isLessonCompleted = (lesson: CourseLesson) => {
    const progress = getLessonProgress(lesson.id);
    return progress?.completed || false;
  };

  if (loading || enrollmentsLoading || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading lesson...</p>
        </div>
      </div>
    );
  }

  if (!currentLesson || !currentModule || !courseDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Lesson not found</p>
          <Link to={`/courses/${courseId}`} className="text-blue-600 hover:text-blue-700 font-semibold">
            Back to Course
          </Link>
        </div>
      </div>
    );
  }

  const currentIndex = getCurrentLessonIndex();
  const isCompleted = isLessonCompleted(currentLesson);
  const moduleProgressInfo = moduleProgress.find(p => p.module_id === currentModule.id);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center gap-2 text-xl font-bold text-blue-600">
              <BookOpen className="w-7 h-7" />
              AdaptLearn
            </Link>
            <div className="flex items-center gap-4">
              <Link
                to={`/courses/${courseId}`}
                className="text-gray-700 hover:text-blue-600 font-semibold transition-colors"
              >
                Back to Course
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

      {moduleProgressInfo && (
        <div className="bg-blue-600 text-white py-2">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between text-sm">
              <span>
                Module Progress: {moduleProgressInfo.completed_lessons} of {moduleProgressInfo.total_lessons} lessons completed
              </span>
              <span>
                {Math.round((moduleProgressInfo.completed_lessons / moduleProgressInfo.total_lessons) * 100)}%
              </span>
            </div>
            <div className="w-full bg-blue-500 rounded-full h-1 mt-1">
              <div
                className="bg-white h-1 rounded-full transition-all duration-500"
                style={{ width: `${(moduleProgressInfo.completed_lessons / moduleProgressInfo.total_lessons) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="mb-6">
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                  <span>{courseDetails.title}</span>
                  <span>›</span>
                  <span>{currentModule.title}</span>
                </div>
                <div className="flex items-center gap-3 mb-4">
                  {getContentIcon(currentLesson.content_type)}
                  <h1 className="text-3xl font-bold text-gray-900">{currentLesson.title}</h1>
                </div>
                {currentLesson.description && (
                  <p className="text-gray-600 mb-4">{currentLesson.description}</p>
                )}
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{currentLesson.estimated_minutes} minutes</span>
                  </div>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-semibold capitalize">
                    {currentLesson.content_type}
                  </span>
                  {isCompleted && (
                    <div className="flex items-center gap-1 text-green-600">
                      <CheckCircle className="w-4 h-4" />
                      <span>Completed</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6 mb-8">
                <div className="prose prose-lg max-w-none">
                  {currentLesson.content_text ? (
                    <div className="whitespace-pre-wrap">{currentLesson.content_text}</div>
                  ) : (
                    <p className="text-gray-600">Lesson content coming soon...</p>
                  )}
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <div className="flex items-center justify-between">
                  <button
                    onClick={handlePreviousLesson}
                    disabled={currentIndex === 0}
                    className="flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed text-gray-700 font-semibold rounded-lg transition-all"
                  >
                    <ChevronLeft className="w-5 h-5" />
                    Previous
                  </button>

                  {!isCompleted && (
                    <button
                      onClick={handleCompleteLesson}
                      disabled={completingLesson}
                      className="px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-all"
                    >
                      {completingLesson ? 'Marking Complete...' : 'Mark as Complete'}
                    </button>
                  )}

                  <button
                    onClick={handleNextLesson}
                    disabled={currentIndex === allLessons.length - 1}
                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all"
                  >
                    Next
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-24">
              <h3 className="font-bold text-gray-900 mb-4">Course Lessons</h3>
              <div className="space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto">
                {courseDetails.modules.map((module, moduleIdx) => (
                  <div key={module.id} className="mb-4">
                    <div className="font-semibold text-sm text-gray-700 mb-2">
                      Module {moduleIdx + 1}: {module.title}
                    </div>
                    <div className="space-y-1">
                      {module.lessons.map((lesson, lessonIdx) => {
                        const completed = isLessonCompleted(lesson);
                        const isCurrent = lesson.id === lessonId;

                        return (
                          <button
                            key={lesson.id}
                            onClick={() => navigate(`/courses/${courseId}/lessons/${lesson.id}`)}
                            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                              isCurrent
                                ? 'bg-blue-100 text-blue-900 font-semibold'
                                : 'hover:bg-gray-100 text-gray-700'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              {completed && <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />}
                              <span className="flex-1">{lessonIdx + 1}. {lesson.title}</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
