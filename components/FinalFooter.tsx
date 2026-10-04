import Ph from './Ph'
import { Arrow } from './icons'
import { WA_GENERAL } from '@/lib/links'

const IG = 'https://www.instagram.com/_big_coach_/'
const TT = 'https://www.tiktok.com/@big.coach.golan.boublil'
const FB = 'https://www.facebook.com/golan.boublil/'
const MAPS = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent('ביאליק 137, באר שבע')

function Dot() {
  return (
    <span className="dot">
      <Arrow />
    </span>
  )
}

const IcWa = () => (
  <svg viewBox="0 0 16 16">
    <path d="M8 1.8a6.2 6.2 0 0 0-5.3 9.4L1.8 14.2l3.1-.9A6.2 6.2 0 1 0 8 1.8z" />
    <path
      className="fill"
      d="M6.1 5.2c.2-.4.4-.4.6-.4h.5c.2 0 .4 0 .5.4.2.4.6 1.4.6 1.5 0 .1.1.3 0 .4l-.3.5c-.1.1-.2.3-.1.5.1.2.5.8 1 1.3.7.6 1.2.8 1.4.9.2.1.3.1.4-.1l.6-.7c.1-.2.3-.1.5-.1l1.3.6c.2.1.3.2.3.3 0 .2 0 .8-.3 1.2-.3.4-1 .9-1.4.9-.4 0-1.5.2-3.5-1-2-1.3-2.8-3.2-2.9-3.4-.1-.2-.7-1-.7-1.9 0-.9.5-1.4.5-1.4z"
    />
  </svg>
)
const IcIg = () => (
  <svg viewBox="0 0 16 16">
    <rect x="2" y="2" width="12" height="12" rx="3.5" />
    <circle cx="8" cy="8" r="3" />
    <circle className="fill" cx="12.2" cy="3.8" r="1" />
  </svg>
)
const IcTt = () => (
  <svg viewBox="0 0 16 16">
    <path
      className="fill"
      d="M11 1.5c.3 1.9 1.6 3.3 3.4 3.5v2.5c-1.3 0-2.4-.4-3.4-1v4.3a4.2 4.2 0 1 1-4.2-4.2c.2 0 .5 0 .7.1v2.6a1.6 1.6 0 1 0 1.1 1.5V1.5h2.4z"
    />
  </svg>
)
const IcFb = () => (
  <svg viewBox="0 0 16 16">
    <path
      className="fill"
      d="M10.5 5.2h1.8V2.5h-1.8c-1.8 0-3.2 1.4-3.2 3.2v1.6H5.5v2.7h1.8v5.5h2.7V10h1.8l.5-2.7H10V5.9c0-.4.2-.7.5-.7z"
    />
  </svg>
)
const IcMail = () => (
  <svg viewBox="0 0 16 16">
    <rect x="1.8" y="3.2" width="12.4" height="9.6" rx="2" />
    <path d="M2.4 4.2 8 8.6l5.6-4.4" />
  </svg>
)
const IcPin = () => (
  <svg viewBox="0 0 16 16">
    <path d="M8 14.4s4.6-4.3 4.6-7.9a4.6 4.6 0 1 0-9.2 0c0 3.6 4.6 7.9 4.6 7.9z" />
    <circle cx="8" cy="6.5" r="1.7" />
  </svg>
)
const IcGlobe = () => (
  <svg viewBox="0 0 16 16">
    <circle cx="8" cy="8" r="6.2" />
    <path d="M1.8 8h12.4M8 1.8c1.7 1.8 2.5 3.8 2.5 6.2S9.7 12.4 8 14.2C6.3 12.4 5.5 10.4 5.5 8S6.3 3.6 8 1.8z" />
  </svg>
)

const NAV: [string, string][] = [
  ['#about', 'הסיפור שלי'],
  ['#programs', 'המסלולים'],
  ['#golan', 'מי המאמן'],
  ['#testimonials', 'תוצאות'],
  ['/research', 'מחקרים'],
  ['#faq', 'שאלות נפוצות'],
]

