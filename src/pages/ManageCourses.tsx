import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Edit, Plus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useUserRole } from '../hooks/useUserRole';
import { useCourses } from '../hooks/useCourses';

export default function ManageCourses() {
  const { user } = useAuth();
  const { isAdminOrInstructor, loading: roleLoading } = useUserRole();
  const { courses, loading: coursesLoading } = useCourses();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/signin');
      return;
    }

    if (!roleLoading && !isAdminOrInstructor) {
      navigate('/dashboard');
    }
  }, [user, isAdminOrInstructor, roleLoading, navigate]);

  if (!user || roleLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAdminOrInstructor) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/admin" className="flex items-center gap-2 text-xl font-bold text-blue-600">
              <BookOpen className="w-7 h-7" />
              AdaptLearn Admin
            </Link>
            <Link
              to="/admin"
              className="text-gray-700 hover:text-blue-600 font-semibold transition-colors"
            >
              Back to Admin
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Manage Courses</h1>
            <p className="text-gray-600">View and edit all courses</p>
          </div>
          <Link
            to="/admin/courses/new"
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all"
          >
            <Plus className="w-5 h-5" />
            Create New Course
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          {coursesLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            </div>
          ) : courses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {courses.map((course) => (
                <div
                  key={course.id}
                  className="p-6 bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl hover:shadow-lg transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-bold text-gray-900 text-lg">{course.title}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          course.difficulty === 'beginner' ? 'bg-blue-100 text-blue-700' :
                          course.difficulty === 'intermediate' ? 'bg-green-100 text-green-700' :
                          'bg-orange-100 text-orange-700'
                        }`}>
                          {course.difficulty}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm line-clamp-3">{course.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 text-sm text-gray-500 mb-4">
                    <span>{course.duration_hours}h</span>
                    <span>{course.student_count} students</span>
                    <span>{course.rating.toFixed(1)} rating</span>
                  </div>

                  <Link
                    to={`/admin/courses/${course.id}/edit`}
                    className="flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-all"
                  >
                    <Edit className="w-4 h-4" />
                    Edit Course
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">No courses created yet</p>
              <Link
                to="/admin/courses/new"
                className="inline-block text-blue-600 hover:text-blue-700 font-semibold"
              >
                Create your first course
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
