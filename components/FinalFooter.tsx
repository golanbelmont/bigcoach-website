import Ph from './Ph'
import { Arrow } from './icons'
import { WA_GENERAL } from '@/lib/links'

function Dot() {
  return (
    <span className="dot">
      <Arrow />
    </span>
  )
}

export default function FinalFooter() {
  return (
    <footer id="final">
      <div className="final-bg">
        <Ph img="footer-bg.jpg" alt="" label="footer-bg.jpg (1920×1080)" sizes="(max-width:860px) 178vh, 100vw" quality={75} />
      </div>
      <div className="final-inner">
        <p className="final-kicker">ההתחלה האחרונה שלך מתחילה בהודעה אחת.</p>
        <a className="cta-marquee" href={WA_GENERAL} target="_blank">
          <span className="sr-only">קבע שיחה בוואטסאפ</span>
          <div className="marquee" aria-hidden="true">
            <span>
              קבע שיחה <Dot /> קבע שיחה <Dot />
            </span>
            <span>
              קבע שיחה <Dot /> קבע שיחה <Dot />
            </span>
          </div>
        </a>
        <div className="footer-grid">
          <div>
            <Ph img="logo.png" alt="BIG COACH לוגו" sizes="180px" />
            <p>
              BIG COACH. ליווי תזונה ואימונים מותאם אישית.
              <br />
              ח&quot;פ 318259579 · ח&quot;נ ביאליק 137, באר שבע
              <br />
              ליווי אונליין: כל הארץ.
            </p>
            <div className="socials">
              <a href={WA_GENERAL} target="_blank" aria-label="וואטסאפ">
                <svg viewBox="0 0 16 16">
                  <path d="M8 1.8a6.2 6.2 0 0 0-5.3 9.4L1.8 14.2l3.1-.9A6.2 6.2 0 1 0 8 1.8z" />
                  <path
                    className="fill"
                    d="M6.1 5.2c.2-.4.4-.4.6-.4h.5c.2 0 .4 0 .5.4.2.4.6 1.4.6 1.5 0 .1.1.3 0 .4l-.3.5c-.1.1-.2.3-.1.5.1.2.5.8 1 1.3.7.6 1.2.8 1.4.9.2.1.3.1.4-.1l.6-.7c.1-.2.3-.1.5-.1l1.3.6c.2.1.3.2.3.3 0 .2 0 .8-.3 1.2-.3.4-1 .9-1.4.9-.4 0-1.5.2-3.5-1-2-1.3-2.8-3.2-2.9-3.4-.1-.2-.7-1-.7-1.9 0-.9.5-1.4.5-1.4z"
                  />
                </svg>
              </a>
              <a href="https://www.instagram.com/_big_coach_/" target="_blank" aria-label="אינסטגרם">
                <svg viewBox="0 0 16 16">
                  <rect x="2" y="2" width="12" height="12" rx="3.5" />
                  <circle cx="8" cy="8" r="3" />
                  <circle className="fill" cx="12.2" cy="3.8" r="1" />
                </svg>
              </a>
              <a href="https://www.tiktok.com/@big.coach.golan.boublil" target="_blank" aria-label="טיקטוק">
                <svg viewBox="0 0 16 16">
                  <path
                    className="fill"
                    d="M11 1.5c.3 1.9 1.6 3.3 3.4 3.5v2.5c-1.3 0-2.4-.4-3.4-1v4.3a4.2 4.2 0 1 1-4.2-4.2c.2 0 .5 0 .7.1v2.6a1.6 1.6 0 1 0 1.1 1.5V1.5h2.4z"
                  />
                </svg>
              </a>
              <a href="https://www.facebook.com/golan.boublil/" target="_blank" aria-label="פייסבוק">
                <svg viewBox="0 0 16 16">
                  <path
                    className="fill"
                    d="M10.5 5.2h1.8V2.5h-1.8c-1.8 0-3.2 1.4-3.2 3.2v1.6H5.5v2.7h1.8v5.5h2.7V10h1.8l.5-2.7H10V5.9c0-.4.2-.7.5-.7z"
                  />
                </svg>
              </a>
            </div>
          </div>
          <div>
            <h3>ניווט</h3>
            <ul>
              <li>
                <a href="#about">הסיפור שלי</a>
              </li>
              <li>
                <a href="#programs">המסלולים</a>
              </li>
              <li>
                <a href="#golan">מי המאמן</a>
              </li>
              <li>
                <a href="#testimonials">תוצאות</a>
              </li>
              <li>
                <a href="#faq">שאלות נפוצות</a>
              </li>
              <li>
                <a href="/accessibility.html">הצהרת נגישות</a>
              </li>
              <li>
                <a href="/privacy.html">מדיניות פרטיות</a>
              </li>
            </ul>
          </div>
          <div>
            <h3>דברו איתי</h3>
            <ul>
              <li>
                <a href={WA_GENERAL}>וואטסאפ: 052-689-6182</a>
              </li>
              <li>
                <a href="mailto:golanboublil@gmail.com">מייל: golanboublil@gmail.com</a>
              </li>
              <li>
                <a href="https://www.instagram.com/_big_coach_/" target="_blank">
                  אינסטגרם: @_big_coach_
                </a>
              </li>
              <li>
                <a href="https://www.tiktok.com/@big.coach.golan.boublil" target="_blank">
                  טיקטוק: @big.coach.golan.boublil
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 BIG COACH, גולן בלמונט. כל הזכויות שמורות</span>
          <span>זמין בוואטסאפ ביום ובלילה</span>
        </div>
      </div>
    </footer>
  )
}
