import { useId, type ReactNode } from 'react'
import type { ClothingKind } from '../data/clothes'

interface Props {
  kind: ClothingKind
  color: string
  accent?: string
}

// 방 분위기에 맞춘 따뜻한 갈색 선 (너무 진하지 않게)
const LINE = '#6b5242'
const DETAIL = 'rgba(74, 51, 36, 0.35)'
const RIB = 'rgba(40, 28, 18, 0.28)' // 시보리(립) 부분을 살짝 어둡게

// 길이가 긴 옷은 세로로 긴 캔버스(100x140)에 그린다
export const TALL_KINDS = new Set<ClothingKind>(['coat', 'puffer', 'woolcoat', 'jeans', 'denimskirt', 'floraldress', 'flarepants'])

interface Shape {
  body: string[] // 옷 실루엣 (색 + 음영 + 외곽선)
  under?: (c: string, a: string) => ReactNode // 실루엣 뒤에 그릴 것 (가방 끈 등)
  inside?: (c: string, a: string) => ReactNode // 실루엣 안쪽으로 잘려서 그려지는 무늬 (줄무늬·체크 등)
  details?: (c: string, a: string) => ReactNode
  fill?: 'dots' // 실루엣을 패턴으로 채움
}

const TEE_BODY = 'M30 18 L40 14 Q50 22 60 14 L70 18 L88 34 L78 46 L70 40 L70 86 L30 86 L30 40 L22 46 L12 34 Z'
const LONGSLEEVE_BODY = 'M32 16 L42 12 Q50 20 58 12 L68 16 L84 30 L92 76 L82 78 L72 42 L72 88 L28 88 L28 42 L18 78 L8 76 L16 30 Z'
const KNIT_BODY = 'M30 16 L42 12 Q50 20 58 12 L70 16 L86 30 L92 72 L80 74 L72 42 L72 86 L28 86 L28 42 L20 74 L8 72 L14 30 Z'

