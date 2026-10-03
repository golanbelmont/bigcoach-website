import Link from 'next/link'
import ResearchCard from './ResearchCard'
import { RESEARCH } from '@/lib/research'
import { GUIDES } from '@/lib/guides'

/* טיזר בדף הבית: שני מחקרים + מדריך אחד, וכניסה לספרייה */
export default function ResearchTeaser() {
  const pick = [RESEARCH[1], RESEARCH[0], GUIDES[0]].filter(Boolean)
  return (
    <section id="research">
      <div className="research-head reveal">
        <h2>אני קורא את המחקרים. אתה מקבל את השורה התחתונה.</h2>
        <p className="sec-sub">
          {RESEARCH.length} מחקרים ו{GUIDES.length} מדריכים על תזונה, אימונים ותוספים. בשפה פשוטה, עם מקורות.
        </p>
      </div>
      <div className="research-grid reveal" data-d="1">
        {pick.map(r => (
          <ResearchCard key={r.slug} r={r} h="h3" />
        ))}
      </div>
      <div className="research-more reveal" data-d="2">
        <Link href="/research" className="u-link">
          לכל הספרייה
        </Link>
      </div>
    </section>
  )
}
