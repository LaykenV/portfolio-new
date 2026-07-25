import projectsData from '@/data/projects.json'
import type { Project } from '@/types/project'

export const dynamic = 'force-static'

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.laykenvarholdt.com'

/** Kept in step with the list rendered by app/blog/page.tsx. */
const POSTS = [
  {
    slug: 'safari-iphone-theme-sync',
    title: 'The Safari theme-sync quirk no AI could fix',
    description:
      'Why iPhone Safari would not sync the toolbar on theme switch in a fixed-shell mobile portfolio, and the workaround that did work.',
  },
  {
    slug: 'my-default-app-stack',
    title: 'The stack I am building everything on now',
    description:
      'TanStack Start, Convex, and Clerk, plus the architectural patterns that make them work together.',
  },
  {
    slug: 'mesh-mind-debate-workflow',
    title: 'Three models, one answer',
    description:
      'Rebuilding the MIT and Google Brain multi-agent debate paper as a chat product, end to end on Convex.',
  },
] as const

const TIER_HEADINGS: Array<[Project['tier'], string]> = [
  ['hero', 'Selected work'],
  ['featured', 'More work'],
  ['more', 'Also built'],
]

export async function GET() {
  const projects = (projectsData as { projects: Project[] }).projects

  const sections = TIER_HEADINGS.map(([tier, heading]) => {
    const group = projects.filter((p) => p.tier === tier)
    if (group.length === 0) return ''
    const lines = group.map((p) => {
      const url = p.links.live ?? p.links.github ?? BASE
      const source = p.links.github ? ` Source: ${p.links.github}.` : ''
      const award = p.award ? ` ${p.award.label}.` : ''
      return `- [${p.title}](${url}): ${p.description}${award} Stack: ${p.techStack.join(', ')}.${source}`
    })
    return `## ${heading}\n\n${lines.join('\n')}\n`
  })

  const body = `# Layken Varholdt

> Software engineer building production web applications with React, TypeScript, Java, and applied AI. U.S. Department of Labor contractor and 1st-place Convex hackathon winner. Open to new roles.

- Site: ${BASE}
- Résumé: ${BASE}/Layken-Varholdt-Software-Engineer-Resume.pdf
- GitHub: https://github.com/laykenV
- LinkedIn: https://www.linkedin.com/in/layken-varholdt-a78687230/
- X: https://x.com/LLVarholdt
- Email: Laykenv@gmail.com

${sections.filter(Boolean).join('\n')}
## Writing

${POSTS.map((p) => `- [${p.title}](${BASE}/blog/${p.slug}): ${p.description}`).join('\n')}
`

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=0, must-revalidate',
    },
  })
}
