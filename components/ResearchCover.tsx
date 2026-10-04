import Image from 'next/image'
import type { CoverIcon } from '@/lib/research'
import { imgUrl } from '@/lib/assets'

/*
 * 2026-10: שערים מעוצבים בסגנון הקרוסלות של ביג קואוץ׳ (Canva, עיצוב "Big Coach – שערים למחקרים ומדריכים באתר").
 * הקבצים ב-Supabase: assets/img/research-<slug>.jpg (800×1000). אם אין קובץ לסלאג, נופלים לאייקון ה-SVG.
 */
const DESIGNED = new Set([
  'cns-fatigue', 'peptides-young-men', 'nutrition-supplements-2025-2026', 'boxing-strategy-physiology',
  'lose-belly-fat', 'protein-made-simple', 'lose-weight-still-go-out', 'intermittent-fasting',
  'cardio-or-strength', 'supplements-worth-it', 'beginner-3-days', 'the-scale-lies',
  'keep-the-results', 'night-snacking', 'clean-bulk', 'shift-work-eating',
])

/*
 * תמונת שער לכל מחקר / מדריך: אייקון נושא גדול בקו אדום־לבן על רקע כהה עם זוהר,
 * רשת עדינה ומספר רץ. הכל SVG בקוד (חד בכל גודל, בלי קבצים). האייקונים מקוריים.
 */
const ICONS: Record<CoverIcon, React.ReactNode> = {
  brain: (
    <>
      <path d="M31 13c-5-4-13-1-13 6-5 1-8 6-6 11-4 3-3 10 1 12 0 6 6 10 12 8 2 3 4 4 6 3z" />
      <path d="M33 13c5-4 13-1 13 6 5 1 8 6 6 11 4 3 3 10-1 12 0 6-6 10-12 8-2 3-4 4-6 3z" />
      <path d="M21 26c3 0 5 2 5 5M18 38c3-2 7-1 8 2M43 26c-3 0-5 2-5 5M46 38c-3-2-7-1-8 2" className="thin" />
    </>
  ),
  syringe: (
    <>
      <path d="M40 10l14 14M47 17l-6 6M44 20L20 44l-6-6 24-24z" />
      <path d="M20 44l-6 6M14 38l-4 4" />
      <path d="M28 30l4 4M32 26l4 4M24 34l4 4" className="thin" />
    </>
  ),
  flask: (
    <>
      <path d="M24 8h16M27 8v16L14 48a4 4 0 0 0 3.5 6h29a4 4 0 0 0 3.5-6L37 24V8" />
      <path d="M19 40h26" className="thin" />
      <circle cx="28" cy="46" r="2" className="dot" />
      <circle cx="36" cy="44" r="1.5" className="dot" />
    </>
  ),
  glove: (
    <>
      <path d="M18 34c0-12 6-22 18-22 9 0 14 6 14 14v6c0 6-4 10-10 10H24c-4 0-6-3-6-8z" />
      <path d="M22 42v8a4 4 0 0 0 4 4h14a4 4 0 0 0 4-4v-8" />
      <path d="M38 26c-6 0-10 2-12 6M22 50h22" className="thin" />
    </>
  ),
  tape: (
    <>
      <circle cx="24" cy="30" r="14" />
      <circle cx="24" cy="30" r="4" className="thin" />
      <path d="M38 30h18v8H34" />
      <path d="M42 34v4M47 34v4M52 34v4" className="thin" />
    </>
  ),
  protein: (
    <>
      <path d="M40 10c8 0 14 6 14 14 0 10-10 14-16 14l-8 8a5 5 0 1 1-6 6 5 5 0 1 1-6-6 5 5 0 0 1 6 0l8-8c0-6 4-28 8-28z" />
      <path d="M40 18c4 0 6 3 6 6" className="thin" />
    </>
  ),
  beer: (
    <>
      <path d="M16 20h26v32a4 4 0 0 1-4 4H20a4 4 0 0 1-4-4z" />
      <path d="M42 26h5a5 5 0 0 1 5 5v8a5 5 0 0 1-5 5h-5" />
      <path d="M16 20c0-5 4-8 8-7 2-4 9-4 11 0 4-1 8 2 7 7" />
      <path d="M24 30v18M34 30v18" className="thin" />
    </>
  ),
  clock: (
    <>
      <circle cx="32" cy="32" r="22" />
      <path d="M32 32V10a22 22 0 0 1 19 33z" className="fill" />
      <path d="M32 18v14l9 6" />
    </>
  ),
  dumbbell: (
    <>
      <path d="M10 24v16M16 18v28M48 18v28M54 24v16M16 32h32" />
      <path d="M20 32l5-8 5 14 5-10 4 4" className="thin" />
    </>
  ),
  pills: (
    <>
      <rect x="8" y="22" width="30" height="14" rx="7" transform="rotate(-30 23 29)" />
      <path d="M18 36l10-16" className="thin" />
      <circle cx="44" cy="42" r="11" />
      <path d="M36 42h16" className="thin" />
    </>
  ),
  calendar: (
    <>
      <rect x="10" y="14" width="44" height="40" rx="5" />
      <path d="M10 24h44M22 9v9M42 9v9" />
      <path d="M17 36l3 3 5-6M29 36l3 3 5-6M41 36l3 3 5-6" className="thin" />
    </>
  ),
  scale: (
    <>
      <rect x="10" y="10" width="44" height="44" rx="10" />
      <path d="M20 26a14 14 0 0 1 24 0" />
      <path d="M32 30l5-7" className="thin" />
      <path d="M22 44h20" className="thin" />
    </>
  ),
  flag: (
    <>
      <path d="M6 54l18-26 8 10 8-14 18 30z" />
      <path d="M40 24V8l12 5-12 5" />
    </>
  ),
  moon: (
    <>
      <path d="M40 10a22 22 0 1 0 14 34A18 18 0 0 1 40 10z" />
      <path d="M48 16l1.5 3 3 1.5-3 1.5-1.5 3-1.5-3-3-1.5 3-1.5z" className="dot" />
      <path d="M54 30l1 2 2 1-2 1-1 2-1-2-2-1 2-1z" className="dot" />
    </>
  ),
  muscle: (
    <>
      <path d="M12 46c4-8 10-12 18-12l6-14c1-3 4-4 7-3l3 1c2 1 2 4 0 5l-6 3-2 8c8-2 14 3 14 10 0 8-8 12-18 12H18c-4 0-7-4-6-10z" />
      <path d="M30 34c2 4 6 6 10 6" className="thin" />
      <path d="M50 12v8M46 16h8" className="thin" />
    </>
  ),
  shift: (
    <>
      <circle cx="28" cy="34" r="18" />
      <path d="M28 22v12l7 5" />
      <path d="M48 8a10 10 0 1 0 8 14 8 8 0 0 1-8-14z" className="fill" />
    </>
  ),
}

