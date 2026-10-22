// 게임 타이틀: 구름 모양 배지 + 핑크 바느질 점선 + 별, 글자마다 다른 파스텔 색
const LETTER_COLORS = ['#f2559b', '#f6b81c', '#38b4e6', '#9b6ef0']

const CLOUD =
  'M34 70 A20 20 0 0 1 22 34 A24 24 0 0 1 62 16 A28 28 0 0 1 112 8 A26 26 0 0 1 158 14 A24 24 0 0 1 198 32 A20 20 0 0 1 204 68 A16 16 0 0 1 186 80 L50 80 A16 16 0 0 1 34 70 Z'

function Star({ className, color, glow }: { className: string; color: string; glow: string }) {
  return (
    <svg className={`title-star ${className}`} viewBox="0 0 40 40" aria-hidden="true">
      <path
        d="M20 3 L25 14.5 L37.5 15.5 L28 24 L31 36.5 L20 30 L9 36.5 L12 24 L2.5 15.5 L15 14.5 Z"
        fill={color}
        stroke="#ffffff"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <path d="M20 9 L23 16.5 L30 17.5" fill="none" stroke={glow} strokeWidth="2.2" strokeLinecap="round" opacity="0.9" />
    </svg>
  )
}

export function TitleBadge({ text }: { text: string }) {
  let colorIndex = 0
  return (
    <h1 className="title-badge" aria-label={text}>
      <svg className="title-cloud" viewBox="0 0 226 92" preserveAspectRatio="none" aria-hidden="true">
        <path d={CLOUD} fill="#fffdfb" stroke="#f6c9dc" strokeWidth="2" />
        <path
          d={CLOUD}
          fill="none"
          stroke="#f08cb8"
          strokeWidth="1.8"
          strokeDasharray="6 5"
          strokeLinecap="round"
          transform="translate(113 46) scale(0.9 0.84) translate(-113 -46)"
        />
      </svg>
      <Star className="s1" color="#7fd3f2" glow="#e6f7ff" />
      <Star className="s2" color="#ffd84a" glow="#fff6c8" />
      <Star className="s3" color="#8fdcf5" glow="#e6f7ff" />
      <span className="title-text" aria-hidden="true">
        {[...text].map((ch, i) =>
          ch === ' ' ? (
            <span key={i} className="title-space" />
          ) : (
            <span key={i} className="title-letter" style={{ '--c': LETTER_COLORS[colorIndex++ % LETTER_COLORS.length] } as React.CSSProperties}>
              {ch}
            </span>
          ),
        )}
      </span>
    </h1>
  )
}
