import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Plus, Users, GraduationCap, Settings } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useUserRole } from '../hooks/useUserRole';
import { useCourses } from '../hooks/useCourses';

export default function AdminDashboard() {
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

  const totalStudents = courses.reduce((sum, course) => sum + course.student_count, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center gap-2 text-xl font-bold text-blue-600">
              <BookOpen className="w-7 h-7" />
              AdaptLearn Admin
            </Link>
            <div className="flex gap-6">
              <Link
                to="/dashboard"
                className="text-gray-700 hover:text-blue-600 font-semibold transition-colors"
              >
                My Dashboard
              </Link>
              <Link
                to="/courses"
                className="text-gray-700 hover:text-blue-600 font-semibold transition-colors"
              >
                Courses
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage courses, modules, and lessons</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">{courses.length}</div>
                <div className="text-gray-600 text-sm">Total Courses</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">{totalStudents.toLocaleString()}</div>
                <div className="text-gray-600 text-sm">Total Students</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Settings className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">Active</div>
                <div className="text-gray-600 text-sm">Platform Status</div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Quick Actions</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              to="/admin/courses/new"
              className="flex items-center gap-4 p-6 bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-xl hover:shadow-lg transition-all"
            >
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <Plus className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg">Create New Course</h3>
                <p className="text-gray-600 text-sm">Add a new course with modules and lessons</p>
              </div>
            </Link>

            <Link
              to="/admin/courses"
              className="flex items-center gap-4 p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl hover:shadow-lg transition-all"
            >
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg">Manage Courses</h3>
                <p className="text-gray-600 text-sm">Edit or delete existing courses</p>
              </div>
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">All Courses</h2>

          {coursesLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            </div>
          ) : courses.length > 0 ? (
            <div className="space-y-4">
              {courses.map((course) => (
                <Link
                  key={course.id}
                  to={`/admin/courses/${course.id}/edit`}
                  className="block p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-bold text-gray-900 text-lg">{course.title}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          course.difficulty === 'beginner' ? 'bg-blue-100 text-blue-700' :
                          course.difficulty === 'intermediate' ? 'bg-green-100 text-green-700' :
                          'bg-orange-100 text-orange-700'
                        }`}>
                          {course.difficulty}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm line-clamp-2">{course.description}</p>
                      <div className="flex items-center gap-6 mt-3 text-sm text-gray-500">
                        <span>{course.duration_hours} hours</span>
                        <span>{course.student_count} students</span>
                        <span>{course.rating.toFixed(1)} rating</span>
                      </div>
                    </div>
                  </div>
                </Link>
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
