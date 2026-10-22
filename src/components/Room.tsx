import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { ClothingItem } from '../data/clothes'
import { DRAWER_COUNT, SHELF_COUNT, capacityOf, cleanupAmount, consignBlock, formatPayout, freeSlots, occupants, type Choice, type Payout, type Place, type Storage } from '../game'
import { ClothingArt, FoldedArt, TALL_KINDS } from './ClothingArt'
import { RoomScene } from './RoomScene'
import { InfoButton, type Service } from './ServiceInfo'

interface Props {
  items: ClothingItem[]
  places: Record<string, Place>
  onMove: (id: string, place: Place) => void
  onClosetFull: () => void // 옷장 전체가 꽉 찬 상태에서 더 넣으려 할 때
  onInfo: (service: Service) => void // 서비스 안내 열기
  payout: Payout // 바로 정리 정산 방식
}

// 봉 길이 대비 옷걸이 위치 비율 (RAIL_CAPACITY 개수만큼)
const HANG_SLOTS = [0.24, 0.36, 0.48, 0.6, 0.72, 0.84]

// 개어진 옷 크기. 가로는 방 너비 %(cqw), 세로는 비율로 계산해 방 높이 %로 환산.
const FOLD_W_SHELF = 16
const FOLD_W_DRAWER = 11
const FOLD_RATIO = 0.32
const H_PER_W = 0.75 // 방이 3:4라 가로 1% = 세로 0.75%

// 서랍은 3칸씩 2줄 (CSS .closet-drawers 와 맞춤)
const DRAWER_COLS = 3
// 아래 칸 서랍이 위 칸의 열린 앞판에 가려졌는지
const coveredByUpper = (i: number, open: boolean[]) => i >= DRAWER_COLS && open[i - DRAWER_COLS]

// 열린 서랍 앞판이 내려가는 비율 (CSS .drawer.open 과 맞춤)
const DRAWER_OPEN_SHIFT = 0.45

// 이만큼 움직이기 전에는 드래그가 아니라 탭으로 본다 (px)
const DRAG_THRESHOLD = 6

type Target = { kind: Storage; index: number }

interface Drag {
  id: string
  startX: number
  startY: number
  x: number // 방 기준 %
  y: number
  moved: boolean
  target: Target | null
  blocked: string | null // 놓을 수 없는 이유
}

// 방 기준 % 좌표 상자
interface Box {
  left: number
  right: number
  top: number
  bottom: number
}

interface Layout {
  hang: Box // 옷장 왼쪽 행거 칸
  rail: Box
  shelves: Box[]
  drawers: Box[]
  visRight: number // 화면에 보이는 오른쪽 끝 (방 기준 %). 모바일에서 방 오른쪽이 잘리면 100보다 작음
}

const won = (n: number) => (n >= 10000 ? `${(n / 10000).toLocaleString('ko-KR')}만원` : `${n.toLocaleString('ko-KR')}원`)
// 방 기준 % 좌표에서 옷이 놓인 곳
type Surface = 'bed' | 'chair' | 'floor' | null
const surfaceAt = (x: number, y: number): Surface => {
  if (x > 63 && y >= 48 && y < 80) return 'bed'
  if (x < 32 && y >= 68 && y < 88) return 'chair'
  if (y >= 64) return 'floor'
  return null
}
// 걸쳐진 모습: 의자는 항상, 침대는 앞 모서리 근처일 때 반쯤 접혀 아래로 늘어짐
const BED_EDGE_Y = 66

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v))
const sameTarget = (a: Target | null, b: Target | null) => !!a && !!b && a.kind === b.kind && a.index === b.index

function Hanger() {
  return (
    <svg className="hanger" viewBox="0 0 100 30" fill="none" stroke="#3a3632" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M50 16 V10 Q50 3 57 3 Q63 3 63 9" />
      <path d="M50 16 L10 28 H90 Z" />
    </svg>
  )
}

