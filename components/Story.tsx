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
    const reduced = matchMedia('(prefers-reduced-motion:reduce)').matches
    let raf = 0
    /*
     * כל שורה צמודה ישירות למיקום הגלילה (scrub), בלי החלקה ובלי transition.
     * באג קודם: lerp + transition גרמו לטקסט "להתמלא לבד" באיחור אחרי שהגלילה נעצרה.
     * עכשיו: גוללים קצת → השורה עולה קצת. עוצרים → הכל עוצר באותו רגע.
     * "האורות" נשארים: שורה שעברה מתעמעמת בהדרגה כשהבאה נדלקת.
     */
    const render = () => {
      raf = 0
      const total = story.offsetHeight - innerHeight
      const p = Math.min(1, Math.max(0, -story.getBoundingClientRect().top / Math.max(1, total)))
      // מסיימים להדליק ב-85% מהגלילה, כדי שהשורה האחרונה תישאר רגע על המסך
      const pos = reduced ? lines.length : Math.min(lines.length, (p / 0.85) * lines.length)
      let cur = 0
      lines.forEach((l, i) => {
        const k = Math.min(1, Math.max(0, pos - i)) // 0 = כבויה, 1 = דולקת
        if (k > 0) cur = i
        // מתעמעמת כשהשורה הבאה (מאלמנט אחר) נדלקת
        const nextOther = lines.findIndex((_, j) => j > i && anchors[j] !== anchors[i])
        const dimK = nextOther < 0 ? 0 : Math.min(1, Math.max(0, pos - nextOther))
        l.style.opacity = String(k * (1 - 0.7 * dimK))
        l.style.transform = k < 1 ? `translate3d(0,${((1 - k) * 40).toFixed(1)}px,0)` : ''
        if (l.classList.contains('frag')) {
          l.style.maxWidth = k < 1 ? `${(k * 16).toFixed(2)}em` : '16em'
          if (l.nextElementSibling) l.style.marginInlineEnd = `${(k * 0.45).toFixed(3)}em`
        }
      })
      // טלפרומפטר: אם הערימה גבוהה מהמסך, מזיזים אותה כך שהשורה הנוכחית תישאר באמצע
      const a = anchors[cur]
      const H = sticky.clientHeight
      const center = stack.offsetTop + a.offsetTop + a.offsetHeight / 2
      const ty = Math.min(0, Math.max(H - (stack.offsetTop + stack.offsetHeight) - H * 0.08, H / 2 - center))
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
