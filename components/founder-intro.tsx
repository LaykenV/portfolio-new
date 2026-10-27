import { ArrowUpRight } from 'lucide-react'

export function FounderIntro() {
  return (
    <div className="founder-intro">
      <p className="founder-label">Founder of</p>
      <h2 className="founder-name">
        <a href="https://www.varholdt.com/" target="_blank" rel="noreferrer noopener">
          Varholdt AI
          <ArrowUpRight aria-hidden="true" size={14} />
        </a>
      </h2>
      <p className="founder-description">
        The AI engineer for businesses that don’t have one.
      </p>
    </div>
  )
}
