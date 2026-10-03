import Ph from './Ph'
import Cnum from './Cnum'
import CredToggle from './CredToggle'
import { Arrow, Mask } from './icons'
import { WA_GENERAL } from '@/lib/links'

/*
 * הכרטיס הממוזג about+golan (2026-07): קלף אחד, בלי תמונות גלויות —
 * golan.jpg משמש רקע בשקיפות נמוכה (.ag-bg). העוגן #golan יושב על עמודת גולן.
 */
export default function About() {
  return (
    <section id="about">
      <span className="floater" data-fspeed="-0.08" style={{ top: '12%', left: '8%' }} aria-hidden="true">
        ✦
      </span>
      <span className="floater f-ring" data-fspeed="0.06" style={{ bottom: '16%', left: '30%' }} aria-hidden="true" />
      <Ph img="golan.jpg" className="ag-bg" sizes="(max-width:860px) 178vh, 100vw" quality={45} />
      <div className="about-grid">
        <div className="about-text reveal">
          <h2 className="about-h2">
            אני הבן אדם שיהיה שם <em>כשקשה.</em>
          </h2>
          <p>
            אחרי יותר מ-2,000 מתאמנים וליווים, למדתי דבר אחד: כשיש לך מנטליות מנצחת וראש חזק, הגוף יילך אחריו לכל
            מקום שתבחר.
          </p>
          <p>
            בגלל זה המעטפת שאתה מקבל ממני מתחילה בעבודה מנטלית, חומרי קריאה, צפייה וקשר רציף עם בן אדם אמיתי ולא
            בוט. שעונה לך גם בערב, גם כשנפלת וגם כשאתה בטוח שזה לא בשבילך.
          </p>
          <div className="about-stats">
            <div className="stat">
              <div className="num">
                <Cnum count={2000} />
                <span>+</span>
              </div>
              <div className="lbl">סיימו את התכנית</div>
              <div className="stat-m">
                2,000<span>+</span> סיימו
              </div>
            </div>
            <div className="stat">
              <div className="num">
                <Cnum count={250} />
                <span>+</span>
              </div>
              <div className="lbl">מתאמנים פעילים</div>
              <div className="stat-m">
                250<span>+</span> פעילים
              </div>
            </div>
            <div className="stat">
              <div className="num">24/7</div>
              <div className="lbl">מענה אמיתי</div>
              <div className="stat-m">24/7 זמינות</div>
            </div>
          </div>
          <div className="about-cta-row">
            <a href={WA_GENERAL} target="_blank" className="u-link">
              <Mask text="קבע שיחת היכרות" />
            </a>
          </div>
        </div>
        <div className="golan-card reveal" data-d="1" id="golan">
          <div>
            <div className="ag-kicker">האיש שמאחורי המכונה</div>
            <h3>גולן בלמונט</h3>
            <div className="role">פאפא ג&apos;י | ביג קואוצ&apos; | אבא של ישראל</div>
            <p>
              התחלתי את הדרך בגיל 12, באומניות לחימה. בגיל 15 כבר הייתי מדריך. מאז ועד היום, בין אם על המזרן,
              במדים או באולם האימונים, חיפשתי דבר אחד: איך לוקחים בן אדם ומוציאים ממנו את הגרסה החזקה שלו.
            </p>
            <p>
              בצבא הייתי <b>ראש מדור קרב מגע של חטיבת גולני</b>. בעולם האזרחי ניהלתי רשתות כושר גדולות. אבל הרגע
              ששינה לי את החיים היה כשהבנתי שאני לא רוצה לנהל מערכת, אני רוצה לשנות אנשים. אחד אחד.
            </p>
            <p>
              היום אני עושה את זה דרך ביג קואוצ&apos;, עם כל מה שצברתי בדרך: <b>לחימה, ניהול, ראש, וגוף.</b>
            </p>
            <div className="golan-creds">
              <div className="cred">
                <span className="cred-ic">★</span>
                <div>
                  <div className="cred-t">ראש מדור קרב מגע, חטיבת גולני</div>
                </div>
              </div>
              <div className="cred">
                <span className="cred-ic">★</span>
                <div>
                  <div className="cred-t">מנהל מקצועי בעבר ברשתות כושר מובילות</div>
                </div>
              </div>
              <div className="cred">
                <span className="cred-ic">★</span>
                <div>
                  <div className="cred-t">מאמן ומדריך מגיל 15, מעל 13 שנות ניסיון</div>
                </div>
              </div>
            </div>
            <CredToggle />
          </div>
          <div className="golan-cta-row">
            <button type="button" className="golan-direct" data-lead-open>
              <Mask text="השאר פרטים" />
            </button>
            <span className="golan-cta-or">או</span>
            <a href={WA_GENERAL} target="_blank" className="golan-lead-btn">
              <Mask text="קבע שיחת היכרות" />
              <span className="circle">
                <Arrow />
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
