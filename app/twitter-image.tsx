import { ImageResponse } from 'next/og'

export const alt = 'Layken Varholdt — AI Engineer'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

const BLUE = '93, 140, 230'
const PEACH = '230, 130, 85'
const FG = '#222222'
const MUTED = 'rgba(34, 34, 34, 0.65)'

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          backgroundColor: '#FAF9F6',
          backgroundImage: `
            radial-gradient(circle at 10% 10%, rgba(${BLUE}, 0.22), transparent 55%),
            radial-gradient(circle at 92% 20%, rgba(${PEACH}, 0.18), transparent 55%),
            radial-gradient(circle at 50% 120%, rgba(${PEACH}, 0.12), transparent 60%)
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
            border: `1px solid rgba(${BLUE}, 0.26)`,
            backgroundColor: 'rgba(255, 255, 255, 0.55)',
            backgroundImage: `linear-gradient(180deg, rgba(255, 255, 255, 0.72), rgba(255, 255, 255, 0.45))`,
            boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.9)',
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
                background: '#16a34a',
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
                border: `1px solid rgba(${PEACH}, 0.45)`,
                backgroundImage: `linear-gradient(135deg, rgba(${PEACH}, 0.20), rgba(${BLUE}, 0.14))`,
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
