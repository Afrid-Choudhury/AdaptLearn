import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  BookOpen,
  User,
  Mail,
  Bell,
  Lock,
  Trash2,
  Download,
  Save,
  ArrowLeft,
  Eye,
  EyeOff,
  CheckCircle,
  AlertTriangle,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useProfile } from '../hooks/useProfile';
import { supabase } from '../lib/supabase';

interface NotificationPreferences {
  email_welcome: boolean;
  email_achievements: boolean;
  email_assessment_reminder: boolean;
  email_course_updates: boolean;
  email_weekly_digest: boolean;
}

export default function Settings() {
  const { user, signOut, updatePassword, deleteAccount } = useAuth();
  const { profile, loading: profileLoading, refetch } = useProfile();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'security' | 'account'>('profile');
  const [username, setUsername] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [notifications, setNotifications] = useState<NotificationPreferences>({
    email_welcome: true,
    email_achievements: true,
    email_assessment_reminder: true,
    email_course_updates: true,
    email_weekly_digest: false,
  });
  const [notificationsLoading, setNotificationsLoading] = useState(true);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);
  const [passwordChanging, setPasswordChanging] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/signin');
      return;
    }
    fetchNotificationPreferences();
  }, [user, navigate]);

  useEffect(() => {
    if (profile) {
      setUsername(profile.username || '');
    }
  }, [profile]);

  const fetchNotificationPreferences = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_notification_preferences')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!error && data) {
        setNotifications({
          email_welcome: data.email_welcome ?? true,
          email_achievements: data.email_achievements ?? true,
          email_assessment_reminder: data.email_assessment_reminder ?? true,
          email_course_updates: data.email_course_updates ?? true,
          email_weekly_digest: data.email_weekly_digest ?? false,
        });
      }
    } catch (err) {
      if (import.meta.env.DEV) {
        console.error('Error fetching notification preferences:', err);
      }
    } finally {
      setNotificationsLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!user || !username.trim()) return;

    setSaving(true);
    setMessage(null);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ username: username.trim(), updated_at: new Date().toISOString() })
        .eq('id', user.id);

      if (error) throw error;

      await supabase.auth.updateUser({
        data: { username: username.trim() },
      });

      await refetch();
      setMessage({ type: 'success', text: 'Profile updated successfully' });
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Failed to update profile' });
    } finally {
      setSaving(false);
    }
  };

  const handleSaveNotifications = async () => {
    if (!user) return;

    setSaving(true);
    setMessage(null);

    try {
      const { error } = await supabase
        .from('user_notification_preferences')
        .upsert({
          user_id: user.id,
          ...notifications,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id',
        });

      if (error) throw error;
      setMessage({ type: 'success', text: 'Notification preferences saved' });
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Failed to save preferences' });
    } finally {
      setSaving(false);
    }
  };

  const validatePassword = (pass: string): string[] => {
    const errors: string[] = [];
    if (pass.length < 8) errors.push('At least 8 characters');
    if (!/[A-Z]/.test(pass)) errors.push('One uppercase letter');
    if (!/[a-z]/.test(pass)) errors.push('One lowercase letter');
    if (!/[0-9]/.test(pass)) errors.push('One number');
    return errors;
  };

  const passwordErrors = validatePassword(newPassword);
  const passwordsMatch = newPassword === confirmPassword;

  const handleChangePassword = async () => {
    if (passwordErrors.length > 0 || !passwordsMatch) return;

    setPasswordChanging(true);
    setMessage(null);

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user?.email || '',
        password: currentPassword,
      });

      if (signInError) {
        setMessage({ type: 'error', text: 'Current password is incorrect' });
        setPasswordChanging(false);
        return;
      }

      const { error } = await updatePassword(newPassword);
      if (error) throw error;

      setMessage({ type: 'success', text: 'Password changed successfully' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Failed to change password' });
    } finally {
      setPasswordChanging(false);
    }
  };

  const handleExportData = async () => {
    if (!user) return;

    setExporting(true);

    try {
      const [
        { data: profileData },
        { data: enrollmentsData },
        { data: progressData },
        { data: achievementsData },
        { data: assessmentsData },
        { data: preferencesData },
      ] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', user.id).maybeSingle(),
        supabase.from('course_enrollments').select('*, courses(title)').eq('user_id', user.id),
        supabase.from('user_lesson_progress').select('*, course_lessons(title)').eq('user_id', user.id),
        supabase.from('user_achievements').select('*, achievements(name, description)').eq('user_id', user.id),
        supabase.from('user_assessment_results').select('*').eq('user_id', user.id),
        supabase.from('user_notification_preferences').select('*').eq('user_id', user.id).maybeSingle(),
      ]);

      const exportData = {
        exportDate: new Date().toISOString(),
        user: {
          id: user.id,
          email: user.email,
          createdAt: user.created_at,
        },
        profile: profileData,
        enrollments: enrollmentsData,
        lessonProgress: progressData,
        achievements: achievementsData,
        assessmentResults: assessmentsData,
        notificationPreferences: preferencesData,
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `adaptlearn-data-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setMessage({ type: 'success', text: 'Data exported successfully' });
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to export data' });
    } finally {
      setExporting(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== 'DELETE') return;

    setDeleting(true);

    try {
      const { error } = await deleteAccount();
      if (error) throw error;
      navigate('/');
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Failed to delete account' });
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  if (!user) return null;

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Email Preferences', icon: Bell },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'account', label: 'Account', icon: Trash2 },
  ] as const;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-8">
              <Link to="/" className="flex items-center gap-2 text-xl font-bold text-blue-600">
                <BookOpen className="w-7 h-7" />
                AdaptLearn
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/dashboard" className="text-gray-600 hover:text-gray-900 flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
              </Link>
              <button
                onClick={() => signOut()}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Settings</h1>

        {message && (
          <div
            className={`mb-6 px-4 py-3 rounded-lg flex items-center gap-2 ${
              message.type === 'success'
                ? 'bg-green-50 border border-green-200 text-green-700'
                : 'bg-red-50 border border-red-200 text-red-700'
            }`}
          >
            {message.type === 'success' ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <AlertTriangle className="w-5 h-5" />
            )}
            {message.text}
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="flex border-b border-gray-200">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setMessage(null);
                  }}
                  className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="p-6">
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Profile Information</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-600">
                        <Mail className="w-5 h-5 text-gray-400" />
                        {user.email}
                      </div>
                      <p className="mt-1 text-sm text-gray-500">Email cannot be changed for security reasons</p>
                    </div>
                    <div>
                      <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                        Username
                      </label>
                      <input
                        id="username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="Enter your username"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Skill Level</label>
                      <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-600 capitalize">
                        {profile?.skill_level || 'Not set'}
                      </div>
                      <p className="mt-1 text-sm text-gray-500">
                        Complete an assessment to update your skill level
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={handleSaveProfile}
                    disabled={saving || !username.trim()}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-5 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Save className="w-4 h-4" />
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">Email Preferences</h2>
                  <p className="text-gray-600 mb-6">Choose which emails you'd like to receive</p>
                  {notificationsLoading ? (
                    <div className="flex justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                        <div>
                          <p className="font-medium text-gray-900">Achievement Notifications</p>
                          <p className="text-sm text-gray-500">Get notified when you unlock new achievements</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={notifications.email_achievements}
                          onChange={(e) =>
                            setNotifications({ ...notifications, email_achievements: e.target.checked })
                          }
                          className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                        />
                      </label>
                      <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                        <div>
                          <p className="font-medium text-gray-900">Assessment Reminders</p>
                          <p className="text-sm text-gray-500">Reminders to complete skill assessments</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={notifications.email_assessment_reminder}
                          onChange={(e) =>
                            setNotifications({ ...notifications, email_assessment_reminder: e.target.checked })
                          }
                          className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                        />
                      </label>
                      <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                        <div>
                          <p className="font-medium text-gray-900">Course Updates</p>
                          <p className="text-sm text-gray-500">Updates about courses you're enrolled in</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={notifications.email_course_updates}
                          onChange={(e) =>
                            setNotifications({ ...notifications, email_course_updates: e.target.checked })
                          }
                          className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                        />
                      </label>
                      <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                        <div>
                          <p className="font-medium text-gray-900">Weekly Digest</p>
                          <p className="text-sm text-gray-500">Weekly summary of your learning progress</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={notifications.email_weekly_digest}
                          onChange={(e) =>
                            setNotifications({ ...notifications, email_weekly_digest: e.target.checked })
                          }
                          className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                        />
                      </label>
                    </div>
                  )}
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={handleSaveNotifications}
                    disabled={saving || notificationsLoading}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-5 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Save className="w-4 h-4" />
                    {saving ? 'Saving...' : 'Save Preferences'}
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">Change Password</h2>
                  <p className="text-gray-600 mb-6">Update your password to keep your account secure</p>
                  <div className="space-y-4 max-w-md">
                    <div>
                      <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-2">
                        Current Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          id="currentPassword"
                          type={showPasswords ? 'text' : 'password'}
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          placeholder="Enter current password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPasswords(!showPasswords)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPasswords ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                        New Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          id="newPassword"
                          type={showPasswords ? 'text' : 'password'}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          placeholder="Enter new password"
                        />
                      </div>
                      {newPassword && (
                        <div className="mt-2 space-y-1">
                          {['At least 8 characters', 'One uppercase letter', 'One lowercase letter', 'One number'].map(
                            (req) => (
                              <div
                                key={req}
                                className={`text-sm flex items-center gap-2 ${
                                  !passwordErrors.includes(req) ? 'text-green-600' : 'text-gray-400'
                                }`}
                              >
                                <CheckCircle className="w-4 h-4" />
                                {req}
                              </div>
                            )
                          )}
                        </div>
                      )}
                    </div>
                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          id="confirmPassword"
                          type={showPasswords ? 'text' : 'password'}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          placeholder="Confirm new password"
                        />
                      </div>
                      {confirmPassword && (
                        <div
                          className={`mt-2 text-sm flex items-center gap-2 ${
                            passwordsMatch ? 'text-green-600' : 'text-red-500'
                          }`}
                        >
                          <CheckCircle className="w-4 h-4" />
                          {passwordsMatch ? 'Passwords match' : 'Passwords do not match'}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={handleChangePassword}
                    disabled={
                      passwordChanging ||
                      !currentPassword ||
                      passwordErrors.length > 0 ||
                      !passwordsMatch ||
                      !newPassword
                    }
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-5 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Lock className="w-4 h-4" />
                    {passwordChanging ? 'Changing...' : 'Change Password'}
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'account' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">Export Your Data</h2>
                  <p className="text-gray-600 mb-4">
                    Download a copy of all your data including profile information, course progress, achievements, and
                    more.
                  </p>
                  <button
                    onClick={handleExportData}
                    disabled={exporting}
                    className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2.5 px-5 rounded-lg transition-all disabled:opacity-50"
                  >
                    <Download className="w-4 h-4" />
                    {exporting ? 'Exporting...' : 'Export Data'}
                  </button>
                </div>

                <div className="border-t border-gray-200 pt-8">
                  <h2 className="text-lg font-semibold text-red-600 mb-2">Delete Account</h2>
                  <p className="text-gray-600 mb-4">
                    Permanently delete your account and all associated data. This action cannot be undone.
                  </p>
                  <button
                    onClick={() => setShowDeleteModal(true)}
                    className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 font-semibold py-2.5 px-5 rounded-lg transition-all border border-red-200"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete Account
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Delete Account</h3>
                <p className="text-gray-500 text-sm">This action is permanent</p>
              </div>
            </div>
            <div className="space-y-4">
              <p className="text-gray-600">
                This will permanently delete your account and all associated data including:
              </p>
              <ul className="text-sm text-gray-600 space-y-1 ml-4">
                <li>- Your profile information</li>
                <li>- All course enrollments and progress</li>
                <li>- Achievements and assessment results</li>
                <li>- Email preferences and history</li>
              </ul>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-sm text-yellow-800">
                  We recommend exporting your data before deleting your account.
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type <span className="font-bold text-red-600">DELETE</span> to confirm
                </label>
                <input
                  type="text"
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="DELETE"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteConfirmText('');
                }}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2.5 px-5 rounded-lg transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleteConfirmText !== 'DELETE' || deleting}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 px-5 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deleting ? 'Deleting...' : 'Delete Account'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
