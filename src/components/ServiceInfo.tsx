import { CLEANUP_RATE, NONBRAND_MIN_PRICE } from '../game'

export type Service = 'consign' | 'cleanup'

// 빙글 서비스 안내 카드 (위탁 판매 / 바로 정리)
const INFO: Record<Service, { icon: string; title: string; body: string[]; note: string }> = {
  consign: {
    icon: '💸',
    title: '빙글 위탁 판매',
    body: [
      '버리기 아까운 브랜드 옷, 빙글에 맡겨주세요.',
      '촬영부터 판매, 배송까지 빙글이 한 번에 대신해 드려요.',
      '옷이 팔리면 수수료를 뺀 금액을 정산해 드려요.',
    ],
    note: `${NONBRAND_MIN_PRICE.toLocaleString('ko-KR')}원 이상의 판매 가치가 있는 옷만 맡길 수 있어요`,
  },
  cleanup: {
    icon: '📦',
    title: '빙글 바로 정리',
    body: ['보내주신 옷의 무게만큼 바로 정산해 드려요.'],
    note: `kg당 빙글 포인트 ${CLEANUP_RATE.point}P 또는 현금 ${CLEANUP_RATE.cash}원 중에 골라 받을 수 있어요`,
  },
}

export function InfoButton({ service, onInfo }: { service: Service; onInfo: (s: Service) => void }) {
  return (
    <button
      type="button"
      className="info-btn"
      aria-label={`${INFO[service].title} 안내`}
      onClick={(e) => {
        e.stopPropagation()
        onInfo(service)
      }}
    >
      i
    </button>
  )
}

export function ServiceInfo({ service, onClose }: { service: Service; onClose: () => void }) {
  const info = INFO[service]
  return (
    <div className="notice-backdrop" onClick={onClose}>
      <div className="notice" role="dialog" aria-modal="true" aria-labelledby="service-title" onClick={(e) => e.stopPropagation()}>
        <div className="notice-icon">{info.icon}</div>
        <h2 id="service-title">{info.title}</h2>
        <p>
          {info.body.map((line, i) => (
            <span key={i}>
              {i > 0 && <br />}
              {line}
            </span>
          ))}
        </p>
        <p className="notice-tip">{info.note}</p>
        <button className="btn primary" onClick={onClose}>
          알겠어요
        </button>
      </div>
    </div>
  )
}
