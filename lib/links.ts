// כל קישורי הוואטסאפ כוללים ?text= עם הודעה מוכנה — לא להסיר
const WA_BASE = 'https://wa.me/972526896182'

const enc = (t: string) => `${WA_BASE}?text=${encodeURIComponent(t)}`

export const WA_GENERAL = enc('היי גולן, הגעתי מהאתר ואני רוצה לקבוע שיחת היכרות.')
export const WA_ONLINE = enc('היי גולן, הגעתי מהאתר. מעניין אותי ליווי האונליין, אשמח לשמוע איך זה עובד.')
export const WA_GROUP = enc('היי גולן, הגעתי מהאתר. מעניין אותי הליווי עם אימוני הקבוצה בסטודיו, יש מקום בקבוצות?')
export const WA_PERSONAL = enc('היי גולן, הגעתי מהאתר. מעניין אותי מסלול הפרימיום עם אימונים אישיים בסטודיו.')
export const WA_BOXING = enc('היי גולן, הגעתי מהאתר. מעניין אותי לבוא לשיעור אגרוף ב-BIG BOX.')
export const WA_COMBAT = enc('היי גולן, הגעתי מהאתר. אני רוצה להתכונן לגיבוש ולשירות קרבי, אשמח לשמוע על ההכנה.')
