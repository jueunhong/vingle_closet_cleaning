import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
// GitHub Pages는 https://<user>.github.io/<저장소 이름>/ 아래에서 서비스되므로 빌드할 때만 경로를 붙임
// (vite preview도 빌드 결과를 그대로 보여주므로 같은 경로 사용)
export default defineConfig(({ command, isPreview }) => ({
  base: command === 'build' || isPreview ? '/vingle_closet_cleaning/' : '/',
  plugins: [react()],
  server: { host: '127.0.0.1', port: 5174 },
}))
