import { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';

interface XPNotificationProps {
  xpAmount: number;
  onComplete?: () => void;
}

export default function XPNotification({ xpAmount, onComplete }: XPNotificationProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);

    const timer = setTimeout(() => {
      setVisible(false);
      if (onComplete) {
        setTimeout(onComplete, 300);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div
      className={`
        fixed top-24 right-8 z-50 transition-all duration-300 transform
        ${visible ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'}
      `}
    >
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 min-w-[200px]">
        <div className="relative">
          <Sparkles className="w-8 h-8 text-yellow-300" />
          <div className="absolute inset-0 animate-ping">
            <Sparkles className="w-8 h-8 text-yellow-300 opacity-50" />
          </div>
        </div>
        <div>
          <div className="text-sm text-blue-100">XP Earned</div>
          <div className="text-2xl font-bold">+{xpAmount}</div>
        </div>
      </div>
    </div>
  );
}
