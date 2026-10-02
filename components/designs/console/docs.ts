import type { posts as allPosts } from '@/data/posts'
import type { Project } from '@/types/project'

export type DocKind = 'about' | 'contact' | 'project' | 'post'

export interface Doc {
  id: string
  kind: DocKind
  /** Filename shown in the explorer, tab and breadcrumb. */
  file: string
  title: string
  /** Hash fragment used to deep-link the tab. Empty for the home document. */
  slug: string
  keywords: string
}

type Posts = typeof allPosts

export function buildDocs(projects: Project[], posts: Posts): Doc[] {
  return [
    {
      id: 'about',
      kind: 'about',
      file: 'about.md',
      title: 'About',
      slug: '',
      keywords: 'about bio experience stack',
    },
    {
      id: 'contact',
      kind: 'contact',
      file: 'contact.sh',
      title: 'Contact',
      slug: 'contact',
      keywords: 'contact hire email resume book call',
    },
    ...projects.map<Doc>((p) => ({
      id: `p:${p.slug}`,
      kind: 'project',
      file: `${p.slug}.tsx`,
      title: p.title,
      slug: p.slug,
      keywords: `${p.tagline} ${p.techStack.join(' ')}`,
    })),
    ...posts.map<Doc>((p) => ({
      id: `w:${p.slug}`,
      kind: 'post',
      file: `${p.slug}.md`,
      title: p.title,
      slug: p.slug,
      keywords: p.tags.join(' '),
    })),
  ]
}

/** Case-insensitive subsequence match; lower score is a better match. */
export function fuzzy(query: string, text: string): number | null {
  const q = query.trim().toLowerCase()
  if (!q) return 0
  const t = text.toLowerCase()
  const direct = t.indexOf(q)
  if (direct !== -1) return direct
  let ti = 0
  let gaps = 0
  for (const ch of q) {
    const found = t.indexOf(ch, ti)
    if (found === -1) return null
    gaps += found - ti
    ti = found + 1
  }
  return 100 + gaps
}
