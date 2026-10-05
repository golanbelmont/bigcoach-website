import { NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'

/*
 * קליטת לידים — מטופס הפרטים (#leadForm) ומפופאפ ההנחה (discount:true).
 *
 * יעדים (כולם אופציונליים, לפי משתני סביבה — בלי שינויי קוד):
 *   SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY  →  insert לטבלת leads (ראו supabase/schema.sql)
 *   GOOGLE_SHEETS_WEBHOOK_URL                 →  Google Apps Script Web App
 *   CRM_WEBHOOK_URL                           →  webhook נכנס של כל CRM
 * בלי אף אחד מהם הליד עדיין נרשם ל-logs של Vercel.
 */
export async function POST(req: Request) {
  let body: Record<string, unknown> = {}
  try {
    body = await req.json()
  } catch {
    /* גוף לא תקין — נטופל בוולידציה למטה */
  }

  const webhooks = [process.env.GOOGLE_SHEETS_WEBHOOK_URL, process.env.CRM_WEBHOOK_URL].filter(
    (u): u is string => !!u
  )

  // קליק על כפתור וואטסאפ: אין טלפון, רק על מה לחצו ומאיפה. נרשם בלשונית "קליקים לוואטסאפ".
  if (body.type === 'wa_click') {
    const click = { type: 'wa_click', label: String(body.label ?? '').slice(0, 80), place: String(body.place ?? '').slice(0, 40) }
    console.log('[wa_click]', JSON.stringify(click))
    await Promise.all(
      webhooks.map(url =>
        fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(click) }).catch(err =>
          console.error('[wa_click] forward failed:', err)
        )
      )
    )
    return NextResponse.json({ ok: true })
  }

  const cleanPhone = String(body.phone ?? '').replace(/\D/g, '')
  if (cleanPhone.length < 9) {
    return NextResponse.json({ ok: false, error: 'invalid phone' }, { status: 400 })
  }

  const lead = {
    name: String(body.name ?? '').trim(),
    phone: cleanPhone,
    goal: String(body.goal ?? '').trim(),
    discount: !!body.discount,
    source: String(body.source ?? 'bigcoach-website'),
    ts: String(body.ts ?? new Date().toISOString()),
  }

  console.log('[lead]', JSON.stringify(lead))

  const jobs: Promise<unknown>[] = []

  const supabase = getSupabase()
  if (supabase) {
    jobs.push(
      Promise.resolve(
        supabase
          .from('leads')
          .insert({
          name: lead.name,
          phone: lead.phone,
          goal: lead.goal,
          discount: lead.discount,
          source: lead.source,
          submitted_at: lead.ts,
        })
      ).then(({ error }) => {
        if (error) console.error('[lead] supabase insert failed:', error.message)
      })
    )
  }

  jobs.push(
    ...webhooks.map(url =>
      fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(lead),
      }).catch(err => console.error('[lead] forward failed:', url, err))
    )
  )

  await Promise.all(jobs)

  return NextResponse.json({ ok: true })
}
