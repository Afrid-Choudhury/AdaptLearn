interface SquiggleUnderlineProps {
  color?: string;
  width?: number;
  className?: string;
}

export default function SquiggleUnderline({ color = '#FBBF24', width = 200, className = '' }: SquiggleUnderlineProps) {
  return (
    <svg
      className={`block ${className}`}
      width={width}
      height="12"
      viewBox={`0 0 ${width} 12`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d={`M2 8 C ${width * 0.08} 2, ${width * 0.16} 14, ${width * 0.25} 8 S ${width * 0.42} 2, ${width * 0.5} 8 S ${width * 0.67} 14, ${width * 0.75} 8 S ${width * 0.92} 2, ${width - 2} 8`}
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}
