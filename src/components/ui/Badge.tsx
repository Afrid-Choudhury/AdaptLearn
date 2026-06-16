import { ReactNode } from 'react';

type BadgeColor = 'accent' | 'secondary' | 'tertiary' | 'quaternary';

interface BadgeProps {
  color?: BadgeColor;
  className?: string;
  children: ReactNode;
}

const colorClasses: Record<BadgeColor, string> = {
  accent: 'bg-accent/10 text-accent border-accent',
  secondary: 'bg-secondary/10 text-pink-700 border-secondary',
  tertiary: 'bg-tertiary/10 text-amber-700 border-tertiary',
  quaternary: 'bg-quaternary/10 text-emerald-700 border-quaternary',
};

export default function Badge({ color = 'accent', className = '', children }: BadgeProps) {
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-bold border-2 ${colorClasses[color]} ${className}`}>
      {children}
    </span>
  );
}
