export const posts = [
  {
    slug: 'glm-5-3-flash-pr-agent-code-review',
    title: 'Code review for less than a cent.',
    description:
      'How I wired GLM 5.3 Flash, open-source PR-Agent, GitHub Actions, and two repository-local Codex skills into a review loop that still asks me before merge.',
    date: '2026-08-28',
    dateReadable: 'August 28, 2026',
    readMinutes: 9,
    tags: ['GLM 5.3 Flash', 'PR-Agent', 'CI'],
  },
  {
    slug: 'safari-iphone-theme-sync',
    title: 'The Safari theme-sync quirk no AI could fix.',
    description:
      'Why iPhone Safari wouldn’t sync the toolbar on theme switch in a fixed-shell mobile portfolio, the obvious fixes that didn’t work, and the small workaround that did.',
    date: '2026-04-19',
    dateReadable: 'April 19, 2026',
    readMinutes: 7,
    tags: ['iOS Safari', 'Mobile UX', 'Debugging'],
  },
  {
    slug: 'my-default-app-stack',
    title: 'The stack I’m building everything on now.',
    description:
      'TanStack Start, Convex, and Clerk — plus the specific architectural patterns from Theo Browne’s open-source Lawn repo that make them work together.',
    date: '2026-04-17',
    dateReadable: 'April 17, 2026',
    readMinutes: 10,
    tags: ['TanStack Start', 'Convex', 'Architecture'],
  },
  {
    slug: 'mesh-mind-debate-workflow',
    title: 'Three models, one answer.',
    description:
      'Rebuilding MIT and Google Brain’s multi-agent debate paper as a chat product, end to end on Convex — sub-threads per model, two parallel rounds, a hidden synthesis prompt, and a Zod-validated summary.',
    date: '2026-04-16',
    dateReadable: 'April 16, 2026',
    readMinutes: 12,
    tags: ['Multi-agent', 'Convex', 'Mesh Mind'],
  },
] as const

export type PostSummary = (typeof posts)[number]
