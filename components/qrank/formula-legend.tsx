'use client'

import { Info } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

export function FormulaPill({ className }: { className?: string }) {
  return (
    <Tooltip>
      <TooltipTrigger
        className={
          'inline-flex cursor-help items-center gap-2 rounded-md border border-border bg-background/50 px-2.5 py-1 font-mono text-xs text-muted-foreground transition-colors hover:text-foreground ' +
          (className ?? '')
        }
      >
        <span>
          Q ={' '}
          <span className="text-[var(--chart-1)]">(RPR + CR)</span> ×{' '}
          <span className="text-[var(--chart-3)]">Q</span>
        </span>
        <Info className="h-3.5 w-3.5" />
      </TooltipTrigger>
      <TooltipContent className="max-w-xs space-y-2 p-3" side="bottom">
        <p className="font-mono text-xs">
          Q-Score = ((RPR + CR) × Q) ÷ 2
        </p>
        <ul className="space-y-1 text-xs leading-relaxed">
          <li>
            <span className="font-medium text-foreground">RPR</span> — Repeat
            Purchase Rate: share of customers who buy again.
          </li>
          <li>
            <span className="font-medium text-foreground">CR</span> — Cohort
            Retention: share of a cohort still active after 90 days.
          </li>
          <li>
            <span className="font-medium text-foreground">Q</span> — Pure Quality
            Index: normalized product quality, isolated from popularity.
          </li>
        </ul>
        <p className="text-[11px] text-muted-foreground">
          Loyalty (RPR + CR) is amplified by quality (Q), then normalized to a
          0–100 scale.
        </p>
      </TooltipContent>
    </Tooltip>
  )
}
