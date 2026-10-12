'use client'

import { useEffect, useRef, useState } from 'react'
import { vidUrl } from '@/lib/assets'

/*
 * "קצת ממה שאני מסביר" (2026-10-12): רילסים של תוכן (לא עדויות) שהורדו מהאינסטגרם של ביג קואוץ'
 * ומתארחים אצלנו (assets/vid/ig-<id>.mp4 + .jpg), כדי שינוגנו בתוך האתר ולא יוציאו לאינסטגרם.
 * להוספה: להוריד את הרילס, לדחוס (720×1280, H.264, faststart), להעלות ig-<id>.mp4 + ig-<id>.jpg ולהוסיף שורה.
 */
type Ig = { id: string; tag: string; title: string }

const IG: Ig[] = [
  { id: 'Dd61Doqk382', tag: 'תזונה', title: 'אוכלת 1200 קלוריות ולא יורדת?' },
  { id: 'DeCjXxOjqrT', tag: 'התמדה', title: 'מוטיבציה? עזבו.' },
  { id: 'Ddl4_h-ipss', tag: 'מדדים', title: 'לא נשקלת בהתחלה?' },
  { id: 'DeGzATRiWu_', tag: 'ראש', title: 'למי לא להקשיב' },
  { id: 'DdrKnvkiW1Y', tag: 'התהליך', title: 'מי מצליח אצלי ומי לא' },
  { id: 'DeXJh11j7H3', tag: 'התחלה', title: 'ומה אם דווקא תצליח?' },
]

function Card({ ig, playing, onPlay, onStop }: { ig: Ig; playing: boolean; onPlay: () => void; onStop: () => void }) {
  const ref = useRef<HTMLDivElement>(null)
  const v = useRef<HTMLVideoElement>(null)
  const [near, setNear] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      es => {
        if (es.some(e => e.isIntersecting)) {
          setNear(true)
          io.disconnect()
        }
      },
      { rootMargin: '300px 600px' }
    )
    io.observe(el)
    // יצא מהמסך בזמן ניגון → עוצרים
    const vis = new IntersectionObserver(es => es.forEach(e => !e.isIntersecting && v.current && !v.current.paused && v.current.pause()), {
      threshold: 0,
    })
    vis.observe(el)
    return () => {
      io.disconnect()
      vis.disconnect()
    }
  }, [])

  // כרטיס אחר התחיל לנגן → עוצרים את זה
  useEffect(() => {
    if (!playing && v.current && !v.current.paused) v.current.pause()
  }, [playing])

  const play = () => {
    const el = v.current
    if (!el) return
    el.muted = false
    el.controls = true
    el.play().catch(() => {})
    onPlay()
  }

  return (
    <div className={`ig-card${playing ? ' is-playing' : ''}`} ref={ref}>
      {near && (
        <video
          ref={v}
          src={`${vidUrl(`ig-${ig.id}.mp4`)}#t=0.1`}
          poster={vidUrl(`ig-${ig.id}.jpg`)}
          playsInline
          preload="metadata"
          onPause={e => !e.currentTarget.seeking && onStop()}
          onEnded={onStop}
        />
      )}
      {!playing && (
        <button type="button" className="ig-face" onClick={play} aria-label={`הפעל: ${ig.title}`}>
          <span className="ig-tag">{ig.tag}</span>
          <span className="ig-play" aria-hidden="true">
            <span className="play-ic" />
          </span>
          <span className="ig-title">{ig.title}</span>
        </button>
      )}
    </div>
  )
}

export default function IgVideos() {
  const [active, setActive] = useState<string | null>(null)
  return (
    <section id="ig-videos">
      <div className="ig-head reveal">
        <h2>קצת ממה שאני מסביר כל יום.</h2>
        <p className="sec-sub">סרטונים קצרים. תזונה, אימונים והראש שמאחוריהם. בלי חפירות.</p>
      </div>
      <div className="ig-strip reveal" data-d="1">
        {IG.map(ig => (
          <Card
            key={ig.id}
            ig={ig}
            playing={active === ig.id}
            onPlay={() => setActive(ig.id)}
            onStop={() => setActive(cur => (cur === ig.id ? null : cur))}
          />
        ))}
      </div>
    </section>
  )
}
