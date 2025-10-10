import { AnimatedThemeToggler } from '@/components/animated-theme-toggler'
import { ProjectsScroller } from '@/components/projects-scroller'
import { StructuredData } from '@/components/structured-data'
import type { Project } from '@/types/project'
import projectsData from '@/data/projects.json'
import Image from 'next/image'
import { Github, Linkedin, Globe, Rocket, MonitorSmartphone, FileText } from 'lucide-react'
import { MobileMenuController } from '@/components/mobile-menu-controller'

export const dynamic = 'force-static'

export default function Home() {
  const projects = (projectsData as { projects: Project[] }).projects
  return (
    <>
      <StructuredData projects={projects} />
    <div className="font-sans mx-auto max-w-[110rem] h-dvh overflow-hidden">
      <div className="flex flex-col md:flex-row h-full">
        <aside className="relative flex-shrink-0 md:h-screen md:overflow-y-auto md:overflow-x-hidden px-8 pt-8 pb-3 md:p-6 md:pt-6 flex flex-col gap-3 md:gap-4 md:border-r border-subtle md:w-[42%] md:shrink-0">
          {/* Burger menu button (mobile) */}
          <MobileMenuController className="absolute top-6 right-6 md:top-4 md:right-4 md:hidden" />
          {/* Keep theme toggle visible on desktop */}
          <div className="hidden md:block absolute top-4 right-4">
            <AnimatedThemeToggler className="btn-icon" />
          </div>

          {/* Header: avatar + name/role */}
          <div className="flex flex-row md:flex-row items-center md:items-start gap-4 sm:gap-5 md:gap-4 justify-center md:justify-start md:pr-0">
            <div className="h-32 w-32 md:h-28 md:w-28 border border-subtle overflow-hidden flex-shrink-0 mx-0">
              <Image src="/portrait.jpeg" alt="Layken Varholdt's profile portrait" width={128} height={128} className="object-cover" priority />
            </div>
            <div className="min-w-0 text-left">
              <h1 className="text-3xl md:text-3xl font-semibold tracking-tight">Layken Varholdt</h1>
              <p className="text-lg md:text-base opacity-80">Software Engineer @ DOL</p>
              {/* Social links */}
              <div className="mt-2 md:mt-3 hidden md:flex flex-wrap items-center gap-2 justify-start">
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
                <a href="/LLVarholdt-Resume.pdf" aria-label="Resume" title="Resume" className="btn text-xs md:text-sm" target="_blank" rel="noreferrer">
                  <FileText className="h-4 w-4" />
                  <span>Resume</span>
                </a>
              </div>
            </div>
          </div>

          {/* Big marketing copy */}
          <div className="mt-2 md:mt-4 space-y-1 sm:space-y-1.5 md:space-y-2 text-center md:text-left px-0">
            <p className="text-2xl md:text-3xl lg:text-4xl font-semibold leading-tight tracking-tight text-balance">
              Building Web Applications with cutting edge technology
            </p>
            <p className="text-base md:text-lg lg:text-xl opacity-90 text-balance leading-snug">
              I work with teams that move fast and want stunning websites done right
            </p>
          </div>

          {/* Primary actions - now visible on all screen sizes */}
          <div className="flex gap-2 justify-center md:justify-start mt-2 md:mt-3">
            <a className="btn-accent-invert btn-compact btn-equal text-sm md:text-base" href="https://cal.com/layken-varholdt" target="_blank" rel="noreferrer">Schedule call</a>
            <a className="btn-accent btn-compact btn-equal text-sm md:text-base" href="https://t.me/LLVarholdt" target="_blank" rel="noreferrer"> <Image src="/telegram.png" alt="Telegram" width={20} height={20} /> Chat</a>
          </div>

          {/* Sidebar footer (md+): compact, polished value section */}
          <div className="hidden md:block mt-auto pt-3 pb-2">
            <div className="aside-footer mt-3" role="contentinfo" aria-labelledby="aside-footer-title">
              <div className="flex items-center justify-between">
                <p id="aside-footer-title" className="text-xs font-semibold tracking-wider uppercase opacity-70">What I deliver</p>
              </div>
              <ul className="mt-2 space-y-2">
                <li className="footer-item">
                  <span className="footer-icon" aria-hidden="true"><Globe className="h-3.5 w-3.5" /></span>
                  <span className="text-sm md:text-base font-medium tracking-tight text-balance">
                    Realtime apps that stay perfectly in sync worldwide
                  </span>
                </li>
                <li className="footer-item">
                  <span className="footer-icon" aria-hidden="true"><Rocket className="h-3.5 w-3.5" /></span>
                  <span className="text-sm md:text-base font-medium tracking-tight text-balance">
                    Ship faster with modern tooling without sacrificing quality
                  </span>
                </li>
                <li className="footer-item">
                  <span className="footer-icon" aria-hidden="true"><MonitorSmartphone className="h-3.5 w-3.5" /></span>
                  <span className="text-sm md:text-base font-medium tracking-tight text-balance">
                    Smooth, performant experiences on desktop, laptop, and mobile
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </aside>

        <section className="flex-1 h-full md:h-screen overflow-hidden">
          <ProjectsScroller projects={projects} />
          {/* Mobile bottom dock with index tracker will be rendered inside ProjectsScroller or here as needed */}
        </section>
      </div>

      {/* Mobile slide-over menu is handled by MobileMenuController (client) */}
    </div>
    </>
  )
}
