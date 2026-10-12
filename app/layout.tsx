import type { Metadata, Viewport } from 'next'
import { Heebo, Rubik } from 'next/font/google'
import { imgUrl } from '@/lib/assets'
import './globals.css'

const rubik = Rubik({
  subsets: ['hebrew', 'latin'],
  weight: ['700', '800', '900'],
  variable: '--font-rubik',
  display: 'swap',
})

const heebo = Heebo({
  subsets: ['hebrew', 'latin'],
  weight: ['400', '700', '800', '900'],
  variable: '--font-heebo',
  display: 'swap',
})

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.bigcoach.co.il'
const TITLE = 'BIG COACH, גולן בלמונט | ליווי תזונה ואימונים'
const DESC = 'ליווי אישי צמוד לאימונים ותזונה. גולן בלמונט, סטודיו בבאר שבע והדרום. אונליין בכל הארץ.'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: TITLE,
  description: DESC,
  alternates: { canonical: '/' },
  icons: { icon: imgUrl('favicon.png'), apple: imgUrl('favicon.png') },
  robots: { index: true, follow: true },
  openGraph: {
    type: 'website',
    url: '/',
    siteName: 'BIG COACH',
    title: TITLE,
    description: 'ליווי אישי צמוד לאימונים ותזונה. סטודיו בבאר שבע ואונליין מכל הארץ. שיחת היכרות 20 דקות, בלי עלות.',
    images: [{ url: imgUrl('og-share.jpg'), width: 1200, height: 630, alt: 'BIG COACH, גולן בלמונט. נמאס לך להתחיל כל פעם מחדש?' }],
    locale: 'he_IL',
  },
  twitter: { card: 'summary_large_image' },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#232323',
}

// נתונים מובנים לגוגל (עסק מקומי). רק פרטים שמופיעים באתר, בלי המצאות.
const JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'HealthClub',
  name: 'BIG COACH',
  alternateName: 'ביג קואוצ׳, גולן בלמונט',
  url: siteUrl,
  image: imgUrl('hero.jpg'),
  logo: imgUrl('logo.png'),
  description: DESC,
  telephone: '+972526896182',
  email: 'golanboublil@gmail.com',
  address: { '@type': 'PostalAddress', streetAddress: 'ח"נ ביאליק 137', addressLocality: 'באר שבע', addressCountry: 'IL' },
  areaServed: 'IL',
  founder: { '@type': 'Person', name: 'גולן בלמונט' },
  sameAs: [
    'https://www.instagram.com/_big_coach_/',
    'https://www.tiktok.com/@big.coach.golan.boublil',
    'https://www.facebook.com/golan.boublil/',
    'https://www.youtube.com/@BigCoachAcademy',
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl" className={`${rubik.variable} ${heebo.variable}`}>
      <body>
        <link rel="preconnect" href="https://ypujlwhqccutmscfrnuz.supabase.co" crossOrigin="anonymous" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
        {children}
      </body>
    </html>
  )
}
