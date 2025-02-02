import { api } from "./apiService";

/**
 * 가장 최신 3개의 뉴스 데이터를 가져오는 기능
 * @returns TOP3 뉴스데이터
 */
export const top3News = async () => {
    try {
      const response = await api.get("/news/top3");
      return response.data;
    } catch (error) {
      throw new Error('뉴스 데이터를 불러오는 중 오류가 발생했습니다.');
    }
  };
