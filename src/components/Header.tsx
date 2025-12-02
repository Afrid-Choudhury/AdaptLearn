import { Link } from 'react-router-dom';
import { Bot, Menu } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Header() {
  const { user } = useAuth();

  return (
    <header className="flex items-center justify-between py-6">
      <Link to="/" className="flex items-center gap-2">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
          <Bot className="w-5 h-5 text-white" />
        </div>
        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-100 to-white">
          AdaptLearn
        </span>
      </Link>

      <nav className="hidden md:flex items-center gap-4">
        {user ? (
          <Link
            to="/dashboard"
            className="px-5 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-all shadow-[0_0_15px_rgba(99,102,241,0.3)]"
          >
            Dashboard
          </Link>
        ) : (
          <>
            <Link
              to="/signin"
              className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              className="px-5 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-all shadow-[0_0_15px_rgba(99,102,241,0.3)]"
            >
              Get Started
            </Link>
          </>
        )}
      </nav>

      <button className="md:hidden text-gray-300">
        <Menu className="w-6 h-6" />
      </button>
    </header>
  );
}