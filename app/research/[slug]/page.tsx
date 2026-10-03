import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import ResearchShell from '@/components/ResearchShell'
import { LIBRARY, getResearch, type Block } from '@/lib/research'
import ResearchCover from '@/components/ResearchCover'
import ReadProgress from '@/components/ReadProgress'
import { WaIcon } from '@/components/icons'

export const dynamicParams = false
export function generateStaticParams() {
  return LIBRARY.map(r => ({ slug: r.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const r = getResearch((await params).slug)
  if (!r) return {}
  return {
    title: `${r.title} | המחקרים של Big Coach`,
    description: r.summary,
    alternates: { canonical: `/research/${r.slug}` },
    openGraph: { type: 'article', title: r.title, description: r.summary, locale: 'he_IL' },
  }
}

function BlockView({ b }: { b: Block }) {
  if (b.type === 'p') return <p>{b.text}</p>
  if (b.type === 'note') return <p className="r-note">{b.text}</p>
  return (
    <ul>
      {b.items.map(t => {
        // המשפט הראשון של כל פריט הוא הכותרת שלו
        const i = t.indexOf('. ')
        return (
          <li key={t}>
            {i > 0 && i < 60 ? (
              <>
                <b>{t.slice(0, i + 1)}</b> {t.slice(i + 2)}
              </>
            ) : (
              t
            )}
          </li>
        )
      })}
    </ul>
  )
}

export default async function ResearchPage({ params }: { params: Promise<{ slug: string }> }) {
  const r = getResearch((await params).slug)
  if (!r) notFound()
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: r.title,
    description: r.summary,
    datePublished: r.date,
    inLanguage: 'he',
    author: { '@type': 'Person', name: 'גולן בלמונט' },
    publisher: { '@type': 'Organization', name: 'BIG COACH' },
  }
  return (
    <ResearchShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ReadProgress />
      <article className={`r-article${r.kind === 'guide' ? ' is-guide' : ''}`}>
        <div className="r-a-cover">
          <ResearchCover icon={r.icon} kind={r.kind} big />
        </div>
        <header className="r-a-head">
          <Link href="/research" className="r-back">
            → כל המחקרים
          </Link>
          <span className="r-card-k">{r.kicker}</span>
          <h1>{r.title}</h1>
          <p className="r-lede">{r.summary}</p>
          <span className="r-meta">
            גולן בלמונט · {r.dateLabel} · {r.readMin} דקות קריאה
          </span>
        </header>
        <aside className="r-take" aria-label="בקצרה">
          <h2>בקצרה</h2>
          <ul>
            {r.takeaways.map(t => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </aside>
        {r.sections.map((s, i) => (
          <section key={s.title} className="r-sec">
            <h2>
              <span className="r-num">{String(i + 1).padStart(2, '0')}</span>
              {s.title}
            </h2>
            {s.blocks.map((b, j) => (
              <BlockView key={j} b={b} />
            ))}
            {s.sources && (
              <details className="r-src">
                <summary>מקורות ({s.sources.length})</summary>
                <ol>
                  {s.sources.map(src => (
                    <li key={src.label}>
                      {src.url ? (
                        <a href={src.url} target="_blank" rel="noopener noreferrer">
                          {src.label}
                        </a>
                      ) : (
                        src.label
                      )}
                    </li>
                  ))}
                </ol>
              </details>
            )}
          </section>
        ))}
        {r.kind === 'guide' && (
          <section className="r-gate" aria-label="המדריך המלא">
            <div className="r-gate-locked" aria-hidden="true">
              {(r.locked ?? []).map((t, i) => (
                <div key={t} className="r-gate-row">
                  <span className="r-num">{String(r.sections.length + i + 1).padStart(2, '0')}</span>
                  <span>{t}</span>
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <rect x="5" y="11" width="14" height="10" rx="2" />
                    <path d="M8 11V8a4 4 0 0 1 8 0v3" />
                  </svg>
                </div>
              ))}
            </div>
            <div className="r-gate-cta">
              <h2>רוצה את המדריך המלא?</h2>
              <p>
                {r.locked?.length ?? 0} חלקים נוספים, עם טבלאות, דוגמאות ומקורות. שולח לך אותו בוואטסאפ, בחינם.
              </p>
              <a
                className="r-wa-btn"
                href={`https://wa.me/972526896182?text=${encodeURIComponent(`היי גולן, הגעתי מהאתר ואשמח לקבל את המדריך: ${r.title}`)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <WaIcon /> שלח לי את המדריך
              </a>
            </div>
          </section>
        )}
        <p className="r-disclaimer">המידע כאן הוא סיכום של מחקרים ולא ייעוץ רפואי. לפני שינוי בתוספים או בתרופות, תדבר עם הרופא שלך.</p>
      </article>
    </ResearchShell>
  )
}
