import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import ResearchShell from '@/components/ResearchShell'
import { RESEARCH, getResearch, type Block } from '@/lib/research'

export const dynamicParams = false
export function generateStaticParams() {
  return RESEARCH.map(r => ({ slug: r.slug }))
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
      <article className="r-article">
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
        <p className="r-disclaimer">המידע כאן הוא סיכום של מחקרים ולא ייעוץ רפואי. לפני שינוי בתוספים או בתרופות, תדבר עם הרופא שלך.</p>
      </article>
    </ResearchShell>
  )
}
