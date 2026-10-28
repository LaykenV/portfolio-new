import type { MetadataRoute } from 'next'
import { postList } from '@/lib/posts'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.laykenvarholdt.com'
  const latestPostUpdate = postList
    .map((post) => post.modifiedISO ?? post.publishedISO)
    .sort()
    .at(-1)

  return [
    { url: `${base}/`, changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/blog`, lastModified: latestPostUpdate, changeFrequency: 'weekly', priority: 0.6 },
    ...postList.map((post) => ({
      url: `${base}/blog/${post.slug}`,
      lastModified: post.modifiedISO ?? post.publishedISO,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ]
}
