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
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          background: '#0A0A0A',
          color: '#EDEDED',
          padding: 64,
          fontSize: 48,
          fontWeight: 600,
          letterSpacing: -1,
        }}
      >
        <div style={{ fontSize: 64, marginBottom: 12 }}>Layken Varholdt</div>
        <div style={{ fontSize: 36, opacity: 0.9 }}>Software Engineer</div>
        <div style={{ marginTop: 24, fontSize: 24, opacity: 0.85 }}>
          Building web applications with cutting-edge technology
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}


