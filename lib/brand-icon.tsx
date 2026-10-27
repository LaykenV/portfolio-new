import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { brand } from '@/lib/brand'

export async function renderBrandIcon(size: number) {
  const font = await readFile(join(process.cwd(), 'assets/fonts/geist-bold.ttf'))
  return new ImageResponse(
    <div style={{
      width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: brand.accent, color: brand.onAccent, fontFamily: 'Geist',
      fontWeight: 700, fontSize: size * 0.56, letterSpacing: -size * 0.035,
    }}>LV</div>,
    { width: size, height: size, fonts: [{ name: 'Geist', data: font, weight: 700, style: 'normal' }] },
  )
}
