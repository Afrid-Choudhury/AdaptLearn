import { CheckCircle2, Lock } from 'lucide-react';

interface AchievementBadgeProps {
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  size?: 'small' | 'medium' | 'large';
}

export default function AchievementBadge({
  name,
  description,
  icon,
  unlocked,
  unlockedAt,
  size = 'medium'
}: AchievementBadgeProps) {
  const sizeClasses = {
    small: 'w-16 h-16 text-2xl',
    medium: 'w-24 h-24 text-4xl',
    large: 'w-32 h-32 text-5xl'
  };

  const badgeSize = sizeClasses[size];

  return (
    <div className={`group relative flex flex-col items-center ${unlocked ? '' : 'opacity-50'}`}>
      <div
        className={`
          ${badgeSize}
          rounded-full
          flex items-center justify-center
          transition-all duration-300
          ${unlocked
            ? 'bg-gradient-to-br from-yellow-400 via-orange-400 to-yellow-500 shadow-lg hover:shadow-xl hover:scale-110'
            : 'bg-gray-300 border-2 border-gray-400 hover:border-gray-500'
          }
        `}
      >
        <span className="relative">
          {icon}
          {!unlocked && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-600/80 rounded-full">
              <Lock className="w-6 h-6 text-gray-200" />
            </div>
          )}
        </span>
      </div>

      {unlocked && (
        <div className="absolute -top-1 -right-1 bg-green-600 rounded-full p-1">
          <CheckCircle2 className="w-4 h-4 text-white" />
        </div>
      )}

      <div className="mt-2 text-center">
        <div className={`text-sm font-bold ${unlocked ? 'text-gray-900' : 'text-gray-600'}`}>
          {name}
        </div>
        {unlocked && unlockedAt && (
          <div className="text-xs text-gray-900 font-medium mt-0.5">
            {new Date(unlockedAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric'
            })}
          </div>
        )}
      </div>

      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
        <div className="bg-gray-900 text-white px-3 py-2 rounded-lg shadow-xl text-center min-w-[200px]">
          <div className="font-semibold text-sm mb-1">{name}</div>
          <div className="text-xs text-gray-300 mb-1">{description}</div>
          {unlocked && unlockedAt && (
            <div className="text-xs text-green-400 mt-1">
              Unlocked {new Date(unlockedAt).toLocaleDateString()}
            </div>
          )}
          {!unlocked && (
            <div className="text-xs text-gray-400 mt-1">
              Not yet unlocked
            </div>
          )}
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1">
            <div className="border-4 border-transparent border-t-gray-900"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
