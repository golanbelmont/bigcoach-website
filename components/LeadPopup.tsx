'use client'

import { useEffect, useRef, useState } from 'react'
import { Arrow, CloseIcon } from './icons'
import { WA_GENERAL } from '@/lib/links'

/*
 * פופאפ השארת פרטים. נפתח מכל אלמנט עם data-lead-open (האזנה מואצלת על document),
 * כך שכל הסקשנים נשארים server components. שולח ל-/api/lead.
 */
export default function LeadPopup() {
  const [state, setState] = useState<'hidden' | 'open' | 'success'>('hidden')
  const [visible, setVisible] = useState(false)
  const [sending, setSending] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const lastFocus = useRef<Element | null>(null)

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const t = (e.target as HTMLElement).closest('[data-lead-open]')
      if (!t) return
      lastFocus.current = document.activeElement
      setState('open')
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])

  useEffect(() => {
    if (state === 'hidden') return
    document.body.style.overflow = 'hidden'
    const raf = requestAnimationFrame(() => setVisible(true))
    const focusT = setTimeout(() => {
      cardRef.current?.querySelector<HTMLInputElement>('#leadName')?.focus()
    }, 400)
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      if (e.key !== 'Tab' || !cardRef.current) return
      const els = [...cardRef.current.querySelectorAll<HTMLElement>('button,input,select,a,[tabindex]')].filter(
        el => !(el as HTMLButtonElement).disabled && !el.hidden
      )
      const first = els[0]
      const last = els[els.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      cancelAnimationFrame(raf)
      clearTimeout(focusT)
      removeEventListener('keydown', onKey)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state !== 'hidden'])

  function close() {
    setVisible(false)
    setTimeout(() => {
      setState('hidden')
      setSending(false)
      formRef.current?.reset()
      ;(lastFocus.current as HTMLElement | null)?.focus?.()
    }, 350)
  }

  function markErr(el: HTMLElement) {
    el.style.borderColor = 'var(--red)'
    el.focus()
    el.addEventListener('input', () => (el.style.borderColor = ''), { once: true })
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const nameEl = form.elements.namedItem('name') as HTMLInputElement
    const phoneEl = form.elements.namedItem('phone') as HTMLInputElement
    const goalEl = form.elements.namedItem('goal') as HTMLSelectElement
    const name = nameEl.value.trim()
    const phone = phoneEl.value.replace(/\D/g, '')
    const goal = goalEl.value
    if (!name) return markErr(nameEl)
    if (phone.length < 9) return markErr(phoneEl)
    if (!goal) return markErr(goalEl)

    setSending(true)
    try {
      await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, goal, source: 'bigcoach-website', ts: new Date().toISOString() }),
      })
    } catch (err) {
      console.error('[lead] submit failed', err)
    }
    setState('success')
    setTimeout(close, 3500)
  }

  if (state === 'hidden') return null

  return (
    <div
      className={`lead-overlay${visible ? ' lead-visible' : ' lead-hidden'}`}
      id="leadPopup"
      role="dialog"
      aria-modal="true"
      aria-labelledby="leadPopupTitle"
      onClick={e => {
        if (e.target === e.currentTarget) close()
      }}
      style={{ display: 'flex' }}
    >
      <div className="lead-card" id="leadCard" ref={cardRef}>
        <button className="lead-close" aria-label="סגור חלון" onClick={close}>
          <CloseIcon />
        </button>
        {state === 'open' ? (
          <div id="leadFormWrap">
            <div className="lead-label">קבע שיחת היכרות</div>
            <h2 id="leadPopupTitle">
              השאר פרטים
              <br />
              ונחזור אליך.
            </h2>
            <p className="lead-sub">בלי עלות, בלי התחייבות. גולן יחזור אליך תוך שעה.</p>
            <form id="leadForm" noValidate ref={formRef} onSubmit={onSubmit}>
              <div className="lead-field">
                <label htmlFor="leadName">שם מלא</label>
                <input type="text" id="leadName" name="name" placeholder="ישראל ישראלי" autoComplete="name" required />
              </div>
              <div className="lead-field">
                <label htmlFor="leadPhone">טלפון</label>
                <input type="tel" id="leadPhone" name="phone" placeholder="05X-XXX-XXXX" autoComplete="tel" dir="ltr" required />
              </div>
              <div className="lead-field">
                <label htmlFor="leadGoal">מה המטרה שלך?</label>
                <select id="leadGoal" name="goal" required defaultValue="">
                  <option value="">בחר/י</option>
                  <option value="ירידה במשקל">ירידה במשקל</option>
                  <option value="עלייה במסה">עלייה במסה</option>
                  <option value="שיפור כוח וביצועים">שיפור כוח וביצועים</option>
                  <option value="תזונה ובריאות כללית">תזונה ובריאות כללית</option>
                  <option value="הכנה לקרבי ויחידות מיוחדות">הכנה לקרבי ויחידות מיוחדות</option>
                  <option value="אחר">אחר</option>
                </select>
              </div>
              <button type="submit" className="lead-submit" disabled={sending}>
                <span className="btn-text">{sending ? 'שולח...' : 'שלח פרטים'}</span>
                <span className="circle">
                  <Arrow />
                </span>
              </button>
              <p className="lead-legal">
                הפרטים ישמשו ליצירת קשר בלבד ולא יועברו לצד שלישי.{' '}
                <a href="/privacy.html" style={{ color: 'inherit', textDecoration: 'underline' }}>
                  מדיניות פרטיות
                </a>
              </p>
            </form>
          </div>
        ) : (
          <div className="lead-success">
            <div className="lead-success-icon">✓</div>
            <h3>קיבלנו!</h3>
            <p>
              גולן יחזור אליך בהקדם.
              <br />
              עד אז, אפשר גם בוואטסאפ:{' '}
              <a href={WA_GENERAL} style={{ color: 'var(--white)' }}>
                052-689-6182
              </a>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
