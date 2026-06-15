import { cn } from '@/lib/utils'

export function MetricBar({
  label,
  abbr,
  value,
  suffix = '',
  description,
  color = 'var(--chart-1)',
}: {
  label: string
  abbr: string
  value: number
  suffix?: string
  description?: string
  color?: string
}) {
  return (
    <div className="rounded-lg border border-border bg-background/40 p-4">
      <div className="flex items-baseline justify-between gap-2">
        <div className="flex items-center gap-2">
          <span
            className="flex h-5 items-center rounded px-1.5 font-mono text-[10px] font-semibold"
            style={{ backgroundColor: 'color-mix(in oklch, ' + color + ' 22%, transparent)', color }}
          >
            {abbr}
          </span>
          <span className="text-sm font-medium text-foreground">{label}</span>
        </div>
        <span className="font-mono text-sm font-semibold tabular-nums text-foreground">
          {value}
          {suffix}
        </span>
      </div>
      <div className={cn('mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted')}>
        <div
          className="h-full rounded-full"
          style={{
            width: `${value}%`,
            backgroundColor: color,
            transition: 'width 0.6s cubic-bezier(0.4,0,0.2,1)',
          }}
        />
      </div>
      {description ? (
        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
          {description}
        </p>
      ) : null}
    </div>
  )
}
