'use client'

import { useCallback, useEffect, useRef, useState, type MutableRefObject } from 'react'
import { vidUrl } from '@/lib/assets'

/*
 * יוטיוב: `thumb` = איכות התמונה הכי גבוהה שקיימת לסרטון (hq720 = 1280×720, נחתך למרכז הכרטיס).
 * לסרטון בלי hq720 נשארים על hqdefault.
 */
type Item =
  | { type: 'yt'; id: string; thumb: 'hq720' | 'hqdefault' }
  | { type: 'vid'; file: string; poster?: string; name?: string }

/*
 * עדויות ערוכות (2026-10): הרילסים שערכנו, דחוסים לווב (720×1280, H.264, faststart) + תמונת פתיחה.
 * הגרסאות הגולמיות (testi-vid-1..6) והסרטונים ביוטיוב ירדו עד שיערכו. להוספת עדות: להעלות
 * reel-<שם>.mp4 + reel-<שם>.jpg ל-assets/vid ב-Supabase ולהוסיף שורה כאן.
 */
const ITEMS: Item[] = [
  { type: 'vid', file: 'reel-shai.mp4', poster: 'reel-shai.jpg', name: 'שי' },
  { type: 'vid', file: 'reel-lev-f.mp4', poster: 'reel-lev-f.jpg', name: 'לב' },
  { type: 'vid', file: 'reel-adi.mp4', poster: 'reel-adi.jpg', name: 'עדי' },
  { type: 'vid', file: 'reel-natan.mp4', poster: 'reel-natan.jpg', name: 'נתן' },
  { type: 'vid', file: 'reel-dan.mp4', poster: 'reel-dan.jpg', name: 'דן' },
  { type: 'vid', file: 'reel-yasno.mp4', poster: 'reel-yasno.jpg', name: 'דניאל' },
  { type: 'vid', file: 'reel-lev-v.mp4', poster: 'reel-lev-v.jpg', name: 'לב' },
]

/*
 * מצב "גלילה טבעית" (scroll-snap + סיבוב אוטומטי עדין): מגע, או מסך צר.
 * מצב "סרט נע" (transform + גרירה עם אינרציה): עכבר על מסך רחב.
 * ההחלטה נעשית ב-JS ונכתבת כ-class על הסטריפ, כדי שה-CSS וה-JS תמיד יסכימו (באג קודם: טאבלט רחב קפא).
 */
const NATIVE_QUERY = '(hover:none), (pointer:coarse), (max-width:860px)'

type ReelProps = {
  id: string
  item: Item
  dragDist: MutableRefObject<number>
  hidden?: boolean
  playing: boolean
  onPlay: (id: string) => void
  onStop: (id: string) => void
}

/*
 * כרטיס אחד.
 * - המדיה נטענת רק כשהכרטיס מתקרב למסך.
 * - וידאו מהאחסון: play() נקרא בתוך מחוות הלחיצה (iOS דורש). `#t=0.1` גורם ל-Safari לצייר פריים ראשון.
 * - יוטיוב: בלחיצה נטען iframe עם autoplay. אין IFrame API — פחות דברים שיכולים להישבר.
 *   אם הדפדפן חוסם autoplay, רואים את נגן היוטיוב עם כפתור ה-play שלו (תמיד נפתח).
 * - עצירה (pause של המשתמש, סוף הסרטון, יציאה מהמסך, לחיצה מחוץ לכרטיס, כפתור ×) מחזירה את הקרוסלה לסיבוב.
 */
