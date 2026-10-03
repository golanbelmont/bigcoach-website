'use client'

import { useEffect, useRef } from 'react'

/* פס התקדמות קריאה אדום בראש הדף */
export default function ReadProgress() {
  const ref = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    let raf = 0
    const tick = () => {
      raf = 0
      const h = document.documentElement
      const max = h.scrollHeight - innerHeight
      if (ref.current) ref.current.style.transform = `scaleX(${max > 0 ? Math.min(1, scrollY / max) : 0})`
    }
    const on = () => {
      if (!raf) raf = requestAnimationFrame(tick)
    }
    tick()
    addEventListener('scroll', on, { passive: true })
    addEventListener('resize', on)
    return () => {
      removeEventListener('scroll', on)
      removeEventListener('resize', on)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])
  return (
    <span className="r-progress" aria-hidden="true">
      <span ref={ref} />
    </span>
  )
}
