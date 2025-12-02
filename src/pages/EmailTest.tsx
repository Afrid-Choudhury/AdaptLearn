import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  sendWelcomeEmail,
  sendAssessmentReminderEmail,
  sendAchievementEmail
} from '../lib/email-service';
import { Mail, CheckCircle, AlertCircle, Loader } from 'lucide-react';

export default function EmailTest() {
  const { user } = useAuth();
  const [loading, setLoading] = useState<string | null>(null);
  const [results, setResults] = useState<Record<string, { success: boolean; error?: string }>>({});

  const handleSendWelcome = async () => {
    if (!user?.email) return;

    setLoading('welcome');
    const username = user.user_metadata?.username || user.email.split('@')[0];
    const result = await sendWelcomeEmail(user.id, user.email, username);
    setResults(prev => ({ ...prev, welcome: result }));
    setLoading(null);
  };

  const handleSendAssessmentReminder = async () => {
    if (!user?.email) return;

    setLoading('assessment');
    const username = user.user_metadata?.username || user.email.split('@')[0];
    const result = await sendAssessmentReminderEmail(user.id, user.email, username);
    setResults(prev => ({ ...prev, assessment: result }));
    setLoading(null);
  };

  const handleSendAchievement = async () => {
    if (!user?.email) return;

    setLoading('achievement');
    const username = user.user_metadata?.username || user.email.split('@')[0];
    const result = await sendAchievementEmail(
      user.id,
      user.email,
      username,
      'Email Master',
      'Successfully tested the email notification system',
      '📧',
      5
    );
    setResults(prev => ({ ...prev, achievement: result }));
    setLoading(null);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <AlertCircle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Sign In Required</h1>
          <p className="text-gray-600">You must be signed in to test email functionality.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <Mail className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Email System Test</h1>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
            <p className="text-sm text-blue-900">
              <strong>Test User:</strong> {user.email}
            </p>
            <p className="text-sm text-blue-700 mt-1">
              Click the buttons below to send test emails to your inbox.
            </p>
          </div>

          <div className="space-y-4">
            <EmailTestButton
              title="Welcome Email"
              description="Test the account creation welcome email"
              onClick={handleSendWelcome}
              loading={loading === 'welcome'}
              result={results.welcome}
            />

            <EmailTestButton
              title="Assessment Reminder"
              description="Test the skill assessment reminder email"
              onClick={handleSendAssessmentReminder}
              loading={loading === 'assessment'}
              result={results.assessment}
            />

            <EmailTestButton
              title="Achievement Unlocked"
              description="Test the achievement notification email"
              onClick={handleSendAchievement}
              loading={loading === 'achievement'}
              result={results.achievement}
            />
          </div>

          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">Notes:</h3>
            <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
              <li>Emails are sent via Resend API using your configured API key</li>
              <li>Check your inbox (and spam folder) for test emails</li>
              <li>Email logs are stored in the database for tracking</li>
              <li>From address: AdaptLearn &lt;onboarding@resend.dev&gt;</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

interface EmailTestButtonProps {
  title: string;
  description: string;
  onClick: () => void;
  loading: boolean;
  result?: { success: boolean; error?: string };
}

function EmailTestButton({ title, description, onClick, loading, result }: EmailTestButtonProps) {
  return (
    <div className="border border-gray-200 rounded-lg p-6 hover:border-blue-300 transition-all">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>

          {result && (
            <div className={`mt-3 flex items-center gap-2 text-sm ${
              result.success ? 'text-green-700' : 'text-red-700'
            }`}>
              {result.success ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span>Email sent successfully!</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-4 h-4" />
                  <span>Failed: {result.error}</span>
                </>
              )}
            </div>
          )}
        </div>

        <button
          onClick={onClick}
          disabled={loading}
          className="ml-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {loading ? (
            <>
              <Loader className="w-4 h-4 animate-spin" />
              Sending...
            </>
          ) : (
            'Send Test'
          )}
        </button>
      </div>
    </div>
  );
}
