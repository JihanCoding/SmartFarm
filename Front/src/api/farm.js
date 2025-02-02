import { api } from "./apiService";

export const getFarm = async () => {
    try {
      const response = await api.post("/farm/get", {
        user_email : sessionStorage.getItem("email")
      });
      return response.data;
    } catch (error) {
      throw new Error('양식장 데이터를 불러오는 중 오류가 발생했습니다.');
    }
  };

  export const deleteFarm = async (item) => {
    try {
      const response = await api.post("/farm/delete", {
        farm_index : item
      });
      return response.data;
    } catch (error) {
      throw new Error('양식장 데이터를 삭제하는 중 오류가 발생했습니다.');
    }
  };