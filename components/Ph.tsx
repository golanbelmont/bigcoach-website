'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { imgUrl } from '@/lib/assets'

/*
 * מערכת התמונות (placeholder) — מקבילה ל-injector מהאתר המקורי:
 * מסגרת מקווקוות + תווית עד שהתמונה נטענת; onError משאיר placeholder.
 *
 * הקבצים נטענים מ-Supabase Storage (bucket: assets, תיקיית img/) דרך next/image:
 * ה-Image Optimizer של Vercel מגיש כל תמונה בגודל שמתאים למסך (srcset לפי `sizes`)
 * ובפורמט AVIF/WebP — במובייל זה חוסך את רוב המשקל של הדף.
 *
 * `priority` רק לתמונות שנראות מיידית (hero). כל השאר lazy.
 */
export default function Ph({
  img,
  alt = '',
  label,
  light = false,
  eager = false,
  className,
  sizes = '100vw',
  quality,
  fit,
  position,
}: {
  img?: string
  alt?: string
  label?: string
  light?: boolean
  eager?: boolean
  className?: string
  /** גודל התצוגה של התמונה ביחס למסך (srcset). ברירת מחדל: רוחב מלא */
  sizes?: string
  quality?: number
  fit?: 'cover' | 'contain'
  position?: string
}) {
  const [state, setState] = useState<'loading' | 'ok' | 'err'>('loading')
  const ref = useRef<HTMLImageElement>(null)

  // תמונה שנטענה מה-cache לפני ההידרציה לא תירה onLoad — בודקים ידנית אחרי ה-mount.
  useEffect(() => {
    const el = ref.current
    if (el && el.complete && el.naturalWidth > 0) setState('ok')
  }, [])

  const cls = ['ph', light && 'light', state === 'ok' && 'has-img', className]
    .filter(Boolean)
    .join(' ')
  const style = fit || position ? { objectFit: fit, objectPosition: position } : undefined
  return (
    <div className={cls} data-label={label}>
      {img && state !== 'err' && (
        <Image
          ref={ref}
          src={imgUrl(img)}
          alt={alt}
          fill
          sizes={sizes}
          quality={quality}
          priority={eager}
          unoptimized={/^https?:/.test(img)}
          loading={eager ? 'eager' : 'lazy'}
          style={style}
          onLoad={() => setState('ok')}
          onError={() => setState('err')}
        />
      )}
    </div>
  )
}
