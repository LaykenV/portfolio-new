import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

export const ogCardAlt = 'Layken Varholdt — Senior Engineer'
export const ogCardSize = {
  width: 1200,
  height: 630,
}

const BLUE = '125, 167, 243'
const PEACH = '243, 164, 125'
const FG = '#EDEDED'
const MUTED = 'rgba(237, 237, 237, 0.6)'

const NAME = 'Layken Varholdt'
const ROLE = 'SENIOR ENGINEER'
const SUB =
  'Document intelligence, multi-agent orchestration, and infrastructure that holds up in production.'
const URL_TEXT = 'laykenvarholdt.com'
const CREDENTIAL = '1st place · Convex Modern Stack Hackathon · $10k'

async function loadGoogleFont(family: string, weight: number, text: string) {
  const url = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(
    family
  )}:wght@${weight}&text=${encodeURIComponent(text)}`
  const css = await (await fetch(url)).text()
  const match = css.match(/src: url\((.+?)\) format\('(opentype|truetype)'\)/)
  if (!match) throw new Error(`Could not load font: ${family} ${weight}`)
  const res = await fetch(match[1])
  return res.arrayBuffer()
}

export async function renderOgCard() {
  const [portrait, geistBold, geistRegular, geistMono] = await Promise.all([
    readFile(join(process.cwd(), 'public', 'portrait.jpeg')),
    loadGoogleFont('Geist', 700, NAME),
    loadGoogleFont('Geist', 400, SUB),
    loadGoogleFont('Geist Mono', 500, ROLE + URL_TEXT + CREDENTIAL),
  ])
  const portraitSrc = `data:image/jpeg;base64,${portrait.toString('base64')}`

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#0A0A0A',
          backgroundImage: `
            radial-gradient(circle at 84% 38%, rgba(${BLUE}, 0.16), transparent 46%),
            radial-gradient(circle at 6% 4%, rgba(${BLUE}, 0.10), transparent 42%),
            radial-gradient(circle at 20% 110%, rgba(${PEACH}, 0.12), transparent 50%)
          `,
          padding: '60px 76px 52px',
          color: FG,
        }}
      >
        {/* Main: name block + portrait */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              maxWidth: 720,
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 18,
                fontFamily: 'Geist Mono',
                fontSize: 22,
                fontWeight: 500,
                letterSpacing: 7,
                color: `rgb(${PEACH})`,
              }}
            >
              <div
                style={{
                  width: 46,
                  height: 2,
                  backgroundImage: `linear-gradient(90deg, rgb(${BLUE}), rgb(${PEACH}))`,
                }}
              />
              {ROLE}
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                marginTop: 28,
                fontFamily: 'Geist',
                fontSize: 108,
                fontWeight: 700,
                lineHeight: 1.02,
                letterSpacing: -4,
                color: FG,
              }}
            >
              <div style={{ display: 'flex' }}>Layken</div>
              <div style={{ display: 'flex' }}>Varholdt</div>
            </div>

            <div
              style={{
                display: 'flex',
                marginTop: 30,
                maxWidth: 640,
                fontFamily: 'Geist',
                fontSize: 24,
                fontWeight: 400,
                lineHeight: 1.5,
                color: MUTED,
              }}
            >
              {SUB}
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              padding: 5,
              borderRadius: 9999,
              backgroundImage: `linear-gradient(135deg, rgba(${BLUE}, 0.9), rgba(${PEACH}, 0.9))`,
              boxShadow: `0 24px 90px rgba(${BLUE}, 0.28)`,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={portraitSrc}
              alt=""
              width={292}
              height={292}
              style={{
                borderRadius: 9999,
                objectFit: 'cover',
                border: '5px solid #0A0A0A',
              }}
            />
          </div>
        </div>

        {/* Footer: url + credential */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '1px solid rgba(237, 237, 237, 0.14)',
            paddingTop: 30,
            fontFamily: 'Geist Mono',
            fontSize: 21,
            fontWeight: 500,
          }}
        >
          <div style={{ display: 'flex', color: `rgba(${BLUE}, 0.95)` }}>
            {URL_TEXT}
          </div>
          <div style={{ display: 'flex', color: MUTED }}>{CREDENTIAL}</div>
        </div>
      </div>
    ),
    {
      ...ogCardSize,
      fonts: [
        { name: 'Geist', data: geistBold, weight: 700, style: 'normal' },
        { name: 'Geist', data: geistRegular, weight: 400, style: 'normal' },
        { name: 'Geist Mono', data: geistMono, weight: 500, style: 'normal' },
      ],
    }
  )
}
