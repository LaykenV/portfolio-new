'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'
import {
  ChevronDown,
  ChevronRight,
  FileCode2,
  FileText,
  Files,
  Link2,
  Mail,
  Menu,
  Moon,
  Search,
  SquareTerminal,
  Sun,
  X,
} from 'lucide-react'

import { AnimatedThemeToggler } from '@/components/animated-theme-toggler'
import { DesignLinks } from '@/components/designs/design-links'
import { buildDocs, type Doc } from '@/components/designs/console/docs'
import { jetbrains } from '@/components/designs/console/fonts'
import { Palette, type PaletteItem } from '@/components/designs/console/palette'
import { Terminal } from '@/components/designs/console/terminal'
import {
  AboutView,
  ContactView,
  EmptyView,
  PostView,
  ProjectView,
} from '@/components/designs/console/views'
import { ELSEWHERE, IDENTITY } from '@/components/variants/identity'
import { posts } from '@/data/posts'
import type { Project } from '@/types/project'

import '@/components/designs/console/console.css'

function DocIcon({ doc }: { doc: Doc }) {
  if (doc.kind === 'post' || doc.kind === 'about') return <FileText size={14} aria-hidden="true" />
  if (doc.kind === 'contact') return <SquareTerminal size={14} aria-hidden="true" />
  return <FileCode2 size={14} aria-hidden="true" />
}

/**
 * The portfolio as an editor. Work is a file tree, an open project is a tab,
 * and everything is reachable from the keyboard: Ctrl/Cmd+K jumps anywhere,
 * Ctrl+` toggles a small terminal that understands `open`, `ls` and `stack`.
 * On a phone the explorer becomes a drawer and the bottom bar takes over.
 */
