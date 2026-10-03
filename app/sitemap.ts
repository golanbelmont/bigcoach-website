import type { MetadataRoute } from 'next'
import { LIBRARY } from '@/lib/research'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.bigcoach.co.il'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${siteUrl}/`, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${siteUrl}/research`, changeFrequency: 'weekly', priority: 0.8 },
    ...LIBRARY.map(r => ({ url: `${siteUrl}/research/${r.slug}`, lastModified: new Date(r.date), changeFrequency: 'monthly' as const, priority: 0.7 })),
    { url: `${siteUrl}/privacy.html`, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${siteUrl}/accessibility.html`, changeFrequency: 'yearly', priority: 0.2 },
  ]
}
