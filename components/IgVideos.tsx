'use client'

import { useState } from 'react'

/*
 * "קצת ממה שאני מסביר" (2026-10-12): רילסים של תוכן (לא עדויות) מהאינסטגרם.
 * הכרטיס מעוצב כטקסט; ההטמעה של אינסטגרם נטענת רק בלחיצה (בלי עוגיות של מטא לפני כן, ובלי משקל מיותר).
 * להוספה/החלפה: מזהה הרילס מהקישור instagram.com/reel/<id>/
 */
type Ig = { id: string; tag: string; title: string; sub: string }

const IG: Ig[] = [
  { id: 'Dd61Doqk382', tag: 'תזונה', title: 'אוכלת 1200 קלוריות ולא יורדת?', sub: 'זה לא את. זה החישוב.' },
  { id: 'DeCjXxOjqrT', tag: 'התמדה', title: 'מוטיבציה? עזבו.', sub: 'השאלה האמיתית היא איך מתמידים.' },
  { id: 'Ddl4_h-ipss', tag: 'מדדים', title: 'לא נשקלת בהתחלה?', sub: 'אז איך תדע שאתה מתקדם.' },
  { id: 'DeGzATRiWu_', tag: 'ראש', title: 'למי לא להקשיב', sub: 'מוטיבציה זה גם לדעת את מי לסנן.' },
  { id: 'DdrKnvkiW1Y', tag: 'התהליך', title: 'מי מצליח אצלי ומי לא', sub: 'שני סוגים של אנשים שפונים אליי.' },
  { id: 'DeXJh11j7H3', tag: 'התחלה', title: 'ומה אם דווקא תצליח?', sub: 'השאלה ההפוכה לפחד מכישלון.' },
]

const IG_PROFILE = 'https://www.instagram.com/_big_coach_/'

function Card({ ig, n }: { ig: Ig; n: number }) {
  const [open, setOpen] = useState(false)
  return (
    <div className={`ig-card${open ? ' is-open' : ''}`}>
      {open ? (
        <iframe
          src={`https://www.instagram.com/reel/${ig.id}/embed/`}
          title={ig.title}
          allow="autoplay; encrypted-media; picture-in-picture; clipboard-write"
          allowFullScreen
          scrolling="no"
        />
      ) : (
        <button type="button" className="ig-face" onClick={() => setOpen(true)} aria-label={`צפייה: ${ig.title}`}>
          <span className="ig-top">
            <span className="ig-n">{String(n).padStart(2, '0')}</span>
            <span className="ig-tag">{ig.tag}</span>
          </span>
          <span className="ig-title">{ig.title}</span>
          <span className="ig-sub">{ig.sub}</span>
          <span className="ig-play" aria-hidden="true">
            <span className="play-ic" />
          </span>
          <span className="ig-src">רילס · אינסטגרם</span>
        </button>
      )}
    </div>
  )
}

export default function IgVideos() {
  return (
    <section id="ig-videos">
      <div className="ig-head reveal">
        <h2>קצת ממה שאני מסביר כל יום.</h2>
        <p className="sec-sub">סרטונים קצרים מהאינסטגרם. תזונה, אימונים והראש שמאחוריהם. בלי חפירות.</p>
      </div>
      <div className="ig-strip reveal" data-d="1">
        {IG.map((ig, i) => (
          <Card key={ig.id} ig={ig} n={i + 1} />
        ))}
      </div>
      <div className="ig-more reveal" data-d="2">
        <a href={IG_PROFILE} target="_blank" rel="noopener" className="u-link">
          עוד באינסטגרם @_big_coach_
        </a>
      </div>
    </section>
  )
}
