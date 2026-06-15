'use client'

import { Users, RefreshCw, Gem } from 'lucide-react'
import { type Business, computeQScore, TAG_LABELS } from '@/lib/q-data'
import { MetricBar } from './metric-bar'
import { Badge } from '@/components/ui/badge'

export function MetricBreakdown({ business }: { business: Business }) {
  const score = computeQScore(business.rpr, business.cr, business.q)
  const loyalty = business.rpr + business.cr

  return (
    <div className="space-y-4 border-t border-border bg-background/30 p-4 sm:p-5">
      <div className="grid gap-3 sm:grid-cols-3">
        <MetricBar
          label="Repeat Purchase Rate"
          abbr="RPR"
          value={business.rpr}
          suffix="%"
          color="var(--chart-1)"
          description="Customers placing a second order within 60 days."
        />
        <MetricBar
          label="Cohort Retention"
          abbr="CR"
          value={business.cr}
          suffix="%"
          color="var(--chart-2)"
          description="Share of each monthly cohort still active at 90 days."
        />
        <MetricBar
          label="Pure Quality Index"
          abbr="Q"
          value={business.q}
          color="var(--chart-3)"
          description="Quality signal isolated from popularity and spend."
        />
      </div>

      <div className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-sm">
          <span className="text-muted-foreground">Q-Score =</span>
          <span className="flex items-center gap-1">
            <RefreshCw className="h-3.5 w-3.5 text-[var(--chart-1)]" />
            <span className="text-[var(--chart-1)]">{business.rpr}</span>
            <span className="text-muted-foreground">+</span>
            <Users className="h-3.5 w-3.5 text-[var(--chart-2)]" />
            <span className="text-[var(--chart-2)]">{business.cr}</span>
          </span>
          <span className="text-muted-foreground">×</span>
          <span className="flex items-center gap-1">
            <Gem className="h-3.5 w-3.5 text-[var(--chart-3)]" />
            <span className="text-[var(--chart-3)]">{business.q}</span>
          </span>
          <span className="text-muted-foreground">
            → {loyalty} × {business.q} ÷ 200
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Core Q-Score</span>
          <span className="rounded-md bg-primary/15 px-2.5 py-1 font-mono text-lg font-semibold tabular-nums text-primary">
            {score}
          </span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-muted-foreground">Strength signals:</span>
        {business.tags.map((t) => (
          <Badge
            key={t}
            variant="outline"
            className="border-border bg-background/50 text-xs font-normal text-muted-foreground"
          >
            {TAG_LABELS[t]}
          </Badge>
        ))}
        <span className="ml-auto font-mono text-[11px] text-muted-foreground">
          n = {business.sampleSize.toLocaleString()} signals
        </span>
      </div>
    </div>
  )
}
