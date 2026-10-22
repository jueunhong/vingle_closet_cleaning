export type ClothingKind =
  | 'coat' | 'puffer' | 'knit' | 'cableknit' | 'uniform' | 'bomber' | 'swimsuit' | 'cap' | 'socks'
  | 'nordic' | 'floralcardi' | 'polo'
  | 'camohoodie' | 'flightbomber' | 'dottee' | 'purplefleece' | 'flarepants' | 'creamknit'
  | 'fleece' | 'leatherjacket' | 'lightpuffer' | 'ziphoodie'
  | 'floraldress' | 'teddyfur' | 'leatherskirt' | 'boots' | 'plainlong'
  | 'turtleneck' | 'stripeknit' | 'graphictee' | 'ringertee' | 'raglantee' | 'plaidskirt' | 'denimskirt' | 'duffle' | 'argyle' | 'backpack' | 'woolcoat' | 'furrider' | 'jeans' | 'sportpuffer'

export interface ClothingItem {
  id: string
  name: string
  kind: ClothingKind // 일러스트 모양
  color: string
  accent: string
  image?: string // 방에 일러스트 대신 그릴 이미지 (public/images/clothes/)
  photo?: string // 말풍선에 보여줄 실제 상품 사진 (public/images/clothes/)
  reason: string // 안 입는(또는 자주 입는) 이유 — 말풍선에 표시
  worn: string // 착용 기록
  estPrice: number // 위탁 시 예상 판매가(원). 브랜드 3~5만원, 비브랜드는 9,900원 이상이어야 위탁 가능
  brand?: string // 브랜드 옷이면 브랜드명
  isNew?: boolean // 최근에 사서 아직 안 입은 새 옷
  favorite?: boolean // 요즘 자주 입는 최애 옷
  weightKg: number // 바로 정리(kg당 700원) 정산용 무게
  vingleNo?: string // 빙글에 맡길 수 없는 이유 (교복·양말·속옷·하자·오염·냄새). '…은/는' 형태로 문장 앞에 붙임
  // 처음 방 화면에서의 위치 (방 크기 기준 %, 회전 각도)
  x: number
  y: number
  rot: number
  drawer?: number // 처음에 열린 서랍에 개지 않고 쑤셔 넣어져 있는 경우 서랍 번호
  start?: 'rail' | { shelf: number } // 처음부터 정리되어 있는 옷 (옷걸이에 걸림 / 선반에 개어짐)
}

