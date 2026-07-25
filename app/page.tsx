import { PortfolioShell } from '@/components/portfolio-shell'
import { StructuredData } from '@/components/structured-data'
import type { Project } from '@/types/project'
import projectsData from '@/data/projects.json'

export const dynamic = 'force-static'

export default function Home() {
  const projects = (projectsData as { projects: Project[] }).projects
  return (
    <>
      <StructuredData projects={projects} />
      {/* The only h1 on the page. Both shells are layout-specific, so the
          document outline lives here rather than being duplicated in each. */}
      <h1 className="sr-only">Layken Varholdt — Software Engineer</h1>
      <PortfolioShell projects={projects} />
    </>
  )
}
