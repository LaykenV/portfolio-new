import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.laykenvarholdt.com'
  const now = new Date().toISOString()
  return [
    { url: `${base}/`, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/blog`, lastModified: now, changeFrequency: 'weekly', priority: 0.6 },
    {
      url: `${base}/blog/safari-iphone-theme-sync`,
      lastModified: '2026-04-19T00:00:00.000Z',
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${base}/blog/mesh-mind-debate-workflow`,
      lastModified: '2026-04-16T00:00:00.000Z',
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${base}/blog/my-default-app-stack`,
      lastModified: '2026-04-17T00:00:00.000Z',
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ]
}


