import Link from 'next/link'
import Ph from './Ph'
import { Arrow, WaIcon } from './icons'
import { WA_GENERAL } from '@/lib/links'

/* מעטפת לדפי המחקרים: פס עליון קבוע (לוגו + חזרה לאתר + שיחת היכרות) ופוטר קצר */
export default function ResearchShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a href="#rmain" className="skip-link">
        דלג לתוכן הראשי
      </a>
      <header className="r-top">
        <Link href="/" className="r-logo" aria-label="BIG COACH, חזרה לדף הבית">
          <Ph img="logo.png" alt="BIG COACH לוגו" sizes="200px" position="right center" />
        </Link>
        <div className="r-nav" role="navigation" aria-label="ניווט">
          <Link href="/research">כל המחקרים</Link>
          <Link href="/">לאתר</Link>
          <a href={WA_GENERAL} target="_blank" className="r-cta">
            <WaIcon /> שיחת היכרות
          </a>
        </div>
      </header>
      <main id="rmain">{children}</main>
      <footer className="r-foot">
        <p className="r-foot-k">רוצה שמישהו יתרגם את כל זה לתוכנית שמתאימה לך?</p>
        <a href={WA_GENERAL} target="_blank" className="btn btn-red">
          <span>קבע שיחת היכרות</span>
          <span className="circle">
            <Arrow />
          </span>
        </a>
        <p className="r-foot-note">20 דקות, בלי עלות ובלי התחייבות.</p>
        <p className="r-foot-legal">
          BIG COACH · גולן בלמונט · ביאליק 137, באר שבע · <Link href="/privacy.html">מדיניות פרטיות</Link>
        </p>
      </footer>
    </>
  )
}
