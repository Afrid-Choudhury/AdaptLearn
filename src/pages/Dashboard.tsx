import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bot, User, Target, Clock, TrendingUp, Award, LogOut, CheckCircle, Play, Settings, BookOpen } from 'lucide-react';
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
      if (import.meta.env.DEV) {
        console.error('Error fetching assessment:', err);
      }
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
      if (import.meta.env.DEV) {
        console.error('Error fetching enrolled courses:', err);
      }
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (!user || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const userInitial = profile?.username?.[0]?.toUpperCase() || profile?.email?.[0]?.toUpperCase() || 'U';
  const displayName = profile?.username || profile?.email?.split('@')[0] || 'User';

  const getSkillLevelColor = (level: string) => {
    switch (level) {
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

  return (
    <div className="min-h-screen bg-background text-white">
      <nav className="bg-surface/80 backdrop-blur-md border-b border-gray-800 sticky top-0 z-50">
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
            <div className="flex items-center gap-4">
              {isAdminOrInstructor && (
                <Link
                  to="/admin"
                  className="flex items-center gap-2 text-gray-300 hover:text-white font-semibold transition-colors"
                >
                  <Settings className="w-5 h-5" />
                  Admin
                </Link>
              )}
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 text-gray-300 hover:text-red-400 font-semibold transition-colors"
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
          <h1 className="text-4xl font-bold text-white mb-2">Welcome back, {displayName}!</h1>
          <p className="text-xl text-gray-400">Track your progress and continue learning</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-surface rounded-2xl shadow-xl border border-gray-800 p-8">
              <div className="flex items-center gap-3 mb-6">
                <Target className="w-6 h-6 text-indigo-400" />
                <h2 className="text-2xl font-bold text-white">Assessment Status</h2>
              </div>

              {loadingAssessment ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                </div>
              ) : assessmentResult ? (
                <div>
                  <div className="bg-green-900/20 rounded-xl p-6 border border-green-800/50 mb-6">
                    <div className="flex items-center gap-2 mb-4">
                      <CheckCircle className="w-6 h-6 text-green-400" />
                      <span className="font-bold text-green-300">Assessment Completed</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-gray-400 mb-1">Your Score</div>
                        <div className="text-3xl font-bold text-green-400">{assessmentResult.score}%</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-400 mb-1">Skill Level</div>
                        <span className={`inline-block px-3 py-1 rounded-lg text-sm font-semibold ${getSkillLevelColor(profile?.skill_level || 'beginner')}`}>
                          {(profile?.skill_level || 'beginner').charAt(0).toUpperCase() + (profile?.skill_level || 'beginner').slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <Link
                      to="/courses"
                      className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg text-center transition-all shadow-[0_0_15px_rgba(99,102,241,0.2)]"
                    >
                      View Courses
                    </Link>
                    <Link
                      to="/assessment"
                      className="flex-1 bg-surfaceHighlight hover:bg-gray-700 text-gray-300 font-semibold py-3 px-6 rounded-lg text-center transition-all border border-gray-700"
                    >
                      Retake Assessment
                    </Link>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="bg-blue-900/20 rounded-xl p-6 border border-blue-800/50 mb-6">
                    <p className="text-gray-300 mb-4">
                      You haven't taken the assessment yet. Take it now to discover your skill level and get personalized course recommendations!
                    </p>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Clock className="w-4 h-4" />
                      <span>Takes approximately 5-10 minutes</span>
                    </div>
                  </div>
                  <Link
                    to="/assessment"
                    className="block w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg text-center transition-all transform hover:scale-105 shadow-[0_0_15px_rgba(99,102,241,0.3)]"
                  >
                    Take Assessment Now
                  </Link>
                </div>
              )}
            </div>

            <div className="bg-surface rounded-2xl shadow-xl border border-gray-800 p-8">
              <div className="flex items-center gap-3 mb-6">
                <TrendingUp className="w-6 h-6 text-indigo-400" />
                <h2 className="text-2xl font-bold text-white">My Courses</h2>
              </div>

              {enrollmentsLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
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
                        className="block bg-blue-900/20 rounded-xl p-6 border border-blue-800/50 hover:shadow-lg hover:shadow-blue-900/20 hover:-translate-y-1 transition-all"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="font-bold text-white text-lg mb-1">{course.title}</h3>
                            <p className="text-sm text-gray-400 line-clamp-2">{course.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="text-sm text-gray-400">
                            Last accessed: {lastAccessed}
                          </div>
                          <div className="flex items-center gap-2 text-indigo-400 font-semibold">
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
                  <div className="w-20 h-20 bg-surfaceHighlight rounded-full flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="w-10 h-10 text-gray-500" />
                  </div>
                  <p className="text-gray-400 mb-4">No courses enrolled yet</p>
                  {assessmentResult && (
                    <Link
                      to="/courses"
                      className="inline-block text-indigo-400 hover:text-indigo-300 font-semibold"
                    >
                      Browse Recommended Courses
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-surface rounded-2xl shadow-xl border border-gray-800 p-8">
              <div className="flex items-center gap-3 mb-6">
                <User className="w-6 h-6 text-indigo-400" />
                <h2 className="text-2xl font-bold text-white">Profile</h2>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(99,102,241,0.3)]">
                  <span className="text-3xl font-bold text-white">{userInitial}</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-1">{displayName}</h3>
                <p className="text-gray-400 text-sm mb-4">{profile?.email}</p>
                {profile?.skill_level && (
                  <span className={`inline-block px-4 py-2 rounded-lg text-sm font-semibold ${getSkillLevelColor(profile.skill_level)}`}>
                    {profile.skill_level.charAt(0).toUpperCase() + profile.skill_level.slice(1)} Level
                  </span>
                )}
              </div>

              <div className="mt-6 pt-6 border-t border-gray-800">
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Member Since</span>
                    <span className="font-semibold text-white">
                      {new Date(profile?.created_at || '').toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl shadow-xl border border-indigo-500/50 p-8 text-white">
              <div className="flex items-center gap-3 mb-4">
                <Award className="w-8 h-8" />
                <h2 className="text-2xl font-bold">Achievements</h2>
              </div>
              <p className="text-blue-100 mb-6">
                Complete courses and assessments to unlock badges and achievements!
              </p>
              <div className="text-center py-8 bg-black/20 rounded-lg">
                <p className="text-blue-100">No achievements yet</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
