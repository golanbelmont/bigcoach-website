'use client'

import { useEffect } from 'react'

/*
 * שכבת האינטראקציה הגלובלית. רץ פעם אחת אחרי ה-mount:
 *
 * 1. כוריאוגרפיית גלילה — תיוג אוטומטי של rv-h / rv-img + stagger, ו-IntersectionObserver
 *    שמוסיף .in (זהה לאתר המקורי; rv-img נחשף דרך ה-parent בגלל באג clip-path של Chrome).
 * 2. מנוע גלילה ב-rAF יחיד עם lerp: פס התקדמות, פרלקסת הירו, אלמנטים צפים —
 *    במקום scroll events, לתנועה חלקה בלי jank.
 * 3. סמן מותאם + כפתורים מגנטיים + tilt לכרטיסים + סמן גרירה לקרוסלה (hover+fine בלבד).
 */
export default function Fx() {
  // 1) כוריאוגרפיית reveal
  useEffect(() => {
    document.querySelectorAll('main h2,.final-kicker,.sec-sub,.reels-head p').forEach(h => h.classList.add('rv-h'))
    // קו האדום מתחת לכותרת מתיישר לפי יישור הכותרת
    document.querySelectorAll('main h2').forEach(h => {
      if (getComputedStyle(h).textAlign === 'center') h.classList.add('h-center')
    })
    document.querySelectorAll<HTMLElement>('.about-text p,.golan-card p').forEach((el, i) => {
      el.classList.add('rv-h')
      el.style.transitionDelay = `${0.08 + (i % 4) * 0.08}s`
    })
    document.querySelectorAll<HTMLElement>('.sec-sub').forEach(el => (el.style.transitionDelay = '.15s'))

    const io = new IntersectionObserver(
      es =>
        es.forEach(e => {
          if (e.isIntersecting) {
            e.target.classList.add('in')
            io.unobserve(e.target)
          }
        }),
      { threshold: 0.12 }
    )
    const pending = new Set(document.querySelectorAll<HTMLElement>('.reveal,.rv-h'))
    pending.forEach(el => io.observe(el))
    // רשת ביטחון: גלילה מהירה / קפיצה לעוגן יכולות לדלג על ה-IO — כל מה שכבר מעל תחתית המסך נחשף.
    let t = 0
    const sweep = () => {
      t = 0
      const lim = innerHeight * 0.95
      pending.forEach(el => {
        if (el.classList.contains('in')) return pending.delete(el)
        if (el.getBoundingClientRect().top < lim) {
          el.classList.add('in')
          io.unobserve(el)
          pending.delete(el)
        }
      })
      if (!pending.size) removeEventListener('scroll', onScroll)
    }
    const onScroll = () => {
      if (!t) t = window.setTimeout(sweep, 150)
    }
    addEventListener('scroll', onScroll, { passive: true })
    return () => {
      io.disconnect()
      removeEventListener('scroll', onScroll)
      clearTimeout(t)
    }
  }, [])

  // 2) מנוע הגלילה — rAF יחיד, ערכים מוחלקים ב-lerp
  useEffect(() => {
    const progressBar = document.getElementById('progressBar')
    const heroBg = document.querySelector<HTMLElement>('.hero-bg .ph')
    let raf = 0
    let sProg = 0
    let sHero = 0
    const mobile = matchMedia('(max-width:860px)')
    const reduced = matchMedia('(prefers-reduced-motion:reduce)')
    const off = () => mobile.matches // בהחלטת הלקוח: לא מכבים לפי reduced-motion
    void reduced
    // במובייל ה-floaters מוסתרים — לא מודדים אותם (חוסך forced reflow בזמן ההידרציה)
    const floaters = off() ? [] : [...document.querySelectorAll<HTMLElement>('.floater')]
    const bases = floaters.map(f => f.getBoundingClientRect().top + scrollY)

    // הלולאה מתעוררת בגלילה ונרדמת כשהערכים התכנסו — לא רצה כל פריים ברקע.
    const tick = () => {
      raf = 0
      let settled = true
      const h = document.documentElement
      const max = h.scrollHeight - innerHeight
      const pT = max > 0 ? scrollY / max : 0
      sProg += (pT - sProg) * 0.25
      if (Math.abs(pT - sProg) < 0.0005) sProg = pT
      else settled = false
      if (progressBar) progressBar.style.transform = `scaleX(${sProg.toFixed(4)})`

      if (off()) {
        if (heroBg) heroBg.style.transform = ''
      } else {
        const yT = Math.min(scrollY, innerHeight) * 0.12
        sHero += (yT - sHero) * 0.18
        if (Math.abs(yT - sHero) < 0.05) sHero = yT
        else settled = false
        if (heroBg) heroBg.style.transform = `translate3d(0,${sHero.toFixed(1)}px,0)`

        const y = scrollY
        floaters.forEach((f, i) => {
          const speed = parseFloat(f.dataset.fspeed || '0')
          f.style.transform = `translate3d(0,${((y - bases[i]) * speed).toFixed(1)}px,0)`
        })
      }
      if (!settled) raf = requestAnimationFrame(tick)
    }
    const wake = () => {
      if (!raf) raf = requestAnimationFrame(tick)
    }
    wake()
    addEventListener('scroll', wake, { passive: true })
    addEventListener('resize', wake)
    return () => {
      if (raf) cancelAnimationFrame(raf)
      removeEventListener('scroll', wake)
      removeEventListener('resize', wake)
    }
  }, [])

  // 3) סמן מותאם + מגנטיות + tilt
  useEffect(() => {
    const fine = matchMedia('(hover:hover) and (pointer:fine)').matches
    const reduced = matchMedia('(prefers-reduced-motion:reduce)').matches
    if (!fine) return
    void reduced

    const cleanups: (() => void)[] = []
    const dot = document.createElement('div')
    dot.className = 'cursor-dot'
    const ring = document.createElement('div')
    ring.className = 'cursor-ring'
    document.body.append(dot, ring)
    cleanups.push(() => {
      dot.remove()
      ring.remove()
    })

    let mx = innerWidth / 2,
      my = innerHeight / 2,
      rx = mx,
      ry = my,
      raf = 0
    const onMove = (e: MouseEvent) => {
      mx = e.clientX
      my = e.clientY
      dot.style.transform = `translate(${mx}px,${my}px) translate(-50%,-50%)`
    }
    addEventListener('mousemove', onMove, { passive: true })
    cleanups.push(() => removeEventListener('mousemove', onMove))
    const loop = () => {
      rx += (mx - rx) * 0.16
      ry += (my - ry) * 0.16
      ring.style.transform = `translate(${rx.toFixed(1)}px,${ry.toFixed(1)}px) translate(-50%,-50%)`
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    cleanups.push(() => cancelAnimationFrame(raf))

    const onOver = (e: MouseEvent) => {
      ring.classList.toggle('on', !!(e.target as HTMLElement).closest('a,button'))
    }
    document.addEventListener('mouseover', onOver)
    cleanups.push(() => document.removeEventListener('mouseover', onOver))

    // סמן גרירה אדום מעל קרוסלת הסרטונים
    const strip = document.getElementById('reelsStrip')
    if (strip) {
      const dc = document.createElement('div')
      dc.className = 'drag-cursor'
      const s1 = document.createElement('span')
      s1.textContent = '›'
      const s2 = document.createElement('span')
      s2.textContent = '‹'
      dc.append(s1, s2)
      document.body.appendChild(dc)
      const enter = () => {
        dc.classList.add('show')
        document.body.classList.add('hide-cursor-fx')
      }
      const leave = () => {
        dc.classList.remove('show', 'grab')
        document.body.classList.remove('hide-cursor-fx')
      }
      const move = (e: MouseEvent) => {
        dc.style.left = `${e.clientX}px`
        dc.style.top = `${e.clientY}px`
      }
      const down = () => dc.classList.add('grab')
      const up = () => dc.classList.remove('grab')
      strip.addEventListener('mouseenter', enter)
      strip.addEventListener('mouseleave', leave)
      strip.addEventListener('mousemove', move)
      strip.addEventListener('pointerdown', down)
      strip.addEventListener('pointerup', up)
      strip.addEventListener('pointercancel', up)
      cleanups.push(() => {
        dc.remove()
        strip.removeEventListener('mouseenter', enter)
        strip.removeEventListener('mouseleave', leave)
        strip.removeEventListener('mousemove', move)
        strip.removeEventListener('pointerdown', down)
        strip.removeEventListener('pointerup', up)
        strip.removeEventListener('pointercancel', up)
      })
    }

    // כפתורים מגנטיים — הסלקטורים הקבועים מהמקור
    document.querySelectorAll<HTMLElement>('.btn,.btn-join,.golan-lead-btn,.lead-submit').forEach(b => {
      const move = (e: MouseEvent) => {
        const r = b.getBoundingClientRect()
        b.style.transform = `translate(${(((e.clientX - r.left - r.width / 2) / r.width) * 10).toFixed(1)}px,${(((e.clientY - r.top - r.height / 2) / r.height) * 8).toFixed(1)}px)`
      }
      const leave = () => {
        b.style.transform = ''
      }
      b.addEventListener('mousemove', move)
      b.addEventListener('mouseleave', leave)
      cleanups.push(() => {
        b.removeEventListener('mousemove', move)
        b.removeEventListener('mouseleave', leave)
      })
    })

    // tilt תלת-ממדי לכרטיסים
    document.querySelectorAll<HTMLElement>('.mcard,.tcard').forEach(c => {
      const move = (e: MouseEvent) => {
        const r = c.getBoundingClientRect()
        const dx = (e.clientX - r.left) / r.width - 0.5
        const dy = (e.clientY - r.top) / r.height - 0.5
        c.style.setProperty('--mx', `${(e.clientX - r.left).toFixed(0)}px`)
        c.style.setProperty('--my', `${(e.clientY - r.top).toFixed(0)}px`)
        c.style.transform = `perspective(700px) rotateX(${(-dy * 6).toFixed(2)}deg) rotateY(${(dx * 8).toFixed(2)}deg) translateY(-4px)`
      }
      const leave = () => {
        c.style.transform = ''
      }
      c.addEventListener('mousemove', move)
      c.addEventListener('mouseleave', leave)
      cleanups.push(() => {
        c.removeEventListener('mousemove', move)
        c.removeEventListener('mouseleave', leave)
      })
    })

    return () => cleanups.forEach(fn => fn())
  }, [])

  return null

  // 4) מעקב קליקים לוואטסאפ: על איזה מסלול לחצו ומאיפה באתר (בלי פרטים אישיים) → גיליון הלידים
  useEffect(() => {
    const PLACES: Record<string, string> = {
      hero: 'הירו', story: 'הסיפור', reels: 'עדויות', about: 'עליי', golan: 'עליי', method: 'השיטה',
      programs: 'מסלולים', testimonials: 'תוצאות', faq: 'שאלות', final: 'פוטר',
    }
    const labelOf = (href: string) => {
      let t = ''
      try { t = new URL(href).searchParams.get('text') || '' } catch { /* קישור בלי טקסט */ }
      if (t.includes('קרבי')) return 'הכנה לקרבי'
      if (t.includes('BIG BOX')) return 'BIG BOX'
      if (t.includes('פרימיום')) return 'פרימיום'
      if (t.includes('קבוצה')) return 'אימוני קבוצה'
      if (t.includes('אונליין')) return 'ליווי אונליין'
      return 'שיחת היכרות כללית'
    }
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.('a[href*="wa.me"]') as HTMLAnchorElement | null
      if (!a) return
      const sec = a.closest('section[id],footer[id],[id="golan"]') as HTMLElement | null
      const place = sec ? PLACES[sec.id] || sec.id : 'כפתור צף'
      const payload = JSON.stringify({ type: 'wa_click', label: labelOf(a.href), place })
      try {
        navigator.sendBeacon('/api/lead', new Blob([payload], { type: 'application/json' }))
      } catch { /* לא חוסם את המעבר לוואטסאפ */ }
    }
    document.addEventListener('click', onClick, true)
    return () => document.removeEventListener('click', onClick, true)
  }, [])
}
