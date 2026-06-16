import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Lock, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import FloatingShapes from '../components/decorations/FloatingShapes';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [validSession, setValidSession] = useState<boolean | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setValidSession(true);
      } else {
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get('access_token');
        const type = hashParams.get('type');

        if (accessToken && type === 'recovery') {
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: hashParams.get('refresh_token') || '',
          });
          if (error) {
            setValidSession(false);
          } else {
            setValidSession(true);
            window.history.replaceState(null, '', window.location.pathname);
          }
        } else {
          setValidSession(false);
        }
      }
    };

    checkSession();
  }, []);

  const validatePassword = (pass: string): string[] => {
    const errors: string[] = [];
    if (pass.length < 8) errors.push('At least 8 characters');
    if (!/[A-Z]/.test(pass)) errors.push('One uppercase letter');
    if (!/[a-z]/.test(pass)) errors.push('One lowercase letter');
    if (!/[0-9]/.test(pass)) errors.push('One number');
    return errors;
  };

  const passwordErrors = validatePassword(password);
  const passwordsMatch = password === confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (passwordErrors.length > 0) {
      setError('Please meet all password requirements');
      return;
    }

    if (!passwordsMatch) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: password,
      });

      if (updateError) throw updateError;
      setSuccess(true);
      setTimeout(() => navigate('/signin'), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  if (validSession === null) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="w-10 h-10 border-3 border-accent border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (validSession === false) {
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
            <div className="w-16 h-16 bg-red-50 rounded-full border-2 border-red-400 flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-8 h-8 text-red-500" strokeWidth={2.5} />
            </div>
            <h1 className="font-heading text-2xl font-bold text-foreground mb-4">Invalid or Expired Link</h1>
            <p className="text-slate-600 font-body mb-6">
              This password reset link is invalid or has expired. Please request a new one.
            </p>
            <Link
              to="/forgot-password"
              className="inline-block px-6 py-3 rounded-full font-bold text-white bg-accent border-2 border-foreground shadow-pop hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-pop-hover active:translate-x-0.5 active:translate-y-0.5 active:shadow-pop-active transition-all duration-300 ease-bounce"
            >
              Request New Link
            </Link>
          </div>
        </div>
      </div>
    );
  }

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
            <h1 className="font-heading text-2xl font-bold text-foreground mb-4">Password Reset Successfully</h1>
            <p className="text-slate-600 font-body mb-6">
              Your password has been updated. Redirecting you to sign in...
            </p>
            <Link
              to="/signin"
              className="text-accent hover:text-accent-dark font-bold transition-colors"
            >
              Sign in now
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4 relative overflow-hidden">
      <FloatingShapes variant="minimal" />

      <div aria-hidden="true" className="absolute top-1/3 -right-16 w-48 h-48 bg-accent/10 rounded-full hidden md:block" />

      <div className="max-w-md w-full relative z-10">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-accent rounded-full border-2 border-foreground flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-2xl font-heading font-bold text-foreground">AdaptLearn</span>
          </Link>
          <h1 className="font-heading text-3xl font-bold text-foreground mb-2">Create New Password</h1>
          <p className="text-slate-500 font-body">Enter your new password below</p>
        </div>

        <div className="bg-white border-2 border-foreground rounded-xl shadow-pop p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-50 border-2 border-red-400 text-red-700 px-4 py-3 rounded-lg text-sm font-medium">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="password" className="block text-xs font-bold uppercase tracking-widest text-foreground mb-1.5">
                New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" strokeWidth={2.5} />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-12 py-3 bg-white border-2 border-slate-300 rounded-lg text-foreground placeholder:text-slate-400 transition-all duration-200 focus:outline-none focus:border-accent focus:shadow-[4px_4px_0px_0px_#8B5CF6]"
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" strokeWidth={2.5} /> : <Eye className="w-5 h-5" strokeWidth={2.5} />}
                </button>
              </div>
              {password && (
                <div className="mt-2 space-y-1">
                  {['At least 8 characters', 'One uppercase letter', 'One lowercase letter', 'One number'].map((req) => (
                    <div
                      key={req}
                      className={`text-sm flex items-center gap-2 font-medium ${
                        !passwordErrors.includes(req) ? 'text-quaternary' : 'text-slate-400'
                      }`}
                    >
                      <CheckCircle className="w-4 h-4" strokeWidth={2.5} />
                      {req}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-xs font-bold uppercase tracking-widest text-foreground mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" strokeWidth={2.5} />
                <input
                  id="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-white border-2 border-slate-300 rounded-lg text-foreground placeholder:text-slate-400 transition-all duration-200 focus:outline-none focus:border-accent focus:shadow-[4px_4px_0px_0px_#8B5CF6]"
                  placeholder="Confirm new password"
                />
              </div>
              {confirmPassword && (
                <div className={`mt-2 text-sm flex items-center gap-2 font-medium ${passwordsMatch ? 'text-quaternary' : 'text-red-500'}`}>
                  <CheckCircle className="w-4 h-4" strokeWidth={2.5} />
                  {passwordsMatch ? 'Passwords match' : 'Passwords do not match'}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || passwordErrors.length > 0 || !passwordsMatch}
              className="w-full px-6 py-3 rounded-full font-bold text-white bg-accent border-2 border-foreground shadow-pop hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-pop-hover active:translate-x-0.5 active:translate-y-0.5 active:shadow-pop-active transition-all duration-300 ease-bounce disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-pop"
            >
              {loading ? 'Updating...' : 'Reset Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
