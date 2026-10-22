import { useEffect, useRef, useState } from 'react'
import { CLOTHES, type ClothingItem } from './data/clothes'
import {
  freeSlots,
  initialPlaces,
  isStored,
  settlement,
  CLEANUP_RATE,
  formatPayout,
  type Payout,
  type Choice,
  type Place,
} from './game'
import { Room } from './components/Room'
import { WallAbove } from './components/RoomScene'
import { InfoButton, ServiceInfo, type Service } from './components/ServiceInfo'
import { TitleBadge } from './components/TitleBadge'
import { Mom } from './components/Mom'
import { useMom } from './useMom'
import { LINKS } from './config'

type Screen = 'room' | 'result'

const won = (n: number) => n.toLocaleString('ko-KR') + '원'
const kg = (n: number) => `${Math.round(n * 100) / 100}kg`

export default function App() {
  const [screen, setScreen] = useState<Screen>('room')
  const [places, setPlaces] = useState<Record<string, Place>>(initialPlaces)
  const [round, setRound] = useState(0) // 다시 하기 때 방(열린 서랍 등)을 초기화

  // 아직 정리도 안 되고 내보내지도 않은 옷
  const looseCount = CLOTHES.filter((c) => !isStored(places[c.id]) && places[c.id].kind !== 'gone').length
  const doneCount = CLOTHES.length - looseCount
  const allDone = looseCount === 0

  const [payout, setPayout] = useState<Payout>('point') // 바로 정리: 빙글 포인트 / 현금
  const money = settlement(places, CLOTHES, payout)
  // 정산 합계: 현금(원)과 빙글 포인트(P)를 따로 표시
  const totalText = [money.cashTotal > 0 && won(money.cashTotal), money.pointTotal > 0 && formatPayout(money.pointTotal, 'point')]
    .filter(Boolean)
    .join(' + ') || '0원'

  // 옷장이 처음 꽉 차는 순간 안내 팝업 (다시 하기 전까지 한 번)
  const [fullNotice, setFullNotice] = useState(false)
  const [info, setInfo] = useState<Service | null>(null) // 서비스 안내 팝업

  // 엄마: 한동안 정리를 안 하면 잔소리, 빙글·정리 진행에 따라 한 번씩 반응
  const momPaused = screen !== 'room' || fullNotice || info !== null || allDone
  const mom = useMom(places, CLOTHES, momPaused, round)
  const fullShown = useRef(false)
  const isFull = freeSlots(places) === 0
  useEffect(() => {
    if (isFull && !fullShown.current) {
      fullShown.current = true
      setFullNotice(true)
    }
  }, [isFull])

  const restart = () => {
    setPlaces(initialPlaces())
    setRound((r) => r + 1)
    fullShown.current = false
    setFullNotice(false)
    setScreen('room')
  }

  const move = (id: string, place: Place) => setPlaces((prev) => ({ ...prev, [id]: place }))

  if (screen === 'room') {
    const progress = (doneCount / CLOTHES.length) * 100
    // 타이틀 아래 안내: 앞부분(강조) + 뒷부분
    const hint: [string, string] =
      doneCount === 0
        ? ['옷을 끌어서 정리해요', '서랍은 눌러서 열고, 옷을 누르면 정보가 보여요']
        : allDone
          ? ['방이 깔끔해졌어요! 🎉', '결과를 확인해보세요']
          : [`남은 옷 ${looseCount}벌`, '안 입는 옷은 눌러서 빙글에 맡겨보세요']

    return (
      <main className="game">
        <header className="hud">
          <div className="hud-top">
            <TitleBadge text="옷장 정리" />
            <span className="hud-count">
              {doneCount}/{CLOTHES.length}
            </span>
          </div>
          <p className="hud-hint">
            <b>{hint[0]}</b>
            <span>{hint[1]}</span>
          </p>
          {/* 정리 진행도: 바느질 선이 들어간 리본 + 끝에 나무 구슬 */}
          <div className="progress-soft">
            <div className="progress-head">
              <span>{allDone ? '옷장 정리 완료' : '옷장 정리 중'}</span>
              <b>{Math.round(progress)}%</b>
            </div>
            <div className="xp" role="progressbar" aria-valuenow={doneCount} aria-valuemin={0} aria-valuemax={CLOTHES.length}>
              <div className="xp-fill" style={{ width: `${progress}%` }} />
              {[100 / 3, 200 / 3].map((at) => (
                <span key={at} className={`xp-dot${progress >= at - 0.01 ? ' on' : ''}`} style={{ left: `${at}%` }} />
              ))}
              <span className="xp-bead" style={{ left: `${progress}%` }} />
            </div>
          </div>
          {/* 정산 금액표: 빙글로 보낸 옷으로 지금까지 번 돈 */}
          <div className="ledger">
            <div>
              <span>
                💸 위탁 판매 <InfoButton service="consign" onInfo={setInfo} />
              </span>
              <b key={`c${money.consignWon}`}>{won(money.consignWon)}</b>
              <small>{money.consigned.length}벌 · 예상가</small>
            </div>
            <div>
              <span>
                📦 바로 정리 <InfoButton service="cleanup" onInfo={setInfo} />
              </span>
              <b key={`q${money.cleanupTotal}${payout}`}>{formatPayout(money.cleanupTotal, payout)}</b>
              <div className="payout-toggle" role="radiogroup" aria-label="바로 정리 정산 방식">
                {(['point', 'cash'] as const).map((p) => (
                  <button key={p} role="radio" aria-checked={payout === p} className={payout === p ? 'on' : ''} onClick={() => setPayout(p)}>
                    {p === 'point' ? `포인트 ${CLEANUP_RATE.point}P` : `현금 ${CLEANUP_RATE.cash}원`}
                  </button>
                ))}
              </div>
            </div>
            <div className="ledger-total">
              <span>💰 정산 합계</span>
              <b key={`t${totalText}`} className={totalText.includes('+') ? 'two' : ''}>
                {totalText}
              </b>
              <small>지금까지 번 돈</small>
            </div>
          </div>
          {allDone && (
            <button className="btn primary" onClick={() => setScreen('result')}>
              결과 보기
            </button>
          )}
        </header>

        <div className="stage">
          <div className="stage-bg" />
          <div className="stage-top">
            <WallAbove />
          </div>
          {mom.phase !== 'hidden' && mom.msg && <Mom msg={mom.msg} leaving={mom.phase === 'leaving'} />}
          <Room key={round} items={CLOTHES} places={places} onMove={move} onClosetFull={() => setFullNotice(true)} onInfo={setInfo} payout={payout} />
        </div>

        {info && <ServiceInfo service={info} onClose={() => setInfo(null)} />}

        {fullNotice && (
          <div className="notice-backdrop" onClick={() => setFullNotice(false)}>
            <div className="notice" role="dialog" aria-modal="true" aria-labelledby="notice-title" onClick={(e) => e.stopPropagation()}>
              <div className="notice-icon">🚪</div>
              <h2 id="notice-title">옷장이 꽉 찼어요</h2>
              <p>
                옷장에 들어갈 수 있는 것보다 옷이 더 많아요.
                <br />
                <b>자주 입는 옷만 남기고</b>, 손이 안 가는 옷은 <b>빙글 옷장정리</b>로 보내보세요. 옷장도 방도 한결 가벼워질 거예요.
              </p>
              <p className="notice-tip">💡 옷을 누르면 빙글 위탁 판매나 바로 정리를 고를 수 있어요</p>
              <button className="btn primary" onClick={() => setFullNotice(false)}>
                정리할 옷 골라보기
              </button>
            </div>
          </div>
        )}
      </main>
    )
  }

  const goneAs = (c: ClothingItem, choice: Choice) => {
    const p = places[c.id]
    return p.kind === 'gone' && p.choice === choice
  }
  const { consigned, cleaned, consignWon, cleanupKg, cleanupTotal } = money
  const binned = CLOTHES.filter((c) => goneAs(c, 'bin'))
  const kept = CLOTHES.filter((c) => isStored(places[c.id]))
  const freed = Math.round(((consigned.length + cleaned.length + binned.length) / CLOTHES.length) * 100)

  return (
    <main className="screen result">
      <p className="eyebrow">정리 완료!</p>
      <h1>옷장 공간 {freed}% 확보 🎉</h1>
      {totalText !== '0원' && <p className="result-money">빙글로 정산받을 금액 {totalText}</p>}
      <div className="stats">
        <div>
          <strong>{kept.length}</strong>
          <span>정리한 옷</span>
        </div>
        <div>
          <strong>{consigned.length}</strong>
          <span>위탁판매</span>
        </div>
        <div>
          <strong>{cleaned.length}</strong>
          <span>바로 정리</span>
        </div>
        <div>
          <strong>{binned.length}</strong>
          <span>헌옷수거함</span>
        </div>
      </div>

      {consigned.length > 0 && (
        <section className="cta-box consign">
          <h2>빙글에 맡기면 예상 수익 {won(consignWon)}</h2>
          <p>{consigned.map((c) => c.name).join(', ')}</p>
          <a className="btn primary" href={LINKS.vingleConsign} target="_blank" rel="noreferrer">
            빙글 위탁판매 신청하기
          </a>
        </section>
      )}

      {cleaned.length > 0 && (
        <section className="cta-box cleanup">
          <h2>
            {cleaned.length}벌 · {kg(cleanupKg)}, 문 앞에 두면 {payout === 'point' ? '빙글 포인트' : '현금'} {formatPayout(cleanupTotal, payout)}
          </h2>
          <p>{cleaned.map((c) => c.name).join(', ')}</p>
          <a className="btn secondary" href={LINKS.quickCleanup} target="_blank" rel="noreferrer">
            빙글 바로 정리 맡기기
          </a>
        </section>
      )}

      {binned.length > 0 && (
        <section className="cta-box bin">
          <h2>♻️ {binned.length}벌은 헌옷수거함으로</h2>
          <p>{binned.map((c) => c.name).join(', ')}</p>
          <p className="cta-note">교복·양말·속옷이나 하자·오염·냄새가 있는 옷은 빙글에서 받지 않아요.</p>
        </section>
      )}

      <button className="btn ghost" onClick={restart}>
        다시 하기
      </button>
    </main>
  )
}
