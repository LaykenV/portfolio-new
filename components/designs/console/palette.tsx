'use client'

import { useEffect, useId, useMemo, useRef, useState, type ReactNode } from 'react'
import { CornerDownLeft, Search } from 'lucide-react'

import { fuzzy } from '@/components/designs/console/docs'

export interface PaletteItem {
  id: string
  label: string
  group: string
  hint?: string
  keywords?: string
  icon?: ReactNode
  run: () => void
}

/** Mounted only while open, so query and selection reset on every opening. */
export function Palette({
  items,
  onClose,
}: {
  items: PaletteItem[]
  onClose: () => void
}) {
  const [query, setQuery] = useState('')
  const [index, setIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const listId = useId()

  const results = useMemo(() => {
    return items
      .map((item) => {
        const score = fuzzy(query, `${item.label} ${item.keywords ?? ''}`)
        return score === null ? null : { item, score }
      })
      .filter((r): r is { item: PaletteItem; score: number } => r !== null)
      .sort((a, b) => a.score - b.score)
      .map((r) => r.item)
  }, [items, query])

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null
    inputRef.current?.focus()
    return () => previous?.focus?.()
  }, [])

  useEffect(() => {
    listRef.current
      ?.querySelector<HTMLElement>('[aria-selected="true"]')
      ?.scrollIntoView({ block: 'nearest' })
  }, [index, results])

  const run = (item: PaletteItem | undefined) => {
    if (!item) return
    onClose()
    item.run()
  }

  const active = results[Math.min(index, results.length - 1)]
  let lastGroup = ''

  return (
    <div
      className="cn-scrim"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="cn-palette" role="dialog" aria-modal="true" aria-label="Command palette">
        <div className="cn-palette-field">
          <Search size={16} aria-hidden="true" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setIndex(0)
            }}
            onKeyDown={(e) => {
              if (e.key === 'ArrowDown') {
                e.preventDefault()
                setIndex((i) => Math.min(i + 1, results.length - 1))
              } else if (e.key === 'ArrowUp') {
                e.preventDefault()
                setIndex((i) => Math.max(i - 1, 0))
              } else if (e.key === 'Enter') {
                e.preventDefault()
                run(active)
              } else if (e.key === 'Escape') {
                e.preventDefault()
                onClose()
              } else if (e.key === 'Tab') {
                e.preventDefault()
              }
            }}
            placeholder="Open a file, run a command…"
            role="combobox"
            aria-expanded="true"
            aria-controls={listId}
            aria-activedescendant={active ? `${listId}-${active.id}` : undefined}
            aria-label="Search commands and files"
            autoComplete="off"
            spellCheck={false}
          />
          <kbd>esc</kbd>
        </div>
        <ul ref={listRef} id={listId} role="listbox" className="cn-palette-list">
          {results.length === 0 && <li className="cn-palette-empty">Nothing matches “{query}”.</li>}
          {results.map((item) => {
            const showGroup = item.group !== lastGroup
            lastGroup = item.group
            const selected = item === active
            return (
              <li key={item.id} role="presentation">
                {showGroup && <div className="cn-palette-group">{item.group}</div>}
                <div
                  id={`${listId}-${item.id}`}
                  role="option"
                  aria-selected={selected}
                  className="cn-palette-row"
                  onMouseMove={() => setIndex(results.indexOf(item))}
                  onClick={() => run(item)}
                >
                  <span className="cn-palette-icon" aria-hidden="true">
                    {item.icon}
                  </span>
                  <span className="cn-palette-label">{item.label}</span>
                  {item.hint && <span className="cn-palette-hint">{item.hint}</span>}
                  {selected && <CornerDownLeft size={13} aria-hidden="true" />}
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
