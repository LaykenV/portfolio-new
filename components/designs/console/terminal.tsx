'use client'

import { useEffect, useRef, useState, type KeyboardEvent } from 'react'

import type { Doc } from '@/components/designs/console/docs'
import { IDENTITY } from '@/components/variants/identity'
import { BIO, topStack } from '@/components/designs/aggregate'
import type { Project } from '@/types/project'

interface Line {
  kind: 'in' | 'out' | 'err'
  text: string
}

const HELP = [
  'help                 list commands',
  'ls [projects|writing] list files',
  'open <name>          open a project, post, about or contact',
  'cat about            print the short bio',
  'stack                most-used technologies',
  'contact              how to reach me',
  'resume               open the résumé PDF',
  'theme dark|light     switch theme',
  'clear                clear this screen',
]

const WELCOME: Line[] = [
  { kind: 'out', text: 'layken-portfolio  ·  type "help" for commands, "open atlas-outbound" to start.' },
]

export function Terminal({
  docs,
  projects,
  onOpen,
  onTheme,
}: {
  docs: Doc[]
  projects: Project[]
  onOpen: (id: string) => void
  onTheme: (theme: 'dark' | 'light') => void
}) {
  const [lines, setLines] = useState<Line[]>(WELCOME)
  const [value, setValue] = useState('')
  const history = useRef<string[]>([])
  const cursor = useRef(-1)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [lines])

  const findDoc = (name: string): Doc | undefined => {
    const n = name.toLowerCase().replace(/\.(tsx|md|sh)$/, '')
    if (!n) return undefined
    const exact = docs.find((d) => d.kind !== 'contact' && d.kind !== 'about' ? d.slug === n : d.id === n)
    if (exact) return exact
    const partial = docs.filter((d) => d.slug.includes(n) || d.title.toLowerCase().includes(n))
    // "mesh" matches a project and a post; the project is almost always the intent.
    const narrowed = (list: Doc[]) => {
      const starts = list.filter((d) => d.slug.startsWith(n))
      const pool = starts.length ? starts : list
      const projectsOnly = pool.filter((d) => d.kind === 'project')
      return projectsOnly.length ? projectsOnly : pool
    }
    const result = narrowed(partial)
    return result.length === 1 ? result[0] : undefined
  }

  const execute = (raw: string): Line[] => {
    const [cmd = '', ...rest] = raw.trim().split(/\s+/)
    const arg = rest.join(' ')
    const out = (text: string): Line => ({ kind: 'out', text })
    const err = (text: string): Line => ({ kind: 'err', text })

    switch (cmd.toLowerCase()) {
      case '':
        return []
      case 'help':
        return HELP.map(out)
      case 'whoami':
        return [out(`${IDENTITY.name} · ${IDENTITY.role} · ${IDENTITY.employer}`)]
      case 'ls': {
        const dir = arg.replace(/\/$/, '')
        if (dir === 'projects') return projects.map((p) => out(`${p.slug}.tsx`))
        if (dir === 'writing') return docs.filter((d) => d.kind === 'post').map((d) => out(d.file))
        if (dir) return [err(`ls: ${dir}: no such directory`)]
        return [out('projects/   writing/   about.md   contact.sh')]
      }
      case 'open': {
        if (!arg) return [err('usage: open <name>  (try: open atlas-outbound)')]
        const doc = findDoc(arg)
        if (!doc) return [err(`open: "${arg}" not found, or more than one match. Try ls projects.`)]
        onOpen(doc.id)
        return [out(`opened ${doc.file}`)]
      }
      case 'cat':
        if (arg === 'about' || arg === 'about.md') return [out(BIO)]
        return [err(`cat: ${arg || '(missing file)'}: only "about" can be printed here. Use open.`)]
      case 'stack': {
        const rows = topStack(projects, 8)
        const max = rows[0]?.count ?? 1
        return rows.map((r) =>
          out(`${r.name.padEnd(14)} ${'█'.repeat(Math.round((r.count / max) * 12))} ${r.count}`)
        )
      }
      case 'contact':
        return [out(`email    ${IDENTITY.emailLabel}`), out(`github   ${IDENTITY.github}`), out(`book     ${IDENTITY.cal}`)]
      case 'resume':
        window.open(IDENTITY.resume, '_blank', 'noopener,noreferrer')
        return [out('opening résumé…')]
      case 'theme':
        if (arg === 'dark' || arg === 'light') {
          onTheme(arg)
          return [out(`theme set to ${arg}`)]
        }
        return [err('usage: theme dark|light')]
      default:
        return [err(`${cmd}: command not found. Type "help".`)]
    }
  }

  const submit = () => {
    const raw = value
    if (raw.trim() === 'clear') {
      setLines([])
    } else {
      const output = execute(raw)
      setLines((prev) => [...prev, { kind: 'in', text: raw }, ...output])
    }
    if (raw.trim()) history.current.push(raw)
    cursor.current = history.current.length
    setValue('')
  }

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      submit()
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      cursor.current = Math.max(0, cursor.current - 1)
      setValue(history.current[cursor.current] ?? '')
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      cursor.current = Math.min(history.current.length, cursor.current + 1)
      setValue(history.current[cursor.current] ?? '')
    } else if (e.key === 'Tab') {
      const match = /^open\s+(\S*)$/.exec(value)
      if (!match) return
      e.preventDefault()
      const hits = docs.filter((d) => d.slug.startsWith(match[1]) && d.slug)
      if (hits.length >= 1) setValue(`open ${hits[0].slug}`)
    }
  }

  return (
    <div className="cn-term" onClick={() => inputRef.current?.focus()}>
      <div ref={scrollRef} className="cn-term-scroll" role="log" aria-live="polite" aria-label="Terminal output">
        {lines.map((line, i) => (
          <div key={i} className={`cn-term-line cn-term-${line.kind}`}>
            {line.kind === 'in' && <span className="cn-term-prompt" aria-hidden="true">$ </span>}
            {line.text}
          </div>
        ))}
        <label className="cn-term-line cn-term-input">
          <span className="cn-term-prompt" aria-hidden="true">$ </span>
          <input
            ref={inputRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={onKeyDown}
            aria-label="Terminal command"
            autoCapitalize="off"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
          />
        </label>
      </div>
    </div>
  )
}
