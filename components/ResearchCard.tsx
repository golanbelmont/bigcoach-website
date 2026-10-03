import Link from 'next/link'
import ResearchCover from './ResearchCover'
import type { Research } from '@/lib/research'

/* כרטיס מחקר / מדריך: שער מעוצב + מסגרת מונפשת (גבול אדום מסתובב בהובר) */
export default function ResearchCard({ r, index, h = 'h2' }: { r: Research; index?: number; h?: 'h2' | 'h3' }) {
  const H = h
  return (
    <Link href={`/research/${r.slug}`} className={`r-card${r.kind === 'guide' ? ' is-guide' : ''}`}>
      <span className="r-card-frame" aria-hidden="true" />
      <ResearchCover icon={r.icon} kind={r.kind} index={index} />
      <span className="r-card-body">
        <span className="r-card-k">{r.kicker}</span>
        <H>{r.title}</H>
        <p>{r.summary}</p>
        <span className="r-tags">
          {r.tags.map(t => (
            <span key={t}>{t}</span>
          ))}
        </span>
        <span className="r-go">
          {r.kind === 'guide' ? 'להצצה במדריך' : 'לקריאה'} <span aria-hidden="true">←</span>
        </span>
      </span>
    </Link>
  )
}
