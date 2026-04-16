import { ImageResponse } from 'next/og'

export const alt = 'Layken Varholdt — AI Engineer'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

const BLUE = '125, 167, 243'
const PEACH = '243, 164, 125'
const FG = '#EDEDED'
const MUTED = 'rgba(237, 237, 237, 0.68)'

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          backgroundColor: '#0A0A0A',
          backgroundImage: `
            radial-gradient(circle at 10% 10%, rgba(${BLUE}, 0.22), transparent 55%),
            radial-gradient(circle at 92% 20%, rgba(${PEACH}, 0.18), transparent 55%),
            radial-gradient(circle at 50% 120%, rgba(${PEACH}, 0.10), transparent 60%)
          `,
          padding: 56,
          fontFamily: 'system-ui, -apple-system, Segoe UI, sans-serif',
          color: FG,
        }}
      >
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '56px 64px',
            borderRadius: 28,
            border: `1px solid rgba(${BLUE}, 0.22)`,
            backgroundColor: 'rgba(20, 20, 22, 0.6)',
            backgroundImage: `linear-gradient(180deg, rgba(${BLUE}, 0.06), rgba(${PEACH}, 0.04))`,
            boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.06)',
          }}
        >
          {/* Top: eyebrow */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              fontSize: 20,
              fontWeight: 600,
              letterSpacing: 3,
              textTransform: 'uppercase',
              color: MUTED,
            }}
          >
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: 9999,
                background: '#22c55e',
                boxShadow: '0 0 12px rgba(34, 197, 94, 0.6)',
              }}
            />
            Layken Varholdt · AI Engineer
          </div>

          {/* Middle: hero */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                fontSize: 88,
                fontWeight: 800,
                lineHeight: 1.02,
                letterSpacing: -2,
                color: FG,
              }}
            >
              <div style={{ display: 'flex' }}>Engineer who ships</div>
              <div style={{ display: 'flex' }}>production AI.</div>
            </div>
            <div
              style={{
                fontSize: 26,
                lineHeight: 1.4,
                maxWidth: 880,
                color: MUTED,
                fontWeight: 400,
              }}
            >
              Document intelligence pipelines. Multi-agent orchestration.
              The infrastructure that keeps AI features reliable in production.
            </div>
          </div>

          {/* Bottom row: trophy pill + url */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '12px 18px',
                borderRadius: 9999,
                border: `1px solid rgba(${PEACH}, 0.35)`,
                backgroundImage: `linear-gradient(135deg, rgba(${PEACH}, 0.16), rgba(${BLUE}, 0.10))`,
                fontSize: 22,
                fontWeight: 600,
                color: FG,
              }}
            >
              <span style={{ fontSize: 24 }}>🥇</span>
              1st · Convex Modern Stack Hackathon · $10k
            </div>
            <div
              style={{
                fontSize: 22,
                fontWeight: 500,
                color: MUTED,
                fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
              }}
            >
              laykenvarholdt.com
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
