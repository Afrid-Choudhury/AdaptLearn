import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Menu, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface NavbarProps {
  variant?: 'public' | 'authenticated';
}

export default function Navbar({ variant = 'public' }: NavbarProps) {
  const { user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="bg-cream border-b-2 border-foreground sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-accent rounded-full border-2 border-foreground flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-xl font-heading font-bold text-foreground">AdaptLearn</span>
          </Link>

          <div className="hidden md:flex items-center gap-3">
            {variant === 'public' && !user && (
              <>
                <Link
                  to="/signin"
                  className="px-5 py-2 rounded-full font-bold text-foreground border-2 border-transparent hover:bg-slate-100 transition-all duration-300"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="px-5 py-2 rounded-full font-bold text-white bg-accent border-2 border-foreground shadow-pop hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-pop-hover active:translate-x-0.5 active:translate-y-0.5 active:shadow-pop-active transition-all duration-300 ease-bounce"
                >
                  Get Started
                </Link>
              </>
            )}
            {(variant === 'public' && user) && (
              <Link
                to="/dashboard"
                className="px-5 py-2 rounded-full font-bold text-white bg-accent border-2 border-foreground shadow-pop hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-pop-hover active:translate-x-0.5 active:translate-y-0.5 active:shadow-pop-active transition-all duration-300 ease-bounce"
              >
                Dashboard
              </Link>
            )}
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden w-10 h-10 flex items-center justify-center rounded-full border-2 border-foreground hover:bg-tertiary transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" strokeWidth={2.5} /> : <Menu className="w-5 h-5" strokeWidth={2.5} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t-2 border-foreground bg-cream px-4 py-4 space-y-3">
          {variant === 'public' && !user && (
            <>
              <Link
                to="/signin"
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-3 rounded-lg font-bold text-foreground hover:bg-slate-100 transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-3 rounded-full font-bold text-white bg-accent border-2 border-foreground shadow-pop text-center"
              >
                Get Started
              </Link>
            </>
          )}
          {(variant === 'public' && user) && (
            <Link
              to="/dashboard"
              onClick={() => setMobileOpen(false)}
              className="block px-4 py-3 rounded-full font-bold text-white bg-accent border-2 border-foreground shadow-pop text-center"
            >
              Dashboard
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
