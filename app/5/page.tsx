import type { Metadata } from 'next'

import { IndexDesign } from '@/components/designs/index/index-design'
import projectsData from '@/data/projects.json'
import type { Project } from '@/types/project'

export const dynamic = 'force-static'

export const metadata: Metadata = {
  title: 'Design 05 — Index',
  description: 'Design exploration: an editorial table of contents with cursor-led previews.',
  robots: { index: false, follow: false },
}

export default function DesignFive() {
  const projects = (projectsData as { projects: Project[] }).projects
  return (
    <>
      <h1 className="sr-only">Layken Varholdt — Software Engineer</h1>
      <IndexDesign projects={projects} />
    </>
  )
}
