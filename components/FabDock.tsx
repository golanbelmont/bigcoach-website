'use client'

import { useEffect, useRef, useState } from 'react'
import { WaIcon } from './icons'
import { WA_GENERAL } from '@/lib/links'

const LINKS = [
  ['#hero', 'דף הבית'],
  ['#about', 'עלינו'],
  ['#programs', 'השירותים שלנו'],
  ['#method', 'תכניות'],
  ['#golan', 'גולן בלמונט'],
  ['#testimonials', 'תוצאות'],
  ['/research', 'מחקרים'],
  ['#final', 'צור קשר'],
] as const

/* התפריט הצף + וואטסאפ צף + overlay התפריט */
export default function FabDock() {
  const [open, setOpen] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const fabRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const t = setTimeout(() => setExpanded(true), 2000)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        fabRef.current?.focus()
      }
    }
    addEventListener('keydown', onKey)
    return () => removeEventListener('keydown', onKey)
  }, [open])

  const label = open ? 'סגור' : 'תפריט'

  return (
    <>
      <div className="fab-dock">
        <button
          ref={fabRef}
          className={`menu-fab${expanded ? ' expanded' : ''}${open ? ' is-open' : ''}`}
          id="menuFab"
          aria-expanded={open}
          aria-controls="menuOverlay"
          aria-label="תפריט ניווט"
          onClick={() => setOpen(o => !o)}
        >
          <span className="fab-label">
            <span className="t1">{label}</span>
            <span className="t2" aria-hidden="true">
              {label}
            </span>
          </span>
          <span className="circle">
            <svg className="ic-bars" width="20" height="18" viewBox="0 0 20 18" fill="none" aria-hidden="true">
              <path d="M3 3.2H17M3 9H11.5M3 14.8H17" stroke="currentColor" strokeWidth="2.7" strokeLinecap="round" />
            </svg>
            <svg className="ic-x" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3 3L13 13M13 3L3 13" stroke="currentColor" strokeWidth="2.7" strokeLinecap="round" />
            </svg>
          </span>
        </button>
        <a className="wa-fab" href={WA_GENERAL} target="_blank" aria-label="קבע שיחת היכרות בוואטסאפ">
          <WaIcon />
        </a>
      </div>
      <nav
        className={`menu-overlay${open ? ' open' : ''}`}
        id="menuOverlay"
        aria-label="ניווט ראשי"
        onClick={e => {
          if (e.target === e.currentTarget) setOpen(false)
        }}
      >
        <div className="menu-card">
          {LINKS.map(([href, text]) => (
            <a key={href} href={href} className="menu-link" onClick={() => setOpen(false)}>
              <span className="mask">
                <span className="t t1">{text}</span>
                <span className="t t2" aria-hidden="true">
                  {text}
                </span>
              </span>
            </a>
          ))}
          <div className="menu-social">
            <a href={WA_GENERAL} aria-label="וואטסאפ">
              <WaIcon width={24} height={24} />
            </a>
            <a href="https://www.instagram.com/_big_coach_/" target="_blank" aria-label="אינסטגרם">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <rect x="3" y="3" width="18" height="18" rx="5.5" />
                <circle cx="12" cy="12" r="4.2" />
                <circle cx="17.3" cy="6.7" r="1.2" fill="currentColor" stroke="none" />
              </svg>
            </a>
            <a href="https://www.tiktok.com/@big.coach.golan.boublil" target="_blank" aria-label="טיקטוק">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M16.6 3c.4 2 1.7 3.4 3.9 3.6v3c-1.5 0-2.8-.4-3.9-1.2v6.4A5.9 5.9 0 1 1 10 9v3.2a2.8 2.8 0 1 0 3.4 2.7V3h3.2Z" />
              </svg>
            </a>
            <a href="https://www.facebook.com/golan.boublil/" target="_blank" aria-label="פייסבוק">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M13.5 21v-7h2.4l.4-3h-2.8V9.1c0-.9.3-1.5 1.6-1.5h1.3V5c-.2 0-1-.1-1.9-.1-1.9 0-3.3 1.2-3.3 3.4V11H8.7v3h2.5v7h2.3Z" />
              </svg>
            </a>
          </div>
        </div>
      </nav>
    </>
  )
}