export function Console({ projects }: { projects: Project[] }) {
  const docs = useMemo(() => buildDocs(projects, posts), [projects])
  const byId = useMemo(() => new Map(docs.map((d) => [d.id, d])), [docs])
  const { setTheme, resolvedTheme } = useTheme()
  const router = useRouter()

  const [tabs, setTabs] = useState<string[]>(['about'])
  const [active, setActive] = useState<string | null>('about')
  const [drawer, setDrawer] = useState(false)
  const [palette, setPalette] = useState(false)
  // null means "never touched": shown on desktop, hidden on a phone where it
  // would cover half the screen. The CSS handles the default; any toggle makes
  // the choice explicit.
  const [terminal, setTerminal] = useState<boolean | null>(null)
  const [folders, setFolders] = useState({ projects: true, writing: true, links: false })
  const editorRef = useRef<HTMLDivElement>(null)

  const open = useCallback(
    (id: string) => {
      if (!byId.has(id)) return
      setTabs((t) => (t.includes(id) ? t : [...t, id]))
      setActive(id)
      setDrawer(false)
    },
    [byId]
  )

  const close = (id: string) => {
    const i = tabs.indexOf(id)
    const next = tabs.filter((t) => t !== id)
    setTabs(next)
    if (active === id) setActive(next[Math.min(i, next.length - 1)] ?? null)
  }

  const toggleTerminal = useCallback(() => {
    setTerminal((t) => (t === null ? !window.matchMedia('(min-width: 768px)').matches : !t))
  }, [])

  /* Deep links: #atlas-outbound opens that project on first load. */
  useEffect(() => {
    const slug = window.location.hash.slice(1)
    if (!slug) return
    const doc = docs.find((d) => d.slug === slug)
    if (doc) open(doc.id)
  }, [docs, open])

  useEffect(() => {
    const doc = active ? byId.get(active) : null
    const hash = doc?.slug ? `#${doc.slug}` : ''
    window.history.replaceState(null, '', `${window.location.pathname}${hash}`)
    editorRef.current?.scrollTo({ top: 0 })
  }, [active, byId])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setPalette((p) => !p)
      } else if (e.ctrlKey && e.key === '`') {
        e.preventDefault()
        toggleTerminal()
      } else if (e.key === 'Escape') {
        setDrawer(false)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [toggleTerminal])

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  const toggleTheme = () => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')

  const paletteItems = useMemo<PaletteItem[]>(() => {
    const files = docs.map<PaletteItem>((d) => ({
      id: d.id,
      label: d.title,
      hint: d.file,
      group: d.kind === 'project' ? 'Projects' : d.kind === 'post' ? 'Writing' : 'Pages',
      keywords: `${d.file} ${d.keywords}`,
      icon: <DocIcon doc={d} />,
      run: () => open(d.id),
    }))
    const links = [
      { key: 'hire', label: 'Hire me (send email)', href: IDENTITY.email },
      ...ELSEWHERE.map((r) => ({ key: r.key, label: r.label, href: r.href })),
    ].map<PaletteItem>((l) => ({
      id: `link:${l.key}`,
      label: l.label,
      group: 'Links',
      hint: l.href.startsWith('/') ? 'page' : 'opens in new tab',
      keywords: 'link contact open',
      icon: l.key === 'hire' ? <Mail size={14} aria-hidden="true" /> : <Link2 size={14} aria-hidden="true" />,
      run: () => {
        if (l.href.startsWith('mailto:')) window.location.href = l.href
        else if (l.href.startsWith('/')) router.push(l.href)
        else window.open(l.href, '_blank', 'noopener,noreferrer')
      },
    }))
    const actions: PaletteItem[] = [
      {
        id: 'act:theme',
        label: 'Toggle light / dark theme',
        group: 'Actions',
        keywords: 'theme dark light mode',
        icon: resolvedTheme === 'dark' ? <Sun size={14} aria-hidden="true" /> : <Moon size={14} aria-hidden="true" />,
        run: toggleTheme,
      },
      {
        id: 'act:terminal',
        label: 'Toggle terminal',
        group: 'Actions',
        hint: 'Ctrl+`',
        keywords: 'terminal console shell',
        icon: <SquareTerminal size={14} aria-hidden="true" />,
        run: toggleTerminal,
      },
    ]
    return [...files, ...links, ...actions]
    // toggleTheme closes over resolvedTheme, which is already a dependency.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [docs, open, resolvedTheme, router, toggleTerminal])

  const projectDocs = docs.filter((d) => d.kind === 'project')
  const postDocs = docs.filter((d) => d.kind === 'post')
  const activeDoc = active ? byId.get(active) : undefined

  const moveFocus = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return
    const items = [...e.currentTarget.querySelectorAll<HTMLElement>('[data-tree-item]')]
    const i = items.indexOf(document.activeElement as HTMLElement)
    if (i === -1) return
    e.preventDefault()
    items[Math.max(0, Math.min(items.length - 1, i + (e.key === 'ArrowDown' ? 1 : -1)))]?.focus()
  }

  const renderFile = (d: Doc) => (
    <li key={d.id}>
      <button
        type="button"
        data-tree-item
        className="cn-file"
        aria-current={active === d.id ? 'page' : undefined}
        onClick={() => open(d.id)}
        title={d.file}
      >
        <DocIcon doc={d} />
        <span>{d.file}</span>
      </button>
    </li>
  )

  const folder = (key: keyof typeof folders, label: string, children: React.ReactNode) => (
    <li>
      <button
        type="button"
        data-tree-item
        className="cn-folder"
        aria-expanded={folders[key]}
        onClick={() => setFolders((f) => ({ ...f, [key]: !f[key] }))}
      >
        {folders[key] ? <ChevronDown size={14} aria-hidden="true" /> : <ChevronRight size={14} aria-hidden="true" />}
        {label}
      </button>
      {folders[key] && <ul className="cn-tree-children">{children}</ul>}
    </li>
  )

  return (
    <div className={`cn-root ${jetbrains.variable}`} >
      <header className="cn-titlebar">
        <button
          type="button"
          className="cn-icon-btn cn-only-mobile"
          onClick={() => setDrawer(true)}
          aria-label="Open explorer"
        >
          <Menu size={18} />
        </button>
        <span className="cn-lights cn-only-desktop" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <p className="cn-title">
          <span className="cn-title-name">layken</span>
          <span className="cn-title-sep">/</span>
          portfolio
        </p>
        <button type="button" className="cn-search" onClick={() => setPalette(true)}>
          <Search size={14} aria-hidden="true" />
          <span>Search</span>
          <kbd>Ctrl K</kbd>
        </button>
        <AnimatedThemeToggler className="cn-icon-btn" />
      </header>

      <div className="cn-body">
        <nav className="cn-activity cn-only-desktop" aria-label="Panels">
          <button
            type="button"
            className="cn-icon-btn"
            aria-label="Command palette"
            onClick={() => setPalette(true)}
          >
            <Search size={18} />
          </button>
          <button
            type="button"
            className="cn-icon-btn"
            aria-label="Toggle terminal"
            aria-pressed={terminal !== false}
            onClick={toggleTerminal}
          >
            <SquareTerminal size={18} />
          </button>
        </nav>

        {drawer && <div className="cn-drawer-scrim" onClick={() => setDrawer(false)} />}
        <aside className="cn-side" data-open={drawer} aria-label="Explorer">
          <div className="cn-side-head">
            <span>Explorer</span>
            <button
              type="button"
              className="cn-icon-btn cn-only-mobile"
              onClick={() => setDrawer(false)}
              aria-label="Close explorer"
            >
              <X size={16} />
            </button>
          </div>
          <ul className="cn-tree" onKeyDown={moveFocus}>
            {renderFile(byId.get('about')!)}
            {renderFile(byId.get('contact')!)}
            {folder('projects', 'projects', projectDocs.map(renderFile))}
            {folder('writing', 'writing', postDocs.map(renderFile))}
            {folder(
              'links',
              'links',
              ELSEWHERE.map((r) => (
                <li key={r.key}>
                  <a
                    data-tree-item
                    className="cn-file"
                    href={r.href}
                    {...(r.href.startsWith('/') ? {} : { target: '_blank', rel: 'noreferrer noopener' })}
                  >
                    <Link2 size={14} aria-hidden="true" />
                    <span>{r.label
                        .toLowerCase()
                        .normalize('NFD')
                        .replace(/[\u0300-\u036f]/g, '')
                        .replace(/\s+/g, '-')}</span>
                  </a>
                </li>
              ))
            )}
          </ul>
          <div className="cn-side-foot">
            <p className="cn-side-note">Other designs</p>
            <DesignLinks current="/4" className="cn-design-links" linkClassName="cn-design-link" />
          </div>
        </aside>

        <main className="cn-main">
          <div className="cn-tabs" role="tablist" aria-label="Open files">
            {tabs.map((id) => {
              const d = byId.get(id)
              if (!d) return null
              return (
                <div key={id} className="cn-tab" data-active={active === id} role="presentation">
                  <button
                    type="button"
                    role="tab"
                    id={`tab-${id}`}
                    aria-selected={active === id}
                    aria-controls="cn-editor"
                    onClick={() => setActive(id)}
                  >
                    <DocIcon doc={d} />
                    <span>{d.file}</span>
                  </button>
                  <button type="button" className="cn-tab-x" aria-label={`Close ${d.file}`} onClick={() => close(id)}>
                    <X size={12} />
                  </button>
                </div>
              )
            })}
          </div>

          {activeDoc && (
            <p className="cn-crumbs" aria-hidden="true">
              layken
              {activeDoc.kind === 'project' && ' › projects'}
              {activeDoc.kind === 'post' && ' › writing'} › {activeDoc.file}
            </p>
          )}

          <div
            ref={editorRef}
            id="cn-editor"
            className="cn-editor"
            role="tabpanel"
            aria-labelledby={active ? `tab-${active}` : undefined}
            tabIndex={0}
          >
            {activeDoc?.kind === 'about' && <AboutView projects={projects} onOpen={open} />}
            {activeDoc?.kind === 'contact' && <ContactView />}
            {activeDoc?.kind === 'project' && (
              <ProjectView
                key={activeDoc.id}
                project={projects.find((p) => p.slug === activeDoc.slug)!}
                index={projects.findIndex((p) => p.slug === activeDoc.slug)}
                total={projects.length}
              />
            )}
            {activeDoc?.kind === 'post' && <PostView slug={activeDoc.slug} />}
            {!activeDoc && <EmptyView onPalette={() => setPalette(true)} />}
          </div>

          {terminal !== false && (
            <section className="cn-panel" data-auto={terminal === null} aria-label="Terminal">
              <div className="cn-panel-head">
                <span>Terminal</span>
                <button
                  type="button"
                  className="cn-icon-btn"
                  aria-label="Close terminal"
                  onClick={() => setTerminal(false)}
                >
                  <X size={14} />
                </button>
              </div>
              <Terminal
                docs={docs}
                projects={projects}
                onOpen={open}
                onTheme={(t) => setTheme(t)}
              />
            </section>
          )}
        </main>
      </div>

      <footer className="cn-status">
        <span className="cn-status-item cn-status-live">
          <span className="cn-dot" aria-hidden="true" /> Open to roles
        </span>
        <span className="cn-status-item cn-only-desktop">Lafayette, LA</span>
        <span className="cn-status-spacer" />
        <button type="button" className="cn-status-item cn-only-mobile" onClick={() => setDrawer(true)}>
          <Files size={13} aria-hidden="true" /> Files
        </button>
        <button type="button" className="cn-status-item" onClick={toggleTerminal}>
          <SquareTerminal size={13} aria-hidden="true" /> Terminal
        </button>
        <a className="cn-status-item cn-status-hire" href={IDENTITY.email}>
          <Mail size={13} aria-hidden="true" /> Hire me
        </a>
      </footer>

      {palette && <Palette items={paletteItems} onClose={() => setPalette(false)} />}
    </div>
  )
}
