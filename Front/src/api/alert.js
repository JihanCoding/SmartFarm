import { api } from "./apiService";

export const getAlert = async () => {
    try {
      const response = await api.post("/alert/get", {
        user_email : sessionStorage.getItem("email")
      });
      return response.data;
    } catch (error) {
      throw new Error('알람 데이터를 불러오는 중 오류가 발생했습니다.');
    }
  };


  export const addAlert = async (farm_name, alert_msg, sensor_name, sensing_at) => {
    try {
      const response = await api.post("/alert/add", {
        farm_name : farm_name,
        user_email : sessionStorage.getItem("email"),
        alert_msg : alert_msg,
        sensor_name : sensor_name,
        sensing_at : sensing_at
      });
      return response.data;
    } catch (error) {
      throw new Error('알람 데이터를 저장하는 중 오류가 발생했습니다.');
    }
  };
