// 방 배경 (벽, 바닥, 러그, 침대, 의자, 소품). 옷장과 옷은 Room에서 그 위에 올린다.
// viewBox 300x400 = 방 비율 3:4 이므로 1단위 = 가로 1/3%, 세로 1/4%.
const WOOD = '#d9a273'
const WOOD_DARK = '#c08657'
const LINE = '#3a2a20'
// 방 배경 채도 (1 = 원본). 단조롭고 차분하게
const ROOM_SATURATE = 0.92

export function RoomScene() {
  return (
    <svg className="room-scene" viewBox="0 0 300 400" aria-hidden="true" style={{ filter: `saturate(${ROOM_SATURATE})` }}>
      <defs>
        <linearGradient id="wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fdf1ef" />
          <stop offset="1" stopColor="#f8e3e3" />
        </linearGradient>
        <radialGradient id="lamp-glow">
          <stop offset="0" stopColor="#ffd3c4" stopOpacity="0.55" />
          <stop offset="1" stopColor="#ffd3c4" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="floor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#efd3b4" />
          <stop offset="1" stopColor="#e5c19d" />
        </linearGradient>
        {/* 바닥에 널브러진 옷을 구겨진 것처럼 살짝 일그러뜨림 (Room의 .room-item.floor에서 사용) */}
        <filter id="crumple" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="7" />
          <feDisplacementMap in="SourceGraphic" scale="9" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <pattern id="stripe-bw" width="6" height="6" patternUnits="userSpaceOnUse">
          <rect width="3" height="6" fill="#38b4e6" />
          <rect x="3" width="3" height="6" fill="#effaff" />
        </pattern>
        <pattern id="stripe-brown" width="8" height="8" patternUnits="userSpaceOnUse">
          <rect width="4" height="8" fill="#ffd84a" />
          <rect x="4" width="4" height="8" fill="#fff6d6" />
        </pattern>
        <pattern id="stripe-navy" width="5" height="5" patternUnits="userSpaceOnUse">
          <rect width="5" height="2.5" fill="#9b6ef0" />
          <rect y="2.5" width="5" height="2.5" fill="#f1eafd" />
        </pattern>
      </defs>

      {/* 벽 + 걸레받이 */}
      <rect width="300" height="250" fill="url(#wall)" />
      <circle cx="268" cy="40" r="120" fill="url(#lamp-glow)" />
      <rect y="243" width="300" height="7" fill="#fffaf8" />
      <path d="M0 243 H300" stroke="#f1d3d6" strokeWidth="1" />

      {/* 마루 */}
      <rect y="250" width="300" height="150" fill="url(#floor)" />
      <g stroke="#d2a983" strokeOpacity="0.45" strokeWidth="1">
        <path d="M0 264 H300 M0 282 H300 M0 304 H300 M0 330 H300 M0 361 H300 M0 397 H300" />
        <path d="M40 250 V264 M150 250 V264 M250 250 V264 M95 264 V282 M205 264 V282 M30 282 V304 M140 282 V304 M260 282 V304 M80 304 V330 M190 304 V330 M120 330 V361 M235 330 V361 M60 361 V397 M170 361 V397" />
      </g>

      {/* 핑크 러그 */}
      <path d="M44 314 H290 L300 400 H6 Z" fill="#bfe3f2" />
      <path d="M52 320 H284 L292 394 H16 Z" fill="none" stroke="#ffffff" strokeWidth="1.5" strokeDasharray="1 3" />

      {/* 펜던트 종이 등 */}
      <path d="M268 0 V18" stroke="#6b5a4a" strokeWidth="1" />
      <rect x="263" y="16" width="10" height="4" rx="1" fill="#e8dcc6" />
      <ellipse cx="268" cy="40" rx="25" ry="21" fill="#f8efdc" />
      <g fill="none" stroke="#e3d2b2" strokeWidth="1">
        <path d="M245 32 Q268 26 291 32 M243 40 Q268 34 293 40 M245 48 Q268 42 291 48 M250 55 Q268 50 286 55" />
      </g>
      <ellipse cx="268" cy="40" rx="25" ry="21" fill="none" stroke="#e3d2b2" strokeWidth="1" />

      {/* 액자 */}
      <rect x="196" y="72" width="48" height="60" fill={WOOD} />
      <rect x="200" y="76" width="40" height="52" fill="#faf6ee" />
      <rect x="204" y="80" width="32" height="44" fill="#a9be8b" />
      <path d="M208 120 Q206 96 222 94 Q232 96 230 112 L230 120 Z" fill="#3f8fd2" />
      <circle cx="221" cy="92" r="5" fill="#e3b28c" />
      <rect x="216" y="99" width="11" height="9" fill="#c8332c" />
      <path d="M208 120 H232" stroke="#6b3a1f" strokeWidth="3" />

      {/* 벽 선반: 책, 화분, 버섯 램프 */}
      <rect x="200" y="166" width="94" height="4" fill={WOOD} />
      <path d="M210 170 V176 M284 170 V176" stroke={WOOD_DARK} strokeWidth="2" />
      <rect x="204" y="146" width="5" height="20" fill="#c8332c" />
      <rect x="209" y="149" width="6" height="17" fill="#9b6ef0" />
      <rect x="215" y="144" width="4" height="22" fill="#e8c66a" />
      <rect x="219.5" y="150" width="5" height="16" fill="#7f9f80" transform="rotate(12 222 166)" />
      <path d="M240 166 L242 154 H252 L254 166 Z" fill="#c9895f" />
      <g fill="#5f8f4e">
        <ellipse cx="240" cy="146" rx="7" ry="4" transform="rotate(-30 240 146)" />
        <ellipse cx="254" cy="144" rx="7" ry="4" transform="rotate(30 254 144)" />
        <ellipse cx="247" cy="139" rx="4" ry="7" />
        <ellipse cx="236" cy="157" rx="6" ry="3" transform="rotate(-50 236 157)" />
      </g>
      <path d="M275 166 V152" stroke="#c9c2b6" strokeWidth="2" />
      <rect x="270" y="164" width="10" height="2.5" rx="1" fill="#c9c2b6" />
      <path d="M264 153 Q264 138 275 138 Q286 138 286 153 Z" fill="#f48aa8" />
      <ellipse cx="275" cy="153" rx="11" ry="2" fill="#ffd7a0" />

      {/* 침대 */}
      <ellipse cx="243" cy="301" rx="58" ry="5" fill="#3a1f0f" opacity="0.18" />
      <rect x="282" y="194" width="14" height="106" rx="6" fill={WOOD} />
      <rect x="284" y="200" width="10" height="70" rx="4" fill={WOOD_DARK} opacity="0.35" />
      <rect x="192" y="272" width="96" height="14" rx="3" fill={WOOD} />
      <rect x="196" y="286" width="5" height="12" fill={WOOD_DARK} />
      <rect x="192" y="232" width="92" height="42" rx="8" fill="#f3ece0" />
      <path d="M190 236 Q206 228 222 234 Q240 240 258 232 L262 232 L262 278 L190 278 Z" fill="#f8c8dc" />
      <path d="M190 262 Q226 268 262 260" fill="none" stroke="#efa9c8" strokeWidth="2" />
      <rect x="256" y="230" width="8" height="48" rx="3" fill="#e9dfcc" />
      <rect x="250" y="210" width="32" height="26" rx="8" fill="url(#stripe-brown)" stroke="#8a5a3b" strokeWidth="1" />
      <rect x="236" y="226" width="24" height="12" rx="6" fill="url(#stripe-navy)" />
      <ellipse cx="260" cy="232" rx="4" ry="6" fill="#9b6ef0" />

      {/* 레트로 의자 */}
      <ellipse cx="52" cy="378" rx="40" ry="4" fill="#3a1f0f" opacity="0.18" />
      <g stroke="#a8aeb4" strokeWidth="3" fill="none" strokeLinecap="round">
        <path d="M24 346 Q20 362 18 376" />
        <path d="M80 346 Q84 362 88 376" />
        <path d="M18 376 H88" />
      </g>
      <rect x="15" y="288" width="18" height="52" rx="6" fill="url(#stripe-bw)" stroke={LINE} strokeWidth="1" />
      <rect x="15" y="334" width="72" height="14" rx="6" fill="#c9b7ef" />
      <rect x="15" y="342" width="72" height="6" rx="3" fill="#b49fe6" />
      <rect x="22" y="318" width="64" height="5" rx="2.5" fill={WOOD} />
      <path d="M78 323 L74 336" stroke={WOOD} strokeWidth="4" strokeLinecap="round" />
    </svg>
  )
}

