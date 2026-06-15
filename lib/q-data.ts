export type Business = {
  id: string
  name: string
  category: string
  neighborhood: string
  /** Number of sampled transactions backing the score */
  sampleSize: number
  /** Repeat Purchase Rate, 0-100 (%) */
  rpr: number
  /** Cohort Retention, 0-100 (%) */
  cr: number
  /** Pure Quality Index, 0-100 */
  q: number
  /** Month-over-month Q-Score trend, percentage points */
  trend: number
  tags: FactorTag[]
}

export type FactorTag =
  | 'loyalty'
  | 'consistency'
  | 'pure-quality'
  | 'hidden-gem'
  | 'value'

export const TAG_LABELS: Record<FactorTag, string> = {
  loyalty: 'Repeat loyalty',
  consistency: 'Consistency',
  'pure-quality': 'Pure quality',
  'hidden-gem': 'Hidden gems',
  value: 'Value',
}

/**
 * Core Q-Score formula: ((RPR + CR) * Q)
 * RPR and CR are rates (0-1), Q is an index (0-1).
 * Normalized back to a 0-100 scale for display.
 */
export function computeQScore(rpr: number, cr: number, q: number) {
  const raw = (rpr / 100 + cr / 100) * (q / 100) // 0 .. 2
  return Math.round((raw / 2) * 100)
}

export type Weights = { rpr: number; cr: number; q: number }

export const DEFAULT_WEIGHTS: Weights = { rpr: 1, cr: 1, q: 1 }

/**
 * Personalized score = weighted blend of the three components,
 * with light tag-based boosts to simulate taste-aware re-ranking.
 */
export function computePersonalScore(
  b: Business,
  weights: Weights,
  activeTags: FactorTag[],
) {
  const wSum = weights.rpr + weights.cr + weights.q || 1
  let base = (b.rpr * weights.rpr + b.cr * weights.cr + b.q * weights.q) / wSum

  let boost = 0
  for (const tag of activeTags) {
    if (b.tags.includes(tag)) boost += 3.5
    if (tag === 'hidden-gem' && b.sampleSize < 1500) boost += 4
    if (tag === 'value' && b.tags.includes('value')) boost += 1.5
  }
  return Math.max(0, Math.min(100, Math.round(base + boost)))
}

export const SEED_QUERY = {
  query: 'Tacos',
  area: 'Santa Ana, CA',
}

export const BUSINESSES: Business[] = [
  {
    id: 'tacos-el-vado',
    name: 'Tacos El Vado',
    category: 'Street Tacos',
    neighborhood: 'Downtown Santa Ana',
    sampleSize: 4820,
    rpr: 91,
    cr: 88,
    q: 94,
    trend: 2.4,
    tags: ['loyalty', 'consistency', 'pure-quality'],
  },
  {
    id: 'la-cocina-azteca',
    name: 'La Cocina Azteca',
    category: 'Taqueria',
    neighborhood: 'French Park',
    sampleSize: 3610,
    rpr: 86,
    cr: 90,
    q: 89,
    trend: 1.1,
    tags: ['loyalty', 'consistency'],
  },
  {
    id: 'birrieria-don-cheto',
    name: 'Birrieria Don Cheto',
    category: 'Birria & Tacos',
    neighborhood: 'Logan',
    sampleSize: 1280,
    rpr: 84,
    cr: 79,
    q: 96,
    trend: 5.8,
    tags: ['pure-quality', 'hidden-gem'],
  },
  {
    id: 'el-metate-grill',
    name: 'El Metate Grill',
    category: 'Mexican Grill',
    neighborhood: 'Artesia Pilar',
    sampleSize: 5240,
    rpr: 82,
    cr: 81,
    q: 85,
    trend: -0.6,
    tags: ['value', 'consistency'],
  },
  {
    id: 'taqueria-la-mera',
    name: 'Taqueria La Mera Mera',
    category: 'Street Tacos',
    neighborhood: 'Cornelia',
    sampleSize: 980,
    rpr: 88,
    cr: 74,
    q: 91,
    trend: 3.2,
    tags: ['hidden-gem', 'pure-quality'],
  },
  {
    id: 'mariscos-el-puerto',
    name: 'Mariscos El Puerto',
    category: 'Seafood Tacos',
    neighborhood: 'Bristol Memorial',
    sampleSize: 2150,
    rpr: 79,
    cr: 83,
    q: 82,
    trend: 0.9,
    tags: ['value'],
  },
  {
    id: 'tacos-la-banqueta',
    name: 'Tacos La Banqueta',
    category: 'Street Tacos',
    neighborhood: 'Madison Park',
    sampleSize: 3340,
    rpr: 77,
    cr: 76,
    q: 80,
    trend: -1.4,
    tags: ['value', 'consistency'],
  },
  {
    id: 'el-fogon-norteno',
    name: 'El Fogón Norteño',
    category: 'Sonoran Tacos',
    neighborhood: 'Pico Lowell',
    sampleSize: 1610,
    rpr: 75,
    cr: 72,
    q: 84,
    trend: 1.7,
    tags: ['hidden-gem'],
  },
]
