import Link from 'next/link'

const DESIGNS = [
  { href: '/4', label: 'Console' },
  { href: '/5', label: 'Index' },
  { href: '/6', label: 'Bento' },
] as const

/**
 * Cross-links between the three explorations so a reviewer can flip between
 * them without editing the URL. Each design styles it through `className`.
 */
export function DesignLinks({
  current,
  className,
  linkClassName,
}: {
  current: '/4' | '/5' | '/6'
  className?: string
  linkClassName?: string
}) {
  return (
    <nav className={className} aria-label="Design explorations">
      {DESIGNS.map((d) => (
        <Link
          key={d.href}
          href={d.href}
          className={linkClassName}
          aria-current={d.href === current ? 'page' : undefined}
        >
          {d.label}
        </Link>
      ))}
      <Link href="/" className={linkClassName}>
        Current site
      </Link>
    </nav>
  )
}
