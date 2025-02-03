import { top3News } from "../api/news";
import {
    getPastData,
    getThreeData,
    getWeather,
    getLiveData,
} from "../api/risa";
import { getAlert, addAlert } from "../api/alert";
import { getFarm } from "../api/farm";
import { getModel } from "../api/model";
import { getSensing } from "../api/sensing";
import { getSensor } from "../api/sensor";
import { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import MainPage from "./MainPage";

const LoadingPage = () => {
    const navigate = useNavigate();
    const [newsTop3, setNewsTop3] = useState([]);
    const [liveData, setLiveData] = useState([]);
    const [pastData, setPastData] = useState([]);
    const [threeData, setThreeData] = useState([]);
    const [weatherData, setWeatherData] = useState([]);
    const [sideFarm, setSideFarm] = useState([]);
    const [currentComponent, setCurrentComponent] = useState("Loading");
    const [currentMain, setCurrentMain] = useState("");
    const [reloadTrigger, setReloadTrigger] = useState(false);
    const [alram, setAlram] = useState([]);
    const [sensor, setSensor] = useState([]);
    const [sensing, setSensing] = useState([]);
    const [model, setModel] = useState([]);
    const [isInitialLoad, setIsInitialLoad] = useState(true);
    
    useEffect(() => {
        if (!sessionStorage.getItem("email")) {
            navigate("/login");
        }
        
        // 최초 로딩 시 데이터 로드
        if (isInitialLoad) {
            loadData().then(() => {
                setIsInitialLoad(false);
                setCurrentComponent("MainPage");
            });
        }
    }, []);

    // 데이터 갱신을 위한 별도의 함수
    const refreshData = async () => {
        try {
            const [
                newsData,
                weatherData,
                risaData,
                past,
                three,
                side,
                AlramData,
                sensorData,
                sensingData,
                modelData,
            ] = await Promise.all([
                top3News(),
                getWeather(),
                getLiveData(),
                getPastData(),
                getThreeData(),
                getFarm(),
                getAlert(),
                getSensor(),
                getSensing(),
                getModel(),
            ]);
            
            setNewsTop3(newsData);
            setWeatherData(weatherData);
            setLiveData(risaData);
            setPastData(past);
            setThreeData(three);
            setSideFarm(side);
            setAlram(AlramData);
            setSensor(sensorData);
            setSensing(sensingData);
            setModel(modelData);
            console.log("Refresh Data")
        } catch (error) {
            console.error("데이터 로드 중 오류 발생:", error);
        }
    };

    // currentComponent가 변경될 때 실행되는 useEffect
    useEffect(() => {
        if (!isInitialLoad && currentComponent === "Loading") {
            // 백그라운드에서 데이터 갱신 후 바로 MainPage로 전환
            refreshData().then(() => {
                setCurrentComponent("MainPage");
            });
        }
    }, [currentComponent]);

    const handleReloadRequest = () => {
        setReloadTrigger(prev => !prev);
    };

    const loadData = async () => {
        try {
            const [
                newsData,
                weatherData,
                risaData,
                past,
                three,
                side,
                alramData,
                sensorData,
                sensingData,
                modelData,
            ] = await Promise.all([
                top3News(),
                getWeather(),
                getLiveData(),
                getPastData(),
                getThreeData(),
                getFarm(),
                getAlert(),
                getSensor(),
                getSensing(),
                getModel(),
            ]);
            
            setNewsTop3(newsData);
            setWeatherData(weatherData);
            setLiveData(risaData);
            setPastData(past);
            setThreeData(three);
            setSideFarm(side);
            setAlram(alramData);
            setSensor(sensorData);
            setSensing(sensingData);
            setModel(modelData);
        } catch (error) {
            console.error("데이터 로드 중 오류 발생:", error);
        }
    };

    return (
        <>
            {isInitialLoad ? (
                <div className="loading-back">
                    <Spinner className="loading-ui" animation="border" variant="primary" />
                </div>
            ) : (
                sessionStorage.getItem("email") && (
                    <MainPage
                        setCurrentMain={setCurrentMain}
                        currentMain={currentMain}
                        newsTop3={JSON.parse(JSON.stringify(newsTop3))}
                        liveData={JSON.parse(JSON.stringify(liveData))}
                        pastData={JSON.parse(JSON.stringify(pastData))}
                        threeData={JSON.parse(JSON.stringify(threeData))}
                        weatherData={JSON.parse(JSON.stringify(weatherData))}
                        handleReloadRequest={handleReloadRequest}
                        setCurrentComponent={setCurrentComponent}
                        currentComponent={currentComponent}
                        sideFarm={JSON.parse(JSON.stringify(sideFarm))}
                        alram={JSON.parse(JSON.stringify(alram))}
                        sensor={JSON.parse(JSON.stringify(sensor))}
                        sensing={JSON.parse(JSON.stringify(sensing))}
                        refreshData = {refreshData}
                        model = {JSON.parse(JSON.stringify(model))}
                    />
                )
            )}
        </>
    );
};

export default LoadingPage;