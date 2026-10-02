import type { Metadata } from 'next'

import { Console } from '@/components/designs/console/console'
import projectsData from '@/data/projects.json'
import type { Project } from '@/types/project'

export const dynamic = 'force-static'

export const metadata: Metadata = {
  title: 'Design 04 — Console',
  description: 'Design exploration: the portfolio as a keyboard-driven code editor.',
  robots: { index: false, follow: false },
}

export default function DesignFour() {
  const projects = (projectsData as { projects: Project[] }).projects
  return (
    <>
      <h1 className="sr-only">Layken Varholdt — Software Engineer</h1>
      <Console projects={projects} />
    </>
  )
}
