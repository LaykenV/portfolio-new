import { AnimatedThemeToggler } from '@/components/animated-theme-toggler'
import { ProjectsScroller } from '@/components/projects-scroller'
import { StructuredData } from '@/components/structured-data'
import type { Project } from '@/types/project'
import projectsData from '@/data/projects.json'
import Image from 'next/image'
import {
  Github,
  Linkedin,
  FileText,
  FileSearch,
  Workflow,
  Cpu,
  Mail,
  CalendarClock,
  BookOpen,
  ArrowUpRight,
} from 'lucide-react'
import { MobileMenuController } from '@/components/mobile-menu-controller'

export const dynamic = 'force-static'

export default function Home() {
  const projects = (projectsData as { projects: Project[] }).projects
  return (
    <>
      <StructuredData projects={projects} />
      <div className="font-sans mx-auto max-w-[110rem] min-h-dvh md:h-dvh md:overflow-hidden">
        <div className="flex flex-col md:flex-row md:h-full">
          <aside className="identity-panel relative flex-shrink-0 md:h-screen md:overflow-hidden px-8 pt-5 pb-6 md:px-10 md:py-8 flex flex-col gap-3 md:gap-4 md:border-r border-subtle md:w-[42%] md:shrink-0">
            <MobileMenuController className="absolute top-4 right-6 md:top-4 md:right-4 md:hidden" />
            <div className="hidden md:block absolute top-8 right-10 z-10">
              <AnimatedThemeToggler className="btn-icon" />
            </div>

            {/* Header: avatar + name/role + inline socials */}
            <div className="flex flex-row md:flex-row items-center md:items-start gap-4 sm:gap-5 md:gap-4 justify-center md:justify-start md:pr-0">
              <div className="avatar-ring flex-shrink-0">
                <div className="h-32 w-32 md:h-28 md:w-28 overflow-hidden">
                  <Image
                    src="/portrait.jpeg"
                    alt="Layken Varholdt's profile portrait"
                    width={128}
                    height={128}
                    className="object-cover"
                    priority
                  />
                </div>
              </div>
              <div className="min-w-0 text-left">
                <h1 className="text-2xl md:text-2xl font-bold tracking-tight">
                  Layken Varholdt
                </h1>
                <p className="text-sm md:text-sm font-medium opacity-70 tracking-wide uppercase mt-0.5">
                  AI Engineer · @ DOL
                </p>
                {/* Social links (desktop only) */}
                <div className="mt-2 md:mt-3 hidden md:flex flex-wrap items-center gap-2 justify-start">
                  <a
                    href="https://x.com/LLVarholdt"
                    aria-label="Twitter"
                    className="btn-icon"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      viewBox="0 0 16 16"
                    >
                      <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865z" />
                    </svg>
                  </a>
                  <a
                    href="https://github.com/laykenV"
                    aria-label="GitHub"
                    className="btn-icon"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Github className="h-4 w-4" />
                  </a>
                  <a
                    href="https://www.linkedin.com/in/layken-varholdt-a78687230/"
                    aria-label="LinkedIn"
                    className="btn-icon"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Linkedin className="h-4 w-4" />
                  </a>
                  <a
                    href="/Layken-Varholdt-AI-Engineer-Resume.pdf"
                    aria-label="Resume"
                    title="Resume"
                    className="btn text-xs md:text-sm"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <FileText className="h-4 w-4" />
                    <span>Resume</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Marketing copy */}
            <div className="mt-2 md:mt-4 space-y-2 md:space-y-3 text-center md:text-left">
              <h2 className="hero-title">Engineer who ships production AI.</h2>
              <p className="hero-sub">
                1st place at the Convex Modern Stack Hackathon ($10k). I
                specialize in document intelligence pipelines, multi-agent
                orchestration, and the infrastructure that makes AI features
                reliable in production.
              </p>
              <div className="flex justify-center md:justify-start pt-0.5">
                <span className="role-pill">
                  <span className="role-pill-dot" aria-hidden="true" />
                  Open to Senior / Staff AI roles
                </span>
              </div>
            </div>

            {/* Primary email CTA + 3 secondary actions */}
            <div className="flex flex-col gap-2 mt-1">
              <a
                href="mailto:laykenv@gmail.com?subject=AI%20Engineering%20role"
                className="cta-primary w-full"
              >
                <Mail className="h-4 w-4" />
                laykenv@gmail.com
                <ArrowUpRight className="h-4 w-4" />
              </a>
              <div className="grid grid-cols-3 gap-2">
                <a
                  className="btn-accent btn-compact text-xs sm:text-sm"
                  href="https://cal.com/layken-varholdt"
                  target="_blank"
                  rel="noreferrer"
                >
                  <CalendarClock className="h-3.5 w-3.5 flex-shrink-0" />
                  <span className="truncate">Call</span>
                </a>
                <a
                  className="btn-accent btn-compact text-xs sm:text-sm"
                  href="https://t.me/LLVarholdt"
                  target="_blank"
                  rel="noreferrer"
                >
                  <Image
                    src="/telegram.png"
                    alt="Telegram"
                    width={16}
                    height={16}
                    className="flex-shrink-0"
                  />
                  <span className="truncate">Chat</span>
                </a>
                <a
                  className="btn-accent btn-compact text-xs sm:text-sm"
                  href="/blog"
                >
                  <BookOpen className="h-3.5 w-3.5 flex-shrink-0" />
                  <span className="truncate">Blog</span>
                </a>
              </div>
            </div>

            {/* What I engineer — pinned to bottom on desktop */}
            <div className="hidden md:block mt-auto pt-3 pb-2">
              <div
                className="aside-footer mt-3"
                role="contentinfo"
                aria-labelledby="aside-footer-title"
              >
                <div className="flex items-center justify-between">
                  <p
                    id="aside-footer-title"
                    className="text-xs font-semibold tracking-wider uppercase opacity-70"
                  >
                    What I engineer
                  </p>
                </div>
                <ul className="mt-2 space-y-2">
                  <li className="footer-item">
                    <span className="footer-icon" aria-hidden="true">
                      <FileSearch className="h-3.5 w-3.5" />
                    </span>
                    <span className="text-sm md:text-base font-medium tracking-tight text-balance">
                      Document intelligence pipelines — parsing, extraction,
                      compliance matrices
                    </span>
                  </li>
                  <li className="footer-item">
                    <span className="footer-icon" aria-hidden="true">
                      <Workflow className="h-3.5 w-3.5" />
                    </span>
                    <span className="text-sm md:text-base font-medium tracking-tight text-balance">
                      Multi-agent orchestration — debate/synthesize workflows,
                      cost-aware routing
                    </span>
                  </li>
                  <li className="footer-item">
                    <span className="footer-icon" aria-hidden="true">
                      <Cpu className="h-3.5 w-3.5" />
                    </span>
                    <span className="text-sm md:text-base font-medium tracking-tight text-balance">
                      Production AI infrastructure — streaming, observability,
                      state
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </aside>

          <section className="md:flex-1 md:h-full md:overflow-hidden">
            <ProjectsScroller projects={projects} />
          </section>
        </div>
      </div>
    </>
  )
}
