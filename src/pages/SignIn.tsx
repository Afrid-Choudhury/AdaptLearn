import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { BookOpen } from 'lucide-react';
import FloatingShapes from '../components/decorations/FloatingShapes';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error: signInError } = await signIn(email, password);

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4 relative overflow-hidden">
      <FloatingShapes variant="minimal" />

      <div aria-hidden="true" className="absolute top-1/4 -left-20 w-64 h-64 bg-tertiary/10 rounded-full hidden md:block" />
      <div aria-hidden="true" className="absolute bottom-1/4 -right-16 w-48 h-48 bg-accent/10 rounded-full hidden md:block" />

      <div className="max-w-md w-full relative z-10">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-accent rounded-full border-2 border-foreground flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-2xl font-heading font-bold text-foreground">AdaptLearn</span>
          </Link>
          <h1 className="font-heading text-3xl font-bold text-foreground mb-2">Welcome Back</h1>
          <p className="text-slate-500 font-body">Sign in to continue your learning journey</p>
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
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-white border-2 border-slate-300 rounded-lg text-foreground placeholder:text-slate-400 transition-all duration-200 focus:outline-none focus:border-accent focus:shadow-[4px_4px_0px_0px_#8B5CF6]"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="block text-xs font-bold uppercase tracking-widest text-foreground">
                  Password
                </label>
                <Link to="/forgot-password" className="text-sm text-accent hover:text-accent-dark font-semibold transition-colors">
                  Forgot password?
                </Link>
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-white border-2 border-slate-300 rounded-lg text-foreground placeholder:text-slate-400 transition-all duration-200 focus:outline-none focus:border-accent focus:shadow-[4px_4px_0px_0px_#8B5CF6]"
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 rounded-full font-bold text-white bg-accent border-2 border-foreground shadow-pop hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-pop-hover active:translate-x-0.5 active:translate-y-0.5 active:shadow-pop-active transition-all duration-300 ease-bounce disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-pop"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-slate-500 font-body">
              Don't have an account?{' '}
              <Link to="/signup" className="text-accent hover:text-accent-dark font-bold transition-colors">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
