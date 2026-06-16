import { Link } from 'react-router-dom';
import { ReactNode, ButtonHTMLAttributes } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonBaseProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
  className?: string;
}

interface ButtonAsButton extends ButtonBaseProps, Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'children'> {
  href?: never;
}

interface ButtonAsLink extends ButtonBaseProps {
  href: string;
  disabled?: boolean;
  type?: never;
  onClick?: never;
}

type ButtonProps = ButtonAsButton | ButtonAsLink;

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
};

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-accent text-white font-bold border-2 border-foreground shadow-pop hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-pop-hover active:translate-x-0.5 active:translate-y-0.5 active:shadow-pop-active',
  secondary:
    'bg-transparent text-foreground font-bold border-2 border-foreground hover:bg-tertiary',
  ghost:
    'bg-transparent text-foreground font-medium hover:bg-slate-100',
};

export default function Button({ variant = 'primary', size = 'md', children, className = '', ...props }: ButtonProps) {
  const classes = `inline-flex items-center justify-center gap-2 rounded-full transition-all duration-300 ease-bounce ${variantClasses[variant]} ${sizeClasses[size]} disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-pop ${className}`;

  if ('href' in props && props.href) {
    return (
      <Link to={props.href} className={classes}>
        {children}
      </Link>
    );
  }

  const { href, ...buttonProps } = props as ButtonAsButton;
  return (
    <button className={classes} {...buttonProps}>
      {children}
    </button>
  );
}
