# 옷장 정리 게임 (마케팅 웹)

옷장 정리 게임 → 안 입는 옷은 빙글(Vingle) 위탁판매 또는 바로 정리(수거)로 연결하는 마케팅용 웹.

## 스택
- Vite + React + TypeScript. `npm run dev` / `npm run build`
- 화면 흐름: `src/App.tsx` (방 화면 → 결과)
- 옷 데이터: `src/data/clothes.ts`, 외부 링크: `src/config.ts`
- 게임 규칙/용량: `src/game.ts` (옷마다 Place: loose | rail | shelf | drawer | gone)
  - 옷걸이(6), 선반 3칸(각 2), 서랍 6개(각 1, 눌러서 열어야 넣을 수 있음). 꽉 차면 거절 + 토스트
  - 어떤 옷이든 드래그 가능, 수납 칸이 아니면 놓은 자리에 둠. 탭하면 빙글 위탁/바로 정리 시트
  - 모든 옷이 수납되거나 내보내지면 '결과 보기'
- 방 그리기: `src/components/Room.tsx`(옷장·드래그), `RoomScene.tsx`(배경 SVG), `ClothingArt.tsx`(옷 일러스트)

## 이미지 (Figma AI)
- 에셋 파일: https://www.figma.com/design/8biI273AmJng7nWWIbkJqx (fileKey `8biI273AmJng7nWWIbkJqx`, Team Vingle 플랜)
- 생성: Figma MCP `create_session`(위 fileKey) → `generate_image`(fileKey, prompt, width/height)
  - 유료(Figma AI 크레딧 차감). 여러 장 만들기 전에 사용자에게 확인.
- 결과의 `image.url`을 curl로 받아 `public/images/clothes/<id>.png`에 저장하고,
  `clothes.ts`의 해당 아이템 `image: '/images/clothes/<id>.png'`로 연결.
- 톤: 밝은 크림 배경(#fbf8f3), 포인트 코럴(#ff5a36), 플랫/소프트 3D 일러스트.
