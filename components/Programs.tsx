'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import Ph from './Ph'
import { Arrow, Mask } from './icons'
import { WA_ONLINE, WA_GROUP, WA_PERSONAL, WA_BOXING, WA_COMBAT } from '@/lib/links'

type Prog = {
  key: string
  name: string
  title: ReactNode
  cap: string
  img: string
  imgLabel: string
  detailTitle: ReactNode
  detailSub: string
  thumb: string
  thumbLabel: string
  text: ReactNode
  rows: { k: string; v: ReactNode }[]
  wa: string
}

const COMPACT_PROGRAMS_QUERY = '(max-width:1024px), (pointer:coarse)'

const PROGS: Prog[] = [
  {
    key: 'online',
    name: 'ליווי האונליין',
    title: 'ליווי האונליין',
    cap: 'ליווי מלא מכל מקום בארץ, בלי מסגרת פיזית.',
    img: 'prog-online.jpg',
    imgLabel: 'prog-online.jpg (1920×1080)',
    detailTitle: (
      <>
        ליווי
        <br />
        אונליין
      </>
    ),
    detailSub: 'תזונה | אימונים | מנטלי | מכל מקום.',
    thumb: 'prog-online-thumb.jpg',
    thumbLabel: 'prog-online-thumb.jpg',
    text: (
      <>
        תכנית אימונים ותפריט תזונה שנבנים על סמך הנתונים <em>שלך</em> ומתעדכנים בכל שבוע מחדש בהתאם לצרכים שלך
        ואפליקציית מעקב חכמה שמרכזת הכל. מעקב צמוד, התאמות בזמן אמת, ואותי זמין לך בוואטסאפ.
      </>
    ),
    rows: [
      { k: 'עדכון תכנית', v: 'כל שבוע' },
      { k: 'תקשורת', v: 'רציפה ישירות איתי' },
      { k: 'עלות חודשית', v: 'החל מ-690 ש"ח' },
    ],
    wa: WA_ONLINE,
  },
  {
    key: 'group',
    name: 'ליווי אונליין ואימוני קבוצה',
    title: (
      <>
        ליווי אונליין &amp;
        <br />
        אימוני קבוצה
      </>
    ),
    cap: 'המסלול הכי נמכר. מסגרת, אנשים ותוצאה.',
    img: 'prog-group.jpg',
    imgLabel: 'prog-group.jpg (1920×1080)',
    detailTitle: (
      <>
        ליווי ואימונים
        <br />
        קבוצתיים
      </>
    ),
    detailSub: 'אנרגיה של קבוצה | יחס 1:1 | ליווי +',
    thumb: 'prog-group-thumb.jpg',
    thumbLabel: 'prog-group-thumb.jpg',
    text: (
      <>
        בנוסף לליווי הצמוד שלי, אתה מקבל אימונים קבוצתיים (עד 5 מתאמנים בקבוצה) בסטודיו שלנו. תפריט, תכנית אימונים
        ומאמן פיזי שזמין לכם בסטודיו להכוונה מדויקת בלייב. המסלול המבוקש ביותר לבאר שבעיים, ולא במקרה.
      </>
    ),
    rows: [
      { k: 'מיקום', v: 'ח"נ ביאליק 137, באר שבע' },
      { k: 'כולל', v: 'אימונים + תפריט + מעקב צמוד' },
      { k: 'עלות חודשית', v: 'החל מ-990 ש"ח' },
    ],
    wa: WA_GROUP,
  },
  {
    key: 'personal',
    name: 'ליווי אונליין ואימונים אישיים',
    title: (
      <>
        ליווי אונליין &amp;
        <br />
        אימונים אישיים
      </>
    ),
    cap: 'המסלול המהיר. אחד על אחד עם גולן.',
    img: 'prog-personal.jpg',
    imgLabel: 'prog-personal.jpg (1920×1080)',
    detailTitle: (
      <>
        מסלול ליווי
        <br />
        פרימיום
      </>
    ),
    detailSub: '100% מתשומת הלב עלייך. גם באימונים.',
    thumb: 'prog-personal-thumb.jpg',
    thumbLabel: 'prog-personal-thumb.jpg',
    text: (
      <>
        אימונים אישיים עם גולן בסטודיו, בתדירות שמתאימה לך, יחד עם מעטפת תזונה וליווי מלאה. הדרך המהירה והטובה
        ביותר לתוצאה תוך כדי עבודה מדויקת ונכונה.
      </>
    ),
    rows: [
      { k: 'תדירות', v: 'עד 3 אימונים אישיים בשבוע' },
      {
        k: 'כולל',
        v: (
          <>
            תכנית מלאה + אימונים <em>איתי</em>
          </>
        ),
      },
      { k: 'עלות חודשית', v: 'החל מ-990 ש"ח' },
    ],
    wa: WA_PERSONAL,
  },
  {
    key: 'boxing',
    name: 'אגרוף BIG BOX',
    title: (
      <>
        BIG
        <br />
        BOX
      </>
    ),
    cap: 'טכניקה, זיעה ופורקן, גם למתחילים מאפס.',
    img: 'prog-boxing.jpg',
    imgLabel: 'prog-boxing.jpg (1920×1080)',
    detailTitle: (
      <>
        אגרוף
        <br />
        BIG BOX
      </>
    ),
    detailSub: 'כושר, ביטחון ופורקן. בשיעור אחד.',
    thumb: 'prog-boxing-thumb.jpg',
    thumbLabel: 'prog-boxing-thumb.jpg',
    text: (
      <>
        שיעורי אגרוף קבוצתיים בסטודיו. טכניקה אמיתית, עבודה על שקיות וכפפות, וכושר שמרגישים אחרי שבוע. מתאים גם
        למתחילים מאפס.
      </>
    ),
    rows: [
      { k: 'רמה', v: 'מתחילים עד מתקדמים' },
      { k: 'מיקום', v: 'ח"נ ביאליק 137, באר שבע' },
      { k: 'עלות חודשית', v: '₪[מחיר] / חודש' },
    ],
    wa: WA_BOXING,
  },
  {
    key: 'combat',
    name: 'הכנה לקרבי ויחידות מיוחדות',
    title: (
      <>
        הכנה לקרבי
        <br />
        ויחידות מיוחדות
      </>
    ),
    cap: 'מגיעים לגיבוש מוכנים. בגוף ובראש.',
    img: 'prog-mental.jpg',
    imgLabel: 'prog-combat.jpg (1920×1080)',
    detailTitle: (
      <>
        הכנה
        <br />
        לקרבי
      </>
    ),
    detailSub: 'גיבושים | יחידות מיוחדות | שירות קרבי.',
    thumb: 'prog-mental-thumb.jpg',
    thumbLabel: 'prog-combat-thumb.jpg',
    text: (
      <>
        מסלול ייעודי למי שמכוון לשירות קרבי, לגיבוש או ליחידה מיוחדת. אימונים שבונים כושר, כוח וסיבולת
        לדרישות האמיתיות, תזונה שמחזיקה את העומס, ועבודה על הראש לרגעים שבהם הגוף רוצה להפסיק. מלווה אותך
        מי שהיה ראש מדור קרב מגע של חטיבת גולני.
      </>
    ),
    rows: [
      { k: 'למי זה מתאים', v: 'מלש"בים לפני גיבוש ושירות קרבי' },
      { k: 'מלווה', v: 'ראש מדור קרב מגע לשעבר, גולני' },
      { k: 'עלות', v: '₪[מחיר]' },
    ],
    wa: WA_COMBAT,
  },
]

