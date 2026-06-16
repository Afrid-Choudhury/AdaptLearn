import { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export default function Input({ label, className = '', id, ...props }: InputProps) {
  return (
    <div>
      {label && (
        <label htmlFor={id} className="block text-xs font-bold uppercase tracking-widest text-foreground mb-1.5">
          {label}
        </label>
      )}
      <input
        id={id}
        className={`w-full px-4 py-3 bg-white border-2 border-slate-300 rounded-lg text-foreground placeholder:text-slate-400 transition-all duration-200 focus:outline-none focus:border-accent focus:shadow-[4px_4px_0px_0px_#8B5CF6] ${className}`}
        {...props}
      />
    </div>
  );
}
