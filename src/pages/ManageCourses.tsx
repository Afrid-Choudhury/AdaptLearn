import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bot, Edit, Plus, BookOpen } from 'lucide-react';
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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAdminOrInstructor) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background text-white">
      <nav className="bg-surface/80 backdrop-blur-md border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/admin" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-100 to-white">
                AdaptLearn Admin
              </span>
            </Link>
            <Link
              to="/admin"
              className="text-gray-300 hover:text-white font-semibold transition-colors"
            >
              Back to Admin
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Manage Courses</h1>
            <p className="text-gray-400">View and edit all courses</p>
          </div>
          <Link
            to="/admin/courses/new"
            className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-all shadow-[0_0_15px_rgba(99,102,241,0.3)]"
          >
            <Plus className="w-5 h-5" />
            Create New Course
          </Link>
        </div>

        <div className="bg-surface rounded-2xl shadow-xl border border-gray-800 p-8">
          {coursesLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
            </div>
          ) : courses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {courses.map((course) => (
                <div
                  key={course.id}
                  className="p-6 bg-surface border border-gray-800 rounded-xl hover:shadow-lg hover:shadow-indigo-900/10 hover:-translate-y-1 transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-bold text-white text-lg">{course.title}</h3>
                        <span className={`px-2 py-1 rounded-lg text-xs font-semibold ${
                          course.difficulty === 'beginner' ? 'bg-blue-100 text-blue-700' :
                          course.difficulty === 'intermediate' ? 'bg-green-100 text-green-700' :
                          'bg-orange-100 text-orange-700'
                        }`}>
                          {course.difficulty}
                        </span>
                      </div>
                      <p className="text-gray-400 text-sm line-clamp-3">{course.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 text-sm text-gray-400 mb-4">
                    <span>{course.duration_hours}h</span>
                    <span>{course.student_count} students</span>
                    <span>{course.rating.toFixed(1)} rating</span>
                  </div>

                  <Link
                    to={`/admin/courses/${course.id}/edit`}
                    className="flex items-center justify-center gap-2 w-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-semibold transition-all shadow-[0_0_10px_rgba(99,102,241,0.2)]"
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
