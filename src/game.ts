import { CLOTHES, type ClothingItem } from './data/clothes'

// 수납 공간별 용량
export const RAIL_CAPACITY = 6
export const SHELF_COUNT = 3
export const SHELF_CAPACITY = 2
export const DRAWER_COUNT = 6
export const DRAWER_CAPACITY = 3

export type Choice = 'consign' | 'cleanup' | 'bin' // 빙글 위탁 판매 / 빙글 바로 정리 / 헌옷수거함

// 옷 하나가 지금 어디에 있는지. at은 넣은 순서(같은 칸 안에서 정렬용).
export type Place =
  | { kind: 'loose'; x: number; y: number; rot: number } // 바닥·침대·의자 등 아무 데나 (방 기준 %)
  | { kind: 'rail'; at: number }
  | { kind: 'shelf'; index: number; at: number }
  | { kind: 'drawer'; index: number; at: number; messy?: boolean } // messy: 개지 않고 쑤셔 넣은 상태
  | { kind: 'gone'; choice: Choice }

export type Storage = 'rail' | 'shelf' | 'drawer'

// 제대로 정리된 상태 (서랍에 쑤셔 넣은 건 정리 안 된 것)
export const isStored = (p: Place) => p.kind === 'rail' || p.kind === 'shelf' || (p.kind === 'drawer' && !p.messy)

export const initialPlaces = (): Record<string, Place> =>
  Object.fromEntries(
    CLOTHES.map((c): [string, Place] => [
      c.id,
      c.start === 'rail'
        ? { kind: 'rail', at: 0 }
        : c.start
          ? { kind: 'shelf', index: c.start.shelf, at: 0 }
          : c.drawer !== undefined
            ? { kind: 'drawer', index: c.drawer, at: 0, messy: true }
            : { kind: 'loose', x: c.x, y: c.y, rot: c.rot },
    ]),
  )

// 해당 수납 칸에 들어 있는 옷 id (넣은 순서대로)
export function occupants(places: Record<string, Place>, kind: Storage, index = 0): string[] {
  return Object.entries(places)
    .filter(([, p]) => p.kind === kind && (p.kind === 'rail' || p.index === index))
    .sort(([, a], [, b]) => (a as { at: number }).at - (b as { at: number }).at)
    .map(([id]) => id)
}

export const capacityOf = (kind: Storage) =>
  kind === 'rail' ? RAIL_CAPACITY : kind === 'shelf' ? SHELF_CAPACITY : DRAWER_CAPACITY

// 빙글 정산 기준
// 바로 정리는 kg 단위로 정산: 빙글 포인트 또는 현금 중 선택
export type Payout = 'point' | 'cash'
export const CLEANUP_RATE: Record<Payout, number> = { point: 700, cash: 600 }
export const payoutUnit = (p: Payout) => (p === 'point' ? 'P' : '원')
export const formatPayout = (n: number, p: Payout) => `${n.toLocaleString('ko-KR')}${payoutUnit(p)}`
export const NONBRAND_MIN_PRICE = 9900 // 비브랜드 위탁 최소 금액 (브랜드는 3~5만원대)

// 위탁 판매가 안 되는 이유 (되면 null)
export function consignBlock(item: ClothingItem): string | null {
  if (item.vingleNo) return `${item.vingleNo} 빙글에 맡길 수 없어요. 헌옷수거함으로 보내주세요!`
  if (!item.brand && item.estPrice < NONBRAND_MIN_PRICE) {
    return '9,900원 이상의 판매 가치가 있는 옷만 위탁 판매할 수 있어요. 바로 정리나 헌옷수거함은 어때요?'
  }
  return null
}

export const cleanupAmount = (item: ClothingItem, payout: Payout) => Math.round(item.weightKg * CLEANUP_RATE[payout])

// 지금까지 빙글로 보낸 옷의 정산 금액
export function settlement(places: Record<string, Place>, items: ClothingItem[], payout: Payout) {
  const gone = (choice: Choice) => items.filter((c) => {
    const p = places[c.id]
    return p.kind === 'gone' && p.choice === choice
  })
  const consigned = gone('consign')
  const cleaned = gone('cleanup')
  const consignWon = consigned.reduce((sum, c) => sum + c.estPrice, 0)
  const cleanupKg = cleaned.reduce((sum, c) => sum + c.weightKg, 0)
  const cleanupTotal = cleaned.reduce((sum, c) => sum + cleanupAmount(c, payout), 0)
  // 현금이면 위탁 판매 금액과 합치고, 포인트면 따로 표시
  const cashTotal = consignWon + (payout === 'cash' ? cleanupTotal : 0)
  const pointTotal = payout === 'point' ? cleanupTotal : 0
  return { consigned, cleaned, consignWon, cleanupKg, cleanupTotal, cashTotal, pointTotal }
}

// 옷장 전체(옷걸이·선반·서랍)에 남은 자리. 서랍에 쑤셔 넣은 옷도 자리를 차지한다
export function freeSlots(places: Record<string, Place>) {
  let free = RAIL_CAPACITY - occupants(places, 'rail').length
  for (let i = 0; i < SHELF_COUNT; i++) free += SHELF_CAPACITY - occupants(places, 'shelf', i).length
  for (let i = 0; i < DRAWER_COUNT; i++) free += DRAWER_CAPACITY - occupants(places, 'drawer', i).length
  return free
}
