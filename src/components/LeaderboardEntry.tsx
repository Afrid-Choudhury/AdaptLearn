import { Trophy, Award, Medal } from 'lucide-react';

interface LeaderboardEntryProps {
  rank: number;
  username: string;
  totalXp: number;
  courseCount: number;
  completedCourses: number;
  isCurrentUser?: boolean;
}

export default function LeaderboardEntry({
  rank,
  username,
  totalXp,
  courseCount,
  completedCourses,
  isCurrentUser = false
}: LeaderboardEntryProps) {
  const getRankIcon = () => {
    if (rank === 1) {
      return <Trophy className="w-6 h-6 text-yellow-500" />;
    }
    if (rank === 2) {
      return <Medal className="w-6 h-6 text-gray-400" />;
    }
    if (rank === 3) {
      return <Medal className="w-6 h-6 text-amber-700" />;
    }
    return null;
  };

  const getRankColor = () => {
    if (rank === 1) return 'text-yellow-600 font-bold';
    if (rank === 2) return 'text-gray-600 font-bold';
    if (rank === 3) return 'text-amber-700 font-bold';
    return 'text-gray-700';
  };

  const getBackgroundColor = () => {
    if (isCurrentUser) {
      return 'bg-blue-50 border-2 border-blue-500';
    }
    if (rank <= 3) {
      return 'bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200';
    }
    return 'bg-white border border-gray-200';
  };

  return (
    <div
      className={`
        ${getBackgroundColor()}
        rounded-xl p-4 transition-all hover:shadow-md
      `}
    >
      <div className="flex items-center gap-4">
        <div className={`w-12 flex items-center justify-center ${getRankColor()}`}>
          {getRankIcon() || <span className="text-xl font-bold">#{rank}</span>}
        </div>

        <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-lg font-bold text-white">
            {username[0]?.toUpperCase() || 'U'}
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-gray-900 truncate">
              {username}
              {isCurrentUser && (
                <span className="ml-2 text-xs font-normal text-blue-600">(You)</span>
              )}
            </h3>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-600 mt-1">
            <span>{courseCount} courses</span>
            {completedCourses > 0 && (
              <>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Award className="w-3 h-3" />
                  {completedCourses} completed
                </span>
              </>
            )}
          </div>
        </div>

        <div className="text-right">
          <div className="text-2xl font-bold text-blue-600">
            {totalXp.toLocaleString()}
          </div>
          <div className="text-xs text-gray-500">XP</div>
        </div>
      </div>
    </div>
  );
}
