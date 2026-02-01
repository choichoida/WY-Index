import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  // GitHub Pages 배포용 base path
  base: process.env.NODE_ENV === 'production' ? '/WY-Index/' : '/',

  server: {
    // 개발 환경 CORS 프록시
    proxy: {
      '/api/kosis': {
        target: 'https://kosis.kr/openapi',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/kosis/, '/statisticsData.do'),
        secure: true,
      },
    },
  },

  build: {
    rollupOptions: {
      output: {
        // 청크 분리로 초기 로딩 최적화
        manualChunks: {
          vendor: ['react', 'react-dom'],
          charts: ['recharts'],
        },
      },
    },
  },
})
