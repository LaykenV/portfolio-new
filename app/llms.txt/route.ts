import projectsData from '@/data/projects.json'
import type { Project } from '@/types/project'
import { postList } from '@/lib/posts'

export const dynamic = 'force-static'

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.laykenvarholdt.com'

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

> Software engineer and founder of Varholdt Labs. Building production web applications with React, TypeScript, Java, and applied AI. U.S. Department of Labor contractor and 1st-place Convex hackathon winner.

- Site: ${BASE}
- Résumé: ${BASE}/Layken-Varholdt-Software-Engineer-Resume.pdf
- GitHub: https://github.com/laykenV
- LinkedIn: https://www.linkedin.com/in/layken-varholdt-a78687230/
- X: https://x.com/LLVarholdt
- Email: layken@varholdt.com

## Varholdt Labs

Layken founded [Varholdt Labs](https://www.varholdt.com/). AI workflows, custom software, and team AI training.

${sections.filter(Boolean).join('\n')}
## Writing

${postList.map((p) => `- [${p.title}](${BASE}/blog/${p.slug}): ${p.summary}`).join('\n')}
`

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=0, must-revalidate',
    },
  })
}