// 옷이 잔뜩 쌓인 방. 배경은 RoomScene(SVG), 옷장은 CSS로 그리고, 옷은 끌어서 옮기는 버튼.
// 옷걸이에 걸기 / 선반에 개어 놓기 / 서랍을 열고 개어 넣기, 그 외엔 놓은 자리에 그대로 둔다.
export function Room({ items, places, onMove, onClosetFull, onInfo, payout }: Props) {
  const roomRef = useRef<HTMLDivElement>(null)
  const railRef = useRef<HTMLDivElement>(null)
  const hangRef = useRef<HTMLDivElement>(null)
  const shelfRefs = useRef<(HTMLDivElement | null)[]>([])
  const drawerRefs = useRef<(HTMLButtonElement | null)[]>([])
  const lastPos = useRef<Record<string, { x: number; y: number }>>({})
  const toastTimer = useRef<number>(undefined)

  const [drag, setDrag] = useState<Drag | null>(null)
  const [layout, setLayout] = useState<Layout | null>(null)
  // 처음에 옷이 들어 있는 서랍은 열린 채로 시작
  const [openDrawers, setOpenDrawers] = useState<boolean[]>(() =>
    Array.from({ length: DRAWER_COUNT }, (_, i) => Object.values(places).some((p) => p.kind === 'drawer' && p.index === i)),
  )
  const [toast, setToast] = useState<string | null>(null)
  const [selected, setSelected] = useState<string | null>(null) // 말풍선을 띄운 옷
  const [warn, setWarn] = useState<string | null>(null) // 빙글에 못 맡기는 옷을 고르면 말풍선에 경고
  const bubbleRef = useRef<HTMLDivElement>(null)
  const [bubbleShift, setBubbleShift] = useState(0) // 말풍선이 방 밖으로 잘리지 않게 위아래로 미는 양(px)

  // 수납 칸 위치를 측정해 그 안에 옷을 배치
  useLayoutEffect(() => {
    const measure = () => {
      const room = roomRef.current!.getBoundingClientRect()
      const toBox = (el: Element): Box => {
        const r = el.getBoundingClientRect()
        return {
          left: ((r.left - room.left) / room.width) * 100,
          right: ((r.right - room.left) / room.width) * 100,
          top: ((r.top - room.top) / room.height) * 100,
          bottom: ((r.bottom - room.top) / room.height) * 100,
        }
      }
      setLayout({
        hang: toBox(hangRef.current!),
        rail: toBox(railRef.current!),
        shelves: shelfRefs.current.map((el) => toBox(el!)),
        drawers: drawerRefs.current.map((el) => toBox(el!)),
        visRight: Math.min(100, (roomRef.current!.parentElement!.clientWidth / room.width) * 100),
      })
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(roomRef.current!)
    return () => ro.disconnect()
  }, [])

  // 옷이나 말풍선 밖을 누르면 말풍선 닫기 (방 밖 포함)
  useEffect(() => {
    if (!selected) return
    const close = (e: PointerEvent) => {
      if (!(e.target as Element).closest('.room-item, .bubble, .notice-backdrop')) setSelected(null)
    }
    document.addEventListener('pointerdown', close)
    return () => document.removeEventListener('pointerdown', close)
  }, [selected])

  const showToast = (msg: string) => {
    setToast(msg)
    window.clearTimeout(toastTimer.current)
    toastTimer.current = window.setTimeout(() => setToast(null), 2400)
  }

  const toRoomPercent = (clientX: number, clientY: number) => {
    const r = roomRef.current!.getBoundingClientRect()
    return { x: ((clientX - r.left) / r.width) * 100, y: ((clientY - r.top) / r.height) * 100 }
  }

  const findTarget = (cx: number, cy: number): Target | null => {
    const inside = (r: DOMRect, extraBottom = 0, pad = 0) =>
      cx >= r.left && cx <= r.right && cy >= r.top - pad && cy <= r.bottom + extraBottom + pad
    // 열린 위 칸 서랍 앞판이 아래 칸을 덮으므로 그 부분을 먼저 보고, 그다음 서랍 자기 영역
    const drawerRects = drawerRefs.current.map((el) => el!.getBoundingClientRect())
    for (let i = 0; i < DRAWER_COLS; i++) {
      if (openDrawers[i] && inside(drawerRects[i], drawerRects[i].height * DRAWER_OPEN_SHIFT)) return { kind: 'drawer', index: i }
    }
    for (let i = 0; i < DRAWER_COUNT; i++) if (inside(drawerRects[i])) return { kind: 'drawer', index: i }
    for (let i = 0; i < DRAWER_COUNT; i++) {
      if (openDrawers[i] && inside(drawerRects[i], drawerRects[i].height * DRAWER_OPEN_SHIFT)) return { kind: 'drawer', index: i }
    }
    for (let i = 0; i < SHELF_COUNT; i++) {
      if (inside(shelfRefs.current[i]!.getBoundingClientRect())) return { kind: 'shelf', index: i }
    }
    if (inside(railRef.current!.getBoundingClientRect(), 0, 40)) return { kind: 'rail', index: 0 }
    return null
  }

  const currentTarget = (id: string): Target | null => {
    const p = places[id]
    if (p.kind === 'rail') return { kind: 'rail', index: 0 }
    if (p.kind === 'shelf' || (p.kind === 'drawer' && !p.messy)) return { kind: p.kind, index: p.index }
    return null
  }

  // 놓을 수 없으면 이유를, 놓을 수 있으면 null
  const blockReason = (id: string, t: Target): string | null => {
    if (sameTarget(t, currentTarget(id))) return null
    if (t.kind === 'drawer' && !openDrawers[t.index]) return '서랍을 먼저 눌러서 열어주세요'
    if (occupants(places, t.kind, t.index).filter((o) => o !== id).length >= capacityOf(t.kind)) {
      const name = t.kind === 'rail' ? '옷걸이가' : t.kind === 'shelf' ? '선반이' : '서랍이'
      return `${name} 꽉 찼어요! 하나를 빼거나, 안 입는 옷은 빙글에 맡겨보세요`
    }
    return null
  }

  const onPointerDown = (e: React.PointerEvent, item: ClothingItem) => {
    e.currentTarget.setPointerCapture(e.pointerId)
    const pos = lastPos.current[item.id] ?? { x: item.x, y: item.y }
    setDrag({ id: item.id, startX: e.clientX, startY: e.clientY, ...pos, moved: false, target: null, blocked: null })
  }

  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag) return
    const moved = drag.moved || Math.hypot(e.clientX - drag.startX, e.clientY - drag.startY) > DRAG_THRESHOLD
    if (!moved) return
    if (!drag.moved) setSelected(null)
    const target = findTarget(e.clientX, e.clientY)
    setDrag({
      ...drag,
      ...toRoomPercent(e.clientX, e.clientY),
      moved,
      target,
      blocked: target ? blockReason(drag.id, target) : null,
    })
  }

  const onPointerUp = (item: ClothingItem) => {
    if (!drag) return
    setDrag(null)
    if (!drag.moved) return setSelected((cur) => (cur === item.id ? null : item.id))

    const t = drag.target
    if (!t) {
      // 수납 칸이 아니면 놓은 자리에 그대로
      // 바닥에 떨어뜨리면 더 아무렇게나 널브러지게
      const x = clamp(drag.x, 6, (layout?.visRight ?? 100) - 6)
      const y = clamp(drag.y, 8, 95)
      const where = surfaceAt(x, y)
      const spread = where === 'floor' ? 80 : where === 'bed' ? 40 : where === 'chair' ? 16 : 30
      onMove(item.id, { kind: 'loose', x, y, rot: Math.round(Math.random() * spread - spread / 2) })
    } else if (drag.blocked) {
      // 원래 자리로 돌아감. 옷장 전체가 꽉 찼으면 안내 팝업, 아니면 토스트
      if (freeSlots(places) === 0 && !drag.blocked.startsWith('서랍을 먼저')) onClosetFull()
      else showToast(drag.blocked)
    } else if (!sameTarget(t, currentTarget(item.id))) {
      const at = Date.now()
      onMove(item.id, t.kind === 'rail' ? { kind: 'rail', at } : { kind: t.kind, index: t.index, at })
    }
  }

  // 옷장 안(행거 칸 바닥·선반 칸)에 그냥 놓인 옷은 그 칸 바닥으로 떨어져 쌓인다
  const inBox = (b: Box, x: number, y: number) => x >= b.left && x <= b.right && y >= b.top && y <= b.bottom
  const closetSpot = (x: number, y: number): { box: Box; shelf: boolean; key: string } | null => {
    if (!layout) return null
    const i = layout.shelves.findIndex((b) => inBox(b, x, y))
    if (i >= 0) return { box: layout.shelves[i], shelf: true, key: `shelf${i}` }
    if (inBox(layout.hang, x, y)) return { box: layout.hang, shelf: false, key: 'hang' }
    return null
  }
  const pileOf = (key: string) =>
    items.filter((c) => {
      const p = places[c.id]
      return p.kind === 'loose' && closetSpot(p.x, p.y)?.key === key
    })

  const toggleDrawer = (i: number) => {
    const messy = Object.values(places).some((p) => p.kind === 'drawer' && p.index === i && p.messy)
    if (openDrawers[i] && messy) return showToast('옷이 삐져나와서 서랍이 안 닫혀요. 꺼내서 개어 넣어주세요')
    setOpenDrawers((prev) => prev.map((open, j) => (j === i ? !open : open)))
  }

  const choose = (item: ClothingItem, choice: Choice) => {
    if (choice !== 'bin' && item.vingleNo) return setWarn(consignBlock(item))
    if (choice === 'consign') {
      const reason = consignBlock(item)
      if (reason) return setWarn(reason)
    }
    onMove(item.id, { kind: 'gone', choice })
    setSelected(null)
  }

  // 다른 옷을 고르거나 닫으면 경고도 지움
  useEffect(() => setWarn(null), [selected])

  // 말풍선이 방 위·아래로 넘치면 안쪽으로 밀어 넣음 (사진·경고가 붙으면 키가 커짐).
  // 등장 애니메이션(scale)의 영향을 받지 않도록 화면 좌표 대신 레이아웃 높이로 계산
  useLayoutEffect(() => {
    const el = bubbleRef.current
    if (!el) return setBubbleShift(0)
    const room = roomRef.current!
    const H = room.clientHeight
    const gap = room.clientWidth * 0.09 // CSS의 9cqw
    const anchorY = (parseFloat(el.style.top) / 100) * H
    const height = el.offsetHeight
    const top = el.classList.contains('below') ? anchorY + gap : anchorY - gap - height
    const minTop = H * 0.035 // 위쪽 소품 레이어에 가리지 않게
    const maxBottom = H - 6
    setBubbleShift(top < minTop ? minTop - top : top + height > maxBottom ? maxBottom - top - height : 0)
  }, [selected, warn])



  const targetClass = (kind: Storage, index = 0) => {
    if (!drag?.moved || !drag.target || drag.target.kind !== kind || drag.target.index !== index) return ''
    return drag.blocked ? ' full' : ' target'
  }

  return (
    <div className={`room${drag?.moved ? ' is-dragging' : ''}`} ref={roomRef}>
      <RoomScene />

      {/* 원목 붙박이 옷장: 왼쪽 행거, 오른쪽 선반, 아래 서랍 */}
      <div className="closet">
        <div className="closet-body">
          <div ref={hangRef} className="closet-hang">
            <div className="closet-led" />
            <div ref={railRef} className={`closet-rail${targetClass('rail')}`} />
          </div>
          <div className="closet-shelves">
            <div className="closet-led" />
            {Array.from({ length: SHELF_COUNT }, (_, i) => (
              <div key={i} ref={(el) => void (shelfRefs.current[i] = el)} className={`shelf${targetClass('shelf', i)}`} />
            ))}
          </div>
        </div>
        <div className="closet-drawers">
          {Array.from({ length: DRAWER_COUNT }, (_, i) => (
            <button
              key={i}
              ref={(el) => void (drawerRefs.current[i] = el)}
              className={`drawer${openDrawers[i] ? ' open' : ''}${targetClass('drawer', i)}`}
              onClick={() => toggleDrawer(i)}
              aria-label={`서랍 ${i + 1} ${openDrawers[i] ? '닫기' : '열기'}`}
            >
              <span className="drawer-front" />
            </button>
          ))}
        </div>
      </div>

      {items.map((item) => {
        const place = places[item.id]
        const isDragging = drag?.id === item.id && drag.moved
        let pos = lastPos.current[item.id] ?? { x: item.x, y: item.y }
        let mode: 'loose' | 'hung' | 'shelf' | 'drawer' | 'messy' | 'gone' =
          place.kind === 'rail' ? 'hung' : place.kind === 'drawer' && place.messy ? 'messy' : place.kind
        let rot = 0
        let spill: 'left' | 'right' | null = null // 서랍에 쑤셔 넣은 옷이 앞판 밖으로 늘어지는 쪽

        let pile: 'pile' | 'spilled' | null = null
        let stackZ: number | undefined

        if (place.kind === 'loose') {
          // 화면 밖(모바일에서 잘린 오른쪽)에 있는 옷은 보이는 곳으로 당겨옴
          pos = { x: Math.min(place.x, (layout?.visRight ?? 100) - 11), y: place.y }
          rot = place.rot
          const spot = closetSpot(place.x, place.y)
          if (spot) {
            // 칸 바닥에 구겨져 쌓임. 선반 맨 아래 옷은 한쪽 끝이 선반 앞으로 늘어짐
            const { box } = spot
            const k = pileOf(spot.key).findIndex((c) => c.id === item.id)
            const h = (TALL_KINDS.has(item.kind) ? 28 : 20) * 0.55 * H_PER_W
            const x = clamp(place.x, box.left + (spot.shelf ? 8 : 9), box.right - (spot.shelf ? 8 : 9))
            const floorY = box.bottom - (spot.shelf ? 1.05 : 0.8)
            if (spot.shelf && k === 0) {
              pile = 'spilled'
              pos = { x, y: floorY }
              rot = item.x % 2 ? 6 : -6
              spill = item.x % 2 ? 'right' : 'left'
            } else if (spot.shelf) {
              pile = 'pile'
              pos = { x, y: floorY - h / 2 - 1.5 - (k - 1) * h * 0.5 }
              rot = clamp(place.rot, -16, 16)
            } else {
              // 행거 칸은 넓으니 두 줄로 나란히 쌓아 낮은 더미로
              pile = 'pile'
              const col = k % 2
              const row = Math.floor(k / 2)
              pos = {
                x: box.left + (box.right - box.left) * (col ? 0.66 : 0.34),
                y: floorY - h / 2 - row * h * 0.42 - col * 1.2,
              }
              rot = clamp(place.rot, -16, 16)
            }
            stackZ = 1 + k
          }
        } else if (!layout) {
          mode = 'loose'
        } else if (place.kind === 'rail') {
          const i = occupants(places, 'rail').indexOf(item.id)
          const { rail } = layout
          pos = { x: rail.left + (rail.right - rail.left) * HANG_SLOTS[i], y: rail.top - 1.2 }
          stackZ = 2 + (HANG_SLOTS.length - i) // 사선으로 겹쳐 걸린 옷은 왼쪽 칸일수록 위에 보이게
        } else if (place.kind === 'shelf') {
          const k = occupants(places, 'shelf', place.index).indexOf(item.id)
          const box = layout.shelves[place.index]
          const h = FOLD_W_SHELF * FOLD_RATIO * H_PER_W
          pos = { x: (box.left + box.right) / 2, y: box.bottom - 1.3 - (k + 0.5) * h }
        } else if (place.kind === 'drawer') {
          // 열린 서랍 틈: 개어진 옷은 쌓고, 쑤셔 넣은 옷은 삐죽 튀어나오게
          const box = layout.drawers[place.index]
          const gapY = box.top + ((box.bottom - box.top) * DRAWER_OPEN_SHIFT) / 2
          const sameKind = occupants(places, 'drawer', place.index).filter((o) => {
            const q = places[o]
            return q.kind === 'drawer' && !!q.messy === !!place.messy
          })
          const k = sameKind.indexOf(item.id)
          if (place.messy) {
            // 접힌 선을 앞판 윗모서리에 맞춰: 위쪽은 서랍 안에 눌려 있고, 한쪽 끝이 앞판 밖으로 늘어짐
            const frontTop = box.top + (box.bottom - box.top) * DRAWER_OPEN_SHIFT
            pos = { x: (box.left + box.right) / 2 + (k - (sameKind.length - 1) / 2) * 4, y: frontTop }
            rot = k % 2 ? 7 : -7
            spill = k % 2 ? 'right' : 'left'
          } else {
            pos = { x: (box.left + box.right) / 2 + (k % 2 ? 0.8 : -0.8), y: gapY - k * FOLD_W_DRAWER * FOLD_RATIO * H_PER_W * 0.6 }
          }
        }
        if (mode !== 'gone') lastPos.current[item.id] = pos

        if (isDragging) {
          pos = { x: drag.x, y: drag.y }
          mode = 'loose'
          rot = 0
        }

        // 닫힌 서랍 속, 또는 위 칸 서랍이 열려 가려진 아래 칸 서랍 속 옷은 안 보임
        const stowed =
          place.kind === 'drawer' && (!openDrawers[place.index] || coveredByUpper(place.index, openDrawers)) && !isDragging
        const tall = TALL_KINDS.has(item.kind) && !item.image
        if (isDragging) pile = null
        const surface = place.kind === 'loose' && !isDragging && !pile ? surfaceAt(pos.x, pos.y) : null
        const draped =
          surface === 'chair' || (surface === 'bed' && pos.y >= BED_EDGE_Y) || (mode === 'messy' && !isDragging) || pile === 'spilled'
        const className = ['room-item', mode, tall && 'tall', surface, pile, isDragging && 'dragging', stowed && 'stowed']
          .filter(Boolean)
          .join(' ')
        const art = item.image ? <img src={item.image} alt="" /> : <ClothingArt kind={item.kind} color={item.color} accent={item.accent} />

        return (
          <button
            key={item.id}
            className={className}
            style={{ left: `${pos.x}%`, top: `${pos.y}%`, zIndex: stackZ, '--rot': `${rot}deg` } as React.CSSProperties}
            disabled={mode === 'gone'}
            aria-label={item.name}
            onPointerDown={(e) => onPointerDown(e, item)}
            onPointerMove={onPointerMove}
            onPointerUp={() => onPointerUp(item)}
            onPointerCancel={() => setDrag(null)}
          >
            {mode === 'hung' ? (
              // 흔들림(swing)과 사선으로 걸린 모습(slant)을 분리해야 흔들린 뒤 사선 상태로 멈춘다
              <span className="hang-swing">
                <span className="hang-slant">
                  <Hanger />
                  {art}
                </span>
              </span>
            ) : mode === 'shelf' || mode === 'drawer' ? (
              <FoldedArt color={item.color} accent={item.accent} />
            ) : draped ? (
              // 위 절반은 바닥면에 눕고 아래 절반은 모서리 밖으로 늘어짐
              <span className={`drape${spill ? ` stuffed spill-${spill}` : ''}`}>
                <span className="drape-top">{art}</span>
                <span className="drape-bottom">{art}</span>
              </span>
            ) : (
              art
            )}
          </button>
        )
      })}

      {(() => {
        const item = items.find((c) => c.id === selected)
        const anchor = item && lastPos.current[item.id]
        if (!item || !anchor || places[item.id].kind === 'gone') return null
        // 걸린 옷은 고리 기준 좌표라 몸통 가운데로 보정
        const ay = places[item.id].kind === 'rail' ? anchor.y + 14 : anchor.y
        const below = ay < 34
        const visRight = layout?.visRight ?? 100
        const left = clamp(anchor.x, 32, visRight - 32) // 말풍선 너비 62% 기준으로 보이는 영역 밖으로 안 나가게
        return (
          <div
            ref={bubbleRef}
            className={`bubble${below ? ' below' : ''}${bubbleShift ? ' shifted' : ''}`}
            style={{ left: `${left}%`, top: `${ay}%`, marginTop: bubbleShift, '--tail': `${clamp(anchor.x - left, -26, 26)}cqw` } as React.CSSProperties}
          >
            <div className="bubble-info">
              {item.photo && <img className="bubble-photo" src={item.photo} alt={`${item.name} 실제 사진`} />}
              <div>
                <strong>{item.name}</strong>
                {item.brand && <span className="brand-badge">🏷 {item.brand}</span>}
                {item.isNew && <span className="brand-badge new">✨ 새 옷</span>}
                {item.favorite && <span className="brand-badge fav">💛 요즘 최애</span>}
                <p>{item.reason}</p>
                <p className="worn">🕰 {item.worn}</p>
              </div>
            </div>
            {warn && <p className="bubble-warn">{warn}</p>}
            <div className="bubble-actions">
              <div className="chip-row">
                <button className="chip consign" onClick={() => choose(item, 'consign')}>
                💸 빙글 위탁 판매{item.estPrice > 0 && ` · ${won(item.estPrice)}`}
              </button>
                <InfoButton service="consign" onInfo={onInfo} />
              </div>
              <div className="chip-row">
                <button className={`chip cleanup${warn && !item.vingleNo ? ' nudge' : ''}`} onClick={() => choose(item, 'cleanup')}>
                📦 빙글 바로 정리 · {item.weightKg}kg = {formatPayout(cleanupAmount(item, payout), payout)}
              </button>
                <InfoButton service="cleanup" onInfo={onInfo} />
              </div>
              <button className={`chip bin${warn ? ' nudge' : ''}`} onClick={() => choose(item, 'bin')}>
                ♻️ 헌옷수거함
              </button>
            </div>
          </div>
        )
      })()}

      {toast && (
        <div className="room-toast" role="status">
          {toast}
        </div>
      )}
    </div>
  )
}
