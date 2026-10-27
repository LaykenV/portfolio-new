'use client'

import { useCallback, useEffect, useId, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTheme } from 'next-themes'
import { ArrowUpRight } from 'lucide-react'
import { WritingIdentity } from '@/components/writing-identity'

const EMAIL = 'layken@varholdt.com'
const CLOSE_MS = 220

const SOCIAL_LINKS = [
  ['Book a call', 'https://cal.com/layken-varholdt'],
  ['Telegram', 'https://t.me/LLVarholdt'],
  ['GitHub', 'https://github.com/laykenV'],
  ['LinkedIn', 'https://www.linkedin.com/in/layken-varholdt-a78687230/'],
  ['X', 'https://x.com/LLVarholdt'],
] as const

/** Two lines. Inside the open menu, CSS folds them into an X. */
export function MenuIcon() {
  return (
    <svg className="site-burger" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 8h16" />
      <path d="M4 16h16" />
    </svg>
  )
}

function reduceMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * The phone menu from varholdt.com and Public Parish: a full-screen sheet that
 * grows down out of the header, large page links, then contact and theme.
 * A native modal dialog handles focus containment, Escape and inert content.
 */
export function SiteMenu({ onHomeClick, onWorkClick }: {
  onHomeClick?: () => void
  onWorkClick?: () => void
}) {
  const pathname = usePathname()
  const { resolvedTheme, setTheme } = useTheme()
  const triggerRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDialogElement>(null)
  const closingRef = useRef(0)
  const [open, setOpen] = useState(false)
  // Home renders a second menu inside an open project sheet.
  const menuId = useId()
  const themeLabelId = `${menuId}-theme`

  const finish = useCallback(() => {
    window.clearTimeout(closingRef.current)
    closingRef.current = 0
    const menu = menuRef.current
    menu?.removeAttribute('data-state')
    if (menu?.open) menu.close()
    document.documentElement.classList.remove('menu-open')
    setOpen(false)
  }, [])

  // Keyboard users return to the menu button. After a tap nothing keeps focus,
  // so the button doesn't stay outlined.
  const settleFocus = useCallback((byKeyboard: boolean) => {
    if (byKeyboard) triggerRef.current?.focus({ preventScroll: true })
    else triggerRef.current?.blur()
  }, [])

  const close = useCallback((instant: boolean, byKeyboard: boolean) => {
    const menu = menuRef.current
    if (!menu?.open) return
    if (instant || reduceMotion()) {
      finish()
      settleFocus(byKeyboard)
      return
    }
    if (closingRef.current) return
    menu.setAttribute('data-state', 'ending')
    closingRef.current = window.setTimeout(() => {
      finish()
      settleFocus(byKeyboard)
    }, CLOSE_MS)
  }, [finish, settleFocus])

  const show = () => {
    const menu = menuRef.current
    if (!menu || menu.open) return
    menu.setAttribute('data-state', 'starting')
    menu.showModal()
    menu.focus({ preventScroll: true })
    document.documentElement.classList.add('menu-open')
    setOpen(true)
    menu.getBoundingClientRect()
    requestAnimationFrame(() => menu.removeAttribute('data-state'))
  }

  useEffect(() => finish, [finish])
  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 768px)')
    const onChange = (event: MediaQueryListEvent) => { if (event.matches) finish() }
    const onPageShow = (event: PageTransitionEvent) => { if (event.persisted) finish() }
    desktop.addEventListener('change', onChange)
    window.addEventListener('pageshow', onPageShow)
    return () => {
      desktop.removeEventListener('change', onChange)
      window.removeEventListener('pageshow', onPageShow)
    }
  }, [finish])

  const onWritingPage = pathname === '/blog' || pathname.startsWith('/blog/')

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className="site-menu-btn"
        aria-label="Open menu"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={show}
      >
        <MenuIcon />
      </button>

      <dialog
        ref={menuRef}
        id={menuId}
        className="site-menu"
        aria-label="Menu"
        tabIndex={-1}
        onCancel={(event) => {
          event.preventDefault()
          close(false, true)
        }}
      >
        <div className="site-menu-head">
          <Link
            href="/"
            className="site-brand"
            onClick={(event) => {
              if (!onHomeClick) return finish()
              event.preventDefault()
              finish()
              settleFocus(event.detail === 0)
              onHomeClick()
            }}
          >
            <WritingIdentity />
          </Link>
          <button
            type="button"
            className="site-menu-btn"
            aria-label="Close menu"
            onClick={(event) => close(false, event.detail === 0)}
          >
            <MenuIcon />
          </button>
        </div>

        <div className="site-menu-body">
          <nav className="site-menu-links" aria-label="Site">
            <Link
              href="/#work"
              onClick={(event) => {
                if (!onWorkClick) return finish()
                event.preventDefault()
                finish()
                settleFocus(event.detail === 0)
                onWorkClick()
              }}
            >
              Work
            </Link>
            <Link href="/blog" aria-current={onWritingPage ? 'page' : undefined} onClick={finish}>
              Writing
            </Link>
            <a href="https://www.varholdt.com/" target="_blank" rel="noreferrer" onClick={finish}>
              Varholdt AI
              <ArrowUpRight className="site-menu-ext" aria-hidden="true" />
            </a>
            <a href="/Layken-Varholdt-Software-Engineer-Resume.pdf" target="_blank" rel="noreferrer" onClick={finish}>
              Résumé
              <ArrowUpRight className="site-menu-ext" aria-hidden="true" />
            </a>
          </nav>

          <div className="site-menu-bottom">
            <a className="site-menu-cta" href={`mailto:${EMAIL}?subject=Software%20Engineering%20role`}>
              Email {EMAIL}
            </a>
            <p className="site-menu-meta">
              {SOCIAL_LINKS.map(([label, href]) => (
                <a key={label} href={href} target="_blank" rel="noreferrer">{label}</a>
              ))}
            </p>
            <div className="site-menu-theme">
              <span id={themeLabelId}>Theme</span>
              <div role="group" aria-labelledby={themeLabelId} className="site-theme-switch">
                {(['light', 'dark'] as const).map((theme) => (
                  <button
                    key={theme}
                    type="button"
                    data-theme-option={theme}
                    aria-pressed={open ? resolvedTheme === theme : undefined}
                    onClick={() => setTheme(theme)}
                  >
                    {theme === 'light' ? 'Light' : 'Dark'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </dialog>
    </>
  )
}