// 화면이 방보다 세로로 길 때 방 위쪽 남는 벽에 보이는 소품 (옷장 위 상자들, 창문, 등 줄).
// 아래쪽(y=200)이 옷장 윗면 높이에 맞춰지고, 남는 공간만큼만 위로 보인다.
export function WallAbove() {
  return (
    <svg className="wall-above" viewBox="0 0 300 200" aria-hidden="true" style={{ filter: `saturate(${ROOM_SATURATE})` }}>
      <defs>
        <radialGradient id="lamp-glow-above">
          <stop offset="0" stopColor="#ffd3c4" stopOpacity="0.55" />
          <stop offset="1" stopColor="#ffd3c4" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#a9cbe0" />
          <stop offset="1" stopColor="#f6dcc0" />
        </linearGradient>
      </defs>

      {/* 방 안 등 불빛이 위로도 이어지도록. y=200이 방 SVG의 y=12이므로 방의 원(cy=40)은 여기서 cy=228.
          방과 겹치는 아래 띠(y 188~200)는 잘라서 두 번 칠해지지 않게 */}
      <clipPath id="above-room">
        <rect x="0" y="-2000" width="300" height="2188" />
      </clipPath>
      <circle cx="268" cy="228" r="120" fill="url(#lamp-glow-above)" clipPath="url(#above-room)" />

      {/* 창문 + 커튼 */}
      <rect x="204" y="62" width="82" height="112" rx="3" fill={WOOD} />
      <rect x="209" y="67" width="72" height="102" fill="url(#sky)" />
      <circle cx="262" cy="150" r="10" fill="#ffe2b0" opacity="0.8" />
      <path d="M209 150 Q226 140 240 150 Q256 142 281 152 V169 H209 Z" fill="#f8c8dc" opacity="0.6" />
      <path d="M245 67 V169 M209 118 H281" stroke={WOOD} strokeWidth="4" />
      <rect x="198" y="58" width="94" height="5" rx="2" fill={WOOD_DARK} />
      <path d="M200 63 Q206 110 200 172 L214 172 Q210 110 216 63 Z" fill="#f3ece0" stroke="#e0d3bd" strokeWidth="1" />
      <path d="M290 63 Q284 110 290 172 L276 172 Q280 110 274 63 Z" fill="#f3ece0" stroke="#e0d3bd" strokeWidth="1" />
      <rect x="200" y="172" width="92" height="5" rx="2" fill="#fffaf8" />

      {/* 펜던트 등 줄이 천장까지 이어짐 */}
      <path d="M268 -2000 V200" stroke="#6b5a4a" strokeWidth="1" />

      {/* 옷장 위 수납: 라탄 바구니, 모자 상자, 수납 박스 */}
      <path d="M22 200 L26 172 H72 L76 200 Z" fill="#c8a06a" />
      <path d="M25 180 H73 M24 190 H74 M34 172 V200 M46 172 V200 M58 172 V200 M68 172 V200" stroke="#a37b48" strokeWidth="1" />
      <rect x="22" y="169" width="56" height="5" rx="2" fill="#b58c58" />
      <path d="M30 170 Q40 160 50 166 Q58 158 70 168" fill="#e9dfcc" stroke="#cdbf9f" strokeWidth="1" />
      <rect x="86" y="176" width="40" height="24" fill="#d9a4a0" />
      <ellipse cx="106" cy="200" rx="20" ry="3" fill="#c48e8a" />
      <rect x="84" y="172" width="44" height="7" rx="3" fill="#c88f8a" />
      <path d="M106 172 V166" stroke="#b07a76" strokeWidth="2" />
      <rect x="136" y="178" width="50" height="22" rx="1" fill="#e7d8bf" stroke="#cdbb9b" strokeWidth="1" />
      <rect x="152" y="185" width="18" height="7" rx="1" fill="#faf6ee" />
      <rect x="141" y="160" width="40" height="18" rx="1" fill="#9fb7a0" stroke="#86a088" strokeWidth="1" />
      <path d="M155 167 H167" stroke="#f4efe4" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}
