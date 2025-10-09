import { ImageResponse } from 'next/og'

export const alt = 'Layken Varholdt — Software Engineer'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '72px 88px',
          backgroundColor: '#FAF9F6',
          backgroundImage:
            'linear-gradient(140deg, #FAF9F6 0%, #FFF8F3 38%, #FFEDE4 72%, #E9F1FF 100%), ' +
            'radial-gradient(420px 420px at -16% 20%, rgba(233,241,255,0.55), rgba(233,241,255,0) 70%), ' +
            'radial-gradient(520px 520px at 120% 120%, rgba(255,237,228,0.48), rgba(255,237,228,0) 70%)',
          color: '#222222',
          fontFamily: "'Geist', 'Inter', 'SF Pro Display', sans-serif",
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            maxWidth: '52%',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              padding: '12px 18px',
              borderRadius: '9999px',
              border: '1px solid rgba(34,34,34,0.12)',
              background: 'rgba(255,255,255,0.55)',
              fontSize: '20px',
              fontWeight: 500,
              letterSpacing: '-0.02em',
              boxShadow: '0 18px 42px -28px rgba(34,34,34,0.45)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '28px',
                height: '28px',
                borderRadius: '6px',
                background: 'linear-gradient(180deg, rgba(233,241,255,0.85), rgba(233,241,255,0.65))',
                border: '1px solid rgba(90,122,255,0.26)',
              }}
            >
              ⚡️
            </span>
            Modern web experiences
          </div>

          <h1
            style={{
              fontSize: '72px',
              fontWeight: 600,
              lineHeight: 0.98,
              letterSpacing: '-0.045em',
              margin: 0,
              display: 'flex',
            }}
          >
            Layken Varholdt
          </h1>

          <p
            style={{
              fontSize: '30px',
              fontWeight: 500,
              opacity: 0.82,
              letterSpacing: '-0.02em',
              margin: 0,
              display: 'flex',
              flexWrap: 'wrap',
            }}
          >
            Software Engineer crafting realtime, beautiful products for fast-moving teams.
          </p>

          <div
            style={{
              display: 'flex',
              gap: '16px',
              fontSize: '22px',
              fontWeight: 500,
              color: '#2f2f2f',
              opacity: 0.85,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', borderRadius: '10px', padding: '4px 10px', background: 'rgba(255,255,255,0.56)' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  background: 'linear-gradient(180deg, rgba(233,241,255,0.9), rgba(90,122,255,0.55))',
                  boxShadow: '0 0 20px rgba(90,122,255,0.38)',
                }}
              />
              Realtime apps
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', borderRadius: '10px', padding: '4px 10px', background: 'rgba(255,255,255,0.56)' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  background: 'linear-gradient(180deg, rgba(255,237,228,0.9), rgba(255,188,148,0.55))',
                  boxShadow: '0 0 20px rgba(255,188,148,0.38)',
                }}
              />
              Fast iterations
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', borderRadius: '10px', padding: '4px 10px', background: 'rgba(255,255,255,0.56)' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  background: 'linear-gradient(180deg, rgba(34,34,34,0.9), rgba(34,34,34,0.65))',
                  boxShadow: '0 0 18px rgba(34,34,34,0.28)',
                }}
              />
              Premium polish
            </div>
          </div>
        </div>

        <div
          style={{
            position: 'relative',
            minHeight: '100%',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              background:
                'linear-gradient(180deg, rgba(10,10,10,0.92) 0%, rgba(24,24,24,0.83) 100%)',
              color: '#EDEDED',
              padding: '44px 40px',
              borderRadius: '28px',
              border: '1px solid rgba(34,34,34,0.16)',
              boxShadow:
                '0 28px 60px -22px rgba(10,10,10,0.28), 0 18px 42px -20px rgba(90,122,255,0.22)',
              display: 'flex',
              flexDirection: 'column',
              gap: '18px',
              width: '360px',
              backdropFilter: 'blur(20px)',
            }}
          >
            <h2
              style={{
                fontSize: '18px',
                letterSpacing: '0.28em',
                textTransform: 'uppercase',
                opacity: 0.58,
                margin: 0,
                display: 'flex',
              }}
            >
              Focus Areas
            </h2>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
              fontSize: '24px',
              fontWeight: 600,
            }}
          >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Next.js & React 19</span>
                <span style={{ fontSize: '20px', opacity: 0.65 }}>→</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Convex</span>
                <span style={{ fontSize: '20px', opacity: 0.65 }}>→</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Stripe / SaaS tooling</span>
                <span style={{ fontSize: '20px', opacity: 0.65 }}>→</span>
              </div>
            </div>
            <p
              style={{
                marginTop: '12px',
                paddingTop: '16px',
                borderTop: '1px solid rgba(237,237,237,0.14)',
                fontSize: '18px',
                lineHeight: 1.4,
                opacity: 0.7,
                display: 'flex',
                marginBottom: 0,
              }}
            >
              Delivering realtime, beautiful web applications with premium UX.
            </p>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}


