'use client'

import { ThumbsUp, ThumbsDown, Check } from 'lucide-react'
import {
  type FactorTag,
  type Weights,
  TAG_LABELS,
} from '@/lib/q-data'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'

const FACTORS: { key: keyof Weights; label: string; abbr: string; color: string }[] = [
  { key: 'rpr', label: 'Repeat Purchase Rate', abbr: 'RPR', color: 'var(--chart-1)' },
  { key: 'cr', label: 'Cohort Retention', abbr: 'CR', color: 'var(--chart-2)' },
  { key: 'q', label: 'Pure Quality Index', abbr: 'Q', color: 'var(--chart-3)' },
]

const TAGS = Object.keys(TAG_LABELS) as FactorTag[]

export function FeedbackPanel({
  accuracy,
  setAccuracy,
  weights,
  setWeights,
  activeTags,
  toggleTag,
  onSave,
}: {
  accuracy: number
  setAccuracy: (v: number) => void
  weights: Weights
  setWeights: (w: Weights) => void
  activeTags: FactorTag[]
  toggleTag: (t: FactorTag) => void
  onSave: () => void
}) {
  function vote(key: keyof Weights, dir: 1 | -1) {
    const next = Math.max(0.5, Math.min(1.5, +(weights[key] + dir * 0.25).toFixed(2)))
    setWeights({ ...weights, [key]: next })
  }

  return (
    <section className="rounded-2xl border border-border bg-card p-5">
      <h2 className="text-lg font-semibold tracking-tight">
        How accurate are these rankings for your tastes?
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Tune the signals that matter to you. The Q-Score algorithm re-weights and
        re-ranks instantly.
      </p>

      {/* accuracy slider */}
      <div className="mt-6">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Overall accuracy</span>
          <span className="font-mono font-semibold tabular-nums">{accuracy}%</span>
        </div>
        <Slider
          value={[accuracy]}
          onValueChange={(v) => setAccuracy(v[0])}
          min={0}
          max={100}
          step={1}
          className="mt-3"
        />
        <div className="mt-1 flex justify-between text-[11px] text-muted-foreground">
          <span>Way off</span>
          <span>Spot on</span>
        </div>
      </div>

      {/* factor voting */}
      <div className="mt-6">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Weight the factors
        </p>
        <div className="mt-3 space-y-2">
          {FACTORS.map((f) => (
            <div
              key={f.key}
              className="flex items-center gap-3 rounded-lg border border-border bg-background/40 px-3 py-2"
            >
              <span
                className="flex h-5 items-center rounded px-1.5 font-mono text-[10px] font-semibold"
                style={{
                  backgroundColor: `color-mix(in oklch, ${f.color} 22%, transparent)`,
                  color: f.color,
                }}
              >
                {f.abbr}
              </span>
              <span className="flex-1 text-sm">{f.label}</span>
              <span className="font-mono text-xs tabular-nums text-muted-foreground">
                ×{weights[f.key].toFixed(2)}
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => vote(f.key, 1)}
                  aria-label={`Increase weight for ${f.label}`}
                  className={cn(
                    'flex h-7 w-7 items-center justify-center rounded-md border border-border transition-colors hover:text-[var(--chart-2)]',
                    weights[f.key] > 1 && 'border-[var(--chart-2)]/50 text-[var(--chart-2)]',
                  )}
                >
                  <ThumbsUp className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => vote(f.key, -1)}
                  aria-label={`Decrease weight for ${f.label}`}
                  className={cn(
                    'flex h-7 w-7 items-center justify-center rounded-md border border-border transition-colors hover:text-destructive',
                    weights[f.key] < 1 && 'border-destructive/50 text-destructive',
                  )}
                >
                  <ThumbsDown className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* tag toggles */}
      <div className="mt-6">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          What do you value most?
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {TAGS.map((t) => {
            const active = activeTags.includes(t)
            return (
              <button
                key={t}
                type="button"
                onClick={() => toggleTag(t)}
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors',
                  active
                    ? 'border-primary bg-primary/15 text-primary'
                    : 'border-border bg-background/40 text-muted-foreground hover:text-foreground',
                )}
              >
                {active ? <Check className="h-3 w-3" /> : null}
                {TAG_LABELS[t]}
              </button>
            )
          })}
        </div>
      </div>

      <Button onClick={onSave} className="mt-6 h-10 w-full text-sm font-semibold">
        Apply to my rankings
      </Button>
    </section>
  )
}
