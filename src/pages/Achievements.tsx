import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Award, Filter } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useAchievements } from '../hooks/useAchievements';
import AchievementCard from '../components/AchievementCard';

export default function Achievements() {
  const { user } = useAuth();
  const { achievements, loading, unlockedCount, totalCount } = useAchievements(user?.id);
  const [filter, setFilter] = useState<'all' | 'unlocked' | 'locked'>('all');

  const filteredAchievements = achievements.filter(achievement => {
    if (filter === 'unlocked') return achievement.unlocked;
    if (filter === 'locked') return !achievement.unlocked;
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading achievements...</p>
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
              <Award className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Achievements</h1>
              <p className="text-xl text-gray-600">
                {unlockedCount} of {totalCount} unlocked
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full h-3 overflow-hidden shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 transition-all duration-500"
              style={{ width: `${totalCount > 0 ? (unlockedCount / totalCount) * 100 : 0}%` }}
            />
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-600" />
            <div className="flex gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  filter === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                All ({totalCount})
              </button>
              <button
                onClick={() => setFilter('unlocked')}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  filter === 'unlocked'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                Unlocked ({unlockedCount})
              </button>
              <button
                onClick={() => setFilter('locked')}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  filter === 'locked'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                Locked ({totalCount - unlockedCount})
              </button>
            </div>
          </div>
        </div>

        {filteredAchievements.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <Award className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No achievements here</h3>
            <p className="text-gray-600">
              {filter === 'unlocked'
                ? 'Start learning to unlock your first achievement!'
                : 'All achievements have been unlocked!'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredAchievements.map((achievement) => (
              <AchievementCard
                key={achievement.id}
                name={achievement.name}
                description={achievement.description}
                icon={achievement.icon}
                unlocked={achievement.unlocked}
                unlockedAt={achievement.unlocked_at}
                criteriaType={achievement.criteria_type}
                criteriaValue={achievement.criteria_value}
                progress={achievement.progress}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
