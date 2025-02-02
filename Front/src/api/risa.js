import { api } from "./apiService";

export const getPastData = async () => {
    try {
      const response = await api.get("/past/today");
      return response.data;  // 과거 데이터 반환
    } catch (error) {
      throw new Error('과거 데이터를 불러오는 중 오류가 발생했습니다.');
    }
  };
  
  export const getThreeData = async () => {
    try {
      const response = await api.get("/past/three");
      return response.data;  // 과거 데이터 반환
    } catch (error) {
      throw new Error('최근3일 데이터를 불러오는 중 오류가 발생했습니다.');
    }
  };
  
  export const getWeather = async () => {
    try {
      const response = await api.get("/weather/get");
      return response.data;
    } catch (error) {
      throw new Error('날씨 데이터를 불러오는 중 오류가 발생했습니다.');
    }
  };
  
  export const getLiveData = async () => {
    try {
      const response = await api.get("/live/get");
      return response.data;
    } catch (error) {
      throw new Error('실시간 데이터를 불러오는 중 오류가 발생했습니다.');
    }
  };