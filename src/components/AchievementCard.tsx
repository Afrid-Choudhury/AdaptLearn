import { CheckCircle2, Lock, Calendar } from 'lucide-react';

interface AchievementCardProps {
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  criteriaType: string;
  criteriaValue: any;
  progress?: number;
}

export default function AchievementCard({
  name,
  description,
  icon,
  unlocked,
  unlockedAt,
  criteriaType,
  criteriaValue,
  progress = 0
}: AchievementCardProps) {
  const getCriteriaDescription = () => {
    if (criteriaType === 'enrollment') {
      const count = criteriaValue?.count || 1;
      return `Enroll in ${count} course${count > 1 ? 's' : ''}`;
    }
    if (criteriaType === 'completion') {
      if (criteriaValue?.threshold) {
        return `Reach ${criteriaValue.threshold}% progress in a course`;
      }
      const count = criteriaValue?.count || 1;
      return `Complete ${count} course${count > 1 ? 's' : ''}`;
    }
    if (criteriaType === 'assessment_score') {
      if (criteriaValue?.type === 'first') {
        return 'Complete your first assessment';
      }
      return `Score ${criteriaValue?.threshold || 90}% or higher on an assessment`;
    }
    return 'Complete the required task';
  };

  return (
    <div
      className={`
        relative overflow-hidden rounded-xl p-6 transition-all duration-300
        ${unlocked
          ? 'bg-gradient-to-br from-yellow-500/10 via-orange-500/10 to-yellow-500/10 border-2 border-yellow-500/30 hover:border-yellow-500/50 hover:shadow-lg hover:shadow-yellow-500/20'
          : 'bg-gray-800/50 border-2 border-gray-700 hover:border-gray-600'
        }
      `}
    >
      <div className="flex items-start gap-4">
        <div
          className={`
            w-16 h-16 rounded-full flex items-center justify-center text-3xl flex-shrink-0 transition-all
            ${unlocked
              ? 'bg-gradient-to-br from-yellow-400 via-orange-400 to-yellow-500 shadow-lg'
              : 'bg-gray-700 border-2 border-gray-600'
            }
          `}
        >
          <span className="relative">
            {icon}
            {!unlocked && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-900/70 rounded-full">
                <Lock className="w-5 h-5 text-gray-400" />
              </div>
            )}
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className={`font-semibold text-lg ${unlocked ? 'text-white' : 'text-gray-300'}`}>
              {name}
            </h3>
            {unlocked && (
              <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0" />
            )}
          </div>

          <p className={`text-sm mb-3 ${unlocked ? 'text-gray-300' : 'text-gray-400'}`}>
            {description}
          </p>

          <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
            <span className="px-2 py-1 bg-gray-700/50 rounded">
              {getCriteriaDescription()}
            </span>
          </div>

          {unlocked && unlockedAt && (
            <div className="flex items-center gap-2 text-sm text-green-400">
              <Calendar className="w-4 h-4" />
              <span>
                Unlocked on {new Date(unlockedAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </span>
            </div>
          )}

          {!unlocked && progress > 0 && (
            <div className="mt-3">
              <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                <span>Progress</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-500"
                  style={{ width: `${Math.min(progress, 100)}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {unlocked && (
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-500/10 to-transparent rounded-bl-full" />
      )}
    </div>
  );
}