export default function FinalFooter() {
  return (
    <footer id="final">
      <div className="final-bg">
        <Ph img="hero.jpg" alt="" label="הסטודיו" sizes="(max-width:860px) 178vh, 100vw" quality={75} position="72% 38%" />
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

        <div className="ft-panel">
          <div className="ft-top">
            <div className="ft-brand">
              <Ph img="logo.png" alt="BIG COACH לוגו" sizes="260px" fit="contain" position="right center" className="ft-logo" />
              <p className="ft-tag">
                ליווי תזונה ואימונים
                <br />
                <em>מותאם אישית.</em>
              </p>
            </div>
            <div className="ft-cta">
              <a className="ft-wa" href={WA_GENERAL} target="_blank">
                <span className="ft-wa-ic">
                  <IcWa />
                </span>
                <span>קבע שיחת היכרות</span>
                <span className="ft-wa-arrow">
                  <Arrow />
                </span>
              </a>
              <span className="ft-micro">20 דקות, בלי עלות ובלי התחייבות</span>
            </div>
          </div>

          <div className="ft-cols">
            <div className="ft-col">
              <h3>ניווט</h3>
              <ul className="ft-nav">
                {NAV.map(([href, label]) => (
                  <li key={href}>
                    <a href={href}>{label}</a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="ft-col">
              <h3>דברו איתי</h3>
              <ul className="ft-contact">
                <li>
                  <a href={WA_GENERAL} target="_blank">
                    <span className="ft-ic wa">
                      <IcWa />
                    </span>
                    <span className="ft-txt">
                      <small>וואטסאפ</small>
                      <b dir="ltr">052-689-6182</b>
                    </span>
                  </a>
                </li>
                <li>
                  <a href="mailto:golanboublil@gmail.com">
                    <span className="ft-ic">
                      <IcMail />
                    </span>
                    <span className="ft-txt">
                      <small>מייל</small>
                      <b dir="ltr">golanboublil@gmail.com</b>
                    </span>
                  </a>
                </li>
                <li>
                  <a href={IG} target="_blank">
                    <span className="ft-ic">
                      <IcIg />
                    </span>
                    <span className="ft-txt">
                      <small>אינסטגרם</small>
                      <b dir="ltr">@_big_coach_</b>
                    </span>
                  </a>
                </li>
              </ul>
            </div>

            <div className="ft-col">
              <h3>הסטודיו</h3>
              <ul className="ft-contact">
                <li>
                  <a href={MAPS} target="_blank">
                    <span className="ft-ic">
                      <IcPin />
                    </span>
                    <span className="ft-txt">
                      <small>סטודיו</small>
                      <b>ביאליק 137, באר שבע</b>
                    </span>
                  </a>
                </li>
                <li>
                  <div className="ft-row">
                    <span className="ft-ic">
                      <IcGlobe />
                    </span>
                    <span className="ft-txt">
                      <small>ליווי אונליין</small>
                      <b>בכל הארץ</b>
                    </span>
                  </div>
                </li>
              </ul>
              <div className="socials">
                <a href={WA_GENERAL} target="_blank" aria-label="וואטסאפ">
                  <IcWa />
                </a>
                <a href={IG} target="_blank" aria-label="אינסטגרם">
                  <IcIg />
                </a>
                <a href={TT} target="_blank" aria-label="טיקטוק">
                  <IcTt />
                </a>
                <a href={FB} target="_blank" aria-label="פייסבוק">
                  <IcFb />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="ft-bottom">
          <span className="ft-live">
            <i aria-hidden="true" />
            זמין בוואטסאפ ביום ובלילה
          </span>
          <span className="ft-legal">
            <a href="/accessibility.html">הצהרת נגישות</a>
            <a href="/privacy.html">מדיניות פרטיות</a>
          </span>
          <span className="ft-copy">© 2026 BIG COACH, גולן בלמונט · ח&quot;פ 318259579</span>
        </div>
      </div>
      <div className="ft-word" aria-hidden="true">
        BIG COACH
      </div>
    </footer>
  )
}
