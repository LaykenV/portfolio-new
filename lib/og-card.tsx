import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { brand } from '@/lib/brand'

export const ogCardAlt = 'Layken Varholdt, software engineer and founder of Varholdt AI. Portrait on a sage green background.'
export const ogCardSize = { width: 1200, height: 630 }

export async function renderOgCard() {
  const [portrait, bold, regular, mono] = await Promise.all([
    readFile(join(process.cwd(), 'public', 'portrait.jpeg')),
    readFile(join(process.cwd(), 'assets/fonts/geist-bold.ttf')),
    readFile(join(process.cwd(), 'assets/fonts/geist-regular.ttf')),
    readFile(join(process.cwd(), 'assets/fonts/geist-mono-medium.ttf')),
  ])

  return new ImageResponse(
    (
      <div style={{
        width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
        padding: '58px 64px 40px', background: brand.background, color: brand.foreground,
        fontFamily: 'Geist',
      }}>
        <div style={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontFamily: 'Geist Mono', fontSize: 19, letterSpacing: 2, color: brand.muted }}>
              SOFTWARE ENGINEER
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', marginTop: 22, fontSize: 102, lineHeight: 1.02, letterSpacing: -4, fontWeight: 700 }}>
              <span>Layken</span>
              <span>Varholdt</span>
            </div>
            <div style={{ display: 'flex', marginTop: 25, fontSize: 28, color: brand.accent }}>
              Founder of Varholdt AI
            </div>
            <div style={{ display: 'flex', marginTop: 12, fontSize: 23, color: brand.muted }}>
              Web applications and AI systems.
            </div>
          </div>
          <div style={{ display: 'flex', padding: 6, border: `2px solid ${brand.border}`, borderRadius: 999 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`data:image/jpeg;base64,${portrait.toString('base64')}`} alt="" width={300} height={300} style={{ borderRadius: 999, objectFit: 'cover' }} />
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 32, paddingTop: 24, borderTop: `1px solid ${brand.border}`, fontFamily: 'Geist Mono', fontSize: 18 }}>
          <span style={{ color: brand.accent }}>laykenvarholdt.com</span>
          <span style={{ color: brand.muted }}>1st place · Convex Modern Stack Hackathon</span>
        </div>
      </div>
    ),
    {
      ...ogCardSize,
      fonts: [
        { name: 'Geist', data: bold, weight: 700, style: 'normal' },
        { name: 'Geist', data: regular, weight: 400, style: 'normal' },
        { name: 'Geist Mono', data: mono, weight: 500, style: 'normal' },
      ],
    },
  )
}