function Reel({ id, item, dragDist, hidden, playing, onPlay, onStop }: ReelProps) {
  const ref = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [near, setNear] = useState(false)
  const [offscreen, setOffscreen] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const ioNear = new IntersectionObserver(
      es => {
        if (es.some(e => e.isIntersecting)) {
          setNear(true)
          ioNear.disconnect()
        }
      },
      { rootMargin: '200px 600px 200px 600px' }
    )
    ioNear.observe(el)
    const ioVis = new IntersectionObserver(es => es.forEach(e => setOffscreen(!e.isIntersecting || e.intersectionRatio < 0.2)), {
      threshold: [0, 0.2],
    })
    ioVis.observe(el)
    return () => {
      ioNear.disconnect()
      ioVis.disconnect()
    }
  }, [])

  // יצא מהמסך בזמן ניגון → עוצרים (אלא אם במסך מלא)
  useEffect(() => {
    if (!playing || !offscreen) return
    const v = videoRef.current as (HTMLVideoElement & { webkitDisplayingFullscreen?: boolean }) | null
    if (document.fullscreenElement || v?.webkitDisplayingFullscreen) return
    onStop(id)
  }, [offscreen, playing, id, onStop])

  // הפסיק לנגן (כרטיס אחר התחיל / נעצר) → משתיקים ומסתירים פקדים
  useEffect(() => {
    if (playing) return
    setLoading(false)
    const v = videoRef.current
    if (v) {
      if (!v.paused) v.pause()
      v.muted = true
      v.controls = false
    }
  }, [playing])

  const handlePlay = () => {
    if (dragDist.current > 8) return
    if (item.type === 'vid') {
      const v = videoRef.current
      if (!v) return
      v.muted = false
      v.controls = true
      setLoading(v.readyState < 3)
      v.play().catch(() => setLoading(false))
    }
    onPlay(id)
  }

  const ytThumb = item.type === 'yt' ? `https://i.ytimg.com/vi/${item.id}/${item.thumb}.jpg` : ''

  return (
    <div className={`reel${playing ? ' is-playing' : ''}${loading ? ' is-loading' : ''}`} ref={ref} data-reel={id}>
      {near && item.type === 'vid' && (
        <video
          ref={videoRef}
          src={`${vidUrl(item.file)}#t=0.1`}
          poster={item.poster ? vidUrl(item.poster) : undefined}
          muted
          playsInline
          preload="metadata"
          onPlaying={() => setLoading(false)}
          onWaiting={() => playing && setLoading(true)}
          onPause={e => {
            const v = e.currentTarget
            // pause של המשתמש (לא סוף, לא seek) → הקרוסלה ממשיכה; לחיצה נוספת ממשיכה מאותה נקודה
            if (playing && !v.ended && !v.seeking) onStop(id)
          }}
          onEnded={() => onStop(id)}
        />
      )}
      {near && item.type === 'yt' && !playing && <img className="reel-thumb" src={ytThumb} alt="" loading="lazy" decoding="async" />}
      {item.type === 'yt' && playing && (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${item.id}?autoplay=1&playsinline=1&rel=0&modestbranding=1`}
          title="עדות לקוח"
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
        />
      )}
      {near && !playing && (
        <button type="button" className="reel-play" onClick={handlePlay} aria-label="הפעל וידאו" tabIndex={hidden ? -1 : 0}>
          <span className="play-ic" aria-hidden="true" />
        </button>
      )}
      {playing && item.type === 'yt' && (
        <button type="button" className="reel-close" onClick={() => onStop(id)} aria-label="סגור וידאו">
          ×
        </button>
      )}
      {loading && <span className="reel-spin" aria-hidden="true" />}
    </div>
  )
}

/*
 * קרוסלת עדויות הוידאו.
 * סרט נע (עכבר, מסך רחב): סיבוב אוטומטי + גרירה עם אינרציה, 2 קבוצות משוכפלות ללולאה.
 * גלילה טבעית (מגע/מסך צר): scroll-snap + מעבר אוטומטי לכרטיס הבא כל כמה שניות, שנעצר כשנוגעים.
 * בשני המצבים: עוצר בזמן ניגון ורק כשהסקשן על המסך.
 */
export default function Reels() {
  const sectionRef = useRef<HTMLElement>(null)
  const stripRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const dragDist = useRef(0)
  const activeRef = useRef<string | null>(null)
  const [active, setActive] = useState<string | null>(null)
  const [native, setNative] = useState(false)

  const onPlay = useCallback((id: string) => {
    activeRef.current = id
    setActive(id)
  }, [])
  const onStop = useCallback((id: string) => {
    setActive(cur => {
      const next = cur === id ? null : cur
      activeRef.current = next
      return next
    })
  }, [])

  // לחיצה מחוץ לכרטיס שמנגן → עוצרים אותו
  useEffect(() => {
    if (!active) return
    const onDown = (e: PointerEvent) => {
      if (!(e.target as HTMLElement).closest(`[data-reel="${active}"]`)) onStop(active)
    }
    document.addEventListener('pointerdown', onDown)
    return () => document.removeEventListener('pointerdown', onDown)
  }, [active, onStop])

  useEffect(() => {
    const mq = matchMedia(NATIVE_QUERY)
    const set = () => setNative(mq.matches)
    set()
    mq.addEventListener('change', set)
    return () => mq.removeEventListener('change', set)
  }, [])

  // ── מצב סרט נע ──
  useEffect(() => {
    if (native) return
    const section = sectionRef.current
    const strip = stripRef.current
    const track = trackRef.current
    if (!section || !strip || !track) return
    const reduced = matchMedia('(prefers-reduced-motion:reduce)').matches
    let off = 0,
      gw = 0,
      drag = false,
      lastX = 0,
      vel = 0,
      raf = 0,
      visible = false,
      hover = false
    const measure = () => {
      gw = track.scrollWidth / 2
    }
    const loop = () => {
      raf = 0
      if (!visible) return
      raf = requestAnimationFrame(loop)
      if (!gw) {
        measure()
        if (!gw) return
      }
      if (!drag) {
        // מאט כשהעכבר מעל הקרוסלה, עוצר בזמן ניגון
        if (!reduced && !activeRef.current) off += hover ? 0.18 : 0.6
        off += vel
        vel *= 0.94
        if (Math.abs(vel) < 0.05) vel = 0
      }
      off = ((off % gw) + gw) % gw
      track.style.transform = `translate3d(${off.toFixed(1)}px,0,0)`
    }
    const start = () => {
      if (!raf) raf = requestAnimationFrame(loop)
    }
    const onDown = (e: PointerEvent) => {
      if ((e.target as HTMLElement).closest('.reel.is-playing')) return
      drag = true
      lastX = e.clientX
      vel = 0
      dragDist.current = 0
      strip.classList.add('dragging')
      addEventListener('pointermove', onMove)
      addEventListener('pointerup', onUp)
      addEventListener('pointercancel', onUp)
    }
    const onMove = (e: PointerEvent) => {
      if (!drag) return
      const dx = e.clientX - lastX
      lastX = e.clientX
      off += dx
      vel = dx
      dragDist.current += Math.abs(dx)
    }
    const onUp = () => {
      drag = false
      strip.classList.remove('dragging')
      removeEventListener('pointermove', onMove)
      removeEventListener('pointerup', onUp)
      removeEventListener('pointercancel', onUp)
    }
    const enter = () => (hover = true)
    const leave = () => (hover = false)
    const io = new IntersectionObserver(
      es => {
        visible = es.some(e => e.isIntersecting)
        if (visible) start()
      },
      { rootMargin: '120px 0px' }
    )
    io.observe(section)
    strip.addEventListener('pointerdown', onDown)
    strip.addEventListener('mouseenter', enter)
    strip.addEventListener('mouseleave', leave)
    addEventListener('resize', measure)
    return () => {
      io.disconnect()
      if (raf) cancelAnimationFrame(raf)
      removeEventListener('resize', measure)
      strip.removeEventListener('pointerdown', onDown)
      strip.removeEventListener('mouseenter', enter)
      strip.removeEventListener('mouseleave', leave)
      onUp()
      track.style.transform = ''
    }
  }, [native])

  // ── מצב גלילה טבעית: מעבר אוטומטי לכרטיס הבא ──
  useEffect(() => {
    if (!native) return
    const section = sectionRef.current
    const strip = stripRef.current
    if (!section || !strip) return
    if (matchMedia('(prefers-reduced-motion:reduce)').matches) return
    let visible = false
    let lastTouch = 0
    const touched = () => (lastTouch = Date.now())
    const io = new IntersectionObserver(es => (visible = es.some(e => e.isIntersecting && e.intersectionRatio > 0.45)), {
      threshold: [0, 0.45, 0.6],
    })
    io.observe(strip)
    const step = () => {
      if (!visible || activeRef.current || document.hidden || Date.now() - lastTouch < 6000) return
      const cards = [...strip.querySelectorAll<HTMLElement>('.reels-group:first-child .reel')]
      if (!cards.length) return
      const sr = strip.getBoundingClientRect()
      const mid = sr.left + sr.width / 2
      let cur = 0
      let best = Infinity
      cards.forEach((c, i) => {
        const r = c.getBoundingClientRect()
        const d = Math.abs(r.left + r.width / 2 - mid)
        if (d < best) {
          best = d
          cur = i
        }
      })
      // RTL: הכרטיס הבא נמצא משמאל. בסוף חוזרים לראשון.
      const next = cards[(cur + 1) % cards.length]
      const nr = next.getBoundingClientRect()
      strip.scrollBy({ left: nr.left + nr.width / 2 - mid, behavior: 'smooth' })
    }
    const t = setInterval(step, 3800)
    strip.addEventListener('touchstart', touched, { passive: true })
    strip.addEventListener('pointerdown', touched)
    strip.addEventListener('wheel', touched, { passive: true })
    return () => {
      clearInterval(t)
      io.disconnect()
      strip.removeEventListener('touchstart', touched)
      strip.removeEventListener('pointerdown', touched)
      strip.removeEventListener('wheel', touched)
    }
  }, [native])

  const group = (prefix: string, hidden?: boolean) =>
    ITEMS.map((it, i) => {
      const id = `${prefix}-${i}`
      return (
        <Reel key={id} id={id} item={it} dragDist={dragDist} hidden={hidden} playing={active === id} onPlay={onPlay} onStop={onStop} />
      )
    })

  return (
    <section id="reels" ref={sectionRef}>
      <span className="floater" data-fspeed="-0.06" style={{ top: '18%', right: '12%' }} aria-hidden="true">
        ✦
      </span>
      <div className="reels-head reveal">
        <h2>ככה נראית ההתחלה האחרונה.</h2>
        <p>מתאמנים אמיתיים מספרים על התהליך, במילים שלהם. בלי פילטרים ובלי תסריט.</p>
      </div>
      <div className={`reels-strip reveal${native ? ' native' : ''}`} data-d="1" id="reelsStrip" ref={stripRef}>
        <div className="reels-track" id="reelsTrack" ref={trackRef}>
          <div className="reels-group">{group('a')}</div>
          {!native && (
            <div className="reels-group" aria-hidden="true">
              {group('b', true)}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
