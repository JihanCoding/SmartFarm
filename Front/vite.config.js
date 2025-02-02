import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    server: {
        proxy: {
            '/focus/api': {                // 기존 경로
                target: 'http://localhost:8088',  // Spring Boot 서버
                changeOrigin: true,
                secure: false
            },
            '/focus/model': {                // 새 경로 추가
                target: 'http://localhost:5000',  // Python FastAPI 서버
                changeOrigin: true,
                secure: false
            }
        }
    },
    define: {
        ".env": {},
    }
});
