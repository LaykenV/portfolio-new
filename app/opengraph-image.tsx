import { renderOgCard, ogCardAlt } from '@/lib/og-card'

export const alt = ogCardAlt
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default function Image() {
  return renderOgCard()
}
