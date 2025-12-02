import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, User, Target, Clock, TrendingUp, Award, LogOut, CheckCircle, Play, Settings } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useProfile } from '../hooks/useProfile';
import { useEnrollments } from '../hooks/useEnrollments';
import { useUserRole } from '../hooks/useUserRole';
import { useWelcomeEmail } from '../hooks/useWelcomeEmail';
import { supabase } from '../lib/supabase';
import { Course } from '../lib/database.types';

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const { profile, loading } = useProfile();
  const { enrollments, loading: enrollmentsLoading } = useEnrollments();
  const { isAdminOrInstructor } = useUserRole();
  useWelcomeEmail();
  const navigate = useNavigate();
  const [assessmentResult, setAssessmentResult] = useState<any>(null);
  const [loadingAssessment, setLoadingAssessment] = useState(true);
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);

  useEffect(() => {
    if (!user) {
      navigate('/signin');
      return;
    }

    fetchAssessmentResult();
    fetchEnrolledCourses();
  }, [user, navigate]);

  useEffect(() => {
    if (enrollments.length > 0) {
      fetchEnrolledCourses();
    }
  }, [enrollments]);

  const fetchAssessmentResult = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_assessment_results')
        .select('*')
        .eq('user_id', user.id)
        .order('completed_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!error && data) {
        setAssessmentResult(data);
      }
    } catch (err) {
      console.error('Error fetching assessment:', err);
    } finally {
      setLoadingAssessment(false);
    }
  };

  const fetchEnrolledCourses = async () => {
    if (!user || enrollments.length === 0) {
      setEnrolledCourses([]);
      return;
    }

    try {
      const activeCourseIds = enrollments
        .filter(e => e.status === 'active')
        .map(e => e.course_id);

      if (activeCourseIds.length === 0) {
        setEnrolledCourses([]);
        return;
      }

      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .in('id', activeCourseIds);

      if (error) throw error;

      const coursesWithEnrollment = (data || []).map(course => {
        const enrollment = enrollments.find(e => e.course_id === course.id);
        return {
          ...course,
          curriculum: course.curriculum as Course['curriculum'],
          enrollment,
        };
      });

      coursesWithEnrollment.sort((a, b) => {
        const dateA = new Date(a.enrollment?.last_accessed || 0).getTime();
        const dateB = new Date(b.enrollment?.last_accessed || 0).getTime();
        return dateB - dateA;
      });

      setEnrolledCourses(coursesWithEnrollment);
    } catch (err) {
      console.error('Error fetching enrolled courses:', err);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (!user || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const userInitial = profile?.username?.[0]?.toUpperCase() || profile?.email?.[0]?.toUpperCase() || 'U';
  const displayName = profile?.username || profile?.email?.split('@')[0] || 'User';

  const getSkillLevelColor = (level: string) => {
    switch (level) {
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
              {isAdminOrInstructor && (
                <Link
                  to="/admin"
                  className="flex items-center gap-2 text-gray-700 hover:text-blue-600 font-semibold transition-colors"
                >
                  <Settings className="w-5 h-5" />
                  Admin
                </Link>
              )}
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 text-gray-700 hover:text-red-600 font-semibold transition-colors"
              >
                <LogOut className="w-5 h-5" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome back, {displayName}!</h1>
          <p className="text-xl text-gray-600">Track your progress and continue learning</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <Target className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-900">Assessment Status</h2>
              </div>

              {loadingAssessment ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                </div>
              ) : assessmentResult ? (
                <div>
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200 mb-6">
                    <div className="flex items-center gap-2 mb-4">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                      <span className="font-bold text-green-900">Assessment Completed</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-gray-600 mb-1">Your Score</div>
                        <div className="text-3xl font-bold text-green-600">{assessmentResult.score}%</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600 mb-1">Skill Level</div>
                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getSkillLevelColor(profile?.skill_level || 'beginner')}`}>
                          {(profile?.skill_level || 'beginner').charAt(0).toUpperCase() + (profile?.skill_level || 'beginner').slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <Link
                      to="/courses"
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg text-center transition-all"
                    >
                      View Courses
                    </Link>
                    <Link
                      to="/assessment"
                      className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg text-center transition-all"
                    >
                      Retake Assessment
                    </Link>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-200 mb-6">
                    <p className="text-gray-700 mb-4">
                      You haven't taken the assessment yet. Take it now to discover your skill level and get personalized course recommendations!
                    </p>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>Takes approximately 5-10 minutes</span>
                    </div>
                  </div>
                  <Link
                    to="/assessment"
                    className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg text-center transition-all transform hover:scale-105"
                  >
                    Take Assessment Now
                  </Link>
                </div>
              )}
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <TrendingUp className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-900">My Courses</h2>
              </div>

              {enrollmentsLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                </div>
              ) : enrolledCourses.length > 0 ? (
                <div className="space-y-4">
                  {enrolledCourses.map((course) => {
                    const lastAccessed = course.enrollment?.last_accessed
                      ? new Date(course.enrollment.last_accessed).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })
                      : 'Never';

                    return (
                      <Link
                        key={course.id}
                        to={`/courses/${course.id}`}
                        className="block bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-200 hover:shadow-lg transition-all"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="font-bold text-gray-900 text-lg mb-1">{course.title}</h3>
                            <p className="text-sm text-gray-600 line-clamp-2">{course.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="text-sm text-gray-600">
                            Last accessed: {lastAccessed}
                          </div>
                          <div className="flex items-center gap-2 text-blue-600 font-semibold">
                            <Play className="w-4 h-4" />
                            <span>Continue</span>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="w-10 h-10 text-gray-400" />
                  </div>
                  <p className="text-gray-600 mb-4">No courses enrolled yet</p>
                  {assessmentResult && (
                    <Link
                      to="/courses"
                      className="inline-block text-blue-600 hover:text-blue-700 font-semibold"
                    >
                      Browse Recommended Courses
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <User className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-900">Profile</h2>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-full flex items-center justify-center mb-4">
                  <span className="text-3xl font-bold text-white">{userInitial}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">{displayName}</h3>
                <p className="text-gray-600 text-sm mb-4">{profile?.email}</p>
                {profile?.skill_level && (
                  <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${getSkillLevelColor(profile.skill_level)}`}>
                    {profile.skill_level.charAt(0).toUpperCase() + profile.skill_level.slice(1)} Level
                  </span>
                )}
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Member Since</span>
                    <span className="font-semibold text-gray-900">
                      {new Date(profile?.created_at || '').toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl shadow-xl p-8 text-white">
              <div className="flex items-center gap-3 mb-4">
                <Award className="w-8 h-8" />
                <h2 className="text-2xl font-bold">Achievements</h2>
              </div>
              <p className="text-blue-100 mb-6">
                Complete courses and assessments to unlock badges and achievements!
              </p>
              <div className="text-center py-8 bg-white/10 rounded-lg">
                <p className="text-blue-100">No achievements yet</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
