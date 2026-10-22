import { useEffect, useRef, useState } from 'react'
import type { ClothingItem } from './data/clothes'
import { isStored, type Place } from './game'

export type MomMood = 'angry' | 'happy' | 'hint'
export interface MomMsg {
  mood: MomMood
  title: string
  sub: string
}

const IDLE_MS = 15000 // 이만큼 정리를 안 하면 잔소리
const STAY_MS = 5000 // 엄마가 말하고 있는 시간
const LEAVE_MS = 500 // 퇴장 애니메이션

const SCOLD: MomMsg = { mood: 'angry', title: '옷 좀 치워!', sub: '안 입는 옷은 버리고!' }

// 게임 중 한 번씩 나오는 엄마 반응 (조건을 처음 만족할 때)
const EVENTS: { id: string; when: (c: Counts) => boolean; msg: MomMsg }[] = [
  {
    id: 'vingle3',
    when: (c) => c.vingle >= 3,
    msg: { mood: 'happy', title: '빙글은 뭐니? 너무 좋다~', sub: '돈도 주네?' },
  },
  {
    id: 'bin5',
    when: (c) => c.bin >= 5 && c.vingle === 0,
    msg: { mood: 'hint', title: '그 옷 주면 돈 주는 곳도 있다는데…', sub: '빙글인가? 그것도 써봐!' },
  },
  {
    id: 'done10',
    when: (c) => c.done >= 10,
    msg: { mood: 'happy', title: '청소하니까 속이 시원하다~~', sub: '우리 딸 최고!' },
  },
]

interface Counts {
  vingle: number // 위탁 판매 + 바로 정리
  bin: number // 헌옷수거함
  done: number // 수납했거나 내보낸 옷
}

function countUp(places: Record<string, Place>, items: ClothingItem[]): Counts {
  let vingle = 0
  let bin = 0
  let done = 0
  for (const c of items) {
    const p = places[c.id]
    if (p.kind === 'gone') {
      done++
      if (p.choice === 'bin') bin++
      else vingle++
    } else if (isStored(p)) done++
  }
  return { vingle, bin, done }
}

// 엄마 등장 관리: 이벤트 반응은 순서대로 한 번씩, 그 외엔 한동안 정리를 안 하면 잔소리
export function useMom(places: Record<string, Place>, items: ClothingItem[], paused: boolean, round: number) {
  const [phase, setPhase] = useState<'hidden' | 'in' | 'leaving'>('hidden')
  const [msg, setMsg] = useState<MomMsg | null>(null)
  const queue = useRef<MomMsg[]>([])
  const fired = useRef(new Set<string>())
  const showTimers = useRef<number[]>([])
  const phaseRef = useRef(phase)
  phaseRef.current = phase
  const prevPlaces = useRef(places)

  const clearShow = () => {
    showTimers.current.forEach((t) => window.clearTimeout(t))
    showTimers.current = []
  }

  const show = (m: MomMsg) => {
    clearShow()
    setMsg(m)
    setPhase('in')
    showTimers.current.push(
      window.setTimeout(() => {
        setPhase('leaving')
        showTimers.current.push(window.setTimeout(() => setPhase('hidden'), LEAVE_MS))
      }, STAY_MS),
    )
  }

  const leave = () => {
    clearShow()
    setPhase('leaving')
    showTimers.current.push(window.setTimeout(() => setPhase('hidden'), LEAVE_MS))
  }

  // 다시 하기: 이벤트 초기화
  useEffect(() => {
    fired.current = new Set()
    queue.current = []
  }, [round])

  // 조건을 처음 만족한 반응을 대기열에 추가
  useEffect(() => {
    const counts = countUp(places, items)
    for (const e of EVENTS) {
      if (!fired.current.has(e.id) && e.when(counts)) {
        fired.current.add(e.id)
        queue.current.push(e.msg)
      }
    }
  }, [places, items])

  // 옷을 옮기면 잔소리하던 엄마는 돌아가고, 대기 중인 반응이 있으면 이어서 등장.
  // phase가 바뀔 때도 실행되므로 '실제로 옷이 움직였을 때'만 잔소리를 끊는다
  // (그렇지 않으면 잔소리하러 들어오자마자 바로 나가버림)
  useEffect(() => {
    const moved = prevPlaces.current !== places
    prevPlaces.current = places
    if (paused) {
      clearShow()
      setPhase('hidden')
      return
    }
    if (moved && phase === 'in' && msg?.mood === 'angry') {
      if (queue.current.length) show(queue.current.shift()!)
      else leave()
      return
    }
    if (phase === 'hidden' && queue.current.length) show(queue.current.shift()!)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [places, phase, paused])

  // 한동안 아무것도 안 옮기면 잔소리 (엄마가 다른 말을 하고 있으면 다음 기회에)
  useEffect(() => {
    if (paused) return
    let t = window.setTimeout(function nag() {
      if (phaseRef.current === 'hidden') show(SCOLD)
      t = window.setTimeout(nag, IDLE_MS + STAY_MS + LEAVE_MS)
    }, IDLE_MS)
    return () => window.clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [places, paused])

  useEffect(() => clearShow, [])

  return { phase, msg }
}
