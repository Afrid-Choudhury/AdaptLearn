import { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { BookOpen, Clock, Users, Star, Award, TrendingUp, CheckCircle } from 'lucide-react';
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
        return 'bg-blue-100 text-blue-700';
      case 'intermediate':
        return 'bg-green-100 text-green-700';
      case 'advanced':
        return 'bg-orange-100 text-orange-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading courses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center gap-2 text-xl font-bold text-blue-600">
              <BookOpen className="w-7 h-7" />
              AdaptLearn
            </Link>
            <Link
              to="/dashboard"
              className="text-gray-700 hover:text-blue-600 font-semibold transition-colors"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {score !== undefined && (
          <div className="mb-12 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl shadow-xl p-8 text-white">
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
              <TrendingUp className="w-6 h-6 text-blue-600" />
              <h2 className="text-3xl font-bold text-gray-900">Recommended for You</h2>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8 border-4 border-blue-600">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getDifficultyColor(recommendedCourse.difficulty)} mb-3`}>
                    {recommendedCourse.difficulty.charAt(0).toUpperCase() + recommendedCourse.difficulty.slice(1)}
                  </span>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {recommendedCourse.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {recommendedCourse.description}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-6 mb-6">
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="w-5 h-5" />
                  <span>{recommendedCourse.duration_hours} hours</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Star className="w-5 h-5 text-yellow-500" />
                  <span>{recommendedCourse.rating.toFixed(1)} rating</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Users className="w-5 h-5" />
                  <span>{recommendedCourse.student_count.toLocaleString()} students</span>
                </div>
              </div>

              {recommendedCourse.curriculum && (
                <div className="mb-6">
                  <h4 className="font-bold text-gray-900 mb-3">What You'll Learn:</h4>
                  <div className="space-y-2">
                    {recommendedCourse.curriculum.modules.slice(0, 3).map((module, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-700">{module.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {isEnrolled(recommendedCourse.id) ? (
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-green-600 font-semibold">
                    <CheckCircle className="w-5 h-5" />
                    <span>Enrolled</span>
                  </div>
                  <Link
                    to={`/courses/${recommendedCourse.id}`}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition-all transform hover:scale-105"
                  >
                    Continue Learning
                  </Link>
                </div>
              ) : (
                <Link
                  to={`/courses/${recommendedCourse.id}`}
                  className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition-all transform hover:scale-105"
                >
                  View Course
                </Link>
              )}
            </div>
          </div>
        )}

        {otherCourses.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Explore Other Courses</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {otherCourses.map((course) => (
                <div key={course.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getDifficultyColor(course.difficulty)} mb-3`}>
                    {course.difficulty.charAt(0).toUpperCase() + course.difficulty.slice(1)}
                  </span>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{course.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">{course.description}</p>

                  <div className="flex flex-wrap gap-4 mb-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{course.duration_hours}h</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span>{course.rating.toFixed(1)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{course.student_count.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    {isEnrolled(course.id) && (
                      <div className="flex items-center gap-2 text-green-600 font-semibold text-sm">
                        <CheckCircle className="w-4 h-4" />
                        <span>Enrolled</span>
                      </div>
                    )}
                    <Link
                      to={`/courses/${course.id}`}
                      className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
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