const SHAPES: Record<ClothingKind, Shape> = {
  coat: {
    // 롱 트렌치코트
    body: ['M32 12 L44 8 L50 20 L56 8 L68 12 L84 26 L90 98 L80 100 L73 44 L77 134 L23 134 L27 44 L20 100 L10 98 L16 26 Z'],
    details: (_, a) => (
      <>
        <path d="M44 8 L39 34 L50 20 L61 34 L56 8" fill={a} />
        <rect x="26" y="60" width="48" height="7" rx="1" fill={a} />
        <rect x="46" y="59" width="8" height="9" rx="1" fill="none" />
        {[38, 50, 78, 92].map((y) => (
          <circle key={y} cx="57" cy={y} r="1.8" fill={LINE} stroke="none" />
        ))}
        <path d="M31 84 L39 88 M69 84 L61 88" stroke={DETAIL} strokeWidth="2" />
        <path d="M50 106 V134" stroke={DETAIL} strokeWidth="2" />
        <path d="M10 92 L20 94 M80 94 L90 92" stroke={a} strokeWidth="3" />
      </>
    ),
  },
  puffer: {
    // 롱 패딩
    body: ['M34 14 Q50 2 66 14 L82 24 Q90 30 90 44 L90 102 L78 102 L74 46 L74 134 Q50 138 26 134 L26 46 L22 102 L10 102 L10 44 Q10 30 18 24 Z'],
    details: (_, a) => (
      <>
        <path d="M26 30 H74 M26 46 H74 M26 62 H74 M26 78 H74 M26 94 H74 M26 110 H74 M26 124 H74 M10 58 H22 M10 74 H22 M10 90 H22 M78 58 H90 M78 74 H90 M78 90 H90" stroke={a} strokeWidth="2" />
        <path d="M50 18 V136" />
        <path d="M34 14 Q50 24 66 14" fill="none" />
      </>
    ),
  },
  knit: {
    body: [KNIT_BODY],
    details: (_, a) => (
      <>
        <path d="M28 78 H72 M8 66 L21 68 M92 66 L79 68" />
        <path d="M42 12 Q50 22 58 12" fill="none" />
        <path d="M38 34 L44 42 L38 50 M62 34 L56 42 L62 50 M50 32 V60" fill="none" stroke={a} strokeWidth="2.2" />
        {[[34, 60], [60, 66], [46, 70], [66, 52], [24, 50]].map(([x, y]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r="2" fill={a} stroke="none" />
        ))}
      </>
    ),
  },
  cableknit: {
    body: [KNIT_BODY],
    details: (_, a) => (
      <>
        <path d="M28 78 H72 M8 66 L21 68 M92 66 L79 68" />
        <path d="M42 12 Q50 22 58 12" fill="none" />
        <path
          d="M38 28 Q44 34 38 40 Q32 46 38 52 Q44 58 38 64 Q32 70 38 76 M62 28 Q56 34 62 40 Q68 46 62 52 Q56 58 62 64 Q68 70 62 76 M50 26 V76"
          fill="none"
          stroke={a}
          strokeWidth="2.6"
        />
        <path d="M32 80 V86 M38 80 V86 M44 80 V86 M50 80 V86 M56 80 V86 M62 80 V86 M68 80 V86" stroke={a} strokeWidth="1.8" />
      </>
    ),
  },
  uniform: {
    body: ['M32 12 L44 8 L50 30 L56 8 L68 12 L84 26 L90 78 L80 80 L72 42 L72 88 L28 88 L28 42 L20 80 L10 78 L16 26 Z'],
    details: (_, a) => (
      <>
        <path d="M44 8 L50 30 L56 8 Z" fill="#f7f2e8" />
        <path d="M47.5 13 L52.5 13 L54 30 L50 38 L46 30 Z" fill={a} />
        <path d="M44 8 L39 34 L50 48 L61 34 L56 8" fill="none" stroke="#efe4cf" strokeWidth="1.8" />
        <path d="M60 40 H68 V46 Q64 50 60 46 Z" fill="#d6ad4a" strokeWidth="1.2" />
        <path d="M32 66 H44 M56 66 H68" />
        {[56, 70].map((y) => (
          <circle key={y} cx="50" cy={y} r="2" fill="#d6ad4a" strokeWidth="1" />
        ))}
      </>
    ),
  },
  bomber: {
    // MA-1 봄버: 립 칼라·소매·밑단, 지퍼, 팔 포켓
    body: ['M30 18 Q40 12 50 13 Q60 12 70 18 L84 28 Q92 34 93 46 L95 70 L82 73 L76 46 L76 76 L24 76 L24 46 L18 73 L5 70 L7 46 Q8 34 16 28 Z'],
    details: (_, a) => (
      <>
        <path d="M38 16 Q50 26 62 16 L60 11 Q50 19 40 11 Z" fill={RIB} />
        <rect x="24" y="72" width="52" height="9" rx="2" fill={RIB} />
        <path d="M5 68 L18 71 L17 78 L4 75 Z M95 68 L82 71 L83 78 L96 75 Z" fill={RIB} />
        <path d="M30 73 V80 M36 73 V80 M42 73 V80 M48 73 V80 M54 73 V80 M60 73 V80 M66 73 V80 M72 73 V80" stroke={DETAIL} strokeWidth="1.2" />
        <path d="M44 16 L50 24 L56 16 Z" fill={a} stroke="none" />
        <path d="M50 24 V81" stroke={DETAIL} strokeWidth="2" />
        <rect x="47.5" y="30" width="5" height="7" rx="1" fill="#c9c2b6" strokeWidth="1" />
        <rect x="11" y="40" width="9" height="7" rx="1.5" fill="none" strokeWidth="1.6" />
        <path d="M30 50 L40 46 M70 50 L60 46" stroke={DETAIL} strokeWidth="2" />
      </>
    ),
  },
  nordic: {
    // 노르딕(페어아일) 후드 니트 가디건
    body: ['M34 16 Q36 4 50 4 Q64 4 66 16 L72 18 L86 32 L92 76 L80 78 L74 44 L74 88 L26 88 L26 44 L20 78 L8 76 L14 32 L28 18 Z'],
    details: (_, a) => (
      <>
        <path d="M38 18 Q40 8 50 8 Q60 8 62 18 L56 24 Q50 27 44 24 Z" fill="#6f6f6c" />
        <path d="M22 26 Q50 42 78 26 L82 34 Q50 52 18 34 Z" fill="#3d3f3c" stroke="none" />
        {[24, 32, 40, 50, 60, 68, 76].map((x, i) => (
          <rect key={x} x={x - 2} y={30 + (i === 3 ? 7 : Math.abs(3 - i) < 2 ? 5 : 2)} width="4" height="4" fill={a} stroke="none" transform={`rotate(45 ${x} ${32 + (i === 3 ? 7 : Math.abs(3 - i) < 2 ? 5 : 2)})`} />
        ))}
        <path d="M18 40 Q50 58 82 40" fill="none" stroke="#efece4" strokeWidth="2" strokeDasharray="2 3" />
        <rect x="26" y="62" width="48" height="8" fill="#3d3f3c" stroke="none" />
        <path d="M27 66 H73" stroke="#efece4" strokeWidth="2" strokeDasharray="2 4" />
        <path d="M27 74 H73" stroke={a} strokeWidth="2" strokeDasharray="3 3" />
        <path d="M9 64 L21 66 M91 64 L79 66" stroke="#3d3f3c" strokeWidth="5" />
        <rect x="26" y="83" width="48" height="5" fill="#3d3f3c" stroke="none" />
        <path d="M50 24 V88" />
        {[32, 44, 56, 68, 80].map((y) => (
          <circle key={y} cx="52.5" cy={y} r="1.6" fill="#2b2a28" stroke="none" />
        ))}
      </>
    ),
  },
  floralcardi: {
    // 꽃무늬 크롭 브이넥 니트 가디건 (벌룬 소매, 베이지 립)
    body: ['M30 14 L42 10 L50 30 L58 10 L70 14 L86 30 Q95 50 92 74 L80 76 Q80 56 74 44 L74 78 L26 78 L26 44 Q20 56 20 76 L8 74 Q5 50 14 30 Z'],
    details: (_, a) => {
      const beige = '#e2c99a'
      const leaf = '#8fa08a'
      const roses: [number, number, number, string][] = [
        [36, 46, 7, a], [63, 38, 6, a], [64, 64, 7, a], [14, 56, 5, a], [86, 54, 5, a],
        [32, 64, 5, beige], [52, 56, 4.5, beige], [78, 40, 4, beige], [44, 32, 3.5, beige], [20, 40, 4, beige],
      ]
      return (
        <>
          <path d="M42 10 L50 30 L58 10 Z" fill="#d8c7a6" />
          {[[42, 54], [70, 50], [26, 54], [56, 70]].map(([x, y]) => (
            <ellipse key={`${x}-${y}`} cx={x} cy={y} rx="3.5" ry="1.6" fill={leaf} stroke="none" transform={`rotate(-35 ${x} ${y})`} />
          ))}
          {roses.map(([x, y, r, fill]) => (
            <g key={`${x}-${y}`} stroke="none">
              <circle cx={x} cy={y} r={r} fill={fill} opacity="0.92" />
              <path d={`M${x - r * 0.45} ${y} q${r * 0.45} ${-r * 0.6} ${r * 0.8} 0 q${-r * 0.3} ${r * 0.5} ${-r * 0.6} ${r * 0.1}`} fill="none" stroke="rgba(74, 51, 36, 0.3)" strokeWidth="1" />
            </g>
          ))}
          <rect x="26" y="72" width="48" height="7" rx="1" fill={beige} />
          <path d="M31 73 V78 M37 73 V78 M43 73 V78 M57 73 V78 M63 73 V78 M69 73 V78" stroke={DETAIL} strokeWidth="1" />
          <path d="M8 70 L20 72 L20 77 L8 75 Z M92 70 L80 72 L80 77 L92 75 Z" fill={beige} strokeWidth="1.6" />
          <path d="M50 30 V79" stroke={beige} strokeWidth="2.4" />
          {[42, 54, 66].map((y) => (
            <circle key={y} cx="50" cy={y} r="2" fill="#d9d4cc" strokeWidth="1" />
          ))}
        </>
      )
    },
  },
  turtleneck: {
    // 터틀넥 니트: 목 부분 접힌 립, 세로 골지
    body: [KNIT_BODY],
    inside: () => (
      <path d="M34 20 V86 M40 18 V86 M46 18 V86 M54 18 V86 M60 18 V86 M66 20 V86" stroke={DETAIL} strokeWidth="1" />
    ),
    details: (c) => (
      <>
        <path d="M40 15 V3 H60 V15 Q50 19 40 15 Z" fill={c} />
        <path d="M44 4 V15 M48 4 V16 M52 4 V16 M56 4 V15" stroke={DETAIL} strokeWidth="1" />
        <path d="M28 79 H72 M8 66 L21 68 M92 66 L79 68" />
      </>
    ),
  },
  stripeknit: {
    // 크루넥 스트라이프 니트
    body: [KNIT_BODY],
    inside: (_, a) => (
      <>
        {[26, 36, 46, 56, 66].map((y) => (
          <rect key={y} x="0" y={y} width="100" height="4.5" fill={a} />
        ))}
      </>
    ),
    details: () => (
      <>
        <path d="M42 12 Q50 22 58 12" fill="none" strokeWidth="3" />
        <path d="M28 79 H72 M8 66 L21 68 M92 66 L79 68" />
      </>
    ),
  },
  graphictee: {
    // 빈티지 프린트 반팔 티
    body: [TEE_BODY],
    details: (_, a) => (
      <>
        <path d="M42 15 Q50 23 58 15" fill="none" strokeWidth="2.6" />
        <g opacity="0.8" stroke="none">
          <circle cx="50" cy="48" r="9" fill="#e2b25a" />
          <path d="M34 64 L44 50 L50 58 L56 48 L66 64 Z" fill={a} />
          <rect x="36" y="68" width="28" height="3" rx="1.5" fill={a} />
          <rect x="40" y="74" width="20" height="2.5" rx="1.2" fill={a} opacity="0.7" />
        </g>
      </>
    ),
  },
  ringertee: {
    // 링거 티: 목·소매 끝 배색 (겨드랑이 얼룩)
    body: [TEE_BODY],
    inside: () => <ellipse cx="34" cy="44" rx="5" ry="4" fill="#d8c27a" opacity="0.55" />,
    details: (_, a) => (
      <>
        <path d="M40 15 Q50 25 60 15" fill="none" stroke={a} strokeWidth="4" />
        <path d="M13.5 36 L23 47.5 M86.5 36 L77 47.5" stroke={a} strokeWidth="4" />
      </>
    ),
  },
  raglantee: {
    // 라글란 긴팔 티: 몸판 흰색, 소매 배색
    body: [LONGSLEEVE_BODY],
    inside: (_, a) => <path d="M42 0 L28 42 L28 100 L0 100 L0 0 Z M58 0 L72 42 L72 100 L100 100 L100 0 Z" fill={a} />,
    details: () => (
      <>
        <path d="M42 12 Q50 22 58 12" fill="none" strokeWidth="2.6" />
        <path d="M42 13 L28 42 M58 13 L72 42" />
      </>
    ),
  },
  plaidskirt: {
    // 체크 플리츠 미니스커트
    body: ['M30 26 H70 L84 76 Q50 82 16 76 Z'],
    inside: (_, a) => (
      <>
        {[22, 38, 54, 70].map((x) => (
          <rect key={x} x={x} y="0" width="7" height="100" fill={a} opacity="0.5" />
        ))}
        {[36, 54, 70].map((y) => (
          <rect key={y} x="0" y={y} width="100" height="6" fill={a} opacity="0.5" />
        ))}
        {[30, 46, 62, 78].map((x) => (
          <rect key={x} x={x} y="0" width="1.4" height="100" fill="#e8d27a" />
        ))}
      </>
    ),
    details: (c) => (
      <>
        <rect x="29" y="19" width="42" height="8" rx="1.5" fill={c} />
        <path d="M36 27 L28 78 M43 27 L39 80 M50 27 L50 81 M57 27 L61 80 M64 27 L72 78" stroke="rgba(40, 20, 10, 0.3)" strokeWidth="1.4" fill="none" />
      </>
    ),
  },
  denimskirt: {
    // 데님 롱스커트 (앞 단추, 뒤트임)
    body: ['M32 16 H68 L80 132 Q50 137 20 132 Z'],
    details: (c, a) => (
      <>
        <rect x="31" y="8" width="38" height="9" rx="1.5" fill={c} />
        <path d="M50 17 V110" stroke={a} strokeWidth="1.4" />
        {[26, 42, 58, 74, 90].map((y) => (
          <circle key={y} cx="53" cy={y} r="1.7" fill="#c4c7cb" stroke="none" />
        ))}
        <path d="M34 17 Q36 30 44 28 M66 17 Q64 30 56 28" fill="none" stroke={a} strokeWidth="1.4" />
        <path d="M50 112 V134" />
        <path d="M23 126 Q50 131 77 126" fill="none" stroke={a} strokeWidth="1.4" />
      </>
    ),
  },
  duffle: {
    // 카멜 더플 숏코트: 후드, 토글 단추, 패치 포켓
    body: ['M30 14 L42 10 L58 10 L70 14 L86 28 L92 82 L80 84 L74 44 L76 92 L24 92 L26 44 L20 84 L8 82 L14 28 Z'],
    under: (c) => <path d="M32 16 Q34 0 50 0 Q66 0 68 16 Z" fill={c} />,
    details: (_, a) => (
      <>
        <path d="M30 14 L42 10 L58 10 L70 14 L76 26 Q50 32 24 26 Z" fill="rgba(60, 30, 10, 0.12)" strokeWidth="1.6" />
        {[36, 52, 68].map((y) => (
          <g key={y}>
            <path d={`M38 ${y} H62`} stroke="#efe4cd" strokeWidth="1.6" />
            <rect x="46" y={y - 1.8} width="8" height="3.6" rx="1.8" fill={a} strokeWidth="1" />
          </g>
        ))}
        <rect x="29" y="64" width="13" height="16" rx="1.5" fill="none" strokeWidth="1.8" />
        <rect x="58" y="64" width="13" height="16" rx="1.5" fill="none" strokeWidth="1.8" />
      </>
    ),
  },
  argyle: {
    // 아가일 브이넥 가디건
    body: ['M30 16 L42 12 L50 34 L58 12 L70 16 L86 30 L92 72 L80 74 L72 42 L72 86 L28 86 L28 42 L20 74 L8 72 L14 30 Z'],
    inside: (_, a) => (
      <>
        {[0, 1, 2, 3].flatMap((row) =>
          [0, 1, 2, 3, 4, 5, 6].map((col) => {
            const x = col * 16 - (row % 2) * 8 + 4
            const y = 30 + row * 16
            return <path key={`${row}-${col}`} d={`M${x} ${y - 8} L${x + 6} ${y} L${x} ${y + 8} L${x - 6} ${y} Z`} fill={a} opacity="0.75" />
          }),
        )}
        <path d="M0 22 L80 102 M20 22 L100 102 M-20 22 L60 102 M100 22 L20 102 M80 22 L0 102 M120 22 L40 102" stroke="#a8443a" strokeWidth="0.8" />
      </>
    ),
    details: () => (
      <>
        <path d="M42 12 L50 34 L58 12" fill="none" strokeWidth="3" />
        <path d="M50 34 V86" />
        {[44, 56, 68, 80].map((y) => (
          <circle key={y} cx="53" cy={y} r="1.7" fill="#6b4a32" stroke="none" />
        ))}
        <path d="M28 80 H72 M8 66 L21 68 M92 66 L79 68" />
      </>
    ),
  },
  backpack: {
    // 캔버스 백팩: 가죽 스트랩, 앞주머니
    body: ['M26 26 Q26 14 38 14 H62 Q74 14 74 26 V84 Q74 90 68 90 H32 Q26 90 26 84 Z'],
    under: () => <path d="M42 15 Q50 3 58 15" fill="none" strokeWidth="3.5" />,
    details: (_, a) => (
      <>
        <path d="M26 30 Q50 40 74 30 L74 26 Q74 14 62 14 H38 Q26 14 26 26 Z" fill="rgba(0, 0, 0, 0.12)" strokeWidth="1.6" />
        <rect x="32" y="56" width="36" height="26" rx="4" fill="rgba(0, 0, 0, 0.1)" strokeWidth="1.8" />
        <path d="M36 60 H64" stroke={DETAIL} strokeWidth="1.4" />
        <rect x="38" y="30" width="5" height="34" rx="1" fill={a} strokeWidth="1" />
        <rect x="57" y="30" width="5" height="34" rx="1" fill={a} strokeWidth="1" />
        <rect x="37" y="60" width="7" height="5" rx="1" fill="#c9a35a" strokeWidth="1" />
        <rect x="56" y="60" width="7" height="5" rx="1" fill="#c9a35a" strokeWidth="1" />
      </>
    ),
  },
  floraldress: {
    // 꽃무늬 미디 원피스 (퍼프 소매)
    body: ['M36 10 L44 8 Q50 15 56 8 L64 10 L72 16 L76 26 L66 30 L64 36 L58 48 L84 130 Q50 136 16 130 L42 48 L36 36 L34 30 L24 26 L28 16 Z'],
    inside: (_, a) => (
      <>
        {[[30, 60], [52, 62], [70, 74], [40, 84], [60, 96], [28, 104], [50, 112], [72, 118], [36, 124], [48, 30], [44, 44], [58, 22]].map(([x, y], i) => (
          <g key={i}>
            {[0, 72, 144, 216, 288].map((d) => (
              <circle key={d} cx={x + 2.6 * Math.cos((d * Math.PI) / 180)} cy={y + 2.6 * Math.sin((d * Math.PI) / 180)} r="1.9" fill={i % 3 ? a : '#e9b8a8'} />
            ))}
            <circle cx={x} cy={y} r="1.2" fill="#e8c66a" />
          </g>
        ))}
      </>
    ),
    details: () => (
      <>
        <path d="M44 8 Q50 15 56 8" fill="none" />
        <path d="M42 48 Q50 51 58 48" fill="none" stroke={DETAIL} strokeWidth="1.8" />
        <path d="M24 26 L34 30 M76 26 L66 30" stroke={DETAIL} strokeWidth="1.6" />
      </>
    ),
  },
  teddyfur: {
    // 테디 퍼 자켓: 북슬북슬한 결, 큰 카라
    body: ['M30 14 L42 10 L58 10 L70 14 L86 28 Q93 36 92 48 L93 80 L81 82 L76 46 L76 88 L24 88 L24 46 L19 82 L7 80 L8 48 Q7 36 14 28 Z'],
    inside: (_, a) => (
      <g fill="none" stroke={a} strokeWidth="1.4" strokeLinecap="round">
        {Array.from({ length: 48 }, (_, i) => {
          const x = 8 + (i % 8) * 12 + (Math.floor(i / 8) % 2) * 6
          const y = 16 + Math.floor(i / 8) * 13
          return <path key={i} d={`M${x} ${y} q2 -3 4 0 q2 3 4 0`} />
        })}
      </g>
    ),
    details: (c) => (
      <>
        <path d="M34 10 Q50 4 66 10 L70 26 L56 22 L50 32 L44 22 L30 26 Z" fill={c} />
        <path d="M36 12 q3 -3 6 0 M48 9 q3 -3 6 0 M60 12 q3 -3 6 0" fill="none" stroke={DETAIL} strokeWidth="1.2" />
        <path d="M50 32 V88" stroke={DETAIL} strokeWidth="1.6" />
        {[44, 60].map((y) => (
          <rect key={y} x="47" y={y} width="6" height="3" rx="1.5" fill="#b8945a" strokeWidth="0.8" />
        ))}
      </>
    ),
  },
  leatherskirt: {
    // 블랙 레더 미니스커트 (광택, 앞 지퍼)
    body: ['M30 24 H70 L82 76 Q50 81 18 76 Z'],
    inside: () => (
      <>
        <path d="M36 26 L28 74" stroke="#ffffff" strokeOpacity="0.22" strokeWidth="5" />
        <path d="M60 26 L66 74" stroke="#ffffff" strokeOpacity="0.1" strokeWidth="3" />
      </>
    ),
    details: (c, a) => (
      <>
        <rect x="29" y="17" width="42" height="8" rx="1.5" fill={c} />
        <path d="M50 25 V52" stroke={a} strokeWidth="1.6" />
        <circle cx="50" cy="53" r="1.6" fill={a} stroke="none" />
        <path d="M24 70 Q50 75 76 70" fill="none" stroke={DETAIL} strokeWidth="1.2" />
      </>
    ),
  },
  boots: {
    // 롱부츠 한 켤레 (뒤쪽 한 짝은 살짝 어둡게)
    body: [
      'M40 6 H58 V62 Q58 68 64 70 L80 76 Q88 80 86 88 L86 92 H46 L44 92 Q40 92 40 86 Z',
      'M22 10 H40 V66 Q40 72 46 74 L62 80 Q70 84 68 92 L68 96 H28 L26 96 Q22 96 22 90 Z',
    ],
    under: (c) => <path d="M40 6 H58 V62 Q58 68 64 70 L80 76 Q88 80 86 88 L86 92 H44 Q40 92 40 86 Z" fill={c} />,
    details: (_, a) => (
      <>
        <path d="M40 6 H58 V62 Q58 68 64 70 L80 76 Q88 80 86 88 L86 92 H44 Q40 92 40 86 Z" fill="rgba(30, 15, 5, 0.25)" stroke="none" />
        <path d="M28 96 H68 V92 H28 Z M22 88 H32 V96 H24 Q22 96 22 92 Z" fill={a} strokeWidth="1.4" />
        <path d="M23 14 H39" stroke={DETAIL} strokeWidth="1.4" />
        <path d="M34 14 V66" stroke={DETAIL} strokeWidth="1.2" strokeDasharray="2 2" />
      </>
    ),
  },
  plainlong: {
    // 무지 긴팔 티
    body: [LONGSLEEVE_BODY],
    details: () => (
      <>
        <path d="M42 12 Q50 22 58 12" fill="none" strokeWidth="2.6" />
        <path d="M8 70 L19 72 M92 70 L81 72" stroke={DETAIL} strokeWidth="1.6" />
      </>
    ),
  },
  fleece: {
    // 하프집업 플리스: 스탠드 카라, 하늘색 파이핑, 요크 절개
    body: ['M28 14 L40 10 Q50 7 60 10 L72 14 L86 30 Q94 50 92 76 L80 78 Q78 56 74 46 L74 84 L26 84 L26 46 Q22 56 20 78 L8 76 Q6 50 14 30 Z'],
    inside: () => (
      <>
        {Array.from({ length: 60 }, (_, i) => (
          <circle key={i} cx={(i * 37) % 100} cy={8 + ((i * 53) % 80)} r="0.9" fill="#b9b8b4" opacity="0.7" />
        ))}
      </>
    ),
    details: (c, a) => (
      <>
        <path d="M38 13 V4 H62 V13" fill={c} />
        <path d="M38 4 H62" stroke={a} strokeWidth="2.4" />
        <path d="M50 6 V44" stroke={a} strokeWidth="2.6" />
        <rect x="48" y="9" width="4" height="7" rx="1" fill={a} strokeWidth="0.8" />
        <path d="M26 52 Q50 46 74 52" fill="none" stroke={DETAIL} strokeWidth="1.4" />
        <path d="M32 56 L30 74 M68 56 L70 74" stroke={DETAIL} strokeWidth="1.6" />
        <path d="M26 84 H74 M8 76 L20 78 M92 76 L80 78" stroke={a} strokeWidth="2.6" />
      </>
    ),
  },
  leatherjacket: {
    // 블랙 레더 블루종: 셔츠 카라, 투웨이 지퍼, 절개선, 가죽 광택
    body: ['M30 14 L42 10 L58 10 L70 14 L86 28 Q92 36 92 48 L94 78 L82 80 L76 46 L76 82 L24 82 L24 46 L18 80 L6 78 L8 48 Q8 36 14 28 Z'],
    inside: () => (
      <g stroke="#ffffff" strokeLinecap="round" fill="none">
        <path d="M32 30 Q36 50 30 70 M66 26 Q70 44 64 62 M14 40 Q12 56 12 70 M86 40 Q88 56 88 70" strokeOpacity="0.2" strokeWidth="3" />
        <path d="M44 52 q4 4 8 0 M28 60 q3 3 6 0 M60 70 q4 3 8 0" strokeOpacity="0.15" strokeWidth="1.4" />
      </g>
    ),
    details: (c, a) => (
      <>
        <path d="M40 10 L35 22 L50 16 L65 22 L60 10 L50 16 Z" fill={c} stroke="#5a4a3e" />
        <g stroke="#ffffff" strokeOpacity="0.22" strokeWidth="1.2" fill="none">
          <path d="M24 40 H76 M38 40 V76 M62 40 V76 M24 76 H76" />
        </g>
        <path d="M50 16 V82" stroke={a} strokeWidth="1.8" />
        <rect x="48" y="20" width="4" height="7" rx="1" fill={a} stroke="none" />
        <rect x="48" y="76" width="4" height="7" rx="1" fill={a} stroke="none" />
      </>
    ),
  },
  lightpuffer: {
    // 스카이블루 경량 후드 패딩
    body: ['M34 16 Q34 2 50 2 Q66 2 66 16 L72 18 L86 28 Q92 34 92 46 L93 80 L81 82 L76 48 L76 86 L24 86 L24 48 L19 82 L7 80 L8 46 Q8 34 14 28 L28 18 Z'],
    inside: () => (
      <g stroke="#a3c1e3" strokeWidth="1.6">
        {[26, 34, 42, 50, 58, 66, 74, 82].map((y) => (
          <path key={y} d={`M0 ${y} H100`} />
        ))}
      </g>
    ),
    details: (_, a) => (
      <>
        <path d="M40 18 Q40 8 50 8 Q60 8 60 18 L55 22 H45 Z" fill="#b9d3ee" />
        <path d="M50 22 V86" stroke={a} strokeWidth="2" />
        <path d="M32 58 L35 72 M68 58 L65 72" stroke={a} strokeWidth="1.6" />
        <path d="M60 34 q2 -2 4 0 l-1 2 Z" fill={a} stroke="none" />
      </>
    ),
  },
  ziphoodie: {
    // 워싱 후드집업: 캥거루 포켓, 디스트로이드 디테일
    body: ['M34 16 Q36 4 50 4 Q64 4 66 16 L72 18 L86 32 L92 78 L80 80 L74 44 L74 86 L26 86 L26 44 L20 80 L8 78 L14 32 L28 18 Z'],
    inside: () => (
      <>
        <ellipse cx="38" cy="40" rx="10" ry="14" fill="#ffffff" opacity="0.1" />
        <ellipse cx="80" cy="56" rx="6" ry="12" fill="#ffffff" opacity="0.08" />
      </>
    ),
    details: (_, a) => (
      <>
        <path d="M38 18 Q40 8 50 8 Q60 8 62 18 L56 24 Q50 27 44 24 Z" fill={a} />
        <path d="M50 24 V86" stroke="#22302c" strokeWidth="1.8" />
        <rect x="48" y="27" width="4" height="6" rx="1" fill="#c4c7cb" stroke="none" />
        <path d="M34 60 H66 L70 76 H30 Z" fill="none" strokeWidth="1.6" />
        <rect x="26" y="80" width="48" height="6" fill="rgba(0, 0, 0, 0.1)" stroke="none" />
        <g stroke={a} strokeWidth="1.2" fill="none">
          <path d="M40 66 l2 2 l-1 2 l2 1 M58 68 l-2 2 l2 1 l-1 2 M84 54 l2 1 l-1 2 l2 1" />
          <path d="M30 86 v3 M36 86 v2 M44 86 v3 M58 86 v2 M66 86 v3 M9 78 v3 M88 80 v3" />
        </g>
      </>
    ),
  },
  camohoodie: {
    // 카모 후드집업 + 주황 바시티 프린트
    body: ['M34 16 Q36 4 50 4 Q64 4 66 16 L72 18 L86 32 L92 78 L80 80 L74 44 L74 86 L26 86 L26 44 L20 80 L8 78 L14 32 L28 18 Z'],
    inside: () => (
      <>
        {[[20, 30, 9, 5, '#d9c9a0'], [62, 22, 8, 4, '#6a4a2e'], [40, 40, 10, 5, '#3f4440'], [78, 44, 7, 6, '#d9c9a0'], [30, 64, 9, 5, '#6a4a2e'], [60, 70, 10, 5, '#d9c9a0'], [14, 56, 6, 7, '#3f4440'], [86, 66, 6, 5, '#6a4a2e'], [46, 80, 8, 4, '#3f4440'], [52, 10, 7, 4, '#d9c9a0']].map(([x, y, rx, ry, f], i) => (
          <ellipse key={i} cx={x} cy={y} rx={rx} ry={ry} fill={f as string} transform={`rotate(${(i * 37) % 60 - 30} ${x} ${y})`} />
        ))}
      </>
    ),
    details: (_, a) => (
      <>
        <path d="M38 18 Q40 8 50 8 Q60 8 62 18 L56 24 Q50 27 44 24 Z" fill="#5f6b45" />
        <path d="M30 46 Q50 36 70 46" fill="none" stroke={a} strokeWidth="6" strokeDasharray="5 1.5" />
        <circle cx="50" cy="58" r="7" fill={a} stroke="none" />
        <path d="M43 58 H57 M50 51 V65 M45 54 Q50 58 55 54 M45 62 Q50 58 55 62" stroke="#5f6b45" strokeWidth="0.9" fill="none" />
        <path d="M38 58 H44 M56 58 H62" stroke={a} strokeWidth="3" />
        <path d="M50 24 V86" stroke="#2b2f2a" strokeWidth="1.6" />
        <path d="M46 24 V36 M54 24 V34" stroke="#5f6b45" strokeWidth="1.2" />
        <rect x="26" y="80" width="48" height="6" fill="#6f7a50" strokeWidth="1.2" />
        <path d="M8 74 L20 76 M92 74 L80 76" stroke="#6f7a50" strokeWidth="4" />
      </>
    ),
  },
  flightbomber: {
    // 올리브 플라이트 봄버: 립 카라·밑단, 곡선 패치 포켓, 스냅 단추 (+ 아직 안 뗀 가격택)
    body: ['M30 18 Q40 12 50 13 Q60 12 70 18 L84 28 Q92 34 93 46 L95 72 L82 75 L76 46 L76 78 L24 78 L24 46 L18 75 L5 72 L7 46 Q8 34 16 28 Z'],
    details: (_, a) => (
      <>
        <path d="M38 16 Q50 26 62 16 L60 10 Q50 18 40 10 Z" fill="#4a4830" />
        <rect x="24" y="74" width="52" height="8" rx="2" fill="#4a4830" />
        <path d="M5 70 L18 73 L17 80 L4 77 Z M95 70 L82 73 L83 80 L96 77 Z" fill="#4a4830" />
        <path d="M24 40 Q36 36 42 46 M76 40 Q64 36 58 46" fill="none" stroke={DETAIL} strokeWidth="1.4" />
        <path d="M27 50 Q27 46 31 46 H42 Q45 46 45 50 V70 H31 Q27 70 27 66 Z M73 50 Q73 46 69 46 H58 Q55 46 55 50 V70 H69 Q73 70 73 66 Z" fill="none" strokeWidth="1.6" />
        <path d="M50 22 V82" stroke={a} strokeWidth="1.8" />
        {[[44, 26], [56, 26], [44, 31], [56, 31], [36, 68], [64, 68]].map(([x, y]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r="1.5" fill={a} stroke="none" />
        ))}
        <path d="M58 18 L66 30" stroke="#9a8f7a" strokeWidth="0.8" />
        <rect x="62" y="29" width="9" height="12" rx="1.5" fill="#fbf7ef" strokeWidth="1" transform="rotate(-14 66 35)" />
        <path d="M64 34 H69 M64 37 H68" stroke="#c4683f" strokeWidth="1" transform="rotate(-14 66 35)" />
      </>
    ),
  },
  dottee: {
    // 블랙 도트 긴팔 티 (가슴에 빨간 하트 로고)
    body: [LONGSLEEVE_BODY],
    inside: (_, a) => (
      <>
        {Array.from({ length: 9 }, (_, row) =>
          Array.from({ length: 8 }, (_, col) => (
            <circle key={`${row}-${col}`} cx={col * 13 + (row % 2) * 6.5 + 2} cy={row * 10 + 14} r="3" fill={a} />
          )),
        )}
      </>
    ),
    details: () => (
      <>
        <path d="M42 12 Q50 22 58 12" fill="none" strokeWidth="2.6" />
        <path d="M58 32 L60 26 L62 30 L64 26 L66 32" fill="none" stroke="#d6303a" strokeWidth="1.6" />
        <path d="M67 24 q1 -2 2.5 0 q1.5 -2 2.5 0 q0 2 -2.5 3.5 q-2.5 -1.5 -2.5 -3.5 Z" fill="#d6303a" stroke="none" />
      </>
    ),
  },
  purplefleece: {
    // 퍼플 셰르파 플리스 집업: 스탠드 카라, 밑단 스트링
    body: ['M30 14 L40 10 L60 10 L70 14 L86 30 Q93 48 92 78 L80 80 Q79 58 74 46 L74 84 L26 84 L26 46 Q21 58 20 80 L8 78 Q7 48 14 30 Z'],
    inside: (_, a) => (
      <g fill="none" stroke={a} strokeWidth="1.2" strokeLinecap="round">
        {Array.from({ length: 54 }, (_, i) => {
          const x = 6 + (i % 9) * 11 + (Math.floor(i / 9) % 2) * 5
          const y = 18 + Math.floor(i / 9) * 12
          return <path key={i} d={`M${x} ${y} q1.5 -2.5 3 0 q1.5 2.5 3 0`} />
        })}
      </g>
    ),
    details: (c, a) => (
      <>
        <path d="M38 12 V3 H62 V12" fill={c} />
        <path d="M50 4 V84" stroke="#2e2440" strokeWidth="1.8" />
        <rect x="48" y="16" width="4" height="7" rx="1" fill="#2e2440" stroke="none" />
        <path d="M32 58 L34 72 M68 58 L66 72" stroke={a} strokeWidth="1.6" />
        <path d="M30 84 V91 M70 84 V91" stroke="#2e2440" strokeWidth="1" />
        <circle cx="30" cy="92" r="1.6" fill="#2e2440" stroke="none" />
        <circle cx="70" cy="92" r="1.6" fill="#2e2440" stroke="none" />
      </>
    ),
  },
  flarepants: {
    // 차콜 코듀로이 부츠컷(플레어) 팬츠: 골지, 로우라이즈 5포켓
    body: ['M30 8 H70 L71 70 Q72 100 84 132 H56 Q52 100 51 64 L50 40 L49 64 Q48 100 44 132 H16 Q28 100 29 70 Z'],
    inside: () => (
      <g stroke="#ffffff" strokeOpacity="0.08" strokeWidth="1">
        {Array.from({ length: 22 }, (_, i) => (
          <path key={i} d={`M${12 + i * 3.6} 0 V140`} />
        ))}
      </g>
    ),
    details: (_, a) => (
      <>
        <path d="M30 15 H70" />
        <circle cx="50" cy="11.5" r="1.8" fill={a} stroke="none" />
        <path d="M50 15 V36" stroke={DETAIL} strokeWidth="1.4" />
        <path d="M32 15 Q34 25 42 23 M68 15 Q66 25 58 23" fill="none" stroke={a} strokeWidth="1.2" />
        <path d="M18 127 H44 M56 127 H82" stroke={DETAIL} strokeWidth="1.2" />
      </>
    ),
  },
  creamknit: {
    // 크림 반팔 니트: 부클 결, 골지 카라·소매·밑단, 사선 펀칭 라인, 작은 로고
    body: ['M30 16 L42 12 Q50 18 58 12 L70 16 L88 34 L80 50 L72 44 L72 86 L28 86 L28 44 L20 50 L12 34 Z'],
    inside: (_, a) => (
      <>
        {Array.from({ length: 70 }, (_, i) => (
          <circle key={i} cx={(i * 29) % 100} cy={12 + ((i * 47) % 76)} r="0.8" fill={a} opacity="0.6" />
        ))}
        <path d="M36 46 L44 74 M64 46 L56 74" stroke={a} strokeWidth="1" strokeDasharray="1 2" />
      </>
    ),
    details: (c, a) => (
      <>
        <path d="M41 12 Q50 22 59 12 L57 17 Q50 24 43 17 Z" fill={c} />
        <path d="M44 16 L45 19 M48 18 V21 M52 18 V21 M56 16 L55 19" stroke={a} strokeWidth="1" />
        <path d="M80 50 L72 44 M20 50 L28 44" />
        <path d="M74 45 L82 49 M26 45 L18 49" stroke={a} strokeWidth="1" />
        <rect x="28" y="76" width="44" height="10" fill="rgba(0, 0, 0, 0.04)" stroke="none" />
        <path d="M32 77 V85 M36 77 V85 M40 77 V85 M44 77 V85 M48 77 V85 M52 77 V85 M56 77 V85 M60 77 V85 M64 77 V85 M68 77 V85" stroke={a} strokeWidth="0.9" />
        <circle cx="62" cy="80" r="2" fill="none" stroke="#9a8a6a" strokeWidth="0.9" />
      </>
    ),
  },
  polo: {
    // 올리브 패딩 집업 점퍼 (네이비 안감)
    body: ['M30 16 L40 10 L60 10 L70 16 L86 28 Q92 34 92 44 L94 76 L82 78 L76 46 L76 86 L24 86 L24 46 L18 78 L6 76 L8 44 Q8 34 14 28 Z'],
    details: (_, a) => (
      <>
        <path d="M40 10 L40 3 L60 3 L60 10" fill="#7a7a3e" />
        <path d="M43 5 H57 V12 L50 14 L43 12 Z" fill={a} />
        <path d="M50 12 V86" stroke="#3b3b25" strokeWidth="2" />
        <rect x="48" y="22" width="4" height="7" rx="1" fill="#b9bcbf" strokeWidth="1" />
        <path d="M32 58 L36 74 M68 58 L64 74" strokeWidth="2.6" />
        <path d="M62 30 q2 -3 4 0 q-1 3 -4 2 Z" fill={a} stroke="none" />
        <path d="M24 82 H76 M6 72 L18 74 M94 72 L82 74" stroke={DETAIL} strokeWidth="2" />
        <circle cx="74" cy="90" r="1.8" fill={a} stroke="none" />
        <path d="M74 86 V89" stroke={a} strokeWidth="1" />
      </>
    ),
  },
  woolcoat: {
    // 라글란 소매 싱글 울 롱코트 (뒤로 늘어진 벨트)
    body: ['M34 12 L44 8 L50 18 L56 8 L66 12 L82 24 L90 100 L80 102 L72 44 L76 134 L24 134 L28 44 L20 102 L10 100 L18 24 Z'],
    under: (c) => <path d="M70 68 L78 72 L82 130 L76 132 Z" fill={c} />,
    details: (_, a) => (
      <>
        <path d="M42 8 L38 22 L50 18 L62 22 L58 8 L50 18 Z" fill="rgba(60, 40, 20, 0.08)" />
        <path d="M44 9 L28 42 M56 9 L72 42" stroke={DETAIL} strokeWidth="1.6" fill="none" />
        <path d="M50 18 V134" stroke={DETAIL} strokeWidth="1.8" />
        {[30, 46, 62, 78].map((y) => (
          <circle key={y} cx="53" cy={y} r="2.2" fill={a} stroke="none" />
        ))}
        <path d="M32 76 L36 74 L38 96 L34 98 Z M68 76 L64 74 L62 96 L66 98 Z" fill="none" strokeWidth="1.6" />
        <path d="M12 92 L20 94 M88 92 L80 94" strokeWidth="2" />
      </>
    ),
  },
  furrider: {
    // 블랙 퍼 라이더 재킷: 큰 퍼 카라, 사선 지퍼, 지퍼 포켓
    body: ['M30 14 L42 10 L58 10 L70 14 L86 26 Q92 32 92 42 L94 82 L82 84 L76 44 L76 86 L24 86 L24 44 L18 84 L6 82 L8 42 Q8 32 14 26 Z'],
    details: (_, a) => (
      <>
        <path d="M32 10 Q50 0 68 10 L72 24 Q50 16 28 24 Z" fill="#2c2a28" />
        <g stroke="#4a4644" strokeWidth="1.2" fill="none">
          <path d="M30 34 q2 -2 4 0 M44 40 q2 -2 4 0 M62 36 q2 -2 4 0 M36 52 q2 -2 4 0 M66 54 q2 -2 4 0 M30 70 q2 -2 4 0 M56 68 q2 -2 4 0 M12 50 q2 -2 4 0 M84 50 q2 -2 4 0 M14 68 q2 -2 4 0 M84 70 q2 -2 4 0 M40 80 q2 -2 4 0 M38 16 q2 -2 4 0 M58 15 q2 -2 4 0" />
        </g>
        <path d="M44 22 L58 86" stroke={a} strokeWidth="2" />
        <path d="M44 22 L58 86" stroke="#7d7d7d" strokeWidth="2" strokeDasharray="1 2" />
        <path d="M30 58 L33 76 M70 58 L67 76" stroke={a} strokeWidth="1.8" />
        <path d="M62 14 L76 20 L74 25 L60 19 Z" fill="#111" strokeWidth="1" />
        <circle cx="70" cy="21" r="1.6" fill="#b8945a" stroke="none" />
        <circle cx="42" cy="26" r="1.3" fill={a} stroke="none" />
        <circle cx="56" cy="27" r="1.3" fill={a} stroke="none" />
      </>
    ),
  },
  sportpuffer: {
    // 블랙 스포츠 패딩 점퍼: 하이넥 카라 레터링, 가슴 로고, 회색 옆판
    body: ['M30 14 Q38 8 50 8 Q62 8 70 14 L84 24 Q92 30 92 42 L94 78 L82 80 L76 44 L76 84 L24 84 L24 44 L18 80 L6 78 L8 42 Q8 30 16 24 Z'],
    details: (_, a) => (
      <>
        <path d="M84 24 Q92 30 92 42 L94 78 L88 79 L84 40 Z M16 24 Q8 30 8 42 L6 78 L12 79 L16 40 Z" fill="#4a4e55" stroke="none" />
        <path d="M34 2 H66 V16 Q50 20 34 16 Z" fill="#22252b" />
        <path d="M37 6 H44 M37 9 H43 M56 6 H63 M57 9 H63" stroke={a} strokeWidth="1.6" />
        <path d="M47 16 V84 M53 16 V84" stroke="#3a3e45" strokeWidth="1.6" />
        <path d="M63 30 L67 34 L63 38 L59 34 Z" fill="none" stroke={a} strokeWidth="1.4" />
        <path d="M59 41 H67" stroke={a} strokeWidth="1.4" />
        <path d="M32 58 L35 70 M68 58 L65 70" stroke="#3a3e45" strokeWidth="2" />
        <rect x="24" y="76" width="52" height="8" rx="2" fill="rgba(255, 255, 255, 0.06)" stroke="#3a3e45" strokeWidth="1.2" />
        <path d="M30 77 V83 M38 77 V83 M46 77 V83 M54 77 V83 M62 77 V83 M70 77 V83" stroke="#3a3e45" strokeWidth="1" />
      </>
    ),
  },
  jeans: {
    // 생지 와이드 데님 (허리 장식 핀)
    body: ['M28 8 L72 8 L78 132 L54 132 L50 46 L46 132 L22 132 Z'],
    details: (_, a) => (
      <>
        <path d="M28 16 H72" />
        {[33, 40, 60, 67].map((x) => (
          <circle key={x} cx={x} cy="12" r="1.5" fill="#c4c7cb" stroke="none" />
        ))}
        <circle cx="50" cy="12" r="2" fill="#c4c7cb" strokeWidth="0.8" />
        <path d="M50 16 V40 Q49 42 46 42" fill="none" stroke={a} strokeWidth="1.6" />
        <path d="M30 16 Q32 28 41 26 M70 16 Q68 28 59 26" fill="none" stroke={a} strokeWidth="1.6" />
        <path d="M24 126 H45 M55 126 H76" stroke={a} strokeWidth="1.4" />
      </>
    ),
  },
  swimsuit: {
    fill: 'dots',
    body: ['M18 46 Q22 26 34 28 Q46 32 48 46 Q34 52 18 46 Z', 'M82 46 Q78 26 66 28 Q54 32 52 46 Q66 52 82 46 Z', 'M24 62 H76 L62 86 Q50 90 38 86 Z'],
    under: () => <path d="M34 10 L28 30 M66 10 L72 30" fill="none" />,
    details: () => <path d="M48 44 H52" />,
  },
  cap: {
    body: ['M14 66 Q14 28 50 28 Q80 30 80 66 Z'],
    details: (_, a) => (
      <>
        <path d="M60 66 L94 66 Q96 76 80 76 L56 72 Z" fill={a} />
        <path d="M47 29 Q42 46 44 66" fill="none" stroke={DETAIL} />
        <circle cx="50" cy="28" r="3.5" fill={a} />
        <rect x="24" y="44" width="14" height="8" rx="2" fill={a} />
      </>
    ),
  },
  socks: {
    body: ['M36 8 L62 8 L62 54 Q62 62 70 66 L84 74 Q92 82 84 90 Q76 94 66 88 L42 74 Q36 70 36 62 Z'],
    details: (_, a) => (
      <>
        <path d="M36 16 H62 M36 23 H62" stroke={a} strokeWidth="2.6" />
        <path d="M74 70 Q92 78 84 90 Q76 94 70 90 Q66 80 74 70 Z" fill={a} />
        <path d="M36 56 Q36 70 48 74 L52 60 Z" fill={a} stroke="none" />
      </>
    ),
  },
}