function StageUI({ prog, open, onToggle }: { prog: Prog; open: boolean; onToggle: () => void }) {
  return (
    <>
      <div className="prog-center">
        <div className="prog-title">{prog.title}</div>
        <p className="prog-cap">{prog.cap}</p>
        <button type="button" className="prog-keep" data-lead-open>
          <Mask text="השאר פרטים" />
        </button>
      </div>
      <button className="prog-plus" aria-expanded={open} aria-label={`${open ? 'סגור' : 'פרטים על'} ${prog.name}`} onClick={onToggle}>
        <span className="pcirc">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
            <path d="M9 2v14M2 9h14" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
          </svg>
        </span>
      </button>
      <div className="prog-detail">
        <div className="pd-head">
          <div>
            <h3>{prog.detailTitle}</h3>
            <div className="sub">{prog.detailSub}</div>
          </div>
          <Ph img={prog.thumb} alt="" label={prog.thumbLabel} sizes="215px" />
        </div>
        <p>{prog.text}</p>
        <div className="pd-rows">
          {prog.rows.map(r => (
            <div className="srow" key={r.k}>
              <span className="k">{r.k}</span>
              <span className="v">{r.v}</span>
            </div>
          ))}
        </div>
        <a href={prog.wa} target="_blank" className="btn btn-light">
          קבע שיחת היכרות
          <span className="circle">
            <Arrow />
          </span>
        </a>
      </div>
    </>
  )
}

