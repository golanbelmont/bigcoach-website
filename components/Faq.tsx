'use client'

import { useRef, useState } from 'react'
import { WA_GENERAL } from '@/lib/links'

const QA: [string, string][] = [
  [
    'אני מתחיל מאפס. זה מתאים לי?',
    'בדיוק בשבילך זה נבנה. רוב המתאמנים שלי הגיעו אחרי ניסיונות שלא החזיקו, התוכנית נבנית מהנקודה שבה אתה נמצא, לא מהנקודה שבה "צריך" להיות.',
  ],
  [
    'יש לי פציעה או כאבי גב. אפשר בכלל להתאמן?',
    'כן. אנחנו עושים גם שיקום פציעות ובניית גוף. מתחילים מהשאלון הרפואי, בונים את התוכנית סביב הפציעה ולא דרכה בכוח, והצוות בסטודיו מלווה כל תרגיל. אם צריך, מביאים קודם אישור רופא, ורק אז מעלים הילוך.',
  ],
  [
    'מה ההבדל בינך לבין אפליקציה או מאמן אחר?',
    'שלושה דברים: התוכנית נבנית על הנתונים שלך ומתעדכנת כל שבוע, אתה מדבר עם בן אדם אמיתי ולא עם בוט, ויש עבודה מנטלית אמיתית, לא רק תפריט.',
  ],
  [
    'אני לא גר בדרום. אפשר אונליין?',
    'כן. מסלול הליווי האונליין נותן את כל המעטפת, תזונה, אימונים, מעקב וזמינות מלאה, מכל מקום בארץ.',
  ],
  [
    'כמה זמן עד שרואים תוצאה?',
    'תלוי בנקודת הפתיחה ובמטרה, ובדיוק בשביל זה יש שיחת היכרות. בשיחה נבין איפה אתה היום ונגדיר יעד ריאלי עם לוח זמנים אמיתי, בלי הבטחות באוויר.',
  ],
  [
    'מה קורה בשיחת ההיכרות?',
    '20 דקות, בלי עלות ובלי התחייבות. אתה מספר איפה נתקעת, אני מסביר איך המעטפת עובדת, ומחליטים יחד אם זה מתאים. אם לא, נפרדים כידידים.',
  ],
]

export default function Faq() {
  const [open, setOpen] = useState<number | null>(null)
  const ansRefs = useRef<(HTMLDivElement | null)[]>([])

  return (
    <section id="faq">
      <div className="faq-wrap">
        <div className="faq-head reveal">
          <h2>מה שכולם שואלים</h2>
          <p className="sec-sub">
            ומה שלא פה, פשוט תשאל.{' '}
            <a href={WA_GENERAL} target="_blank">
              אני עונה בוואטסאפ
            </a>
            .
          </p>
        </div>
        <div className="faq-list reveal" data-d="1">
          {QA.map(([q, a], i) => (
            <div className={`qa${open === i ? ' open' : ''}`} key={i}>
              <button
                aria-controls={`faq-ans-${i}`}
                aria-expanded={open === i}
                onClick={() => setOpen(o => (o === i ? null : i))}
              >
                <span className="qnum">{String(i + 1).padStart(2, '0')}</span>
                <span className="qtxt">{q}</span>
                <span className="plus">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                    <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
                  </svg>
                </span>
              </button>
              <div
                className="ans"
                id={`faq-ans-${i}`}
                ref={el => {
                  ansRefs.current[i] = el
                }}
                style={{ maxHeight: open === i ? ansRefs.current[i]?.scrollHeight : undefined }}
              >
                <p>{a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
