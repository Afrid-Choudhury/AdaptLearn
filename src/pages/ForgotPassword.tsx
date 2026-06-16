import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import FloatingShapes from '../components/decorations/FloatingShapes';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (resetError) throw resetError;
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center px-4 relative overflow-hidden">
        <FloatingShapes variant="minimal" />
        <div className="max-w-md w-full relative z-10">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-accent rounded-full border-2 border-foreground flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" strokeWidth={2.5} />
              </div>
              <span className="text-2xl font-heading font-bold text-foreground">AdaptLearn</span>
            </Link>
          </div>

          <div className="bg-white border-2 border-foreground rounded-xl shadow-pop p-8 text-center">
            <div className="w-16 h-16 bg-quaternary/20 rounded-full border-2 border-foreground flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-quaternary" strokeWidth={2.5} />
            </div>
            <h1 className="font-heading text-2xl font-bold text-foreground mb-4">Check Your Email</h1>
            <p className="text-slate-600 font-body mb-6">
              We've sent a password reset link to <strong className="text-foreground">{email}</strong>.
              Click the link in the email to reset your password.
            </p>
            <p className="text-sm text-slate-400 font-body mb-6">
              The link will expire in 1 hour. If you don't see the email, check your spam folder.
            </p>
            <Link
              to="/signin"
              className="inline-flex items-center gap-2 text-accent hover:text-accent-dark font-bold transition-colors"
            >
              <ArrowLeft className="w-4 h-4" strokeWidth={2.5} />
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4 relative overflow-hidden">
      <FloatingShapes variant="minimal" />

      <div aria-hidden="true" className="absolute bottom-1/4 -left-16 w-48 h-48 bg-tertiary/10 rounded-full hidden md:block" />

      <div className="max-w-md w-full relative z-10">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-accent rounded-full border-2 border-foreground flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-2xl font-heading font-bold text-foreground">AdaptLearn</span>
          </Link>
          <h1 className="font-heading text-3xl font-bold text-foreground mb-2">Reset Password</h1>
          <p className="text-slate-500 font-body">Enter your email to receive a reset link</p>
        </div>

        <div className="bg-white border-2 border-foreground rounded-xl shadow-pop p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-50 border-2 border-red-400 text-red-700 px-4 py-3 rounded-lg text-sm font-medium">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-xs font-bold uppercase tracking-widest text-foreground mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" strokeWidth={2.5} />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-white border-2 border-slate-300 rounded-lg text-foreground placeholder:text-slate-400 transition-all duration-200 focus:outline-none focus:border-accent focus:shadow-[4px_4px_0px_0px_#8B5CF6]"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 rounded-full font-bold text-white bg-accent border-2 border-foreground shadow-pop hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-pop-hover active:translate-x-0.5 active:translate-y-0.5 active:shadow-pop-active transition-all duration-300 ease-bounce disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-pop"
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              to="/signin"
              className="inline-flex items-center gap-2 text-slate-500 hover:text-accent font-semibold transition-colors"
            >
              <ArrowLeft className="w-4 h-4" strokeWidth={2.5} />
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
