'use client'

import { useEffect, useRef } from 'react'

/*
 * נרטיב הגלילה: שורות נדלקות בזו אחר זו; שורת "יום ראשון" מפרגמנטים.
 * ההתקדמות מחושבת ב-rAF עם החלקת lerp — חלק יותר מ-scroll event.
 */
export default function Story() {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const story = ref.current
    if (!story) return
    const sticky = story.querySelector<HTMLElement>('.story-sticky')!
    const stack = story.querySelector<HTMLElement>('.story-lines')!
    const lines = [...story.querySelectorAll<HTMLElement>('.story-line:not(.story-frags),.frag')]
    // לכל שורה: האלמנט שלפיו ממרכזים (פרגמנט → השורה שמכילה אותו)
    const anchors = lines.map(l => (l.classList.contains('frag') ? (l.parentElement as HTMLElement) : l))
    const reduced = false // בהחלטת הלקוח: האנימציה רצה גם כש-Windows מכבה אנימציות
    let raf = 0
    /*
     * כל שורה צמודה ישירות למיקום הגלילה (scrub), בלי החלקה ובלי transition.
     * באג קודם: lerp + transition גרמו לטקסט "להתמלא לבד" באיחור אחרי שהגלילה נעצרה.
     * עכשיו: גוללים קצת → השורה עולה קצת. עוצרים → הכל עוצר באותו רגע.
     * "האורות" נשארים: שורה שעברה מתעמעמת בהדרגה כשהבאה נדלקת.
     */
    /*
     * 2026-10 (הלקוח: "עולה בדיליי ומכוער"):
     * - ההדלקה מתחילה כבר כשהסקשן נכנס למסך (לא רק כשהוא מגיע לראש) — אין יותר מסך שחור ריק.
     * - כל שורה נדלקת בקטע גלילה קצר עם easing, אז היא "קופצת" נקי במקום להיות חצי-שקופה לאורך זמן.
     * - הפריסה קבועה: הפרגמנטים לא מתרחבים (בלי max-width), שורות זזות רק 14px — אין חפיפה ואין ריצוד.
     * - הערימה זזה (טלפרומפטר) רק אם היא באמת גבוהה מהמסך.
     */
    const ease = (t: number) => t * t * (3 - 2 * t)
    const clamp = (t: number) => Math.min(1, Math.max(0, t))
    const render = () => {
      raf = 0
      const r = story.getBoundingClientRect()
      const vh = innerHeight
      // התחלה: ראש הסקשן ב-55% מגובה המסך. סוף: 85% מהדרך עד שהסקשן משתחרר
      const start = vh * 0.55
      const end = -(story.offsetHeight - vh) * 0.85
      const p = clamp((start - r.top) / Math.max(1, start - end))
      const pos = reduced ? lines.length : p * lines.length
      let cur = 0
      lines.forEach((l, i) => {
        const k = ease(clamp((pos - i) / 0.55)) // 0 = כבויה, 1 = דולקת
        if (k > 0) cur = i
        // מתעמעמת כשהשורה הבאה (מאלמנט אחר) נדלקת
        const nextOther = lines.findIndex((_, j) => j > i && anchors[j] !== anchors[i])
        const dimK = nextOther < 0 ? 0 : ease(clamp((pos - nextOther) / 0.55))
        l.style.opacity = String(k * (1 - 0.65 * dimK))
        l.style.transform = k < 1 ? `translate3d(0,${((1 - k) * 14).toFixed(1)}px,0)` : ''
      })
      // טלפרומפטר: רק אם הערימה גבוהה מהמסך — אחרת היא נשארת במקום, ממורכזת
      const H = sticky.clientHeight
      let ty = 0
      if (stack.offsetHeight > H * 0.9) {
        const a = anchors[cur]
        const center = stack.offsetTop + a.offsetTop + a.offsetHeight / 2
        ty = Math.min(0, Math.max(H - (stack.offsetTop + stack.offsetHeight) - H * 0.06, H / 2 - center))
      }
      stack.style.transform = ty ? `translate3d(0,${ty.toFixed(1)}px,0)` : ''
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(render)
    }
    render()
    addEventListener('scroll', onScroll, { passive: true })
    addEventListener('resize', onScroll)
    return () => {
      removeEventListener('scroll', onScroll)
      removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <section id="story" ref={ref}>
      <div className="story-sticky">
        <div className="story-lines">
          <p className="story-line">אתה מכיר את זה.</p>
          <p className="story-line story-frags">
            <span className="frag">יום ראשון.</span>
            <span className="frag">תפריט חדש.</span>
            <span className="frag">מוטיבציה בשמיים.</span>
          </p>
          <p className="story-line">חודש מושלם שאתה על הדברים.</p>
          <p className="story-line">ואז החיים קורים ודברים.</p>
          <p className="story-line">ואתה חוזר לנקודת ההתחלה.</p>
          <p className="story-line final">לא הפעם.</p>
        </div>
      </div>
      <div className="story-spacer" aria-hidden="true" />
    </section>
  )
}
