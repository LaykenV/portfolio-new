import type { Metadata } from 'next'

import { Bento } from '@/components/designs/bento/bento'
import projectsData from '@/data/projects.json'
import type { Project } from '@/types/project'

export const dynamic = 'force-static'

export const metadata: Metadata = {
  title: 'Design 06 — Bento',
  description: 'Design exploration: a board of tiles sized by importance, with morphing project sheets.',
  robots: { index: false, follow: false },
}

export default function DesignSix() {
  const projects = (projectsData as { projects: Project[] }).projects
  return (
    <>
      <h1 className="sr-only">Layken Varholdt — Software Engineer</h1>
      <Bento projects={projects} />
    </>
  )
}
