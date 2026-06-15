'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { BadgeCheck } from 'lucide-react'
import {
  BUSINESSES,
  DEFAULT_WEIGHTS,
  SEED_QUERY,
  type FactorTag,
  type Weights,
} from '@/lib/q-data'
import { AppHeader } from '@/components/qrank/app-header'
import { SearchView } from '@/components/qrank/search-view'
import { RankingsView } from '@/components/qrank/rankings-view'
import { FeedbackPanel } from '@/components/qrank/feedback-panel'
import { CuratedRankings } from '@/components/qrank/curated-rankings'

export default function Page() {
  const [searched, setSearched] = useState(false)
  const [query, setQuery] = useState(SEED_QUERY.query)
  const [area, setArea] = useState(SEED_QUERY.area)

  const [accuracy, setAccuracy] = useState(72)
  const [weights, setWeights] = useState<Weights>(DEFAULT_WEIGHTS)
  const [activeTags, setActiveTags] = useState<FactorTag[]>([])
  const [curatedActive, setCuratedActive] = useState(false)

  function handleGenerate(q: string, a: string) {
    setQuery(q)
    setArea(a)
    setSearched(true)
  }

  function handleReset() {
    setSearched(false)
    setCuratedActive(false)
    setWeights(DEFAULT_WEIGHTS)
    setActiveTags([])
    setAccuracy(72)
  }

  function toggleTag(t: FactorTag) {
    setActiveTags((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t],
    )
  }

  function handleSaveFeedback() {
    setCuratedActive(true)
    toast.success('Feedback saved to Q-Score algorithm', {
      description: 'Your rankings were re-weighted from your taste signals.',
      icon: <BadgeCheck className="h-4 w-4 text-[var(--chart-2)]" />,
    })
  }

  return (
    <main className="min-h-screen">
      <AppHeader
        showBack={searched}
        onBack={handleReset}
        query={searched ? query : undefined}
        area={searched ? area : undefined}
      />

      {!searched ? (
        <SearchView
          initialQuery={query}
          initialArea={area}
          onGenerate={handleGenerate}
        />
      ) : (
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
          <div className="grid gap-6 lg:grid-cols-[1.55fr_1fr]">
            <div className="space-y-6">
              <RankingsView query={query} area={area} businesses={BUSINESSES} />
            </div>

            <div className="space-y-6">
              <FeedbackPanel
                accuracy={accuracy}
                setAccuracy={setAccuracy}
                weights={weights}
                setWeights={setWeights}
                activeTags={activeTags}
                toggleTag={toggleTag}
                onSave={handleSaveFeedback}
              />
              <CuratedRankings
                businesses={BUSINESSES}
                weights={weights}
                activeTags={activeTags}
                active={curatedActive}
              />
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
