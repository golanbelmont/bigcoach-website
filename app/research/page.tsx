import type { Metadata } from 'next'
import Link from 'next/link'
import ResearchShell from '@/components/ResearchShell'
import { RESEARCH } from '@/lib/research'

export const metadata: Metadata = {
  title: 'המחקרים של Big Coach | תזונה, אימונים ותוספים בשפה פשוטה',
  description: 'גולן בלמונט עובר על המחקרים החדשים בתזונה, אימונים ותוספים, ומסכם מה באמת עובד. בלי באזוורדס, עם מקורות.',
  alternates: { canonical: '/research' },
}

export default function ResearchIndex() {
  return (
    <ResearchShell>
      <section className="r-hero">
        <h1>
          המחקרים <em>שלי.</em>
        </h1>
        <p>
          אני קורא את המחקרים כדי שאתה לא תצטרך. כאן אני מסכם מה באמת עובד בתזונה, באימונים ובתוספים. בשפה פשוטה, עם
          מקור לכל טענה.
        </p>
      </section>
      <section className="r-list" aria-label="רשימת מחקרים">
        {RESEARCH.map(r => (
          <Link key={r.slug} href={`/research/${r.slug}`} className="r-card">
            <span className="r-card-k">{r.kicker}</span>
            <h2>{r.title}</h2>
            <p>{r.summary}</p>
            <span className="r-meta">
              {r.dateLabel} · {r.readMin} דקות קריאה
            </span>
            <span className="r-tags">
              {r.tags.map(t => (
                <span key={t}>{t}</span>
              ))}
            </span>
            <span className="r-go" aria-hidden="true">
              לקריאה ←
            </span>
          </Link>
        ))}
      </section>
    </ResearchShell>
  )
}
