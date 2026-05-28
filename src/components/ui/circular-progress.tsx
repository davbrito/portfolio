interface CircularProgressProps {
  progress: number | null;
  size?: number;
  className?: string;
}

const RADIUS = 8;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function CircularProgress({ progress, size = 20, className = "" }: CircularProgressProps) {
  const indeterminate = progress === null;
  const dashArray = indeterminate ? "30 70" : `${CIRCUMFERENCE}`;
  const offset = indeterminate ? 0 : CIRCUMFERENCE - (CIRCUMFERENCE * progress) / 100;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      className={`${className} ${indeterminate ? "animate-spin" : ""}`.trim()}
      aria-hidden="true"
    >
      <circle
        cx="10"
        cy="10"
        r={RADIUS}
        fill="none"
        stroke="rgba(148,163,184,0.25)"
        strokeWidth="2"
      />
      <circle
        cx="10"
        cy="10"
        r={RADIUS}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray={dashArray}
        strokeDashoffset={offset}
        transform="rotate(-90 10 10)"
      />
    </svg>
  );
}
