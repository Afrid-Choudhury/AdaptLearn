import { ReactNode } from 'react';

type IconCircleColor = 'accent' | 'secondary' | 'tertiary' | 'quaternary';
type IconCircleSize = 'sm' | 'md' | 'lg';

interface IconCircleProps {
  color?: IconCircleColor;
  size?: IconCircleSize;
  bordered?: boolean;
  className?: string;
  children: ReactNode;
}

const colorClasses: Record<IconCircleColor, string> = {
  accent: 'bg-accent',
  secondary: 'bg-secondary',
  tertiary: 'bg-tertiary',
  quaternary: 'bg-quaternary',
};

const sizeClasses: Record<IconCircleSize, string> = {
  sm: 'w-10 h-10',
  md: 'w-14 h-14',
  lg: 'w-18 h-18',
};

export default function IconCircle({ color = 'accent', size = 'md', bordered = true, className = '', children }: IconCircleProps) {
  return (
    <div
      className={`${sizeClasses[size]} ${colorClasses[color]} rounded-full flex items-center justify-center text-white ${bordered ? 'border-2 border-foreground' : ''} ${className}`}
    >
      {children}
    </div>
  );
}
