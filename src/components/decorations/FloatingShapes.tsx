type FloatingShapesVariant = 'hero' | 'section' | 'minimal';

interface FloatingShapesProps {
  variant?: FloatingShapesVariant;
}

export default function FloatingShapes({ variant = 'hero' }: FloatingShapesProps) {
  if (variant === 'minimal') {
    return (
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden hidden md:block">
        <div className="absolute -top-8 -right-8 w-32 h-32 bg-tertiary/20 rounded-full animate-float-slow" />
        <div className="absolute bottom-12 -left-6 w-20 h-20 bg-secondary/20 rounded-full animate-float-slower" />
      </div>
    );
  }

  if (variant === 'section') {
    return (
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden hidden md:block">
        <div className="absolute top-12 right-12 w-16 h-16 bg-tertiary/30 rounded-full animate-float" />
        <div className="absolute bottom-8 left-8 w-12 h-12 bg-quaternary/30 rounded-full animate-float-slow" />
        <svg className="absolute top-1/3 left-6 w-8 h-8 text-secondary/30 animate-float-slower" viewBox="0 0 24 24" fill="currentColor">
          <polygon points="12,2 22,22 2,22" />
        </svg>
      </div>
    );
  }

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden hidden md:block">
      <div className="absolute top-20 left-[8%] w-24 h-24 bg-tertiary/25 rounded-full animate-float" />
      <div className="absolute top-40 right-[10%] w-16 h-16 bg-secondary/25 rounded-full animate-float-slow" />
      <div className="absolute bottom-32 left-[15%] w-12 h-12 bg-quaternary/25 rounded-full animate-float-slower" />
      <div className="absolute bottom-20 right-[20%] w-20 h-20 bg-accent/15 rounded-full animate-float" />
      <svg className="absolute top-32 right-[30%] w-10 h-10 text-tertiary/40 animate-float-slow" viewBox="0 0 24 24" fill="currentColor">
        <polygon points="12,2 22,22 2,22" />
      </svg>
      <svg className="absolute bottom-48 left-[35%] w-8 h-8 text-secondary/30 animate-float-slower" viewBox="0 0 24 24" fill="currentColor">
        <rect x="3" y="3" width="18" height="18" rx="2" />
      </svg>
      <div className="absolute top-1/2 left-[5%] w-6 h-6 border-2 border-accent/30 rounded-full animate-float" />
      <div className="absolute top-1/3 right-[5%] w-8 h-8 border-2 border-tertiary/30 rotate-45 animate-float-slower" />
    </div>
  );
}
