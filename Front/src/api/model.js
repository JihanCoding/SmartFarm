import { model } from "./modelService";

export const getModel = async () => {
    try {
      const response = await model.get("/forecast");
      return response.data;
    } catch (error) {
        console.error("서버 에러:", error.response?.data || error.message);  // 서버 응답 확인
      throw new Error('모델 데이터를 불러오는 중 오류가 발생했습니다.');
    }
  };