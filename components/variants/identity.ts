import type { Project } from '@/types/project'

/**
 * Identity content shared by all five desktop explorations. Mirrors the values
 * the shipped desktop shell uses so a variant that gets promoted needs no
 * copy edits.
 */
export const IDENTITY = {
  name: 'Layken Varholdt',
  first: 'Layken',
  last: 'Varholdt',
  role: 'Software Engineer',
  employer: 'U.S. Department of Labor contractor',
  headline: 'Full-stack engineer, open to new roles',
  email: 'mailto:Laykenv@gmail.com?subject=Software%20Engineering%20role',
  emailLabel: 'Laykenv@gmail.com',
  resume: '/Layken-Varholdt-Software-Engineer-Resume.pdf',
  x: 'https://x.com/LLVarholdt',
  github: 'https://github.com/laykenV',
  linkedin: 'https://www.linkedin.com/in/layken-varholdt-a78687230/',
  cal: 'https://cal.com/layken-varholdt',
  telegram: 'https://t.me/LLVarholdt',
  blog: '/blog',
  portrait: '/portrait.jpeg',
} as const

/** Outbound rows, in the order every variant renders them. */
export const ELSEWHERE = [
  { key: 'resume', label: 'Résumé', href: IDENTITY.resume },
  { key: 'github', label: 'GitHub', href: IDENTITY.github },
  { key: 'linkedin', label: 'LinkedIn', href: IDENTITY.linkedin },
  { key: 'x', label: 'X', href: IDENTITY.x },
  { key: 'cal', label: 'Book a call', href: IDENTITY.cal },
  { key: 'blog', label: 'Blog', href: IDENTITY.blog },
] as const

export function pad(n: number) {
  return String(n).padStart(2, '0')
}

/** Hostname of the live site, used wherever a variant labels an outbound link. */
export function liveHost(project: Project): string {
  const url = project.links.live ?? project.links.github
  if (!url) return 'private'
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return 'private'
  }
}
