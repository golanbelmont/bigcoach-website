/*
 * כל הנכסים (תמונות + סרטונים) נטענים מ-Supabase Storage, bucket ציבורי בשם `assets`.
 * מבנה: assets/img/<קובץ> ו-assets/vid/<קובץ>. שמות הקבצים נשארו כפי שהיו
 * ב-public/assets — ראו public/assets/img/README.md למפה המלאה.
 */
export const ASSETS_BASE =
  'https://ypujlwhqccutmscfrnuz.supabase.co/storage/v1/object/public/assets'

// כתובת מלאה (למשל תמונת Wikimedia עם רישיון חופשי) עוברת כמו שהיא
export const imgUrl = (file: string) => (/^https?:/.test(file) ? file : `${ASSETS_BASE}/img/${file}`)
export const vidUrl = (file: string) => `${ASSETS_BASE}/vid/${file}`
