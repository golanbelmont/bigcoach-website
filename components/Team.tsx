import Ph from './Ph'

/*
 * הצוות (2026-10-12): יושב בתוך כרטיס ה-about, מתחת לעמודת "מי המאמן" (#golan).
 * חלוקת התפקידים: גולן בונה תזונה ותוכנית, הצוות מאמן בפועל בסטודיו.
 * רק עובדות שביג קואוץ' מסר. בלי ציטוטים מומצאים.
 * תמונות: Supabase img/team-<key>.jpg (4:5). עד שעולה תמונה מוצגת האות הראשונה.
 */
type Coach = { key: string; name: string; role: string; win?: string; tags: string[] }

const TEAM: Coach[] = [
  {
    key: 'alex',
    name: 'אלכס ליסנקו',
    role: 'סגן מנהל | מאמן כושר מוסמך',
    win: 'אלוף ישראל 3 פעמים בפאוורליפטינג',
    tags: ['כוח ופאוורליפטינג', 'שיקום פציעות', 'ירידה במשקל ומתחילים', 'הכנה לתחרויות'],
  },
  {
    key: 'noam',
    name: 'נועם פלטניק',
    role: 'סגן מנהל | מאמן כושר מוסמך',
    win: 'אלוף ישראל בקליסטניקס',
    tags: ['קליסטניקס ומשקל גוף', 'אימוני קבוצה', 'גמישות ותנועה', 'אימוני נוער'],
  },
  {
    key: 'maya',
    name: 'מיה בלמונט',
    role: 'מאמנת כושר מוסמכת',
    tags: ['אימוני נשים', 'אימוני קבוצה', 'ירידה במשקל וחיטוב', 'אימונים אישיים'],
  },
]

export default function Team() {
  return (
    <div className="team" id="team">
      <div className="team-head reveal">
        <h3>הצוות שמאמן אותך בסטודיו.</h3>
        <p className="sec-sub">אני בונה את התזונה והתוכנית. הם איתך בכל אימון, על כל חזרה.</p>
      </div>
      <div className="team-grid">
        {TEAM.map((c, i) => (
          <article className="team-card reveal" data-d={String(i + 1)} key={c.key}>
            <div className="team-photo">
              <span className="team-mono" aria-hidden="true">
                {c.name[0]}
              </span>
              <Ph img={`team-${c.key}.jpg`} alt={c.name} sizes="(max-width:860px) 90vw, 30vw" position="center top" />
            </div>
            <div className="team-body">
              <h4>{c.name}</h4>
              <div className="team-role">{c.role}</div>
              {c.win && (
                <div className="team-win">
                  <span aria-hidden="true">★</span> {c.win}
                </div>
              )}
              <ul className="team-tags">
                {c.tags.map(t => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
