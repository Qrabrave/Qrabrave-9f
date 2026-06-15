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

/* ---------- Query-aware results generator ---------- */

// Small deterministic string hash so the same search always yields the same list.
function hashString(s: string) {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

function mulberry32(seed: number) {
  let a = seed
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const NAME_PREFIXES = [
  'The',
  'Casa',
  'House of',
  'Old Town',
  'Golden',
  'Corner',
  'Union',
  'Founders',
  'Bright',
  'Iron',
]
const OWNER_NAMES = [
  "Marco's",
  "Lena's",
  "Sato",
  "Delgado's",
  "Aria",
  "Park",
  "Nguyen",
  "Romano",
  "Cohen",
  "Okafor",
]
const NAME_SUFFIXES = [
  'Co.',
  '& Sons',
  'Collective',
  'Kitchen',
  'Bar',
  'Works',
  'Room',
  'Society',
  'Studio',
  'Market',
]
const AREA_DESCRIPTORS = [
  'Downtown',
  'Arts District',
  'Old Town',
  'Uptown',
  'Riverside',
  'Midtown',
  'Northgate',
  'Harbor',
  'West End',
  'Heights',
]
const ALL_TAGS: FactorTag[] = [
  'loyalty',
  'consistency',
  'pure-quality',
  'hidden-gem',
  'value',
]

function singularize(term: string) {
  const t = term.trim()
  if (/ies$/i.test(t)) return t.replace(/ies$/i, 'y')
  if (/(ses|ches|shes|xes)$/i.test(t)) return t.replace(/es$/i, '')
  if (/s$/i.test(t) && !/ss$/i.test(t)) return t.replace(/s$/i, '')
  return t
}

function titleCase(s: string) {
  return s
    .trim()
    .split(/\s+/)
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1).toLowerCase() : w))
    .join(' ')
}

/**
 * Generates a deterministic, query-and-area-aware set of businesses so the
 * dashboard reflects what the user actually searched for. There's no live
 * backend — this simulates ranked results for any query/area combination.
 */
export function generateBusinesses(query: string, area: string): Business[] {
  const cleanQuery = titleCase(query || 'Top Spots')
  const cityName = (area || 'Your Area').split(',')[0].trim()
  const noun = titleCase(singularize(cleanQuery))

  const rand = mulberry32(hashString(`${cleanQuery}|${area}`.toLowerCase()))
  const pick = <T,>(arr: T[]) => arr[Math.floor(rand() * arr.length)]
  const span = (min: number, max: number) =>
    Math.round(min + rand() * (max - min))

  const usedNames = new Set<string>()
  const businesses: Business[] = []
  const count = 8

  for (let i = 0; i < count; i++) {
    // Build a believable, varied business name tied to the query.
    let name = ''
    let guard = 0
    do {
      const style = Math.floor(rand() * 3)
      if (style === 0) name = `${pick(NAME_PREFIXES)} ${noun} ${pick(NAME_SUFFIXES)}`
      else if (style === 1) name = `${pick(OWNER_NAMES)} ${noun}`
      else name = `${noun} ${pick(NAME_SUFFIXES)}`
      guard++
    } while (usedNames.has(name) && guard < 12)
    usedNames.add(name)

    // Higher-ranked entries get stronger components.
    const tier = 1 - i / count
    const rpr = Math.min(98, span(70, 88) + Math.round(tier * 8))
    const cr = Math.min(97, span(68, 86) + Math.round(tier * 8))
    const q = Math.min(99, span(74, 90) + Math.round(tier * 7))

    const tags: FactorTag[] = []
    const tagCount = 1 + Math.floor(rand() * 2)
    while (tags.length < tagCount) {
      const t = pick(ALL_TAGS)
      if (!tags.includes(t)) tags.push(t)
    }

    businesses.push({
      id: `${name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}-${i}`,
      name,
      category: cleanQuery,
      neighborhood: `${pick(AREA_DESCRIPTORS)} ${cityName}`,
      sampleSize: span(700, 5400),
      rpr,
      cr,
      q,
      trend: Math.round((rand() * 9 - 2.5) * 10) / 10,
      tags,
    })
  }

  return businesses
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
