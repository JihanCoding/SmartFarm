import AreaChart from "./AreaChart";
import Table from "./Table";
import { formatDate } from "../api/time";
import { useEffect, useState } from "react";
import SliderComponent from "./SliderComponent";
import ReLineChart from "./ReLineChart";

const Home = ({ news, liveData, pastData, threeData, weatherData, model}) => {
    const [tableOp, setTableOp] = useState([]);
    const [tableTh, setTableTh] = useState([]);
    const [envData, setEnvData] = useState([]);
    const [envField, setEnvField] = useState([]);
    const [risaData, setRisaData] = useState([]);
    const [risaField, setRisaField] = useState([]);
    const [tableData, setTableData] = useState([]);
    const [modelData, setModelData] = useState([]);
    const [modelField, setModelField] = useState([]);
    useEffect(() => {
        console.log("Home (news):", news, "로드완료");
        console.log("Home (liveData):", liveData, "로드완료");
        console.log("Home (pastData):", pastData, "로드완료");
        console.log("Home (threeData):", threeData, "로드완료");
        console.log("Home (weatherData):", weatherData, "로드완료");
        setTable();
    }, [liveData]);

    /** 테이블 셋팅 메서드드 */
    const setTable = () => {
        /** 테이블 데이터 셋팅 */

        setTableData(
            liveData.map((item) => ({
                op_name: item.op_name,
                observed_at: item.observed_at,
                water_temp: item.water_temp.toFixed(1),
                status: "ACTIVE",
            }))
        );
        setTableOp(["완도 가교"]);
        setTableTh(["순번", "관측소명", "관측일시", "표층수온", "상태"]);

        const transformedData = [];
        const modelformedData = [];

        if(!model){
            refreshData();
        }
        // forEach를 사용하여 데이터 변환
        model.forecast.forEach(item => {
            modelformedData.push({
                key: item.date.split('-').slice(1).join('/'),
                수온: item.temp
            });
        }); 
        setModelData(modelformedData);  

        setModelField([
            { dataKey: '수온', name: '수온', color: '#e17055' },
        ])


        // forEach를 사용하여 데이터 변환
        threeData.forEach(item => {
            transformedData.push({
                key: item.observed_at.split('-').slice(1).join('/'),       // 날짜 값
                평균수온: item.avg_temp,      // 평균 수온
                최고수온: item.high_temp,     // 최고 수온
                최저수온: item.low_temp       // 최저 수온
            });
        });

        setEnvData(transformedData);        

        setEnvField([
            { dataKey: '평균수온', name: '평균수온', color: '#6c5ce7' },
            { dataKey: '최고수온', name: '최고수온', color: '#00b894' },
            { dataKey: '최저수온', name: '최저수온', color: '#d63031' },
        ])

        const filteredData = liveData.slice(0, 12)
            .map(item => ({
                key: item.observed_at.split(' ')[1].substring(0, 5), // 시간(HH:mm)만 추출
                수온: item.water_temp
            }))
            .reverse();
            setRisaData(filteredData)
            setRisaField([
            { dataKey: '수온', name: '수온', color: '#6c5ce7' },
        ])
        /** 테이블 데이터 셋팅 */
    };
    return (
        <>
            <main>
                <header
                    className="page-header page-header-dark pb-10"
                    style={{
                        backgroundImage:
                            "linear-gradient(to right, rgba(0, 0, 0, 0.7), rgba(72, 187, 250, 0.2)),url('../mainImg.jpg')",
                        backgroundSize: "cover",
                        backgroundPosition: "center 47%",
                    }}
                >
                    <div className="container-xl px-4">
                        <div className="page-header-content pt-4">
                            <div className="row align-items-center justify-content-between">
                                <div className="col-auto mt-4">
                                    <h1 className="cutomH1">
                                        김 양식 관련 뉴스
                                    </h1>
                                    <div className="page-header-subtitle">
                                        최신 TOP 30🔥
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="container-xl px-4 mt-n10">
                <div className="row">
                     <SliderComponent news={news} />
                    </div>
                    <div className="row">
                        <div className="col-xxl-7 col-lg-7 col-md-12">
                            <div className="card mb-4">
                                <div className="card-header border-bottom">
                                    <ul
                                        className="nav nav-tabs card-header-tabs"
                                        id="dashboardNav"
                                        role="tablist"
                                    >
                                        <li className="nav-item me-1">
                                            <a
                                                className="nav-link active"
                                                id="overview-pill"
                                                href="#overview"
                                                data-bs-toggle="tab"
                                                role="tab"
                                                aria-controls="overview"
                                                aria-selected="true"
                                            >
                                                최근 한달 수온 변화
                                            </a>
                                        </li>
                                        <li className="nav-item me-2">
                                            <a
                                                className="nav-link"
                                                id="activities1-pill"
                                                href="#activities1"
                                                data-bs-toggle="tab"
                                                role="tab"
                                                aria-controls="activities1"
                                                aria-selected="false"
                                            >
                                                미래 한달 수온 예측
                                            </a>
                                        </li>
                                        <li className="nav-item me-3">
                                            <a
                                                className="nav-link"
                                                id="activities2-pill"
                                                href="#activities2"
                                                data-bs-toggle="tab"
                                                role="tab"
                                                aria-controls="activities2"
                                                aria-selected="false"
                                            >
                                                최근 6시간 수온변화
                                            </a>
                                        </li>
                                    </ul>
                                </div>

                                <div className="card-body">
                                    <div
                                        className="tab-content"
                                        id="dashboardNavContent"
                                    >
                                        <div
                                            className="tab-pane fade show active"
                                            id="overview"
                                            role="tabpanel"
                                            aria-labelledby="overview-pill"
                                        >
                                            <div className="chart-area mb-4 mb-lg-0">
                                            <ReLineChart data = {envData} fields={envField}/>
                                            </div>
                                        </div>
                                        <div
                                            className="tab-pane fade chart-area mb-4 mb-lg-0"
                                            id="activities1"
                                            role="tabpanel"
                                            aria-labelledby="activities1-pill"
                                        >
                                            <ReLineChart data = {modelData} fields={modelField}/>
                                        </div>
                                        <div
                                            className="tab-pane fade chart-area mb-4 mb-lg-0"
                                            id="activities2"
                                            role="tabpanel"
                                            aria-labelledby="activities2-pill"
                                        >
                                            <ReLineChart data = {risaData} fields={risaField}/>
                                        </div>
                                    </div>
                                </div>

                                <div className="card-footer small text-muted">
                                    업데이트 일시:{" "}
                                    {new Date().toLocaleDateString()}{" "}
                                    {new Date().toLocaleTimeString()}
                                </div>
                            </div>
                        </div>

                        <div className="col-xxl-5 col-lg-5 col-md-12">
                            <div className="card mb-4">
                                <div className="card-header">
                                    오늘의 날씨 🌤️
                                </div>
                                <div className="card-body">
                                    {weatherData.map((item, index) => (
                                        <div key={index}>
                                            <div className="weather-container">
                                                <div className="weather-left">
                                                    <img
                                                        src={item.wh_icon}
                                                        alt="날씨 아이콘"
                                                        className="weather-icon"
                                                    />
                                                </div>
                                                <div className="weather-right">
                                                    <p className="weather-summary">
                                                        현재온도{" "}
                                                        <span className="temp-cur">
                                                            {item.wh_curTp}°
                                                        </span>
                                                    </p>
                                                    <p className="weather-summary">
                                                        어제보다{" "}
                                                        <span className="temp-diff">
                                                            {item.wh_difTp}°
                                                        </span>{" "}
                                                        ↑ / 맑음
                                                    </p>
                                                    <p className="weather-details">
                                                        <span>
                                                            체감{" "}
                                                            <b>
                                                                {item.wh_flTp}°
                                                            </b>
                                                        </span>{" "}
                                                        ·
                                                        <span>
                                                            습도{" "}
                                                            <b>
                                                                {item.wh_humid}%
                                                            </b>
                                                        </span>{" "}
                                                        ·
                                                        <span>
                                                            서풍{" "}
                                                            <b>
                                                                {item.wh_wdSp}
                                                                m/s
                                                            </b>
                                                        </span>
                                                    </p>
                                                    <small className="update-time">
                                                        업데이트 시간:{" "}
                                                        {formatDate(
                                                            item.created_at
                                                        )}
                                                    </small>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="card-footer small text-muted">
                                    날씨 정보는 매 1분마다 업데이트 됩니다.
                                </div>
                            </div>
                        </div>

                        <div className="col-xxl-12">
                            <div className="card mb-4">
                                <div className="card-header">
                                    관측소 별 실시간 수온
                                </div>
                                <div className="card-body-newTb">
                                    <Table
                                        data={tableData}
                                        option={tableOp}
                                        th={tableTh}
                                        tableId="homeTable"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
};
export default Home;
