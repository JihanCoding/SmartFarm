import { api } from "./apiService";

export const getSensor = async () => {
    try {
      const response = await api.post("/sensor/select", {
        user_email : sessionStorage.getItem("email")
      });
      return response.data;
    } catch (error) {
      throw new Error('센서 데이터를 불러오는 중 오류가 발생했습니다.');
    }
  };

  export const deleteSensor = async (id, email, fm_name, ss_name) => {
    try {
      const response = await api.post("/focus/api/sensor/delete", {
        sensor_id: id,
        user_email: email,
        farm_name: fm_name,
        sensor_name: ss_name});
      return response.data;
    } catch (error) {
      throw new Error('센서 데이터를 삭제하는 중 오류가 발생했습니다.');
    }
  };

