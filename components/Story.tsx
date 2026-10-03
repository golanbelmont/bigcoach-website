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
    let raf = 0
    let smooth = 0
    let ty = 0
    let visible = false
    /*
     * הלולאה רצה רק כשהסקשן על המסך.
     * "טלפרומפטר": אם ערימת השורות גבוהה מהמסך (טלפונים), הערימה עולה כך שהשורה האחרונה שנדלקה
     * תמיד באמצע המסך — אחרת "לא הפעם." נחתך מתחת למסך ונראה כאילו האנימציה נתקעה.
     * שורות שכבר עברו מתעמעמות, כדי שהעין תלך לשורה החדשה.
     */
    const tick = () => {
      raf = 0
      if (!visible) return
      raf = requestAnimationFrame(tick)
      const total = story.offsetHeight - innerHeight
      const p = Math.min(1, Math.max(0, -story.getBoundingClientRect().top / Math.max(1, total)))
      smooth += (p - smooth) * 0.22
      if (Math.abs(p - smooth) < 0.001) smooth = p
      // מסיימים להדליק ב-85% מהגלילה, כדי שהשורה האחרונה תספיק להישאר על המסך רגע
      const lit = Math.min(lines.length, Math.ceil((smooth / 0.85) * lines.length))
      lines.forEach((l, i) => {
        l.classList.toggle('lit', i < lit)
        l.classList.toggle('dim', i < lit - 1 && anchors[i] !== anchors[lit - 1])
      })
      const cur = anchors[Math.max(0, lit - 1)]
      const H = sticky.clientHeight
      const center = stack.offsetTop + cur.offsetTop + cur.offsetHeight / 2
      const target = Math.min(0, Math.max(H - (stack.offsetTop + stack.offsetHeight) - H * 0.08, H / 2 - center))
      ty += (target - ty) * 0.14
      if (Math.abs(target - ty) < 0.3) ty = target
      stack.style.transform = ty ? `translate3d(0,${ty.toFixed(1)}px,0)` : ''
    }
    const io = new IntersectionObserver(es => {
      visible = es.some(e => e.isIntersecting)
      if (visible && !raf) raf = requestAnimationFrame(tick)
    })
    io.observe(story)
    return () => {
      io.disconnect()
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
