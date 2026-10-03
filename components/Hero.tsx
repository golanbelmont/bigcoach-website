import Ph from './Ph'
import { Arrow, Mask, WaIcon } from './icons'
import { WA_GENERAL } from '@/lib/links'

export default function Hero() {
  return (
    <header id="hero">
      <div className="hero-bg">
        <Ph img="hero.jpg" alt="" label="hero.jpg (1920×1080)" eager sizes="(max-width:860px) 178vh, 100vw" quality={85} />
      </div>
      <div className="hero-cut" aria-hidden="true">
        <Ph img="golan-cut.png" alt="" label="golan-cut.png (PNG חתוך, ~900×1400)" eager sizes="(max-width:860px) 68vw, 44vw" quality={90} />
      </div>
      <div className="hero-content">
        <div className="hero-badge">
          <span className="avatars">
            <Ph img="avatar-1.jpg" alt="" sizes="40px" />
            <Ph img="avatar-2.jpg" alt="" sizes="40px" />
            <Ph img="avatar-3.jpg" alt="" sizes="40px" />
            <Ph img="avatar-4.jpg" alt="" sizes="40px" />
          </span>
          <span>
            <b className="red">+2,000</b> סיימו תוכנית · <i className="live-dot" aria-hidden="true" /><b>250</b> מתאמנים פעילים עכשיו
          </span>
        </div>
        <h1>
          <span className="hl">
            <span>נמאס לך להתחיל</span>
          </span>
          <span className="hl">
            <span>
              <em>כל פעם</em> מחדש?
            </span>
          </span>
        </h1>
        <p className="hero-sub">
          כי להתחיל אתה יודע. שבוע, שבועיים, ואז החיים דוחפים והכל מתפרק. הבעיה היא לא המוטיבציה שלך. חסר לך בן אדם
          שלא נותן לך ליפול. בשביל זה אני פה.
        </p>
        <div className="hero-cta-row">
          <a href={WA_GENERAL} target="_blank" className="btn btn-light">
            <span className="cta-full">קבע שיחת היכרות</span>
            <span className="cta-short">שיחת היכרות</span>
            <span className="circle">
              <Arrow className="cta-arrow" />
              <WaIcon className="cta-wa" />
            </span>
          </a>
          <a href="#about" className="u-link hero-more">
            <Mask text="מי עומד מאחורי זה" />
          </a>
        </div>
        <p className="hero-note">20 דקות, בלי עלות ובלי התחייבות.</p>
      </div>
    </header>
  )
}
