// 외부 연결 링크. 실제 URL이 정해지면 여기만 바꾸면 됩니다.
export const LINKS = {
  vingleConsign: 'https://vingle.example.com/consign', // TODO: 빙글 위탁판매 접수 URL
  quickCleanup: 'https://vingle.example.com/cleanup', // TODO: 바로 정리(수거) 접수 URL
}

// 피그마 AI로 만든 이미지를 모아두는 파일
export const FIGMA_ASSET_FILE = 'https://www.figma.com/design/8biI273AmJng7nWWIbkJqx'

// public/ 폴더 파일 경로 ('/images/...')를 배포 경로(base)에 맞게 바꿈
export const assetUrl = (path: string) => import.meta.env.BASE_URL + path.replace(/^\//, '')