export function ClothingArt({ kind, color, accent = '#ffffff' }: Props) {
  // 그라데이션·패턴 id가 여러 일러스트 사이에서 겹치지 않도록
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '')
  const shape = SHAPES[kind]
  const tall = TALL_KINDS.has(kind)
  const shade = `shade-${uid}`
  const dots = `dots-${uid}`
  const clip = `clip-${uid}`
  const bodyFill = shape.fill === 'dots' ? `url(#${dots})` : color

  return (
    <svg
      viewBox={tall ? '0 0 100 140' : '0 0 100 100'}
      className="clothing-art"
      stroke={LINE}
      strokeWidth="2"
      strokeLinejoin="round"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <defs>
        {/* 왼쪽 위에서 빛이 드는 부드러운 음영 */}
        <linearGradient id={shade} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.28" />
          <stop offset="0.45" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#3c1e0a" stopOpacity="0.24" />
        </linearGradient>
        {shape.fill === 'dots' && (
          <pattern id={dots} width="9" height="9" patternUnits="userSpaceOnUse">
            <rect width="9" height="9" fill={color} stroke="none" />
            <circle cx="4.5" cy="4.5" r="2" fill={accent} stroke="none" />
          </pattern>
        )}
        {shape.inside && (
          <clipPath id={clip}>
            {shape.body.map((d) => (
              <path key={d} d={d} />
            ))}
          </clipPath>
        )}
      </defs>
      {shape.under?.(color, accent)}
      {shape.body.map((d) => (
        <path key={d} d={d} fill={bodyFill} stroke="none" />
      ))}
      {shape.inside && (
        <g clipPath={`url(#${clip})`} stroke="none">
          {shape.inside(color, accent)}
        </g>
      )}
      {shape.body.map((d) => (
        <g key={d}>
          <path d={d} fill={`url(#${shade})`} stroke="none" />
          <path d={d} fill="none" />
        </g>
      ))}
      {shape.details?.(color, accent)}
    </svg>
  )
}

// 개어 놓은 옷 (선반·서랍용). 칸 크기에 맞게 늘어나도록 비율 고정 안 함.
export function FoldedArt({ color, accent = '#ffffff' }: Omit<Props, 'kind'>) {
  return (
    <svg viewBox="0 0 100 32" preserveAspectRatio="none" className="folded-art" aria-hidden="true">
      <g stroke={LINE} strokeWidth="2" strokeLinejoin="round">
        <rect x="2" y="3" width="96" height="26" rx="5" fill={color} vectorEffect="non-scaling-stroke" />
        <rect x="2" y="18" width="96" height="11" rx="5" fill="rgba(60, 30, 10, 0.12)" stroke="none" />
        <path d="M2 12 H98 M28 3 V12 M72 3 V12" stroke={DETAIL} fill="none" vectorEffect="non-scaling-stroke" />
      </g>
      <rect x="40" y="17" width="20" height="6" rx="2" fill={accent} />
    </svg>
  )
}
