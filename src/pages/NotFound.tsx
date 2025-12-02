import { Link } from 'react-router-dom';
import { Home, Search, BookOpen } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background text-white flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 mb-4">
            404
          </h1>
          <h2 className="text-3xl font-bold text-white mb-2">
            Page Not Found
          </h2>
          <p className="text-xl text-gray-400">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="bg-surface rounded-2xl shadow-xl border border-gray-800 p-8 mb-8">
          <h3 className="text-lg font-semibold text-white mb-4">
            Here are some helpful links instead:
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to="/"
              className="flex flex-col items-center gap-3 p-6 bg-blue-900/20 border border-blue-800/50 rounded-xl hover:shadow-lg hover:shadow-blue-900/20 hover:-translate-y-1 transition-all"
            >
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                <Home className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="font-semibold text-white">Home</div>
                <div className="text-sm text-gray-400">Return to homepage</div>
              </div>
            </Link>

            <Link
              to="/courses"
              className="flex flex-col items-center gap-3 p-6 bg-green-900/20 border border-green-800/50 rounded-xl hover:shadow-lg hover:shadow-green-900/20 hover:-translate-y-1 transition-all"
            >
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="font-semibold text-white">Courses</div>
                <div className="text-sm text-gray-400">Browse courses</div>
              </div>
            </Link>

            <Link
              to="/dashboard"
              className="flex flex-col items-center gap-3 p-6 bg-purple-900/20 border border-purple-800/50 rounded-xl hover:shadow-lg hover:shadow-purple-900/20 hover:-translate-y-1 transition-all"
            >
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
                <Search className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="font-semibold text-white">Dashboard</div>
                <div className="text-sm text-gray-400">Your learning hub</div>
              </div>
            </Link>
          </div>
        </div>

        <div className="text-gray-500 text-sm">
          If you believe this is an error, please contact support.
        </div>
      </div>
    </div>
  );
}
