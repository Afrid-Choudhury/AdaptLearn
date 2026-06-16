import { ReactNode } from 'react';

type CardVariant = 'default' | 'featured' | 'flat';

interface CardProps {
  variant?: CardVariant;
  hoverEffect?: boolean;
  className?: string;
  children: ReactNode;
}

const variantClasses: Record<CardVariant, string> = {
  default: 'bg-white border-2 border-foreground rounded-xl shadow-pop-soft',
  featured: 'bg-white border-2 border-foreground rounded-xl shadow-pop-pink',
  flat: 'bg-white rounded-xl',
};

export default function Card({ variant = 'default', hoverEffect = false, className = '', children }: CardProps) {
  const hoverClasses = hoverEffect
    ? 'hover:-rotate-1 hover:scale-[1.02] transition-transform duration-300 ease-bounce cursor-pointer'
    : '';

  return (
    <div className={`${variantClasses[variant]} ${hoverClasses} ${className}`}>
      {children}
    </div>
  );
}
