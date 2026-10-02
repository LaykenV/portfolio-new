import type { Project } from '@/types/project'

/** Technologies ranked by how many projects use them. */
export function topStack(projects: Project[], limit = 8) {
  const counts = new Map<string, number>()
  for (const p of projects) {
    for (const t of p.techStack) counts.set(t, (counts.get(t) ?? 0) + 1)
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([name, count]) => ({ name, count }))
}

export const EXPERIENCE = {
  title: 'Software Engineer',
  company: 'Zyxware Technologies',
  client: 'U.S. Department of Labor',
  bullets: [
    'React/Redux frontend and Java backend features for large federal web applications.',
    'Full-stack bulk-transfer and PDF-upload workflows across React, Java, and PHP/Drupal.',
    'Led a React 15 to 18 migration: 50+ class components moved to hooks.',
    'Agile team shipping production releases through Jenkins CI/CD.',
  ],
} as const

export const BIO =
  'I build production web applications from the frontend through the backend. At work that means U.S. Department of Labor systems in React, Redux and Java. On my own time it is TypeScript, Next.js, Convex, Stripe and AI APIs, shipped as real products. Based in Lafayette, Louisiana, open to remote or local roles.'
