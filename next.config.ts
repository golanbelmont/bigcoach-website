import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    // כל התמונות מוגשות דרך ה-Image Optimizer של Vercel: שינוי גודל לפי המסך + WebP/AVIF + cache בקצה.
    remotePatterns: [
      { protocol: 'https', hostname: 'ypujlwhqccutmscfrnuz.supabase.co', pathname: '/storage/v1/object/public/assets/**' },
      { protocol: 'https', hostname: 'i.ytimg.com', pathname: '/vi/**' },
      // תמונת ההכנה לקרבי: צילום דובר צה"ל מ-Wikimedia Commons (CC BY 2.0)
      { protocol: 'https', hostname: 'upload.wikimedia.org', pathname: '/wikipedia/commons/**' },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [360, 414, 480, 640, 750, 828, 1080, 1280, 1600, 1920],
    imageSizes: [40, 64, 96, 128, 180, 256, 320, 400],
    qualities: [45, 60, 75, 85, 90],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
}

export default nextConfig
