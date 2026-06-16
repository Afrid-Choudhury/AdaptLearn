import { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Clock, Users, Star, Award, TrendingUp, CheckCircle, ArrowRight } from 'lucide-react';
import { useCourses } from '../hooks/useCourses';
import { useAuth } from '../contexts/AuthContext';
import { useProfile } from '../hooks/useProfile';
import { useEnrollments } from '../hooks/useEnrollments';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Courses() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { profile } = useProfile();
  const { courses, loading } = useCourses();
  const { isEnrolled } = useEnrollments();

  useEffect(() => {
    if (!user) {
      navigate('/signin');
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  const score = location.state?.score;
  const skillLevel = profile?.skill_level || 'beginner';
  const recommendedCourse = courses.find(c => c.difficulty === skillLevel);
  const otherCourses = courses.filter(c => c.difficulty !== skillLevel);

  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'intermediate': return 'bg-emerald-100 text-emerald-700 border-emerald-300';
      case 'advanced': return 'bg-amber-100 text-amber-700 border-amber-300';
      default: return 'bg-slate-100 text-slate-700 border-slate-300';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-accent/30 border-t-accent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-500 font-body font-medium">Loading courses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <Navbar variant="authenticated" />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
        {score !== undefined && (
          <div className="mb-10 bg-accent border-2 border-foreground rounded-xl shadow-pop p-8 text-white">
            <div className="flex items-center gap-3 mb-3">
              <Award className="w-7 h-7" strokeWidth={2.5} />
              <h1 className="text-2xl sm:text-3xl font-heading font-extrabold">Assessment Complete!</h1>
            </div>
            <p className="text-white/80 text-lg">
              You scored {score}% and have been identified as a <span className="font-bold text-white">{skillLevel}</span> level programmer.
              We've created a personalized learning path for you.
            </p>
          </div>
        )}

        {recommendedCourse && (
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-accent" strokeWidth={2.5} />
              </div>
              <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-foreground">Recommended for You</h2>
            </div>

            <div className="bg-white border-2 border-foreground rounded-xl shadow-pop-pink p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-5">
                <div>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border-2 mb-3 ${getDifficultyBadge(recommendedCourse.difficulty)}`}>
                    {recommendedCourse.difficulty.charAt(0).toUpperCase() + recommendedCourse.difficulty.slice(1)}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-heading font-bold text-foreground mb-2">
                    {recommendedCourse.title}
                  </h3>
                  <p className="text-slate-600 font-body leading-relaxed">
                    {recommendedCourse.description}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-5 mb-6 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span className="font-medium">{recommendedCourse.duration_hours} hours</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-tertiary" fill="currentColor" />
                  <span className="font-medium">{recommendedCourse.rating.toFixed(1)} rating</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-slate-400" />
                  <span className="font-medium">{recommendedCourse.student_count.toLocaleString()} students</span>
                </div>
              </div>

              {recommendedCourse.curriculum && (
                <div className="mb-6 p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <h4 className="font-heading font-bold text-foreground text-sm mb-3">What You'll Learn</h4>
                  <div className="space-y-2">
                    {recommendedCourse.curriculum.modules.slice(0, 3).map((module, idx) => (
                      <div key={idx} className="flex items-start gap-2.5">
                        <div className="w-5 h-5 bg-quaternary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <CheckCircle className="w-3 h-3 text-emerald-600" strokeWidth={2.5} />
                        </div>
                        <span className="text-sm text-slate-700">{module.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-4 flex-wrap">
                {isEnrolled(recommendedCourse.id) ? (
                  <>
                    <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm">
                      <CheckCircle className="w-4 h-4" strokeWidth={2.5} />
                      <span>Enrolled</span>
                    </div>
                    <Link
                      to={`/courses/${recommendedCourse.id}`}
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-bold text-white bg-accent border-2 border-foreground shadow-pop hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-pop-hover active:translate-x-0.5 active:translate-y-0.5 active:shadow-pop-active transition-all duration-300 ease-bounce text-sm"
                    >
                      Continue Learning
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </>
                ) : (
                  <Link
                    to={`/courses/${recommendedCourse.id}`}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-bold text-white bg-accent border-2 border-foreground shadow-pop hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-pop-hover active:translate-x-0.5 active:translate-y-0.5 active:shadow-pop-active transition-all duration-300 ease-bounce text-sm"
                  >
                    View Course
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}

        {otherCourses.length > 0 && (
          <div>
            <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-foreground mb-6">Explore Other Courses</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {otherCourses.map((course) => (
                <div
                  key={course.id}
                  className="bg-white border-2 border-foreground rounded-xl shadow-pop-soft p-6 hover:-rotate-1 hover:scale-[1.02] transition-transform duration-300 ease-bounce"
                >
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border-2 mb-3 ${getDifficultyBadge(course.difficulty)}`}>
                    {course.difficulty.charAt(0).toUpperCase() + course.difficulty.slice(1)}
                  </span>
                  <h3 className="text-lg font-heading font-bold text-foreground mb-2">{course.title}</h3>
                  <p className="text-slate-600 text-sm mb-4 line-clamp-2 font-body">{course.description}</p>

                  <div className="flex flex-wrap gap-4 mb-5 text-sm text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{course.duration_hours}h</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Star className="w-3.5 h-3.5 text-tertiary" fill="currentColor" />
                      <span>{course.rating.toFixed(1)}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5" />
                      <span>{course.student_count.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t-2 border-slate-100">
                    {isEnrolled(course.id) && (
                      <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-sm">
                        <CheckCircle className="w-4 h-4" strokeWidth={2.5} />
                        <span>Enrolled</span>
                      </div>
                    )}
                    <Link
                      to={`/courses/${course.id}`}
                      className="ml-auto inline-flex items-center gap-1.5 text-accent font-bold text-sm hover:text-accent-dark transition-colors"
                    >
                      View Details
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
