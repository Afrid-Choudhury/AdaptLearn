import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  BookOpen, ChevronLeft, ChevronRight, CheckCircle, Clock,
  FileText, PlayCircle, Code, ClipboardCheck, Award, Menu, X,
  Layers, ArrowLeft
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCourseDetails } from '../hooks/useCourseDetails';
import { useEnrollments } from '../hooks/useEnrollments';
import { useModuleProgress } from '../hooks/useModuleProgress';
import { CourseLesson, ModuleWithLessons } from '../lib/database.types';
import TryItPanel from '../components/TryItPanel';
import MarkdownContent from '../lib/markdown-renderer';

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
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

  useEffect(() => {
    setSidebarOpen(false);
  }, [lessonId]);

  const getCurrentLessonIndex = () => {
    return allLessons.findIndex(l => l.id === lessonId);
  };

  const handlePreviousLesson = () => {
    const currentIndex = getCurrentLessonIndex();
    if (currentIndex > 0) {
      navigate(`/courses/${courseId}/lessons/${allLessons[currentIndex - 1].id}`);
    }
  };

  const handleNextLesson = () => {
    const currentIndex = getCurrentLessonIndex();
    if (currentIndex < allLessons.length - 1) {
      navigate(`/courses/${courseId}/lessons/${allLessons[currentIndex + 1].id}`);
    }
  };

  const handleCompleteLesson = async () => {
    if (!currentLesson || !currentModule || !enrollment) return;

    const modProgress = moduleProgress.find(p => p.module_id === currentModule.id);
    if (!modProgress) return;

    try {
      setCompletingLesson(true);
      await completeLesson(
        currentLesson.id,
        currentModule.id,
        modProgress.id,
        currentLesson.estimated_minutes,
        currentLesson.xp_reward,
        enrollment.id
      );

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

  const getContentIcon = (contentType: string, size?: string) => {
    const cls = size || 'w-5 h-5';
    switch (contentType) {
      case 'video':
        return <PlayCircle className={cls} />;
      case 'reading':
        return <FileText className={cls} />;
      case 'exercise':
        return <Code className={cls} />;
      case 'quiz':
        return <ClipboardCheck className={cls} />;
      default:
        return <FileText className={cls} />;
    }
  };

  const getContentLabel = (contentType: string) => {
    switch (contentType) {
      case 'video': return 'Video Lesson';
      case 'reading': return 'Reading';
      case 'exercise': return 'Hands-on Exercise';
      case 'quiz': return 'Quiz';
      default: return 'Lesson';
    }
  };

  const isLessonCompleted = (lesson: CourseLesson) => {
    const progress = getLessonProgress(lesson.id);
    return progress?.completed || false;
  };

  if (loading || enrollmentsLoading || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 font-medium">Loading lesson...</p>
        </div>
      </div>
    );
  }

  if (!currentLesson || !currentModule || !courseDetails) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-600 mb-4 font-medium">Lesson not found</p>
          <Link to={`/courses/${courseId}`} className="text-teal-600 hover:text-teal-700 font-semibold">
            Back to Course
          </Link>
        </div>
      </div>
    );
  }

  const currentIndex = getCurrentLessonIndex();
  const isCompleted = isLessonCompleted(currentLesson);
  const moduleProgressInfo = moduleProgress.find(p => p.module_id === currentModule.id);
  const totalCompleted = allLessons.filter(l => isLessonCompleted(l)).length;
  const overallProgress = allLessons.length > 0 ? Math.round((totalCompleted / allLessons.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center h-14">
            <div className="flex items-center gap-4">
              <Link to="/" className="flex items-center gap-2 text-lg font-bold text-teal-600">
                <BookOpen className="w-6 h-6" />
                <span className="hidden sm:inline">AdaptLearn</span>
              </Link>
              <div className="h-5 w-px bg-gray-200 hidden sm:block" />
              <Link
                to={`/courses/${courseId}`}
                className="hidden sm:flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                {courseDetails.title}
              </Link>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-2 text-sm text-gray-500">
                <span className="font-medium text-gray-700">{currentIndex + 1}</span>
                <span>/</span>
                <span>{allLessons.length} lessons</span>
              </div>
              <div className="hidden md:block w-32 bg-gray-200 rounded-full h-1.5">
                <div
                  className="bg-teal-500 h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${overallProgress}%` }}
                />
              </div>
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-[1440px] mx-auto flex">
        <aside
          className={`
            fixed inset-y-0 left-0 z-40 w-80 bg-white border-r border-gray-200 pt-14 transform transition-transform duration-300 ease-in-out
            lg:sticky lg:top-14 lg:h-[calc(100vh-3.5rem)] lg:translate-x-0 lg:z-0
            ${sidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}
          `}
        >
          <div className="h-full flex flex-col overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900 text-sm">Course Contents</h3>
              {moduleProgressInfo && (
                <div className="mt-2 overflow-hidden">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>{moduleProgressInfo.completed_lessons} of {moduleProgressInfo.total_lessons} done</span>
                    <span>{Math.round((moduleProgressInfo.completed_lessons / moduleProgressInfo.total_lessons) * 100)}%</span>
                  </div>
                  <div className="bg-gray-100 rounded-full h-1">
                    <div
                      className="bg-teal-500 h-1 rounded-full transition-all duration-500"
                      style={{ width: `${(moduleProgressInfo.completed_lessons / moduleProgressInfo.total_lessons) * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="flex-1 overflow-y-auto py-2">
              {courseDetails.modules.map((module, moduleIdx) => (
                <div key={module.id} className="mb-1">
                  <div className="px-5 py-2.5">
                    <div className="flex items-center gap-2">
                      <Layers className="w-3.5 h-3.5 text-teal-600 flex-shrink-0" />
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Module {moduleIdx + 1}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-gray-800 mt-0.5 ml-5.5">{module.title}</p>
                  </div>
                  <div className="space-y-0.5 px-2">
                    {module.lessons.map((lesson) => {
                      const completed = isLessonCompleted(lesson);
                      const isCurrent = lesson.id === lessonId;

                      return (
                        <button
                          key={lesson.id}
                          onClick={() => navigate(`/courses/${courseId}/lessons/${lesson.id}`)}
                          className={`
                            w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all duration-200 group flex items-center gap-3
                            ${isCurrent
                              ? 'bg-teal-50 text-teal-900 ring-1 ring-teal-200'
                              : 'hover:bg-gray-50 text-gray-600 hover:text-gray-900'
                            }
                          `}
                        >
                          <div className={`
                            w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-colors
                            ${completed
                              ? 'bg-teal-100 text-teal-600'
                              : isCurrent
                                ? 'bg-teal-600 text-white'
                                : 'bg-gray-100 text-gray-400 group-hover:bg-gray-200'
                            }
                          `}>
                            {completed ? (
                              <CheckCircle className="w-4 h-4" />
                            ) : (
                              <span className="text-xs font-medium">
                                {getContentIcon(lesson.content_type, 'w-3.5 h-3.5')}
                              </span>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className={`block truncate ${isCurrent ? 'font-semibold' : 'font-medium'}`}>
                              {lesson.title}
                            </span>
                            <span className="text-xs text-gray-400">{lesson.estimated_minutes} min</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/30 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <main className="flex-1 min-w-0">
          <div className="max-w-3xl mx-auto px-4 sm:px-8 py-8 sm:py-12">
            <div className="mb-8">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className={`
                  inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold
                  ${currentLesson.content_type === 'exercise'
                    ? 'bg-amber-50 text-amber-700 ring-1 ring-amber-200'
                    : currentLesson.content_type === 'video'
                      ? 'bg-blue-50 text-blue-700 ring-1 ring-blue-200'
                      : currentLesson.content_type === 'quiz'
                        ? 'bg-rose-50 text-rose-700 ring-1 ring-rose-200'
                        : 'bg-teal-50 text-teal-700 ring-1 ring-teal-200'
                  }
                `}>
                  {getContentIcon(currentLesson.content_type, 'w-3.5 h-3.5')}
                  {getContentLabel(currentLesson.content_type)}
                </span>
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                  <Clock className="w-3.5 h-3.5" />
                  {currentLesson.estimated_minutes} min
                </span>
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700">
                  <Award className="w-3.5 h-3.5" />
                  {currentLesson.xp_reward} XP
                </span>
                {isCompleted && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-teal-50 text-teal-700 ring-1 ring-teal-200">
                    <CheckCircle className="w-3.5 h-3.5" />
                    Completed
                  </span>
                )}
              </div>

              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight leading-tight">
                {currentLesson.title}
              </h1>

              {currentLesson.description && (
                <p className="mt-3 text-lg text-gray-500 leading-relaxed">{currentLesson.description}</p>
              )}

              <div className="mt-4 flex items-center gap-2 text-sm text-gray-400">
                <span>{currentModule.title}</span>
                <span className="text-gray-300">|</span>
                <span>Lesson {currentModule.lessons.findIndex(l => l.id === currentLesson.id) + 1} of {currentModule.lessons.length}</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 sm:px-10 py-8 sm:py-10">
                {currentLesson.content_text ? (
                  <MarkdownContent content={currentLesson.content_text} />
                ) : (
                  <div className="text-center py-16">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FileText className="w-8 h-8 text-gray-300" />
                    </div>
                    <p className="text-gray-400 font-medium">Lesson content coming soon...</p>
                  </div>
                )}
              </div>
            </div>

            {currentLesson.content_type === 'exercise' && currentLesson.validation_rules && (
              <div className="mt-8">
                <TryItPanel lesson={currentLesson} onSuccess={handleCompleteLesson} />
              </div>
            )}

            <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <button
                onClick={handlePreviousLesson}
                disabled={currentIndex === 0}
                className="flex items-center justify-center gap-2 px-5 py-3 bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed text-gray-700 font-medium rounded-xl transition-all text-sm"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>

              <div className="flex-1" />

              {!isCompleted && !(currentLesson.content_type === 'exercise' && currentLesson.validation_rules) && (
                <button
                  onClick={handleCompleteLesson}
                  disabled={completingLesson}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-700 disabled:bg-gray-300 text-white font-semibold rounded-xl transition-all text-sm shadow-sm shadow-teal-200"
                >
                  <CheckCircle className="w-4 h-4" />
                  {completingLesson ? 'Marking Complete...' : 'Mark as Complete'}
                </button>
              )}

              <button
                onClick={handleNextLesson}
                disabled={currentIndex === allLessons.length - 1}
                className="flex items-center justify-center gap-2 px-5 py-3 bg-gray-900 hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-all text-sm"
              >
                Next Lesson
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
