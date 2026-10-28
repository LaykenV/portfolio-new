import type { Metadata } from 'next'

interface Post {
  slug: string
  title: string
  description: string
  listingDescription: string
  summary: string
  publishedISO: string
  publishedReadable: string
  modifiedISO?: string
  modifiedReadable?: string
  readMinutes: number
  tags: string[]
  socialTitle: string
  ogImage: string
  ogAlt: string
  twitterImage: string
  keywords: string[]
}

export const posts = {
  'glm-5-3-flash-pr-agent-code-review': {
    slug: 'glm-5-3-flash-pr-agent-code-review',
    title: 'Code review for less than a cent',
    description: 'How I wired GLM 5.3 Flash, open-source PR-Agent, GitHub Actions, and two repository-local Codex skills into a review loop that still asks me before merge.',
    listingDescription: 'How I wired GLM 5.3 Flash, open-source PR-Agent, GitHub Actions, and two repository-local Codex skills into a review loop that still asks me before merge.',
    summary: 'How GLM 5.3 Flash, open-source PR-Agent, GitHub Actions, and two repository-local Codex skills form a review loop with an explicit human merge gate.',
    publishedISO: '2026-08-28T00:00:00.000Z',
    publishedReadable: 'August 28, 2026',
    modifiedISO: '2026-08-29T00:00:00.000Z',
    modifiedReadable: 'August 29, 2026',
    readMinutes: 9,
    tags: [
      'GLM 5.3 Flash',
      'PR-Agent',
      'CI'
    ],
    socialTitle: 'Code review for less than a cent | Layken Varholdt',
    ogImage: 'https://www.laykenvarholdt.com/opengraph-image',
    ogAlt: 'A sub-cent pull request review loop using GLM 5.3 Flash',
    twitterImage: 'https://www.laykenvarholdt.com/twitter-image',
    keywords: [
      'GLM 5.3 Flash',
      'PR-Agent',
      'code review',
      'GitHub Actions',
      'Codex skills',
      'OpenRouter',
      'CI'
    ]
  },
  'safari-iphone-theme-sync': {
    slug: 'safari-iphone-theme-sync',
    title: 'The Safari theme-sync quirk no AI could fix',
    description: 'How a fixed-shell mobile portfolio stopped fighting iPhone Safari’s toolbar and learned to feed it instead, without giving up the swipe/snap deck UX.',
    listingDescription: 'Why iPhone Safari wouldn’t sync the toolbar on theme switch in a fixed-shell mobile portfolio, the obvious fixes that didn’t work, and the small workaround that did.',
    summary: 'Why iPhone Safari would not sync the toolbar on theme switch in a fixed-shell mobile portfolio, and the workaround that did work.',
    publishedISO: '2026-04-19T00:00:00.000Z',
    publishedReadable: 'April 19, 2026',
    readMinutes: 7,
    tags: [
      'iOS Safari',
      'Mobile UX',
      'Debugging'
    ],
    socialTitle: 'The Safari theme-sync quirk no AI could fix — Layken Varholdt',
    ogImage: 'https://www.laykenvarholdt.com/opengraph-image',
    ogAlt: 'Theme-syncing iPhone Safari on a fixed-shell mobile portfolio',
    twitterImage: 'https://www.laykenvarholdt.com/twitter-image',
    keywords: [
      'iOS Safari',
      'theme-color',
      'color-scheme',
      'mobile UX',
      'CSS',
      'Next.js',
      'fixed shell',
      'scroll snap',
      'next-themes'
    ]
  },
  'my-default-app-stack': {
    slug: 'my-default-app-stack',
    title: 'The stack I’m building everything on now',
    description: 'TanStack Start, Convex, and Clerk — and the specific architectural patterns from Theo Browne’s open-source Lawn repo that make them work together.',
    listingDescription: 'TanStack Start, Convex, and Clerk — plus the specific architectural patterns from Theo Browne’s open-source Lawn repo that make them work together.',
    summary: 'TanStack Start, Convex, and Clerk, plus the architectural patterns that make them work together.',
    publishedISO: '2026-04-17T00:00:00.000Z',
    publishedReadable: 'April 17, 2026',
    readMinutes: 10,
    tags: [
      'TanStack Start',
      'Convex',
      'Architecture'
    ],
    socialTitle: 'The stack I’m building everything on now — Layken Varholdt',
    ogImage: 'https://www.laykenvarholdt.com/opengraph-image',
    ogAlt: 'A modern web app stack: TanStack Start, Convex, and Clerk',
    twitterImage: 'https://www.laykenvarholdt.com/twitter-image',
    keywords: [
      'TanStack Start',
      'Convex',
      'Clerk',
      'Lawn',
      'Theo Browne',
      'AI engineering',
      'modern web stack',
      'SPA',
      'prerendering'
    ]
  },
  'mesh-mind-debate-workflow': {
    slug: 'mesh-mind-debate-workflow',
    title: 'Three models, one answer',
    description: 'How I rebuilt the MIT and Google Brain multi-agent debate paper as a chat product, end to end on Convex — sub-threads per model, two parallel rounds, a hidden synthesis prompt, and a Zod-validated summary.',
    listingDescription: 'Rebuilding MIT and Google Brain’s multi-agent debate paper as a chat product, end to end on Convex — sub-threads per model, two parallel rounds, a hidden synthesis prompt, and a Zod-validated summary.',
    summary: 'Rebuilding the MIT and Google Brain multi-agent debate paper as a chat product, end to end on Convex.',
    publishedISO: '2026-04-16T00:00:00.000Z',
    publishedReadable: 'April 16, 2026',
    readMinutes: 12,
    tags: [
      'Multi-agent',
      'Convex',
      'Mesh Mind'
    ],
    socialTitle: 'Three models, one answer — Layken Varholdt',
    ogImage: 'https://www.laykenvarholdt.com/MeshMind-og.png',
    ogAlt: 'Mesh Mind multi-model debate UI',
    twitterImage: 'https://www.laykenvarholdt.com/MeshMind-og.png',
    keywords: [
      'multi-agent debate',
      'multi-model orchestration',
      'Convex',
      'Next.js',
      'AI engineering',
      'Mesh Mind',
      'Du et al.'
    ]
  }
} satisfies Record<string, Post>

// Keep the listing, sitemap and llms.txt in the same editorial order.
export const postList: readonly Post[] = Object.values(posts)

export function postMetadata(post: Post): Metadata {
  const url = '/blog/' + post.slug
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: url },
    openGraph: {
      title: post.socialTitle,
      description: post.description,
      url,
      siteName: 'Layken Varholdt',
      locale: 'en_US',
      type: 'article',
      publishedTime: post.publishedISO,
      ...(post.modifiedISO ? { modifiedTime: post.modifiedISO } : {}),
      authors: ['Layken Varholdt'],
      images: [{ url: post.ogImage, width: 1200, height: 630, alt: post.ogAlt }],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.socialTitle,
      description: post.description,
      creator: '@LLVarholdt',
      images: [post.twitterImage],
    },
  }
}

export function postSchema(post: Post) {
  return {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: post.title,
    description: post.description,
    image: [post.ogImage],
    datePublished: post.publishedISO,
    dateModified: post.modifiedISO ?? post.publishedISO,
    author: { '@type': 'Person', name: 'Layken Varholdt', url: 'https://www.laykenvarholdt.com' },
    publisher: { '@type': 'Person', name: 'Layken Varholdt' },
    mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://www.laykenvarholdt.com/blog/' + post.slug },
    keywords: post.keywords.join(', '),
  }
}
