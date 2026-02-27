import { Link } from 'react-router-dom';
import { BookOpen, Trophy, TrendingUp, Award } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLeaderboard } from '../hooks/useLeaderboard';
import LeaderboardEntry from '../components/LeaderboardEntry';

export default function Leaderboard() {
  const { user } = useAuth();
  const { leaderboard, userRank, loading } = useLeaderboard(user?.id, 100);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center gap-2 text-xl font-bold text-blue-600">
              <BookOpen className="w-7 h-7" />
              AdaptLearn
            </Link>
            <Link
              to="/dashboard"
              className="text-gray-700 hover:text-blue-600 font-semibold transition-colors"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 via-orange-400 to-yellow-500 rounded-full flex items-center justify-center shadow-lg">
              <Trophy className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Leaderboard</h1>
              <p className="text-xl text-gray-600">Top learners ranked by total XP</p>
            </div>
          </div>
        </div>

        {userRank && (
          <div className="mb-8 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl shadow-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <div>
                  <div className="text-sm text-blue-100 mb-1">Your Rank</div>
                  <div className="text-4xl font-bold">#{userRank.rank}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-blue-100 mb-1">Total XP</div>
                <div className="text-4xl font-bold">{userRank.total_xp.toLocaleString()}</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-blue-100 mb-1">Courses</div>
                <div className="flex items-center gap-2">
                  <div className="text-2xl font-bold">{userRank.course_count}</div>
                  {userRank.completed_courses > 0 && (
                    <div className="flex items-center gap-1 text-sm">
                      <Award className="w-4 h-4" />
                      <span>{userRank.completed_courses} completed</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-6 bg-gradient-to-r from-gray-50 to-white border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">Top 100 Learners</h2>
            <p className="text-gray-600 mt-1">See how you compare to other students</p>
          </div>

          {leaderboard.length === 0 ? (
            <div className="p-12 text-center">
              <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">No rankings yet</h3>
              <p className="text-gray-600 mb-6">
                Start learning and earning XP to appear on the leaderboard!
              </p>
              <Link
                to="/courses"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Browse Courses
              </Link>
            </div>
          ) : (
            <div className="p-6 space-y-3">
              {leaderboard.map((entry) => (
                <LeaderboardEntry
                  key={entry.user_id}
                  rank={entry.rank}
                  username={entry.username}
                  totalXp={entry.total_xp}
                  courseCount={entry.course_count}
                  completedCourses={entry.completed_courses}
                  isCurrentUser={entry.user_id === user?.id}
                />
              ))}
            </div>
          )}
        </div>

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-blue-600" />
            How to Earn XP
          </h3>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">•</span>
              <span>Complete lessons and exercises to earn XP rewards</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">•</span>
              <span>Each lesson has different XP values based on difficulty</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">•</span>
              <span>Complete courses to unlock achievements and bonus XP</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">•</span>
              <span>Climb the leaderboard by consistently learning and practicing</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
