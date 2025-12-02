import { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Bot, Clock, Users, Star, Award, TrendingUp, CheckCircle } from 'lucide-react';
import { useCourses } from '../hooks/useCourses';
import { useAuth } from '../contexts/AuthContext';
import { useProfile } from '../hooks/useProfile';
import { useEnrollments } from '../hooks/useEnrollments';

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

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-blue-900/30 text-blue-400 border border-blue-800/50';
      case 'intermediate':
        return 'bg-green-900/30 text-green-400 border border-green-800/50';
      case 'advanced':
        return 'bg-orange-900/30 text-orange-400 border border-orange-800/50';
      default:
        return 'bg-gray-800 text-gray-400 border border-gray-700';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading courses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-white">
      <nav className="bg-surface/80 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-100 to-white">
                AdaptLearn
              </span>
            </Link>
            <Link
              to="/dashboard"
              className="text-gray-300 hover:text-white font-semibold transition-colors"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {score !== undefined && (
          <div className="mb-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl shadow-xl border border-indigo-500/50 p-8 text-white">
            <div className="flex items-center gap-3 mb-4">
              <Award className="w-8 h-8" />
              <h1 className="text-3xl font-bold">Assessment Complete!</h1>
            </div>
            <p className="text-blue-100 text-lg mb-2">
              You scored {score}% and have been identified as a <span className="font-bold text-white">{skillLevel}</span> level programmer.
            </p>
            <p className="text-blue-100">
              Based on your results, we've created a personalized learning path just for you.
            </p>
          </div>
        )}

        {recommendedCourse && (
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="w-6 h-6 text-indigo-400" />
              <h2 className="text-3xl font-bold text-white">Recommended for You</h2>
            </div>

            <div className="bg-surface rounded-2xl shadow-xl border-2 border-indigo-600 shadow-indigo-900/20 p-8">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className={`inline-block px-3 py-1 rounded-lg text-sm font-semibold ${getDifficultyColor(recommendedCourse.difficulty)} mb-3`}>
                    {recommendedCourse.difficulty.charAt(0).toUpperCase() + recommendedCourse.difficulty.slice(1)}
                  </span>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {recommendedCourse.title}
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    {recommendedCourse.description}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-6 mb-6">
                <div className="flex items-center gap-2 text-gray-400">
                  <Clock className="w-5 h-5" />
                  <span>{recommendedCourse.duration_hours} hours</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <Star className="w-5 h-5 text-yellow-400" />
                  <span>{recommendedCourse.rating.toFixed(1)} rating</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <Users className="w-5 h-5" />
                  <span>{recommendedCourse.student_count.toLocaleString()} students</span>
                </div>
              </div>

              {recommendedCourse.curriculum && (
                <div className="mb-6">
                  <h4 className="font-bold text-white mb-3">What You'll Learn:</h4>
                  <div className="space-y-2">
                    {recommendedCourse.curriculum.modules.slice(0, 3).map((module, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-indigo-400 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-300">{module.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {isEnrolled(recommendedCourse.id) ? (
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-green-400 font-semibold">
                    <CheckCircle className="w-5 h-5" />
                    <span>Enrolled</span>
                  </div>
                  <Link
                    to={`/courses/${recommendedCourse.id}`}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold px-8 py-3 rounded-lg transition-all transform hover:scale-105 shadow-[0_0_15px_rgba(99,102,241,0.3)]"
                  >
                    Continue Learning
                  </Link>
                </div>
              ) : (
                <Link
                  to={`/courses/${recommendedCourse.id}`}
                  className="inline-block bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold px-8 py-3 rounded-lg transition-all transform hover:scale-105 shadow-[0_0_15px_rgba(99,102,241,0.3)]"
                >
                  View Course
                </Link>
              )}
            </div>
          </div>
        )}

        {otherCourses.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold text-white mb-6">Explore Other Courses</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {otherCourses.map((course) => (
                <div key={course.id} className="bg-surface rounded-xl shadow-lg border border-gray-800 p-6 hover:shadow-xl hover:shadow-indigo-900/10 hover:-translate-y-1 transition-all">
                  <span className={`inline-block px-3 py-1 rounded-lg text-sm font-semibold ${getDifficultyColor(course.difficulty)} mb-3`}>
                    {course.difficulty.charAt(0).toUpperCase() + course.difficulty.slice(1)}
                  </span>
                  <h3 className="text-xl font-bold text-white mb-2">{course.title}</h3>
                  <p className="text-gray-400 mb-4 line-clamp-2">{course.description}</p>

                  <div className="flex flex-wrap gap-4 mb-4 text-sm text-gray-400">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{course.duration_hours}h</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400" />
                      <span>{course.rating.toFixed(1)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{course.student_count.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    {isEnrolled(course.id) && (
                      <div className="flex items-center gap-2 text-green-400 font-semibold text-sm">
                        <CheckCircle className="w-4 h-4" />
                        <span>Enrolled</span>
                      </div>
                    )}
                    <Link
                      to={`/courses/${course.id}`}
                      className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
