import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

// LV initials with the Varholdt tile, rim and forest-and-sage shading.
export async function renderPortfolioIcon(size: number) {
  const svg = await readFile(join(process.cwd(), 'public/favicon.svg'))
  return new ImageResponse(
    <div style={{ width: '100%', height: '100%', display: 'flex' }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`data:image/svg+xml;base64,${svg.toString('base64')}`} alt="" width={size} height={size} />
    </div>,
    { width: size, height: size },
  )
}
