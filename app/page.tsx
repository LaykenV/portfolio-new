import { AnimatedThemeToggler } from '@/components/animated-theme-toggler'
import { ProjectsScroller } from '@/components/projects-scroller'
import type { Project } from '@/components/projects-scroller'
import projectsData from '@/data/projects.json'

export const dynamic = 'force-static' as const

export default function Home() {
  const projects = (projectsData as { projects: Project[] }).projects
  return (
    <div className="font-sans mx-auto max-w-6xl h-screen">
      <div className="flex flex-col md:flex-row h-full md:overflow-hidden">
        <aside className="h-[60vh] md:h-full md:sticky md:top-0 md:self-start md:w-[40%] md:shrink-0 p-6 flex flex-col gap-6">
          <div className="w-full flex justify-end md:hidden">
            <AnimatedThemeToggler className="btn-icon" />
          </div>

          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full border border-subtle" aria-hidden="true" />
            <div>
              <h1 className="text-xl font-semibold">Your Name</h1>
              <p className="text-sm opacity-80">Short headline or role</p>
            </div>
          </div>

          <div className="hidden md:block">
            <AnimatedThemeToggler className="btn-icon" />
          </div>

          <div className="flex gap-2">
            <button className="btn-accent">Contact</button>
            <button className="btn-accent">Resume</button>
          </div>

          <div className="text-sm opacity-80">
            <p>Based in …</p>
            <p>Currently building …</p>
          </div>
        </aside>

        <section className="flex-1 h-[40vh] md:h-full md:overflow-hidden p-6 pt-0 md:pt-6">
          <div className="h-full">
            <ProjectsScroller projects={projects} />
          </div>
        </section>
      </div>
    </div>
  )
}
