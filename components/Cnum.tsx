'use client'

import { useEffect, useRef } from 'react'

/* מונה חי — נספר כשנכנס למסך (IntersectionObserver), עם easing */
export default function Cnum({ count }: { count: number }) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    // ב-HTML המספר הסופי (אם ה-JS לא רץ, לא נתקעים על 0). מאפסים רק אם המונה עוד לא על המסך.
    if (el.getBoundingClientRect().top < innerHeight) return
    el.textContent = '0'
    const io = new IntersectionObserver(
      es =>
        es.forEach(en => {
          if (!en.isIntersecting) return
          io.unobserve(en.target)
          const dur = 1400
          const t0 = performance.now()
          const tick = (t: number) => {
            const p = Math.min(1, (t - t0) / dur)
            const ease = 1 - Math.pow(1 - p, 3)
            el.textContent = Math.round(count * ease).toLocaleString('en-US')
            if (p < 1) requestAnimationFrame(tick)
          }
          requestAnimationFrame(tick)
        }),
      { threshold: 0.5 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [count])

  return (
    <span ref={ref} className="cnum">
      {count.toLocaleString('en-US')}
    </span>
  )
}
