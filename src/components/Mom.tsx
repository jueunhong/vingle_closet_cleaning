import type { MomMsg } from '../useMom'

// 오른쪽에서 쑥 들어와 한마디 하는 엄마. 기분(mood)에 따라 표정이 바뀜
export function Mom({ msg, leaving }: { msg: MomMsg; leaving: boolean }) {
  const { mood } = msg
  return (
    <div className={`mom mood-${mood}${leaving ? ' leaving' : ''}`} role="status" aria-live="polite">
      <div className="mom-bubble">
        <b>{msg.title}</b>
        <span>{msg.sub}</span>
      </div>
      <svg className="mom-art" viewBox="0 0 120 200" aria-hidden="true">
        <g stroke="#6b5242" strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round">
          {/* 몸: 원피스 + 앞치마 */}
          <path d="M30 104 Q34 92 60 90 Q86 92 90 104 L100 200 H20 Z" fill="#b9d8f0" />
          <path d="M40 112 Q60 108 80 112 L86 200 H34 Z" fill="#fff6fa" />
          <path d="M40 112 Q60 108 80 112" fill="none" stroke="#f08cb8" strokeDasharray="3 3" />
          <rect x="50" y="140" width="20" height="14" rx="3" fill="#f8c8dc" />
          {/* 허리에 올린 팔 */}
          <path d="M88 104 Q104 120 96 140 Q90 146 84 138" fill="#b9d8f0" />
          {/* 앞으로 뻗어 가리키는 팔 */}
          <path d="M34 104 Q16 106 6 96" fill="none" stroke="#6b5242" strokeWidth="13" />
          <path d="M34 104 Q16 106 6 96" fill="none" stroke="#b9d8f0" strokeWidth="9" />
          <circle cx="5" cy="95" r="5.5" fill="#ffdcc8" />
          <path d="M2 92 L-4 86" strokeWidth="4" />
          <path d="M2 92 L-4 86" stroke="#ffdcc8" strokeWidth="2" />
          {/* 목 + 얼굴 */}
          <rect x="53" y="80" width="14" height="12" fill="#ffdcc8" />
          <circle cx="60" cy="60" r="26" fill="#ffdcc8" />
          {/* 뽀글 파마머리 */}
          <g fill="#7a5040">
            {[
              [36, 46], [42, 36], [52, 30], [64, 29], [75, 33], [83, 42], [86, 54], [34, 58], [38, 68], [84, 66],
            ].map(([x, y]) => (
              <circle key={`${x}-${y}`} cx={x} cy={y} r="9" />
            ))}
          </g>
          {mood === 'angry' && (
            <>
              {/* 화난 눈썹, 눈, 입 */}
              <path d="M46 52 L56 56 M74 52 L64 56" strokeWidth="2.8" />
              <circle cx="52" cy="62" r="2.4" fill="#4a3324" stroke="none" />
              <circle cx="68" cy="62" r="2.4" fill="#4a3324" stroke="none" />
              <path d="M54 74 Q60 69 66 74 Q60 78 54 74 Z" fill="#e36a7c" />
            </>
          )}
          {mood === 'happy' && (
            <>
              {/* 웃는 눈(^^), 활짝 웃는 입 */}
              <path d="M46 50 Q51 47 56 50 M64 50 Q69 47 74 50" strokeWidth="2.4" fill="none" />
              <path d="M48 63 Q52 58 56 63 M64 63 Q68 58 72 63" strokeWidth="2.6" fill="none" />
              <path d="M52 71 Q60 81 68 71 Z" fill="#e36a7c" />
            </>
          )}
          {mood === 'hint' && (
            <>
              {/* 한쪽 눈썹 올리고 슬쩍 웃는 얼굴 */}
              <path d="M46 52 Q51 48 56 52 M64 49 Q69 45 74 49" strokeWidth="2.4" fill="none" />
              <circle cx="52" cy="62" r="2.4" fill="#4a3324" stroke="none" />
              <circle cx="68" cy="62" r="2.4" fill="#4a3324" stroke="none" />
              <path d="M54 73 Q61 77 67 71" strokeWidth="2.4" fill="none" />
            </>
          )}
          <ellipse cx="45" cy="70" rx="5" ry="3" fill="#f7a9b8" stroke="none" opacity="0.8" />
          <ellipse cx="75" cy="70" rx="5" ry="3" fill="#f7a9b8" stroke="none" opacity="0.8" />
          {mood === 'angry' && (
            // 화남 표시
            <path d="M88 28 l5 -5 M92 33 l7 -1 M85 24 l1 -7" stroke="#f2559b" strokeWidth="2.6" />
          )}
          {mood === 'happy' && (
            // 하트
            <g stroke="none" fill="#f27fb3">
              <path d="M90 22 q2 -4 5 -1 q3 -3 5 1 q0 4 -5 7 q-5 -3 -5 -7 Z" />
              <path d="M100 38 q1.5 -3 3.5 -1 q2 -2 3.5 1 q0 3 -3.5 5 q-3.5 -2 -3.5 -5 Z" />
            </g>
          )}
          {mood === 'hint' && (
            // 반짝 아이디어 전구
            <g>
              <circle cx="96" cy="22" r="7" fill="#ffd84a" />
              <rect x="93" y="28" width="6" height="4" rx="1" fill="#c9c2b6" />
              <path d="M96 8 V11 M85 13 L87 15 M107 13 L105 15" stroke="#f6b81c" strokeWidth="2" />
            </g>
          )}
        </g>
      </svg>
    </div>
  )
}
