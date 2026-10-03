import type { Metadata } from 'next'
import ResearchShell from '@/components/ResearchShell'
import ResearchCard from '@/components/ResearchCard'
import { RESEARCH } from '@/lib/research'
import { GUIDES } from '@/lib/guides'

export const metadata: Metadata = {
  title: 'המחקרים והמדריכים של Big Coach | תזונה, אימונים ותוספים בשפה פשוטה',
  description: 'גולן בלמונט עובר על המחקרים החדשים בתזונה, אימונים ותוספים, ומסכם מה באמת עובד. בלי באזוורדס, עם מקורות.',
  alternates: { canonical: '/research' },
}

export default function ResearchIndex() {
  return (
    <ResearchShell>
      <section className="r-hero">
        <span className="r-hero-k">ספריית BIG COACH</span>
        <h1>
          המחקרים <em>שלי.</em>
        </h1>
        <p>
          אני קורא את המחקרים כדי שאתה לא תצטרך. כאן אני מסכם מה באמת עובד בתזונה, באימונים ובתוספים. בשפה פשוטה, עם
          מקור לכל טענה.
        </p>
        <div className="r-hero-stats">
          <span>
            <b>{RESEARCH.length}</b> מחקרים
          </span>
          <span>
            <b>{GUIDES.length}</b> מדריכים
          </span>
        </div>
      </section>

      <section className="r-shelf" aria-labelledby="sh-research">
        <div className="r-shelf-head">
          <h2 id="sh-research">מחקרים</h2>
          <p>סיכומים מלאים, פתוחים לקריאה.</p>
        </div>
        <div className="r-list">
          {RESEARCH.map((r, i) => (
            <ResearchCard key={r.slug} r={r} index={i} h="h3" />
          ))}
        </div>
      </section>

      <section className="r-shelf" aria-labelledby="sh-guides">
        <div className="r-shelf-head">
          <h2 id="sh-guides">מדריכים</h2>
          <p>הצצה כאן, המדריך המלא אצלך בוואטסאפ, בחינם.</p>
        </div>
        <div className="r-list">
          {GUIDES.map((r, i) => (
            <ResearchCard key={r.slug} r={r} index={i} h="h3" />
          ))}
        </div>
      </section>
    </ResearchShell>
  )
}
