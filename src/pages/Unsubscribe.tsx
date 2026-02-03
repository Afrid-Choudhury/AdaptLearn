import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { BookOpen, Mail, CheckCircle, AlertCircle, Settings } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Preferences {
  email_achievements: boolean;
  email_assessment_reminder: boolean;
  email_course_updates: boolean;
  email_weekly_digest: boolean;
}

export default function Unsubscribe() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const type = searchParams.get('type');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [unsubscribeAll, setUnsubscribeAll] = useState(false);
  const [preferences, setPreferences] = useState<Preferences | null>(null);

  useEffect(() => {
    if (!token) {
      setError('Invalid unsubscribe link. Please check the link in your email.');
      setLoading(false);
      return;
    }

    fetchPreferences();
  }, [token]);

  const fetchPreferences = async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from('user_notification_preferences')
        .select('email_achievements, email_assessment_reminder, email_course_updates, email_weekly_digest')
        .eq('unsubscribe_token', token)
        .maybeSingle();

      if (fetchError) throw fetchError;

      if (!data) {
        setError('Invalid or expired unsubscribe link.');
        setLoading(false);
        return;
      }

      setPreferences({
        email_achievements: data.email_achievements ?? true,
        email_assessment_reminder: data.email_assessment_reminder ?? true,
        email_course_updates: data.email_course_updates ?? true,
        email_weekly_digest: data.email_weekly_digest ?? false,
      });

      if (type === 'all') {
        setUnsubscribeAll(true);
      }
    } catch (err) {
      setError('Failed to load preferences. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUnsubscribe = async () => {
    if (!token) return;

    setSaving(true);
    setError(null);

    try {
      const updates = unsubscribeAll
        ? {
            email_achievements: false,
            email_assessment_reminder: false,
            email_course_updates: false,
            email_weekly_digest: false,
            updated_at: new Date().toISOString(),
          }
        : {
            ...preferences,
            updated_at: new Date().toISOString(),
          };

      const { error: updateError } = await supabase
        .from('user_notification_preferences')
        .update(updates)
        .eq('unsubscribe_token', token);

      if (updateError) throw updateError;

      setSuccess(true);
    } catch (err) {
      setError('Failed to update preferences. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error && !preferences) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 text-2xl font-bold text-blue-600 mb-2">
              <BookOpen className="w-8 h-8" />
              AdaptLearn
            </Link>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Invalid Link</h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <Link
              to="/"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all"
            >
              Go to Homepage
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 text-2xl font-bold text-blue-600 mb-2">
              <BookOpen className="w-8 h-8" />
              AdaptLearn
            </Link>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Preferences Updated</h1>
            <p className="text-gray-600 mb-6">
              {unsubscribeAll
                ? "You've been unsubscribed from all marketing emails. You'll still receive important account-related emails."
                : 'Your email preferences have been updated successfully.'}
            </p>
            <div className="space-y-3">
              <Link
                to="/signin"
                className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all"
              >
                Sign In to Manage All Settings
              </Link>
              <Link
                to="/"
                className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-all"
              >
                Go to Homepage
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-2xl font-bold text-blue-600 mb-2">
            <BookOpen className="w-8 h-8" />
            AdaptLearn
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Email Preferences</h1>
          <p className="text-gray-600">Manage which emails you receive from us</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4 mb-6">
            <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900">Unsubscribe from all</p>
                  <p className="text-sm text-gray-500">Stop receiving all marketing emails</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={unsubscribeAll}
                onChange={(e) => setUnsubscribeAll(e.target.checked)}
                className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
              />
            </label>
          </div>

          {!unsubscribeAll && preferences && (
            <div className="space-y-4 mb-6">
              <p className="text-sm font-medium text-gray-700">Or customize your preferences:</p>
              <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                <div>
                  <p className="font-medium text-gray-900">Achievement Notifications</p>
                  <p className="text-sm text-gray-500">When you unlock new achievements</p>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.email_achievements}
                  onChange={(e) => setPreferences({ ...preferences, email_achievements: e.target.checked })}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                />
              </label>
              <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                <div>
                  <p className="font-medium text-gray-900">Assessment Reminders</p>
                  <p className="text-sm text-gray-500">Reminders to complete assessments</p>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.email_assessment_reminder}
                  onChange={(e) => setPreferences({ ...preferences, email_assessment_reminder: e.target.checked })}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                />
              </label>
              <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                <div>
                  <p className="font-medium text-gray-900">Course Updates</p>
                  <p className="text-sm text-gray-500">Updates about your enrolled courses</p>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.email_course_updates}
                  onChange={(e) => setPreferences({ ...preferences, email_course_updates: e.target.checked })}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                />
              </label>
              <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                <div>
                  <p className="font-medium text-gray-900">Weekly Digest</p>
                  <p className="text-sm text-gray-500">Weekly summary of your progress</p>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.email_weekly_digest}
                  onChange={(e) => setPreferences({ ...preferences, email_weekly_digest: e.target.checked })}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                />
              </label>
            </div>
          )}

          <button
            onClick={handleUnsubscribe}
            disabled={saving}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Saving...' : 'Save Preferences'}
          </button>

          <div className="mt-6 text-center">
            <Link to="/signin" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm">
              <Settings className="w-4 h-4" />
              Sign in for more settings
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
