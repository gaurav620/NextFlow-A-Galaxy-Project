import { ImageResponse } from 'next/og';

// Image metadata
export const size = {
  width: 32,
  height: 32,
};
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(to bottom right, #111, #000)',
          border: '1px solid #333',
          borderRadius: '8px', 
        }}
      >
        <span
          style={{
            color: 'white',
            fontSize: '22px',
            fontWeight: 800,
            fontFamily: 'sans-serif',
            letterSpacing: '-1px',
          }}
        >
          N
        </span>
      </div>
    ),
    {
      ...size,
    }
  );
}
