'use client'

import { useState } from 'react'

const MORE = [
  'לוחמת רחוב ושימוש בכלי נשק קר',
  'קיקבוקס ואגרוף קלאסי',
  'הסמכה לחגורות עד חומה',
  'אימון בעלי מגבלות פיזיות',
  'שיקום פציעות ספורט',
  'הכנה לקרבי ויחידות מיוחדות',
  'הכנה לתחרויות Powerlifting',
  'אימוני קבוצות ויחיד',
  'פסיכולוגיה של הספורט',
]

export default function CredToggle() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button
        className="cred-toggle"
        id="credToggle"
        aria-expanded={open}
        aria-controls="credMore"
        onClick={() => setOpen(o => !o)}
      >
        {open ? 'פחות הסמכות −' : 'עוד הסמכות והתמחויות +'}
      </button>
      <div className="cred-more" id="credMore" hidden={!open}>
        {MORE.map(t => (
          <span key={t}>{t}</span>
        ))}
      </div>
    </>
  )
}
