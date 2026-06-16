import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Target, Clock, TrendingUp, Award, CheckCircle, Play, Trophy, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useProfile } from '../hooks/useProfile';
import { useEnrollments } from '../hooks/useEnrollments';
import { useUserRole } from '../hooks/useUserRole';
import { useWelcomeEmail } from '../hooks/useWelcomeEmail';
import { useAchievements } from '../hooks/useAchievements';
import { supabase } from '../lib/supabase';
import { Course } from '../lib/database.types';
import AchievementBadge from '../components/AchievementBadge';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Dashboard() {
  const { user } = useAuth();
  const { profile, loading } = useProfile();
  const { enrollments, loading: enrollmentsLoading } = useEnrollments();
  const { isAdminOrInstructor } = useUserRole();
  const { achievements, unlockedCount, totalCount } = useAchievements(user?.id);
  useWelcomeEmail();
  const navigate = useNavigate();
  const [assessmentResult, setAssessmentResult] = useState<any>(null);
  const [loadingAssessment, setLoadingAssessment] = useState(true);
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [totalXP, setTotalXP] = useState<number>(0);

  useEffect(() => {
    if (!user) {
      navigate('/signin');
      return;
    }

    fetchAssessmentResult();
    fetchEnrolledCourses();
    fetchTotalXP();
    checkAchievements();
  }, [user, navigate]);

  const checkAchievements = async () => {
    if (!user) return;

    try {
      await supabase.rpc('check_all_achievements', {
        p_user_id: user.id
      });
    } catch (err) {
      if (import.meta.env.DEV) {
        console.error('Error checking achievements:', err);
      }
    }
  };

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

  const fetchTotalXP = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('course_enrollments')
        .select('total_xp')
        .eq('user_id', user.id);

      if (error) throw error;

      const total = data?.reduce((sum, enrollment) => sum + (enrollment.total_xp || 0), 0) || 0;
      setTotalXP(total);
    } catch (err) {
      if (import.meta.env.DEV) {
        console.error('Error fetching total XP:', err);
      }
    }
  };

  if (!user || loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-accent/30 border-t-accent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-500 font-body font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const userInitial = profile?.username?.[0]?.toUpperCase() || profile?.email?.[0]?.toUpperCase() || 'U';
  const displayName = profile?.username || profile?.email?.split('@')[0] || 'User';

  const getSkillBadgeColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'intermediate': return 'bg-emerald-100 text-emerald-700 border-emerald-300';
      case 'advanced': return 'bg-amber-100 text-amber-700 border-amber-300';
      default: return 'bg-slate-100 text-slate-700 border-slate-300';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'border-blue-300 bg-blue-50';
      case 'intermediate': return 'border-emerald-300 bg-emerald-50';
      case 'advanced': return 'border-amber-300 bg-amber-50';
      default: return 'border-slate-200 bg-slate-50';
    }
  };

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <Navbar variant="authenticated" />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-10">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-foreground">
                Welcome back, {displayName}
              </h1>
              <p className="text-slate-500 font-body mt-1">Track your progress and continue learning</p>
            </div>
            {isAdminOrInstructor && (
              <Link
                to="/admin"
                className="px-5 py-2.5 rounded-full font-bold text-sm text-foreground border-2 border-foreground hover:bg-tertiary transition-all duration-300"
              >
                Admin Panel
              </Link>
            )}
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <div className="bg-white border-2 border-foreground rounded-xl p-5 shadow-pop-soft">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 bg-accent rounded-full border-2 border-foreground flex items-center justify-center">
                <Trophy className="w-4 h-4 text-white" strokeWidth={2.5} />
              </div>
              <span className="text-sm font-bold text-slate-500">Total XP</span>
            </div>
            <p className="text-2xl font-heading font-extrabold text-foreground">{totalXP.toLocaleString()}</p>
          </div>

          <div className="bg-white border-2 border-foreground rounded-xl p-5 shadow-pop-soft">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 bg-quaternary rounded-full border-2 border-foreground flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-white" strokeWidth={2.5} />
              </div>
              <span className="text-sm font-bold text-slate-500">Courses</span>
            </div>
            <p className="text-2xl font-heading font-extrabold text-foreground">{enrolledCourses.length}</p>
          </div>

          <div className="bg-white border-2 border-foreground rounded-xl p-5 shadow-pop-soft">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 bg-secondary rounded-full border-2 border-foreground flex items-center justify-center">
                <Award className="w-4 h-4 text-white" strokeWidth={2.5} />
              </div>
              <span className="text-sm font-bold text-slate-500">Achievements</span>
            </div>
            <p className="text-2xl font-heading font-extrabold text-foreground">{unlockedCount}/{totalCount}</p>
          </div>

          <div className="bg-white border-2 border-foreground rounded-xl p-5 shadow-pop-soft">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 bg-tertiary rounded-full border-2 border-foreground flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" strokeWidth={2.5} />
              </div>
              <span className="text-sm font-bold text-slate-500">Level</span>
            </div>
            <p className="text-2xl font-heading font-extrabold text-foreground capitalize">{profile?.skill_level || 'Beginner'}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Assessment Status */}
            <div className="bg-white border-2 border-foreground rounded-xl shadow-pop-soft overflow-hidden">
              <div className="px-6 pt-6 pb-4 border-b-2 border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center">
                    <Target className="w-4 h-4 text-accent" strokeWidth={2.5} />
                  </div>
                  <h2 className="text-xl font-heading font-bold text-foreground">Assessment Status</h2>
                </div>
              </div>

              <div className="p-6">
                {loadingAssessment ? (
                  <div className="text-center py-6">
                    <div className="w-8 h-8 border-3 border-accent/30 border-t-accent rounded-full animate-spin mx-auto" />
                  </div>
                ) : assessmentResult ? (
                  <div>
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-quaternary/10 border-2 border-quaternary/30 mb-5">
                      <CheckCircle className="w-5 h-5 text-emerald-600" strokeWidth={2.5} />
                      <span className="font-bold text-emerald-800">Assessment Completed</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="p-4 bg-slate-50 rounded-xl">
                        <div className="text-sm text-slate-500 font-medium mb-1">Your Score</div>
                        <div className="text-3xl font-heading font-extrabold text-accent">{assessmentResult.score}%</div>
                      </div>
                      <div className="p-4 bg-slate-50 rounded-xl">
                        <div className="text-sm text-slate-500 font-medium mb-1">Skill Level</div>
                        <span className={`inline-block px-3 py-1.5 rounded-full text-sm font-bold border-2 ${getSkillBadgeColor(profile?.skill_level || 'beginner')}`}>
                          {(profile?.skill_level || 'beginner').charAt(0).toUpperCase() + (profile?.skill_level || 'beginner').slice(1)}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Link
                        to="/courses"
                        className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full font-bold text-white bg-accent border-2 border-foreground shadow-pop hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-pop-hover active:translate-x-0.5 active:translate-y-0.5 active:shadow-pop-active transition-all duration-300 ease-bounce text-sm"
                      >
                        View Courses
                      </Link>
                      <Link
                        to="/assessment"
                        className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full font-bold text-foreground border-2 border-foreground hover:bg-tertiary transition-all duration-300 text-sm"
                      >
                        Retake
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="p-5 rounded-xl bg-accent/5 border-2 border-accent/20 mb-5">
                      <p className="text-slate-700 font-body mb-3">
                        Take the assessment to discover your skill level and get personalized course recommendations.
                      </p>
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <Clock className="w-4 h-4" />
                        <span>Takes approximately 5-10 minutes</span>
                      </div>
                    </div>
                    <Link
                      to="/assessment"
                      className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full font-bold text-white bg-accent border-2 border-foreground shadow-pop hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-pop-hover active:translate-x-0.5 active:translate-y-0.5 active:shadow-pop-active transition-all duration-300 ease-bounce"
                    >
                      Take Assessment Now
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* My Courses */}
            <div className="bg-white border-2 border-foreground rounded-xl shadow-pop-soft overflow-hidden">
              <div className="px-6 pt-6 pb-4 border-b-2 border-slate-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-quaternary/10 rounded-full flex items-center justify-center">
                      <TrendingUp className="w-4 h-4 text-emerald-600" strokeWidth={2.5} />
                    </div>
                    <h2 className="text-xl font-heading font-bold text-foreground">My Courses</h2>
                  </div>
                  {enrolledCourses.length > 0 && (
                    <Link to="/courses" className="text-sm font-bold text-accent hover:text-accent-dark transition-colors">
                      View All
                    </Link>
                  )}
                </div>
              </div>

              <div className="p-6">
                {enrollmentsLoading ? (
                  <div className="text-center py-6">
                    <div className="w-8 h-8 border-3 border-accent/30 border-t-accent rounded-full animate-spin mx-auto" />
                  </div>
                ) : enrolledCourses.length > 0 ? (
                  <div className="space-y-4">
                    {enrolledCourses.map((course) => {
                      const lastAccessed = course.enrollment?.last_accessed
                        ? new Date(course.enrollment.last_accessed).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                          })
                        : 'Not started';

                      return (
                        <Link
                          key={course.id}
                          to={`/courses/${course.id}`}
                          className={`block rounded-xl p-5 border-2 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md ${getDifficultyColor(course.difficulty)}`}
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <h3 className="font-heading font-bold text-foreground text-base mb-1 truncate">{course.title}</h3>
                              <p className="text-sm text-slate-500 line-clamp-1">{course.description}</p>
                            </div>
                            <div className="flex items-center gap-2 text-accent font-bold text-sm flex-shrink-0">
                              <Play className="w-4 h-4" fill="currentColor" />
                              Continue
                            </div>
                          </div>
                          <div className="mt-3 text-xs text-slate-400 font-medium">
                            Last accessed: {lastAccessed}
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-slate-200">
                      <BookOpen className="w-7 h-7 text-slate-400" />
                    </div>
                    <p className="text-slate-500 font-medium mb-3">No courses enrolled yet</p>
                    {assessmentResult && (
                      <Link
                        to="/courses"
                        className="inline-flex items-center gap-2 text-accent font-bold hover:text-accent-dark transition-colors"
                      >
                        Browse Recommended Courses
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Profile Card */}
            <div className="bg-white border-2 border-foreground rounded-xl shadow-pop-soft p-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-accent rounded-full border-2 border-foreground flex items-center justify-center mb-4">
                  <span className="text-2xl font-heading font-bold text-white">{userInitial}</span>
                </div>
                <h3 className="text-lg font-heading font-bold text-foreground mb-0.5">{displayName}</h3>
                <p className="text-slate-400 text-sm mb-3">{profile?.email}</p>
                {profile?.skill_level && (
                  <span className={`inline-block px-3 py-1.5 rounded-full text-xs font-bold border-2 ${getSkillBadgeColor(profile.skill_level)}`}>
                    {profile.skill_level.charAt(0).toUpperCase() + profile.skill_level.slice(1)} Level
                  </span>
                )}
              </div>
              <div className="mt-5 pt-5 border-t-2 border-slate-100 text-sm text-slate-500 flex justify-between">
                <span>Member since</span>
                <span className="font-bold text-foreground">
                  {new Date(profile?.created_at || '').toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                </span>
              </div>
            </div>

            {/* Achievements Card */}
            <div className="bg-accent border-2 border-foreground rounded-xl shadow-pop p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5" strokeWidth={2.5} />
                  <h2 className="text-lg font-heading font-bold">Achievements</h2>
                </div>
                <Link
                  to="/achievements"
                  className="text-xs font-bold text-white/70 hover:text-white transition-colors"
                >
                  View All
                </Link>
              </div>
              <p className="text-white/70 text-sm mb-4">
                {unlockedCount} of {totalCount} unlocked
              </p>
              {unlockedCount > 0 ? (
                <div>
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    {achievements
                      .filter(a => a.unlocked)
                      .slice(0, 4)
                      .map((achievement) => (
                        <div key={achievement.id} className="flex justify-center">
                          <AchievementBadge
                            name={achievement.name}
                            description={achievement.description}
                            icon={achievement.icon}
                            unlocked={achievement.unlocked}
                            unlockedAt={achievement.unlocked_at}
                            size="small"
                          />
                        </div>
                      ))}
                  </div>
                  {unlockedCount > 4 && (
                    <Link
                      to="/achievements"
                      className="block text-center text-sm font-bold text-white bg-white/20 hover:bg-white/30 py-2 rounded-lg transition-colors"
                    >
                      +{unlockedCount - 4} more
                    </Link>
                  )}
                </div>
              ) : (
                <div className="text-center py-6 bg-white/10 rounded-lg">
                  <p className="text-white/80 font-medium text-sm">Start learning to unlock badges!</p>
                </div>
              )}
            </div>

            {/* Leaderboard Link */}
            <Link
              to="/leaderboard"
              className="block bg-white border-2 border-foreground rounded-xl shadow-pop-soft p-5 hover:-translate-y-0.5 hover:shadow-pop transition-all duration-300"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-tertiary rounded-full border-2 border-foreground flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-white" strokeWidth={2.5} />
                </div>
                <div>
                  <p className="font-heading font-bold text-foreground text-sm">Leaderboard</p>
                  <p className="text-xs text-slate-500">See how you rank</p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 ml-auto" />
              </div>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
