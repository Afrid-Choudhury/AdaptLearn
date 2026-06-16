import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  BookOpen, Clock, Users, Star, ChevronDown, ChevronUp,
  FileText, Code, ClipboardCheck, Target, CheckCircle, Lock, ArrowLeft, ArrowRight
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCourseDetails } from '../hooks/useCourseDetails';
import { useEnrollments } from '../hooks/useEnrollments';
import { useModuleProgress } from '../hooks/useModuleProgress';
import { useContinueLearning } from '../hooks/useContinueLearning';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

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
    if (!courseDetails || !courseDetails.modules || courseDetails.modules.length === 0) {
      navigate('/dashboard');
      return;
    }

    if (nextLesson) {
      navigate(`/courses/${courseId}/lessons/${nextLesson.id}`);
      return;
    }

    const firstModule = courseDetails.modules[0];
    if (firstModule && firstModule.lessons && firstModule.lessons.length > 0) {
      const firstLesson = firstModule.lessons[0];
      navigate(`/courses/${courseId}/lessons/${firstLesson.id}`);
    } else {
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

  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'intermediate': return 'bg-emerald-100 text-emerald-700 border-emerald-300';
      case 'advanced': return 'bg-amber-100 text-amber-700 border-amber-300';
      default: return 'bg-slate-100 text-slate-700 border-slate-300';
    }
  };

  const getContentIcon = (contentType: string) => {
    switch (contentType) {
      case 'video':
        return <BookOpen className="w-4 h-4" />;
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
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-accent/30 border-t-accent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-500 font-body font-medium">Loading course details...</p>
        </div>
      </div>
    );
  }

  if (!courseDetails) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-600 mb-4 font-medium">Course not found</p>
          <Link to="/courses" className="text-accent hover:text-accent-dark font-bold">
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
    <div className="min-h-screen bg-cream flex flex-col">
      <Navbar variant="authenticated" />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-6">
          <Link
            to="/courses"
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-accent transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Courses
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Hero Card */}
            <div className="bg-white border-2 border-foreground rounded-xl shadow-pop-soft p-6 sm:p-8">
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border-2 mb-4 ${getDifficultyBadge(courseDetails.difficulty)}`}>
                {courseDetails.difficulty.charAt(0).toUpperCase() + courseDetails.difficulty.slice(1)}
              </span>

              <h1 className="text-3xl sm:text-4xl font-heading font-extrabold text-foreground mb-4">{courseDetails.title}</h1>

              <p className="text-lg text-slate-600 font-body mb-6 leading-relaxed">
                {courseDetails.description}
              </p>

              <div className="flex flex-wrap gap-5 pb-6 border-b-2 border-slate-100 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span className="font-medium">
                    {totalHours > 0 && `${totalHours}h `}
                    {remainingMinutes > 0 && `${remainingMinutes}m`}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-tertiary" fill="currentColor" />
                  <span className="font-medium">{courseDetails.rating.toFixed(1)} rating</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-slate-400" />
                  <span className="font-medium">{courseDetails.student_count.toLocaleString()} students</span>
                </div>
              </div>

              {isUserEnrolled && progress > 0 && (
                <div className="mt-6">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-bold text-slate-700">Your Progress</span>
                    <span className="font-bold text-accent">{progress}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-3 border border-slate-200">
                    <div
                      className="bg-accent h-3 rounded-full transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Learning Objectives */}
            {courseDetails.learning_objectives && courseDetails.learning_objectives.length > 0 && (
              <div className="bg-white border-2 border-foreground rounded-xl shadow-pop-soft p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-quaternary/10 rounded-full flex items-center justify-center">
                    <Target className="w-4 h-4 text-emerald-600" strokeWidth={2.5} />
                  </div>
                  <h2 className="text-xl font-heading font-bold text-foreground">What You'll Learn</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {courseDetails.learning_objectives.map((objective, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                      <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" strokeWidth={2.5} />
                      <span className="text-sm text-slate-700">{objective}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Curriculum */}
            <div className="bg-white border-2 border-foreground rounded-xl shadow-pop-soft overflow-hidden">
              <div className="px-6 sm:px-8 pt-6 pb-4 border-b-2 border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center">
                    <BookOpen className="w-4 h-4 text-accent" strokeWidth={2.5} />
                  </div>
                  <h2 className="text-xl font-heading font-bold text-foreground">Course Curriculum</h2>
                </div>
              </div>

              <div className="divide-y-2 divide-slate-100">
                {courseDetails.modules.map((module, moduleIdx) => {
                  const isExpanded = expandedModules.has(module.id);
                  const progressInfo = getModuleProgressInfo(module.id, module.lessons.length);

                  return (
                    <div key={module.id}>
                      <button
                        onClick={() => toggleModule(module.id)}
                        className="w-full flex items-center justify-between p-5 sm:px-8 hover:bg-slate-50 transition-colors"
                      >
                        <div className="flex-1 text-left">
                          <div className="flex items-center gap-3 mb-1 flex-wrap">
                            <span className="font-heading font-bold text-foreground text-sm">
                              Module {moduleIdx + 1}: {module.title}
                            </span>
                            {isUserEnrolled && progressInfo.total > 0 && (
                              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                                {progressInfo.completed}/{progressInfo.total}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                            <span>{module.lessons.length} lessons</span>
                            <span className="w-1 h-1 bg-slate-300 rounded-full" />
                            <span>{module.estimated_minutes} min</span>
                          </div>
                        </div>
                        <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0 ml-4">
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4 text-slate-600" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-slate-600" />
                          )}
                        </div>
                      </button>

                      {isExpanded && (
                        <div className="border-t border-slate-100 bg-slate-50/50">
                          {module.learning_objectives && module.learning_objectives.length > 0 && (
                            <div className="px-5 sm:px-8 py-4 border-b border-slate-100">
                              <h4 className="font-bold text-foreground text-xs uppercase tracking-wider mb-2">Learning Objectives</h4>
                              <ul className="space-y-1">
                                {module.learning_objectives.map((objective, idx) => (
                                  <li key={idx} className="text-sm text-slate-600 flex items-start gap-2">
                                    <span className="text-accent font-bold mt-0.5">-</span>
                                    <span>{objective}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          <div className="divide-y divide-slate-100">
                            {module.lessons.map((lesson, lessonIdx) => (
                              <div key={lesson.id} className="px-5 sm:px-8 py-3.5 hover:bg-white transition-colors">
                                <div className="flex items-center gap-3">
                                  <div className="w-7 h-7 rounded-full bg-white border border-slate-200 flex items-center justify-center flex-shrink-0 text-slate-500">
                                    {getContentIcon(lesson.content_type)}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                      <span className="font-medium text-foreground text-sm truncate">
                                        {lessonIdx + 1}. {lesson.title}
                                      </span>
                                      {!isUserEnrolled && (
                                        <Lock className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                                      )}
                                    </div>
                                  </div>
                                  <span className="text-xs text-slate-400 font-medium flex-shrink-0">{lesson.estimated_minutes} min</span>
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

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white border-2 border-foreground rounded-xl shadow-pop-soft p-6 sticky top-24">
              {isUserEnrolled ? (
                <div>
                  <div className="flex items-center gap-2.5 p-3.5 bg-quaternary/10 border-2 border-quaternary/30 rounded-xl mb-5">
                    <CheckCircle className="w-5 h-5 text-emerald-600" strokeWidth={2.5} />
                    <span className="text-sm font-bold text-emerald-800">You're enrolled</span>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleContinueLearning();
                    }}
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full font-bold text-white bg-accent border-2 border-foreground shadow-pop hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-pop-hover active:translate-x-0.5 active:translate-y-0.5 active:shadow-pop-active transition-all duration-300 ease-bounce mb-3"
                  >
                    Continue Learning
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <p className="text-center text-xs text-slate-500">
                    {nextLesson ? 'Continue where you left off' : 'Start from the beginning'}
                  </p>
                </div>
              ) : (
                <div>
                  <button
                    onClick={handleEnroll}
                    disabled={enrolling}
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full font-bold text-white bg-accent border-2 border-foreground shadow-pop hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-pop-hover active:translate-x-0.5 active:translate-y-0.5 active:shadow-pop-active transition-all duration-300 ease-bounce disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-pop mb-4"
                  >
                    {enrolling ? 'Enrolling...' : 'Enroll Now'}
                  </button>
                  <p className="text-center text-xs text-slate-500 mb-5">
                    Free enrollment - Start learning immediately
                  </p>
                  <div className="border-t-2 border-slate-100 pt-5">
                    <h3 className="font-heading font-bold text-foreground text-sm mb-4">This course includes:</h3>
                    <ul className="space-y-3">
                      <li className="flex items-center gap-2.5 text-sm text-slate-600">
                        <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" strokeWidth={2.5} />
                        <span>{courseDetails.modules.length} comprehensive modules</span>
                      </li>
                      <li className="flex items-center gap-2.5 text-sm text-slate-600">
                        <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" strokeWidth={2.5} />
                        <span>Hands-on exercises and quizzes</span>
                      </li>
                      <li className="flex items-center gap-2.5 text-sm text-slate-600">
                        <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" strokeWidth={2.5} />
                        <span>Progress tracking</span>
                      </li>
                      <li className="flex items-center gap-2.5 text-sm text-slate-600">
                        <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" strokeWidth={2.5} />
                        <span>Lifetime access</span>
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
