import { AnimatedThemeToggler } from '@/components/animated-theme-toggler'
import { ProjectsScroller } from '@/components/projects-scroller'
import type { Project } from '@/components/projects-scroller'
import projectsData from '@/data/projects.json'
import Image from 'next/image'
import { Github, Linkedin } from 'lucide-react'
import { Globe as GlobeViz } from '@/components/globe'

//export const dynamic = 'force-static' as const

export default function Home() {
  const projects = (projectsData as { projects: Project[] }).projects
  return (
    <div className="font-sans mx-auto max-w-[110rem] h-screen">
      <div className="flex flex-col md:flex-row h-full md:overflow-hidden md:items-stretch">
        <aside className="relative md:sticky md:top-0 md:self-stretch md:h-full p-6 pt-8 md:pt-6 flex flex-col gap-6 md:border-r border-subtle md:w-[42%] md:shrink-0">
          {/* Theme toggle pinned to top-right */}
          <div className="absolute top-4 right-4">
            <AnimatedThemeToggler className="btn-icon" />
          </div>

          {/* Header: avatar + name/role */}
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-4 justify-center md:justify-start md:pr-0">
            <div className="h-28 w-28 md:h-28 md:w-28 border border-subtle overflow-hidden flex-shrink-0 mx-auto md:mx-0" aria-hidden="true">
              <Image src="/portrait.jpeg" alt="Profile" width={112} height={112} className="object-cover" />
            </div>
            <div className="min-w-0 text-center md:text-left">
              <h1 className="text-3xl md:text-3xl font-semibold tracking-tight">Layken Varholdt</h1>
              <p className="text-lg md:text-base opacity-80">Software Engineer @ DOL</p>
              {/* Social links */}
              <div className="mt-3 flex flex-wrap items-center gap-2 justify-center md:justify-start">
                <a href="https://x.com/LLVarholdt" aria-label="Twitter" className="btn-icon" target="_blank" rel="noreferrer">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-twitter-x" viewBox="0 0 16 16">
                    <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865z"/>
                  </svg>
                </a>
                <a href="https://github.com/laykenV" aria-label="GitHub" className="btn-icon" target="_blank" rel="noreferrer">
                  <Github className="h-4 w-4" />
                </a>
                <a href="https://www.linkedin.com/in/layken-varholdt-a78687230/" aria-label="LinkedIn" className="btn-icon" target="_blank" rel="noreferrer">
                  <Linkedin className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Big marketing copy */}
          <div className="mt-2 space-y-2 text-center md:text-left">
            <p className="text-2xl md:text-3xl lg:text-4xl font-semibold leading-tight tracking-tight text-balance">
              Building Web Applicaitons with state of the art technology
            </p>
            <p className="text-lg md:text-xl opacity-90 text-balance">
              I work with teams that move fast and want cutting edge websites
            </p>
          </div>

          {/* Primary actions */}
          <div className="flex flex-wrap gap-2 justify-center md:justify-start">
            <a className="btn-accent-invert btn-compact btn-equal" href="https://cal.com/layken-varholdt" target="_blank" rel="noreferrer">Schedule call</a>
            <a className="btn-accent btn-compact btn-equal" href="https://t.me/LLVarholdt" target="_blank" rel="noreferrer"> <Image src="/telegram.png" alt="Telegram" width={20} height={20} /> Chat</a>
          </div>

          {/* Bottom highlight: Centered globe + statement (md+) */}
          <div className="hidden md:flex mt-auto pt-3 pb-2 flex-col items-center text-center">
            <div className="relative w-full max-w-[160px] lg:max-w-[220px] xl:max-w-[260px] aspect-square">
              <div className="globe-aura absolute inset-0" aria-hidden="true" />
              <GlobeViz className="mx-auto max-w-[160px] lg:max-w-[220px] xl:max-w-[260px]" />
            </div>
            <div className="w-full flex justify-center mt-2">
              <div className="separator-accent w-[68%] max-w-[220px] lg:max-w-[260px]" />
            </div>
            <p className="mt-4 max-w-[28ch] text-base lg:text-lg font-semibold tracking-tight opacity-95">
              I build websites with realtime sync across the whole internet
            </p>
          </div>
        </aside>

        <section className="flex-1 h-full md:h-full md:overflow-hidden p-4 pt-0 md:pt-6 md:px-4">
          <div className="h-full md:h-full">
            <ProjectsScroller projects={projects} />
          </div>
        </section>
      </div>
    </div>
  )
}
