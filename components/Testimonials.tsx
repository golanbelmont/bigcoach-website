'use client'

import { useEffect, useRef } from 'react'
import Ph from './Ph'

// כיתובים לפי עדויות אמיתיות
const BA_CAPS: Record<number, string> = {
  1: 'שי דוכן, 30 · ירד 20 ק"ג (מ-92 ל-80), חצי שנה של מסה וחיטוב ושינוי הרכב גוף',
  2: 'אושר דדון, 24 · ירד 58 ק"ג בתהליך של שנתיים, מגיל 19 עד 21',
  3: 'מיכאל ליסאיצ׳וק · התחיל בגיל 17, אחרי 2 סבבי מסה וחיטוב עלה מ-68 ל-75 ק"ג עם הרכב גוף חדש',
  4: 'בן בטוניה, 23 · ירד 30 ק"ג בחצי שנה, בנה ביטחון עצמי והתקבל לעבודת החלומות שלו + אימון מנטלי שהכפיל את השכר בשנה הראשונה',
  5: 'דאשה, 23 · הורידה 13 ק"ג בתהליך של חצי שנה, תוך שינוי הרכב גוף',
  6: 'אבי, 25 · ירד 20 ק"ג בחצי שנה ובנה קוביות וגוף חדש בחצי שנה נוספת, כולל תהליך מנטלי ומציאת זוגיות',
}
const BA = [1, 2, 3, 4, 5, 6]

/*
 * סליידר לפני/אחרי: גלילה טבעית (אצבע / עכבר / גלגלת) עם snap.
 * בדסקטופ יש גם תנועה עצלה אוטומטית שנעצרת בהובר/מגע ורצה רק כשהסקשן על המסך.
 */
export default function Testimonials() {
  const sliderRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = sliderRef.current
    if (!el) return
    if (matchMedia('(prefers-reduced-motion:reduce)').matches) return
    /*
     * מעבר אוטומטי כרטיס אחרי כרטיס (עובד יחד עם ה-snap, במחשב ובטלפון).
     * באג קודם: גלילה של פיקסל-פיקסל נלחמה ב-scroll-snap והסליידר נתקע, ובמגע זה היה כבוי.
     * נעצר בהובר / מגע / גרירה, וחוזר אחרי כמה שניות בלי נגיעה.
     */
    let visible = false
    let hover = false
    let lastTouch = 0
    const touched = () => (lastTouch = Date.now())
    const io = new IntersectionObserver(es => (visible = es.some(e => e.isIntersecting && e.intersectionRatio > 0.35)), {
      threshold: [0, 0.35, 0.6],
    })
    io.observe(el)
    const step = () => {
      if (!visible || hover || document.hidden || Date.now() - lastTouch < 5000) return
      const cards = [...el.querySelectorAll<HTMLElement>('.ba-card')]
      if (cards.length < 2) return
      const sr = el.getBoundingClientRect()
      // RTL: הכרטיס הבא משמאל. הכרטיס "הנוכחי" = הראשון שהקצה הימני שלו בתוך הסליידר
      const cur = cards.findIndex(c => c.getBoundingClientRect().right <= sr.right + 8)
      const atEnd = Math.abs(el.scrollLeft) >= el.scrollWidth - el.clientWidth - 4
      const next = atEnd || cur < 0 ? cards[0] : cards[Math.min(cur + 1, cards.length - 1)]
      const nr = next.getBoundingClientRect()
      el.scrollBy({ left: nr.right - sr.right, behavior: 'smooth' })
    }
    const t = window.setInterval(step, 3200)
    const enter = (e: PointerEvent) => {
      if (e.pointerType === 'mouse') hover = true
    }
    const leave = () => (hover = false)
    // גרירה עם עכבר (במגע הגלילה טבעית)
    let drag = false
    let lastX = 0
    const onDown = (e: PointerEvent) => {
      touched()
      if (e.pointerType !== 'mouse') return
      drag = true
      lastX = e.clientX
      el.classList.add('dragging')
    }
    const onMove = (e: PointerEvent) => {
      if (!drag) return
      el.scrollLeft -= e.clientX - lastX
      lastX = e.clientX
    }
    const onUp = () => {
      drag = false
      el.classList.remove('dragging')
    }
    el.addEventListener('pointerenter', enter)
    el.addEventListener('pointerleave', leave)
    el.addEventListener('pointerdown', onDown)
    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerup', onUp)
    el.addEventListener('pointercancel', onUp)
    el.addEventListener('touchstart', touched, { passive: true })
    el.addEventListener('wheel', touched, { passive: true })
    return () => {
      clearInterval(t)
      io.disconnect()
      el.removeEventListener('pointerenter', enter)
      el.removeEventListener('pointerleave', leave)
      el.removeEventListener('pointerdown', onDown)
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerup', onUp)
      el.removeEventListener('pointercancel', onUp)
      el.removeEventListener('touchstart', touched)
      el.removeEventListener('wheel', touched)
    }
  }, [])

  return (
    <section id="testimonials">
      <div className="testi-head reveal">
        <h2>הם כבר עברו את זה</h2>
        <p className="sec-sub">אנשים אמיתיים. תוצאות אמיתיות. בלי פילטרים.</p>
      </div>

      {/* סליידר לפני/אחרי */}
      <div className="t-slider" ref={sliderRef}>
        <div className="t-track">
          <div className="t-group">
            {BA.map(n => (
              <div className="ba-card" key={n}>
                <Ph img={`ba-${n}.jpeg`} alt={`לפני ואחרי, מתאמן ${n}`} label={`ba-${n}.jpeg (600×760)`} light sizes="(max-width:860px) 72vw, 300px" />
                <div className="cap">{BA_CAPS[n]}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
