'use client'

import { useState } from 'react'
import { ChevronDown, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { type Business, computeQScore } from '@/lib/q-data'
import { cn } from '@/lib/utils'
import { ScoreRing } from './score-ring'
import { FormulaPill } from './formula-legend'
import { MetricBreakdown } from './metric-breakdown'
import { Button } from '@/components/ui/button'

function TrendBadge({ trend }: { trend: number }) {
  const Icon = trend > 0 ? TrendingUp : trend < 0 ? TrendingDown : Minus
  const color =
    trend > 0
      ? 'text-[var(--chart-2)]'
      : trend < 0
        ? 'text-destructive'
        : 'text-muted-foreground'
  return (
    <span className={cn('inline-flex items-center gap-1 font-mono text-xs', color)}>
      <Icon className="h-3.5 w-3.5" />
      {trend > 0 ? '+' : ''}
      {trend.toFixed(1)}
    </span>
  )
}

export function RankingsView({
  query,
  area,
  businesses,
}: {
  query: string
  area: string
  businesses: Business[]
}) {
  const ranked = [...businesses]
    .map((b) => ({ ...b, score: computeQScore(b.rpr, b.cr, b.q) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)

  const [open, setOpen] = useState<string | null>(ranked[0]?.id ?? null)

  return (
    <section className="rounded-2xl border border-border bg-card">
      <div className="flex flex-col gap-3 border-b border-border p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold tracking-tight">Top 5 Rankings</h2>
            <span className="rounded-full bg-primary/15 px-2 py-0.5 font-mono text-[11px] font-medium text-primary">
              Q-SCORE
            </span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            <span className="text-foreground">{query}</span> in {area} · ranked by
            objective quality
          </p>
        </div>
        <FormulaPill />
      </div>

      {/* column header */}
      <div className="hidden grid-cols-[3rem_1fr_auto_auto] items-center gap-4 border-b border-border px-5 py-2.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground sm:grid">
        <span>Rank</span>
        <span>Name</span>
        <span className="text-center">Core Q-Score</span>
        <span className="text-right">Breakdown</span>
      </div>

      <ul>
        {ranked.map((b, i) => {
          const isOpen = open === b.id
          return (
            <li key={b.id} className="border-b border-border last:border-b-0">
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : b.id)}
                className={cn(
                  'grid w-full grid-cols-[3rem_1fr_auto] items-center gap-4 px-5 py-4 text-left transition-colors sm:grid-cols-[3rem_1fr_auto_auto]',
                  isOpen ? 'bg-background/40' : 'hover:bg-background/20',
                )}
              >
                <div className="flex items-center">
                  <span
                    className={cn(
                      'flex h-8 w-8 items-center justify-center rounded-lg font-mono text-sm font-semibold',
                      i === 0
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground',
                    )}
                  >
                    {i + 1}
                  </span>
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="truncate font-medium text-foreground">
                      {b.name}
                    </span>
                    <TrendBadge trend={b.trend} />
                  </div>
                  <span className="truncate text-xs text-muted-foreground">
                    {b.category} · {b.neighborhood}
                  </span>
                </div>

                <div className="flex items-center justify-center">
                  <ScoreRing score={b.score} size={52} stroke={5} />
                </div>

                <div className="hidden items-center justify-end sm:flex">
                  <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
                    {isOpen ? 'Hide' : 'View'} breakdown
                    <ChevronDown
                      className={cn(
                        'h-4 w-4 transition-transform',
                        isOpen && 'rotate-180',
                      )}
                    />
                  </span>
                </div>
              </button>

              {isOpen ? <MetricBreakdown business={b} /> : null}
            </li>
          )
        })}
      </ul>
    </section>
  )
}
