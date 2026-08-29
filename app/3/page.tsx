import type { Metadata } from 'next'

import { V3Bloom } from '@/components/variants/v3-bloom'
import { VariantShell } from '@/components/variants/variant-shell'
import type { Project } from '@/types/project'
import projectsData from '@/data/projects.json'

export const dynamic = 'force-static'

export const metadata: Metadata = {
  title: 'Design 03 — Bloom',
  description: 'Desktop design exploration: a sticky reading rail against a colour-shifting stack.',
  robots: { index: false, follow: false },
}

export default function DesignThree() {
  const projects = (projectsData as { projects: Project[] }).projects
  return (
    <>
      <h1 className="sr-only">Layken Varholdt — Software Engineer</h1>
      <VariantShell projects={projects} desktop={V3Bloom} />
    </>
  )
}