/*
 * סליידשואו נגלל (2026-07): מסגרת sticky אחת, ומיקום הגלילה קובע איזה פריים מוצג —
 * כמו scrubbing של וידאו. ה-spacer (500vh) קובע את אורך הגלילה; כל צעד מחליף שקופית.
 * פס התקדמות (--show-p) + נקודות מסמנים את מיקום הסקראב. במובייל הסליידשואו כבוי.
 */
export default function Programs() {
  const ref = useRef<HTMLElement>(null)
  const showRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState<number | null>(null)
  const [active, setActive] = useState(0)

  useEffect(() => {
    const root = ref.current
    const show = showRef.current
    if (!root || !show) return
    let raf = 0
    let cur = 0
    let visible = false
    const compact = matchMedia(COMPACT_PROGRAMS_QUERY)
    // במובייל (כרטיסים) אין scrub בכלל; בדסקטופ הלולאה רצה רק כשהסקשן על המסך.
    const tick = () => {
      raf = 0
      if (!visible || compact.matches) return
      raf = requestAnimationFrame(tick)
      const r = root.getBoundingClientRect()
      const dist = Math.max(1, r.height - innerHeight)
      const p = Math.min(1, Math.max(0, -r.top / dist))
      show.style.setProperty('--show-p', p.toFixed(4))
      const idx = Math.min(PROGS.length - 1, Math.floor(p * PROGS.length))
      if (idx !== cur) {
        cur = idx
        setActive(idx)
        setOpen(null)
      }
    }
    const start = () => {
      if (!raf) raf = requestAnimationFrame(tick)
    }
    const io = new IntersectionObserver(es => {
      visible = es.some(e => e.isIntersecting)
      if (visible) start()
    })
    io.observe(root)
    compact.addEventListener('change', start)
    return () => {
      io.disconnect()
      compact.removeEventListener('change', start)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  const toggle = (i: number) => setOpen(o => (o === i ? null : i))

  return (
    <section id="programs" ref={ref}>
      <div className="slideshow" ref={showRef}>
        {PROGS.map((prog, i) => (
          <div
            key={prog.key}
            className={`prog-slide prog-stage${i === active ? ' active' : ''}${open === i ? ' open' : ''}`}
            data-prog
          >
            <div className="prog-bg">
              <Ph img={prog.img} alt="" label={prog.imgLabel} sizes="100vw" quality={85} />
            </div>
            <div className="stage-ui">
              <StageUI prog={prog} open={open === i} onToggle={() => toggle(i)} />
            </div>
          </div>
        ))}
        <div className="show-chrome" aria-hidden="true">
          <div className="show-count">
            <span>{String(active + 1).padStart(2, '0')}</span>
            <i>/</i>
            <span>{String(PROGS.length).padStart(2, '0')}</span>
          </div>
          <div className="show-rail">
            <i className="show-fill" />
          </div>
          <div className="show-dots">
            {PROGS.map((prog, i) => (
              <b key={prog.key} className={i === active ? 'on' : undefined} />
            ))}
          </div>
        </div>
      </div>
      <div className="show-spacer" aria-hidden="true" />
    </section>
  )
}
