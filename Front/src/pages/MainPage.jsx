import TopNav from "../components/TopNav";
import Sidebar from "../components/Sidebar";
import Home from "../components/Home";
import { addAlert } from "../api/alert";
import { useNavigate } from "react-router-dom";
import { useEffect } from 'react';
import { formatToLocalDateTime } from "../api/time";
import Fishfarm from "../components/Fishfarm";
import MyFarm from "../components/MyFarm";
import { useState } from "react";
import { Spinner } from 'react-bootstrap';

const MainPage = ({ 
    currentMain, 
    setCurrentMain, 
    newsTop3, 
    liveData, 
    pastData, 
    threeData, 
    weatherData, 
    handleReloadRequest, 
    setCurrentComponent, 
    currentComponent, 
    sideFarm, 
    alram, 
    sensor, 
    sensing,
    refreshData
}) => {
    const [currnetData, setCurrentData] = useState([]);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleResetScroll = () => {
        window.scrollTo(0, 0);  // 스크롤 위치를 0으로 초기화
      };
    useEffect(()=>{
        handleResetScroll();
    },[currentMain])
    useEffect(() => {
        if (!sessionStorage.getItem("email")) {
            navigate('/login');
        }
        console.log("MainPage (sideFarm):", sideFarm, "로드완료");
        console.log("MainPage (newsTop3):", newsTop3, "로드완료");
        console.log("MainPage (weatherData):", weatherData, "로드완료");
        console.log("MainPage (liveData):", liveData, "로드완료");
        console.log("MainPage (pastData):", pastData, "로드완료");
        console.log("MainPage (threeData):", threeData, "로드완료");
        console.log("MainPage (sideFarm):", sideFarm, "로드완료");
        console.log("MainPage (alram):", alram, "로드완료");
        console.log("MainPage (sensor):", sensor, "로드완료");
        console.log("MainPage (sensing):", sensing, "로드완료");
        addNewAlert();
        
        // 10초마다 데이터 갱신
        const intervalId = setInterval(() => {
            refreshData();
            addNewAlert();
        }, 10000);

        return () => clearInterval(intervalId);
    }, [sensing]);

    useEffect(()=>{

    },[])

    /** 알림 추가 */
    let isProcessing = false;

    const addNewAlert = async () => {
      if (isProcessing) return; // 이미 실행 중이면 바로 리턴
      isProcessing = true;
      try {
        // 기존 로직 실행
        const data = sensing.filter((item) =>
          sensor.some((sensor) => sensor.sensor_id === item.sensorId)
        );
    
        const validSensorIds = sensor.map((item) => item.sensor_id);
        const filteredData = data.filter((item) =>
          validSensorIds.includes(item.sensorId)
        );
        const updatedData = filteredData.map((item) => {
          const matchedSensor = sensor.find(
            (sensor_) => sensor_.sensor_id === item.sensorId
          );
          return {
            ...item,
            sensor_name: matchedSensor ? matchedSensor.sensor_name : "알 수 없음",
            farm_name: matchedSensor ? matchedSensor.farm_name : "알 수 없음",
          };
        });
    
        setCurrentData(
          updatedData.map((item) => ({
            sensor_name: item.sensor_name,
            sensing_at: new Date(item.sensingAt)
              .toLocaleString("ko-KR", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: false,
              })
              .replace(/\./g, "-")
              .replace(" ", "")
              .replace(/\s/g, ""),
            sensor_res: item.sensorRes,
            status: item.sensorState,
            sensor_id: item.sensorId
          }))
        );
    
        // 각 센서별 최신 데이터 찾기
        const latestSensorData = updatedData.reduce((acc, item) => {
          if (
            !acc[item.sensor_name] ||
            new Date(item.sensingAt) > new Date(acc[item.sensor_name].sensingAt)
          ) {
            acc[item.sensor_name] = { ...item, sensorRes: item.sensorRes };
          }
          return acc;
        }, {});
    
        // ERROR 상태 필터링
        const latestErrorSensors = Object.values(latestSensorData)
          .filter((sensor) => sensor.sensorState === "ERROR")
          .map((sensor) => ({
            sensor_name: sensor.sensor_name,
            sensing_at: formatToLocalDateTime(sensor.sensingAt),
            farm_name: sensor.farm_name,
          }));
    
        // 임계치 초과 필터링
        const latestThresholdSensors = Object.values(latestSensorData)
          .filter((item) => {
            const sameNameData = sensor.find(
              (data) => data.sensor_name === item.sensor_name
            );
            return sameNameData && item.sensorRes > sameNameData.sensor_threshold;
          })
          .map((item) => ({
            sensor_name: item.sensor_name,
            sensing_at: formatToLocalDateTime(item.sensingAt),
            farm_name: item.farm_name,
          }));
    
        // 알람 추가 (조건이 겹치는 경우를 고려해 중복 호출되지 않도록 주의)
        latestThresholdSensors.forEach((error) => {
          addAlert(
            error.farm_name,
            `${error.sensor_name} 센서의 임계치가 초과되었습니다.`,
            error.sensor_name,
            error.sensing_at
          );
        });
        latestErrorSensors.forEach((error) => {
          addAlert(
            error.farm_name,
            `${error.sensor_name} 센서에서 에러가 발생했습니다.`,
            error.sensor_name,
            error.sensing_at
          );
        });
      } catch (error) {
        console.error("addNewAlert 실행 중 에러 발생", error);
      } finally {
        isProcessing = false;
      }
    };    
    return (
        <div className="nav-fixed">
            {sessionStorage.getItem("email") ? (
                <>
                             {loading &&(
            <div className="loading-back"><Spinner className="loading-ui" animation="border" variant="primary" /></div>
            )}
                    <TopNav 
                        setCurrentComponent={setCurrentComponent} 
                        alram={alram} 
                        sideFarm={sideFarm} 
                        setCurrentMain={setCurrentMain}
                        handleReloadRequest={handleReloadRequest}
                        refreshData={refreshData}
                    />
                    <div id="layoutSidenav">
                        <Sidebar 
                            setCurrentComponent={setCurrentComponent} 
                            sideFarm={sideFarm} 
                            currentComponent={currentComponent}
                            currentMain={currentMain}
                            setCurrentMain={setCurrentMain}
                            sensor={sensor}
                            refreshData={refreshData}
                        />
                        <div id="layoutSidenav_content">
                            {currentComponent === "MainPage" && (
                                <>
                                    {currentMain === "" && (
                                        <Home
                                            news={newsTop3}
                                            liveData={liveData}
                                            pastData={pastData}
                                            threeData={threeData}
                                            weatherData={weatherData}
                                            setCurrentMain={setCurrentMain}
                                            setCurrentComponent={setCurrentComponent}
                                        />
                                    )}
                                    {currentMain === "FishFarm" && (
                                        <Fishfarm 
                                            setCurrentComponent={setCurrentComponent} 
                                            setCurrentMain={setCurrentMain}
                                            refreshData={refreshData}
                                            setLoading = {setLoading}
                                        />
                                    )}
                                    {sideFarm.map((item, key) =>
                                        currentMain === `MyFarm${key}` && (
                                            <MyFarm
                                                key={key}
                                                liveData={JSON.parse(JSON.stringify(liveData))}
                                                sideFarm={JSON.parse(JSON.stringify(sideFarm))}
                                                setCurrentComponent={setCurrentComponent}
                                                setCurrentMain={setCurrentMain}
                                                sensing={JSON.parse(JSON.stringify(currnetData))}
                                                setSensing={setCurrentData}
                                                idx={key}
                                                mySensor={Array.isArray(sensor) ? 
                                                    sensor.filter(sensorItem => 
                                                        sensorItem.farm_name === item.farm_name
                                                    ) : []
                                                }
                                                handleReloadRequest = {handleReloadRequest}
                                                alram={JSON.parse(JSON.stringify(alram))}
                                                refreshData={refreshData}
                                                setLoading = {setLoading}
                                            />
                                        )
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </>
            ) : null}
        </div>
    );
};
export default MainPage;