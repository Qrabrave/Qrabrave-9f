'use client'

import { Sparkles, ArrowUp, ArrowDown, Minus, Lock } from 'lucide-react'
import {
  type Business,
  type FactorTag,
  type Weights,
  computeQScore,
  computePersonalScore,
} from '@/lib/q-data'
import { cn } from '@/lib/utils'

export function CuratedRankings({
  businesses,
  weights,
  activeTags,
  active,
}: {
  businesses: Business[]
  weights: Weights
  activeTags: FactorTag[]
  active: boolean
}) {
  // baseline ranking order (by core Q-Score)
  const baseOrder = [...businesses]
    .map((b) => ({ id: b.id, score: computeQScore(b.rpr, b.cr, b.q) }))
    .sort((a, b) => b.score - a.score)
    .map((b) => b.id)

  const personalized = [...businesses]
    .map((b) => ({
      ...b,
      personal: computePersonalScore(b, weights, activeTags),
    }))
    .sort((a, b) => b.personal - a.personal)
    .slice(0, 5)

  return (
    <section
      className={cn(
        'relative overflow-hidden rounded-2xl border bg-card transition-all',
        active ? 'border-primary/40' : 'border-border',
      )}
    >
      <div className="flex items-center justify-between border-b border-border p-5">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <h2 className="text-lg font-semibold tracking-tight">
            Your Curated Rankings
          </h2>
        </div>
        <span className="font-mono text-[11px] text-muted-foreground">
          Personalized
        </span>
      </div>

      <ul className={cn(!active && 'pointer-events-none blur-[3px] select-none')}>
        {personalized.map((b, i) => {
          const prevRank = baseOrder.indexOf(b.id)
          const delta = prevRank - i
          const Mover = delta > 0 ? ArrowUp : delta < 0 ? ArrowDown : Minus
          const moverColor =
            delta > 0
              ? 'text-[var(--chart-2)]'
              : delta < 0
                ? 'text-destructive'
                : 'text-muted-foreground'

          return (
            <li
              key={b.id}
              className="flex items-center gap-3 border-b border-border px-5 py-3.5 last:border-b-0"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-muted font-mono text-sm font-semibold text-muted-foreground">
                {i + 1}
              </span>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium">{b.name}</div>
                <div className="truncate text-xs text-muted-foreground">
                  {b.category}
                </div>
              </div>
              <span className={cn('inline-flex items-center gap-0.5 text-xs', moverColor)}>
                <Mover className="h-3.5 w-3.5" />
                {delta !== 0 ? Math.abs(delta) : ''}
              </span>
              <div className="w-14 text-right">
                <div className="font-mono text-base font-semibold tabular-nums text-primary">
                  {b.personal}
                </div>
                <div className="text-[10px] text-muted-foreground">match</div>
              </div>
            </li>
          )
        })}
      </ul>

      {!active ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-card/40 text-center">
          <Lock className="h-5 w-5 text-muted-foreground" />
          <p className="max-w-[14rem] text-sm text-muted-foreground">
            Submit feedback to unlock your personalized rankings.
          </p>
        </div>
      ) : null}
    </section>
  )
}
