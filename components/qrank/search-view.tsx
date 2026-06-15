'use client'

import { useState } from 'react'
import { ArrowRight, MapPin, Search, Sparkles, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const SUGGESTIONS = ['Tacos', 'Coffee Shops', 'Ramen', 'Barbershops', 'Pilates Studios']

export function SearchView({
  initialQuery,
  initialArea,
  onGenerate,
}: {
  initialQuery: string
  initialArea: string
  onGenerate: (query: string, area: string) => void
}) {
  const [query, setQuery] = useState(initialQuery)
  const [area, setArea] = useState(initialArea)
  const [loading, setLoading] = useState(false)

  function handleGenerate() {
    if (!query.trim() || !area.trim()) return
    setLoading(true)
    setTimeout(() => {
      onGenerate(query.trim(), area.trim())
    }, 900)
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-3.5rem)] max-w-3xl flex-col items-center justify-center px-4 py-16 sm:px-6">
      <span className="mb-5 inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
        <Sparkles className="h-3.5 w-3.5 text-[var(--chart-2)]" />
        Objective rankings from real purchase behavior
      </span>

      <h1 className="text-balance text-center text-4xl font-semibold tracking-tight sm:text-5xl">
        Forget reviews. <span className="text-primary">Rank what&apos;s actually good.</span>
      </h1>
      <p className="mt-4 max-w-xl text-pretty text-center leading-relaxed text-muted-foreground">
        Qrabrave ranks restaurants and businesses by what actually keeps people
        coming back, using a proprietary formula to generate objective Q-Scores —
        no star ratings, no review brigading.
      </p>

      <div className="mt-10 w-full rounded-2xl border border-border bg-card p-5 shadow-2xl shadow-black/30 sm:p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="query" className="text-xs text-muted-foreground">
              What are you looking for?
            </Label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="query"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g. Tacos, Coffee Shops"
                className="h-11 pl-9"
                onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="area" className="text-xs text-muted-foreground">
              Geographic area
            </Label>
            <div className="relative">
              <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="area"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                placeholder="e.g. Santa Ana, CA"
                className="h-11 pl-9"
                onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
              />
            </div>
          </div>
        </div>

        <Button
          onClick={handleGenerate}
          disabled={loading || !query.trim() || !area.trim()}
          className="mt-5 h-11 w-full text-sm font-semibold"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Analyzing purchase signals…
            </>
          ) : (
            <>
              Generate Objective Q-Scores
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-xs text-muted-foreground">Try:</span>
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setQuery(s)}
              className="rounded-full border border-border bg-background/50 px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 grid w-full grid-cols-3 gap-3 text-center">
        {[
          { k: 'Signals analyzed', v: '2.4M+' },
          { k: 'Businesses scored', v: '38K' },
          { k: 'Bias from reviews', v: '0%' },
        ].map((stat) => (
          <div key={stat.k} className="rounded-xl border border-border bg-card/50 p-4">
            <div className="font-mono text-xl font-semibold tabular-nums">{stat.v}</div>
            <div className="mt-1 text-[11px] text-muted-foreground">{stat.k}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
