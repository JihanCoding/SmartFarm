import axios from 'axios';

// 기본 Axios 인스턴스 생성 (공통 설정)
export const api = axios.create({
    baseURL: '/focus/api',   // API 기본 경로
    timeout: 5000,           // 타임아웃 설정
    headers: { 'Content-Type': 'application/json' },
});