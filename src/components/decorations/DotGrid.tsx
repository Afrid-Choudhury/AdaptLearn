interface DotGridProps {
  className?: string;
}

export default function DotGrid({ className = '' }: DotGridProps) {
  return (
    <div
      aria-hidden="true"
      className={`absolute inset-0 dot-grid-bg opacity-40 pointer-events-none ${className}`}
    />
  );
}