export const CLOTHES: ClothingItem[] = [
  // 옷장 — 행거 칸 바닥과 선반에 마구 쑤셔 넣은 옷
  { id: 'trench', name: '빈폴 베이지 트렌치코트', kind: 'coat', color: '#d4b48a', accent: '#a8845a', reason: '출근룩으로 샀는데 재택하면서 입을 일이 사라진 옷', worn: '2년 전 봄이 마지막', estPrice: 42000, weightKg: 1.0, brand: '빈폴', x: 12, y: 38, rot: -14 },
  { id: 'knit', name: '보풀 난 니트', kind: 'knit', color: '#b9abcf', accent: '#9686b5', reason: '보풀이 너무 많아서 밖에 입고 나가기 민망한 옷', worn: '작년 겨울, 집에서만', estPrice: 0, weightKg: 0.4, vingleNo: '보풀이 심한 하자 있는 옷은', x: 20, y: 45, rot: 4 },
  { id: 'uniform', name: '고등학교 교복 재킷', kind: 'uniform', color: '#2f3a58', accent: '#9c2f3a', reason: '추억이라 차마 못 버리고 있는 옷', worn: '졸업식이 마지막', estPrice: 0, weightKg: 0.6, vingleNo: '교복은', x: 47, y: 28, rot: -10 },
  { id: 'woolcoat', name: '라이트그레이 울 롱코트', kind: 'woolcoat', color: '#ddd8cc', accent: '#3a2e28', photo: '/images/clothes/woolcoat.jpg', reason: '비싸게 샀는데 아끼느라 정작 몇 번 못 입은 코트', worn: '작년 겨울 두 번', estPrice: 28000, weightKg: 1.6, x: 29, y: 35, rot: 10 },
  { id: 'nordic', name: '노르딕 후드 니트 가디건', kind: 'nordic', color: '#9b9b98', accent: '#3a6fb0', photo: '/images/clothes/nordic.jpg', reason: '겨울마다 입었는데 요즘은 손이 덜 가는 가디건', worn: '작년 12월', estPrice: 19000, weightKg: 0.7, x: 46, y: 13, rot: -6 },
  { id: 'fleece', name: '라이트그레이 하프집업 플리스', kind: 'fleece', color: '#dcdcda', accent: '#8fb6e6', photo: '/images/clothes/fleece.jpg', reason: '캠핑 간다고 샀는데 캠핑을 한 번도 안 간 플리스', worn: '택 그대로', estPrice: 35000, weightKg: 0.5, brand: '뉴발란스', x: 44, y: 10, rot: 6 },
  { id: 'rawdenim', name: '생지 와이드 데님', kind: 'jeans', color: '#2e3550', accent: '#c9a35a', photo: '/images/clothes/rawdenim.jpg', reason: '생지라 물 빠질까 봐 아직도 못 입은 바지', worn: '택만 뗌', estPrice: 22000, weightKg: 0.8, x: 51, y: 41, rot: 14 },
  { id: 'turtleneck', name: '브라운 터틀넥 니트', kind: 'turtleneck', color: '#8a5a3c', accent: '#6f4630', reason: '보관을 잘못해서 꿉꿉한 냄새가 배어버린 터틀넥', worn: '재작년 겨울', estPrice: 0, weightKg: 0.5, vingleNo: '냄새가 나는 옷은', x: 22, y: 24, rot: 8 },
  { id: 'stripeknit', name: '네이비 스트라이프 니트', kind: 'stripeknit', color: '#efe6d2', accent: '#2f3b5c', reason: '프렌치 시크 꿈꾸며 샀는데 나랑은 안 맞는 무드', worn: '작년 가을 두 번', estPrice: 15000, weightKg: 0.45, x: 55, y: 22, rot: 12 },
  { id: 'argyle', name: '아가일 브이넥 가디건', kind: 'argyle', color: '#e9dfcc', accent: '#7a8d5c', reason: '할머니 옷장 감성이라 샀는데 입으면 진짜 할머니 같은 가디건', worn: '작년 가을 한 번', estPrice: 12000, weightKg: 0.4, x: 33, y: 46, rot: -8 },
  { id: 'teddyfur', name: '베이지 테디 퍼 자켓', kind: 'teddyfur', color: '#d8c3a5', accent: '#bba383', reason: '귀여워서 샀는데 입으면 곰돌이가 돼서 못 입는 자켓', worn: '작년 겨울 한 번', estPrice: 18000, weightKg: 0.9, x: 15, y: 40, rot: 6 },
  { id: 'leatherskirt', name: '블랙 레더 미니스커트', kind: 'leatherskirt', color: '#1f1d1c', accent: '#c4c7cb', reason: '시크하게 입으려고 샀는데 막상 입을 날이 없는 치마', worn: '연말 파티 한 번', estPrice: 12000, weightKg: 0.35, x: 56, y: 44, rot: -8 },
  { id: 'plainlong', name: '무지 그레이 긴팔 티', kind: 'plainlong', color: '#b9b6b0', accent: '#9a968f', reason: '똑같은 걸 세 장이나 사버려서 하나는 늘 남는 티', worn: '지난달', estPrice: 5000, weightKg: 0.25, x: 30, y: 60, rot: 0, drawer: 4 },
  { id: 'ringertee', name: '레드 링거 반팔 티', kind: 'ringertee', color: '#f2ece0', accent: '#c23a32', reason: '겨드랑이에 누런 얼룩이 생겨버린 티셔츠', worn: '2년 전 여름', estPrice: 0, weightKg: 0.2, vingleNo: '얼룩 같은 오염이 있는 옷은', x: 10, y: 60, rot: 0, drawer: 0 },
  { id: 'graphictee', name: '빈티지 프린트 반팔 티', kind: 'graphictee', color: '#efe8da', accent: '#c2513c', reason: '빈티지샵에서 샀는데 사이즈가 애매해서 손이 안 가는 티', worn: '작년 여름 한 번', estPrice: 7000, weightKg: 0.2, x: 50, y: 60, rot: 0, drawer: 2 },

  // 침대 위
  { id: 'bikini', name: '작년 수영복', kind: 'swimsuit', color: '#3fa79a', accent: '#fbf5e8', reason: '작년에 샀는데 올해는 사이즈가 안 맞는 수영복', worn: '작년 휴가 한 번', estPrice: 0, weightKg: 0.1, vingleNo: '속옷·수영복은', x: 90, y: 60, rot: 18, drawer: 2 },
  { id: 'cableknit', name: '아이보리 꽈배기 니트', kind: 'cableknit', color: '#efe4cd', accent: '#c7b48c', reason: '건조기 돌렸다가 한 사이즈 줄어든 니트', worn: '올해 2월이 마지막', estPrice: 8000, weightKg: 0.5, x: 90, y: 71, rot: -8 },
  { id: 'polo', name: '폴로 올리브 패딩 점퍼', kind: 'polo', color: '#7a7a3e', accent: '#1f2a44', photo: '/images/clothes/polo.jpg', reason: '아빠 옷장에서 가져왔는데 핏이 커서 애매한 점퍼', worn: '작년 가을 한 번', estPrice: 42000, weightKg: 0.9, brand: '폴로 랄프로렌', x: 84, y: 58, rot: 14 },
  { id: 'lightpuffer', name: '스카이블루 경량 후드 패딩', kind: 'lightpuffer', color: '#cfe1f4', accent: '#7fa6d8', photo: '/images/clothes/lightpuffer.jpg', reason: '색이 너무 예뻐서 샀는데 때 탈까 봐 못 입는 패딩', worn: '올해 3월 한 번', estPrice: 26000, weightKg: 0.4, x: 74, y: 55, rot: -10 },
  { id: 'flightbomber', name: 'ADWS 올리브 플라이트 봄버', kind: 'flightbomber', color: '#5d5a3a', accent: '#c4c7cb', photo: '/images/clothes/flightbomber.jpg', isNew: true, reason: '최근에 큰맘 먹고 샀는데 아직 한 번도 못 입어본 봄버', worn: '택도 안 뗌', estPrice: 48000, weightKg: 1.0, brand: 'ADWS', x: 82, y: 52, rot: 8, start: 'rail' },
  { id: 'floralcardi', name: '꽃무늬 크롭 니트 가디건', kind: 'floralcardi', color: '#8e9290', accent: '#c96f7a', photo: '/images/clothes/floralcardi.jpg', reason: '충동구매했는데 막상 같이 입을 옷이 없는 가디건', worn: '작년 봄 한 번', estPrice: 32000, weightKg: 0.45, brand: '자라', x: 71, y: 62, rot: -18 },
  { id: 'plaidskirt', name: '체크 플리츠 미니스커트', kind: 'plaidskirt', color: '#a8443a', accent: '#2f3b5c', reason: 'Y2K 유행 때 샀는데 이제 길이가 부담스러운 치마', worn: '작년 봄', estPrice: 9000, weightKg: 0.3, x: 78, y: 69, rot: 10 },
  { id: 'cap', name: '로고 볼캡', kind: 'cap', color: '#3b4a63', accent: '#26324a', reason: '땀 얼룩이 아무리 빨아도 안 지워지는 모자', worn: '2달 전', estPrice: 0, weightKg: 0.15, vingleNo: '땀 얼룩 같은 오염이 있는 옷은', x: 75, y: 68, rot: -6, drawer: 4 },

  // 의자 위
  { id: 'coat', name: '노스페이스 롱 패딩', kind: 'puffer', color: '#3f4a55', accent: '#2f3842', reason: '겨울 필수템이지만 자리를 너무 많이 차지하는 패딩', worn: '올해 1월', estPrice: 50000, weightKg: 1.3, brand: '노스페이스', x: 15, y: 82, rot: 6 },
  { id: 'umbro', name: '엄브로 블랙 패딩 점퍼', kind: 'sportpuffer', color: '#22252b', accent: '#f2f2f2', photo: '/images/clothes/umbro.jpg', reason: 'Y2K 감성으로 샀는데 생각보다 너무 부해 보이는 패딩', worn: '올해 1월 한 번', estPrice: 48000, weightKg: 1.1, brand: '엄브로', x: 24, y: 85, rot: -6 },

  // 바닥
  { id: 'camohoodie', name: '위캔더스 카모 후드집업', kind: 'camohoodie', color: '#7d8a5a', accent: '#e0702e', photo: '/images/clothes/camohoodie.jpg', reason: '카모가 유행이라 샀는데 입을 때마다 군대 가는 느낌인 후드', worn: '작년 가을 두 번', estPrice: 39000, weightKg: 0.8, brand: '위캔더스', x: 34, y: 75, rot: 18 },
  { id: 'leatherjacket', name: '블랙 레더 블루종', kind: 'leatherjacket', color: '#1c1b1a', accent: '#c4c7cb', photo: '/images/clothes/leatherjacket.jpg', reason: '가죽 재킷 로망으로 샀는데 생각보다 무거워서 손이 안 가는 옷', worn: '작년 가을 한 번', estPrice: 50000, weightKg: 1.2, brand: '노이즈', x: 40, y: 80, rot: 22 },
  { id: 'ziphoodie', name: '빈티지 워싱 후드집업', kind: 'ziphoodie', color: '#4f978a', accent: '#2f5f56', photo: '/images/clothes/ziphoodie.jpg', reason: '디스트로이드 디자인인데 엄마가 자꾸 버리려고 하는 후드집업', worn: '지난달', estPrice: 38000, weightKg: 0.7, brand: '노이즈', x: 57, y: 86, rot: -30 },
  { id: 'floraldress', name: '네이비 꽃무늬 원피스', kind: 'floraldress', color: '#3c4a6b', accent: '#f3e6cf', reason: '봄 데이트룩으로 샀는데 데이트가 없었던 원피스', worn: '택 그대로', estPrice: 14000, weightKg: 0.35, x: 26, y: 92, rot: -48 },
  { id: 'boots', name: '브라운 롱부츠', kind: 'boots', color: '#7a4a2b', accent: '#3e2414', reason: '발볼이 좁아서 신을 때마다 발이 아픈 부츠', worn: '작년 겨울 두 번', estPrice: 15000, weightKg: 1.4, x: 87, y: 84, rot: -20 },
  { id: 'duffle', name: '카멜 더플 숏코트', kind: 'duffle', color: '#c49563', accent: '#5a3a22', reason: '따뜻하긴 한데 입으면 학생 같아 보여서 안 입는 코트', worn: '작년 12월', estPrice: 23000, weightKg: 1.3, x: 36, y: 90, rot: -28 },
  { id: 'denimskirt', name: '데님 롱스커트', kind: 'denimskirt', color: '#5f7fae', accent: '#e0b552', reason: '요즘 다시 유행인데 어떻게 코디할지 모르겠는 치마', worn: '택 그대로', estPrice: 13000, weightKg: 0.6, x: 80, y: 89, rot: 62 },
  { id: 'raglantee', name: '네이비 라글란 긴팔 티', kind: 'raglantee', color: '#f4f1ea', accent: '#2f3b5c', reason: '잠옷으로 입다가 목이 늘어나버린 긴팔 티', worn: '어제도 잠옷으로', estPrice: 0, weightKg: 0.25, vingleNo: '목이 늘어난 하자 있는 옷은', x: 60, y: 92, rot: 24 },
  { id: 'backpack', name: '캔버스 백팩', kind: 'backpack', color: '#4f6b57', accent: '#8a5a3b', reason: '노트북이 안 들어가서 결국 안 메는 백팩', worn: '1년 전', estPrice: 9900, weightKg: 0.7, x: 62, y: 72, rot: -16 },
  { id: 'furrider', name: '블랙 퍼 라이더 재킷', kind: 'furrider', color: '#1f1d1c', accent: '#c9c9c9', photo: '/images/clothes/furrider.jpg', reason: '요즘 트렌드이지만 내 바뀐 추구미에는 안 어울려서 안 입는 옷', worn: '작년 겨울 한 번도 안 입음', estPrice: 17000, weightKg: 1.0, x: 50, y: 78, rot: 18 },
  { id: 'bomber', name: '카키 봄버 재킷', kind: 'bomber', color: '#6f7550', accent: '#d97a2b', reason: '유행 따라 샀는데 핏이 생각보다 커서 손이 안 가는 옷', worn: '작년 봄 두 번', estPrice: 16000, weightKg: 0.9, x: 72, y: 86, rot: -32 },
  { id: 'socks', name: '짝 잃은 양말', kind: 'socks', color: '#e8c24a', accent: '#d0703a', reason: '짝을 잃어버린 지 오래된 양말', worn: '기억도 안 남', estPrice: 0, weightKg: 0.05, vingleNo: '양말은', x: 58, y: 90, rot: 30, drawer: 0 },
  { id: 'creamknit', name: '크림 반팔 니트', kind: 'creamknit', color: '#f3e7cf', accent: '#d9c8a4', photo: '/images/clothes/creamknit.jpg', reason: '봄여름에 자주 입었는데 왠지 내년엔 안 입을 것 같은 니트', worn: '올여름 내내', estPrice: 16000, weightKg: 0.3, x: 70, y: 95, rot: 14 },
  // 요즘 자주 입는 최애 옷 (맨 위에 보이도록 마지막에 둠)
  { id: 'dottee', name: '뮤센트 도트 긴팔 티', kind: 'dottee', color: '#1f1d1c', accent: '#f7f3ea', photo: '/images/clothes/dottee.jpg', favorite: true, reason: '요즘 제일 자주 꺼내 입는 최애 긴팔 티', worn: '이번 주에만 두 번', estPrice: 34000, weightKg: 0.3, brand: '뮤센트', x: 76, y: 60, rot: -10 },
  { id: 'purplefleece', name: '노티카 퍼플 셰르파 플리스', kind: 'purplefleece', color: '#5a4778', accent: '#7c68a0', photo: '/images/clothes/purplefleece.jpg', favorite: true, reason: '가볍고 따뜻해서 요즘 매일 걸치는 플리스', worn: '어제도 입음', estPrice: 42000, weightKg: 0.7, brand: '노티카', x: 12, y: 77, rot: 10 },
  { id: 'flarepants', name: '차콜 코듀로이 플레어 팬츠', kind: 'flarepants', color: '#33302e', accent: '#b8b4ad', favorite: true, reason: '최근에 새로 샀는데 다리가 길어 보여서 요즘 매일 입는 바지', isNew: true, worn: '오늘도 입음', estPrice: 12000, weightKg: 0.6, x: 46, y: 78, rot: -24 },
]
