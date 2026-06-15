'use client'

import { Activity, ChevronLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function AppHeader({
  showBack,
  onBack,
  query,
  area,
}: {
  showBack?: boolean
  onBack?: () => void
  query?: string
  area?: string
}) {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-3 px-4 sm:px-6">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Activity className="h-4 w-4" strokeWidth={2.4} />
          </div>
          <span className="text-sm font-semibold tracking-tight">
            Qrank<span className="text-muted-foreground"> / Q-Score Engine</span>
          </span>
        </div>

        {showBack ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="ml-2 h-8 gap-1 text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft className="h-4 w-4" />
            New search
          </Button>
        ) : null}

        <div className="ml-auto flex items-center gap-2">
          {query ? (
            <div className="hidden items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground sm:flex">
              <span className="font-medium text-foreground">{query}</span>
              <span className="h-1 w-1 rounded-full bg-muted-foreground/50" />
              <span>{area}</span>
            </div>
          ) : null}
          <span className="flex items-center gap-1.5 rounded-full border border-border bg-card px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--chart-2)]" />
            Model v4.2
          </span>
        </div>
      </div>
    </header>
  )
}
