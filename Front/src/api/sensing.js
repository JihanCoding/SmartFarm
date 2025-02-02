import { api } from './apiService';

export const getSensing = async () => {
    try {
        const response = await api.get("/sensing/get");
        return response.data;
    } catch (error) {
        throw new Error("센서 데이터를 불러오는 중 오류가 발생했습니다.");
    }
};