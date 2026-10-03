import Link from 'next/link'
import { RESEARCH } from '@/lib/research'

/* טיזר בדף הבית: המחקר האחרון + כניסה למדור */
export default function ResearchTeaser() {
  const latest = RESEARCH.slice(0, 3)
  return (
    <section id="research">
      <div className="research-head reveal">
        <h2>אני קורא את המחקרים. אתה מקבל את השורה התחתונה.</h2>
        <p className="sec-sub">סיכומים שלי על מה שחדש בתזונה, באימונים ובתוספים. בשפה פשוטה, עם מקורות.</p>
      </div>
      <div className="research-grid reveal" data-d="1">
        {latest.map(r => (
          <Link key={r.slug} href={`/research/${r.slug}`} className="r-card">
            <span className="r-card-k">{r.kicker}</span>
            <h3>{r.title}</h3>
            <p>{r.summary}</p>
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
      </div>
      <div className="research-more reveal" data-d="2">
        <Link href="/research" className="u-link">
          לכל המחקרים
        </Link>
      </div>
    </section>
  )
}
