import { cn } from '@/lib/utils'

export function ScoreRing({
  score,
  size = 64,
  stroke = 6,
  className,
  label,
}: {
  score: number
  size?: number
  stroke?: number
  className?: string
  label?: string
}) {
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const offset = c - (score / 100) * c

  // color shifts from amber -> cyan -> blue as score climbs
  const color =
    score >= 85
      ? 'var(--chart-1)'
      : score >= 70
        ? 'var(--chart-2)'
        : 'var(--chart-3)'

  return (
    <div
      className={cn('relative inline-flex items-center justify-center', className)}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--border)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeDasharray={c}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.6s cubic-bezier(0.4,0,0.2,1)' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-mono text-base font-semibold leading-none tabular-nums">
          {score}
        </span>
        {label ? (
          <span className="mt-0.5 text-[9px] uppercase tracking-wider text-muted-foreground">
            {label}
          </span>
        ) : null}
      </div>
    </div>
  )
}