export default function ResearchCover({
  icon,
  kind = 'research',
  index,
  big = false,
  slug,
  title,
}: {
  icon: CoverIcon
  kind?: 'research' | 'guide'
  index?: number
  big?: boolean
  slug?: string
  title?: string
}) {
  if (slug && DESIGNED.has(slug)) {
    return (
      <div className={`r-cover has-img${big ? ' big' : ''}${kind === 'guide' ? ' is-guide' : ''}`}>
        <Image
          src={imgUrl(`research-${slug}.jpg`)}
          alt={title ? `שער: ${title}` : ''}
          fill
          sizes={big ? '(max-width:860px) 90vw, 440px' : '(max-width:860px) 92vw, 400px'}
          priority={big}
        />
        <span className="r-cover-shine" aria-hidden="true" />
      </div>
    )
  }
  return (
    <div className={`r-cover${big ? ' big' : ''}${kind === 'guide' ? ' is-guide' : ''}`} aria-hidden="true">
      <span className="r-cover-grid" />
      <span className="r-cover-glow" />
      {typeof index === 'number' && <span className="r-cover-num">{String(index + 1).padStart(2, '0')}</span>}
      <span className="r-cover-chip">{kind === 'guide' ? 'מדריך' : 'מחקר'}</span>
      <svg className="r-cover-ic" viewBox="0 0 64 64" fill="none">
        {ICONS[icon]}
      </svg>
      <span className="r-cover-shine" />
    </div>
  )
}
