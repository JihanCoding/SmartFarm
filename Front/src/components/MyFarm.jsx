import { useEffect, useState } from "react";
import KakaoMap from "./KakaoMap";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";
import Table from "./Table";
import { formatDate } from "../api/time";
import CustomAlert from "../components/CustomAlert";

function MyFarm({ sideFarm, idx, sensing, setSensing, mySensor, alram, liveData, refreshData, setLoading}) {
    const [showModal, setShowModal] = useState(false);
    const [selectedSensor, setSelectedSensor] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [tableOp, setTableOp] = useState([]);
    const [tableTh, setTableTh] = useState([]);
    const [alertTbData, setAlertTbData] = useState([]);
    const [alertTableOp, setAlertTableOp] = useState([]);
    const [alertTableTh, setAlertTableTh] = useState([]);
    const [sensorData, setSensorData] = useState({
        sensorName: "",
        sensorType: "",
        installationDate: "",
        model: "",
        alertThreshold: "",
        url: "",
    });
    const [nameError, setNameError] = useState("");

    useEffect(() => {
        console.log("MyFarm (sideFarm):", sideFarm, "로드완료");
        console.log("MyFarm (liveData):", liveData, "로드완료");
        console.log("MyFarm (sideFarm):", sideFarm, "로드완료");
        console.log("MyFarm (alram):", alram, "로드완료");
        console.log("MyFarm (sensor):", mySensor, "로드완료");
        console.log("MyFarm (sensing):", sensing, "로드완료");
        console.log("updateSensing", updateSensing(sensing))
    },[sensing]);

    const updateSensing = (sensing) => {
        if (mySensor.length > 0) {
          // mySensor 배열에서 모든 sensor_id를 추출하여 새로운 배열 생성
          const sensorIds = mySensor.map(sensor => sensor.sensor_id);
      
          // sensing의 각 item의 sensor_id가 sensorIds 배열에 포함되어 있는지 확인
          const filtered = sensing.filter(item => sensorIds.includes(item.sensor_id));
      
          // 각 객체에서 sensor_id 속성을 제거하고 나머지 속성만 남김
          const updated = filtered.map(({ sensor_id, ...rest }) => rest);
          return updated;
        }
        return [];
      };
      
    // 모달 열기 핸들러 (선택한 센서 정보 설정)
    const handleShowModal = (sensor = null) => {
        if (sensor) {
            setIsEditMode(true);
            setSelectedSensor(sensor);
            setSensorData({
                sensorName: sensor.sensor_name || "",
                sensorType: sensor.sensor_type || "",
                installationDate: sensor.sensor_date || "",
                model: sensor.sensor_model || "",
                alertThreshold: sensor.sensor_threshold || "",
                url: sensor.sensor_url || "",
            });
        } else {
            // 새 센서 추가 시 초기화
            setIsEditMode(false); // 등록 모드로 설정
            setSelectedSensor(null);
            setSensorData({
                sensorName: "",
                sensorType: "",
                installationDate: "",
                model: "",
                alertThreshold: "",
                url: "",
            });
        }
        setShowModal(true);
    };

    // 모달 닫기 핸들러
    const handleCloseModal = () => {
        setShowModal(false);
        setNameError("");
        setSelectedSensor(null);
        };

    // 입력 값 핸들러 (중복 검사 포함)
    const handleChange = async (e) => {
        const { name, value } = e.target;

        setSensorData((prevState) => ({
            ...prevState,
            [name]: value,
        }));

        // 센서 이름 중복 체크 로직 위치 조정
        if (name === "sensorName" && value) {
            try {
                const response = await axios.post("/focus/api/sensor/check", {
                    sensor_name: value,
                    farm_name: sideFarm[idx].farm_name, // 해당 farm_name 전달
                });

                if (response.data) {
                    setNameError("이미 사용 중인 센서 이름입니다.");
                } else {
                    setNameError("");
                }
            } catch (error) {
                console.error("센서 이름 확인 중 오류 발생:", error);
                setNameError("중복 검사 중 오류가 발생했습니다.");
            }
        }
    };
    const handleSubmit = () => {
        if (isEditMode) {
            // 수정 모드 API 호출
        } else {
            // 등록 모드 API 호출
            handleRegister();
        }
    };
    // 센서 등록 처리
    const handleRegister = async () => {
        let check = true;
        // 🔥 모든 필드 검사
        for (const key of Object.keys(sensorData)) {
            if (sensorData[key].trim() === '') {
                CustomAlert({
                    title: '주의',
                    text: '모든 필드는 필수입니다.',
                    icon: 'warning',
                    confirmButtonText: '확인',
                  });
                  check = false;
                break;  // 🔥 빈 필드가 발견되면 반복 중단
            }
        }
        if(check){
            if (nameError != "") {
                await CustomAlert({
                    title: '주의',
                    text: '센서 이름을 수정해주세요.',
                    icon: 'warning',
                    confirmButtonText: '확인',
                  });
                return;
            }
            try {
                setLoading(true);
                const response = await axios.post("/focus/api/sensor/register", {
                    sensor_name: sensorData.sensorName,
                    sensor_type: sensorData.sensorType,
                    sensor_date: sensorData.installationDate,
                    sensor_model: sensorData.model,
                    sensor_threshold: parseFloat(sensorData.alertThreshold),
                    farm_name: sideFarm[idx].farm_name,
                    user_email: sideFarm[idx].user_email,
                    sensor_url: sensorData.url,
                });
                console.log(response.data);
                if (response.data) {
                    refreshData();
                    setLoading(false);
                    await CustomAlert({
                        text: '센서가 성공적으로 등록되었습니다!!',   // 메시지 내용만 전달
                        icon: 'success',       // 성공 아이콘으로 변경
                        confirmButtonText: '확인',
                      });
                    // loadSensor();
     
                    handleCloseModal();
                } else {
                }
            } catch (error) {
                console.error("센서 등록 중 오류 발생:", error);
            }
        }
    };
    const handleDeleteSensor = (idx, farm_name, sensor_name) => {
        CustomAlert({
            title: '삭제 확인',
            text: '정말 해당 센서를 삭제하겠습니까?',
            icon: 'warning',
            showCancelButton: true,   // 취소 버튼 추가
            confirmButtonText: '삭제',
            cancelButtonText: '취소',
            onConfirm: async () =>{
                try {
                    const response = await axios.post("/focus/api/sensor/delete", {
                        sensor_id: idx,
                        user_email: sessionStorage.getItem("email"),
                        farm_name: farm_name,
                        sensor_name: sensor_name
                    });
                    if (response.data) {
                        await CustomAlert({
                            text: '센서가 성공적으로 삭제되었습니다.!',   // 메시지 내용만 전달
                            icon: 'success',       // 성공 아이콘으로 변경
                            confirmButtonText: '확인',
                          });
                        // ✅ `mySensor.find`에서 `sensorId`가 아니라 `sensor_id`를 사용해야 함
                        refreshData();
                        // const deletedSensor = mySensor.find((s) => s.sensor_id === idx);
                        // if(sensing.length > 0){
                        //     if (deletedSensor) {
                        //         setSensing((prev) => prev.filter((item) => item.sensor_name !== deletedSensor.sensor_name));
                        //     }
                        //     // ✅ `tableOp`에서도 삭제된 센서를 제거하여 UI를 업데이트
                        //     setTableOp((prev) =>
                        //         prev.filter((name) => name !== deletedSensor.sensor_name)
                        //     );
                        // }
                        // if (deletedSensor) {
                        //     // ✅ 알림 테이블(alertTbData)에서 해당 센서의 알림을 제거
                        //     setAlertTbData((prev) => prev.filter(alram => alram.sensor_name !== deletedSensor.sensor_name));
            
                        //     // ✅ 옵션에서 해당 센서 제거
                        //     setAlertTableOp((prev) => prev.filter(name => name !== deletedSensor.sensor_name));
                        // }
        
                        handleCloseModal();
                    } else {
                    }
                } catch (error) {
                    console.error("센서 삭제 중 오류 발생:", error);
                }
            },
            onCancel: () => {
              // 취소 버튼을 눌렀을 때 실행
              console.log('삭제가 취소되었습니다.');
            }
        })
    };

    useEffect(()=>{
        // sensor_name을 중복 없이 추출 및 정렬
        const uniqueSensorNames = [
            ...new Set(updateSensing(sensing).map((item) => item.sensor_name)),
        ].sort();

        console.log("테이블 초기화")
        setTableOp(uniqueSensorNames);
        setTableTh(["순번", "센서이름", "관측일시", "관측 값", "상태"]);
        if(mySensor.length > 0){
            setAlertTbData(
                alram
                  .filter(item => item.farm_name === mySensor[0].farm_name)
                  .map(item => ({
                    sensor_name: item.sensor_name,
                    alerted_at: new Date(item.alerted_at)
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
                    alert_msg: item.alert_msg,
                    status: item.received_yn === "y" ? "CHECKED" : "UNCHECKED"
                  }))
              );    
        }

        // sensor_name을 중복 없이 추출 및 정렬
        const uniqueAlertSensorNames = [
            ...new Set(alertTbData.map((item) => item.sensor_name)),
        ].sort();

        setAlertTableOp(uniqueAlertSensorNames);
        setAlertTableTh(["순번", "센서이름", "알림일시", "메시지", "상태"]);
    },[sensing, alram])
    return (
        <main>
            <header className="page-header page-header-dark pb-10">
                <div className="container-xl px-4 ">
                    <div className="page-header-content pt-4">
                        <div className="row align-items-center justify-content-between">
                            <div className="col-auto mt-4"></div>
                        </div>
                    </div>
                </div>
            </header>
            <div className="container-xl px-4 mt-n15">
                <div className="row farm-info-row">
                    <div className="col-md-6 farm-info card">
                        <div className="card-header farm-info-h">
                            양식장 기본 정보
                        </div>
                        <div className="farm-info-bg">
                            <div className="farm-info-item">
                                <p className="mt-3 mb-2"> 양식장 명 :</p>{" "}
                                <span>{sideFarm[idx].farm_name}</span>
                            </div>
                            <hr className="mt-0 mb-1" />
                            <div className="farm-info-item">
                                <p className="mt-1 mb-2"> 양식장 소유주 :</p>{" "}
                                <span>{sideFarm[idx].farm_owner}</span>
                            </div>
                            <hr className="mt-0 mb-1" />
                            <div className="farm-info-item">
                                <p className="mt-1 mb-2"> 양식장 연락처 :</p>{" "}
                                <span>{sideFarm[idx].farm_tel}</span>
                            </div>
                            <hr className="mt-0 mb-1" />
                            <div className="farm-info-item">
                                <p className="mt-1 mb-2"> 양식장 위도 :</p>{" "}
                                <span>{sideFarm[idx].farm_latitude}</span>
                            </div>
                            <hr className="mt-0 mb-1" />
                            <div className="farm-info-item">
                                <p className="mt-1 mb-2"> 양식장 경도 :</p>{" "}
                                <span>{sideFarm[idx].farm_longitude}</span>
                            </div>
                            <hr className="mt-0 mb-1" />
                            <div className="farm-info-item">
                                <p className="mt-1 mb-2"> 양식장 등록일 : </p>{" "}
                                <span>
                                    {formatDate(sideFarm[idx].created_at)}
                                </span>
                            </div>
                        </div>
                        {/* <hr className="mt-0 mb-4" /> */}
                    </div>
                    <div className="col-md-6 farm-info card">
                        <h1 className="card-header farm-info-h">양식장 위치</h1>
                        <div className="farm-map">
                            <KakaoMap
                                initialPosition={{
                                    lat: sideFarm[idx].farm_latitude,
                                    lng: sideFarm[idx].farm_longitude,
                                }}
                                isEditable={false}
                            />
                        </div>
                    </div>
                </div>
                <div className="col-xxl-12">
                    <div className="card mb-4">
                        <div className="card-header">알람 기록</div>
                        <div className="card-body-newTb">
                            <Table
                                data={alertTbData}
                                option={alertTableOp}
                                th={alertTableTh}
                                tableId="alertTable"
                            />
                        </div>
                    </div>
                </div>
                <div className="card mb-4 farm-sensor">
                    <p className="card-header farm-info-h">내 센서</p>
                    <hr className="mt-0 mb-4" />
                    <div className="farm-sensor-row">
                        {mySensor.length > 0 ? (
                            mySensor.map((sensor, index) => (
                                <div
                                    key={index}
                                    className="col-sm-6 col-md-4 col-xl-3 mb-4 position-relative farm-sensor-wrap"
                                    style={{ position: "relative" }}
                                >
                                    {/* 삭제 버튼 */}
                                    <button
                                        className="delete-btn"
                                        style={{
                                            position: "absolute",
                                            top: "24px",
                                            right: "18px",
                                            backgroundColor: "transparent",
                                            border: "none",
                                            cursor: "pointer",
                                        }}
                                        onClick={() =>
                                            handleDeleteSensor(sensor.sensor_id, sensor.farm_name, sensor.sensor_name)
                                        }
                                    >
                                        <span className="material-symbols-rounded delete-icon">close</span>
                                        {/* <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="26"
                                            height="26"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="#567c8d" // 기본 색상
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="delete-icon"
                                        >
                                            <polyline points="3 6 5 6 21 6"></polyline>
                                            <path d="M19 6L18 20a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6m5 0V4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2"></path>
                                            <line
                                                x1="10"
                                                y1="11"
                                                x2="10"
                                                y2="17"
                                            ></line>
                                            <line
                                                x1="14"
                                                y1="11"
                                                x2="14"
                                                y2="17"
                                            ></line>
                                        </svg> */}
                                    </button>

                                    <a
                                        href="#"
                                        className="add-item-box"
                                        onClick={() => handleShowModal(sensor)}
                                        style={{
                                            borderBottom: sensing.find((item) => item.sensor_name === sensor.sensor_name)?.status === "ERROR"
                                            ? "8px solid #ee3333"
                                            : sensing.find((item) => item.sensor_name === sensor.sensor_name)?.status === "ACTIVE"
                                            ? "8px solid #33bb33"
                                            : "8px solid #567c8d"
                                        }}
                                    >
                                        <span className="sensor-info">
                                            <span className="sensor-text">
                                                <p>센서 명 :{" "}</p>
                                                <span>{sensor.sensor_name}</span>
                                            </span>
                                            <span className="sensor-text">
                                                <p>센서 타입 :{" "}</p>
                                                <span>{sensor.sensor_type}</span>
                                            </span>
                                            <span className="sensor-text">
                                                <p>센서 설치일 :{" "}</p>
                                                <span>{sensor.sensor_date}</span>
                                            </span>
                                            <span className="sensor-text">
                                                <p>센서 상태 :{" "}</p>
                                                <span className="sensor-status-text"
                                                style={{
                                                    color: sensing.find((item) => item.sensor_name === sensor.sensor_name)?.status === "ERROR"
                                                    ? "#ee3333"
                                                    : sensing.find((item) => item.sensor_name === sensor.sensor_name)?.status === "ACTIVE"
                                                    ? "#33bb33"
                                                    : "#567c8d"
                                                }}
                                                >
                                                    {sensing.find(
                                                        (item) =>
                                                            item.sensor_name ===
                                                            sensor.sensor_name
                                                    )?.status || "정보 없음"}
                                                </span>
                                            </span>
                                        </span>
                                    </a>
                                    <div
                                        className="text-center big"
                                        style={{
                                            fontSize: "20px",
                                            marginTop: "10px",
                                        }}
                                    >
                                        {sensor.sensor_name}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <></>
                        )}

                        <div className="col-sm-6 col-md-4 col-xl-3 mb-4 farm-sensor-wrap">
                            <a
                                href="#"
                                className="add-item-box"
                                onClick={() => {
                                    handleShowModal();
                                    setIsEditMode(false);
                                }}
                            >
                                <span className="plus-sign">+</span>
                            </a>
                            <div
                                className="text-center big"
                                style={{
                                    fontSize: "20px",
                                    fontWeight: "500",
                                    marginTop: "10px",
                                }}
                            >
                                센서 추가
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-xxl-12">
                    <div className="card mb-4 time-data">
                        <div className="card-header">센서 별 실시간 데이터</div>
                        <div className="card-body-newTb">
                            <Table
                                data={updateSensing(sensing)}
                                option={tableOp}
                                th={tableTh}
                                tableId="sensorTable"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* 센서 등록 모달 */}
            <Modal 
            show={showModal}
            onHide={handleCloseModal}
            
            >
                <Modal.Header closeButton>
                    <Modal.Title>
                        {selectedSensor ? "센서 수정" : "센서 등록"}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>센서 이름</Form.Label>
                            <Form.Control
                                type="text"
                                name="sensorName"
                                value={sensorData.sensorName}
                                onChange={handleChange}
                                placeholder="센서 이름을 입력하세요"
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>센서 타입</Form.Label>
                            <Form.Select
                                name="sensorType"
                                value={sensorData.sensorType}
                                onChange={handleChange}
                            >
                                <option value="">선택</option>
                                <option value="temperature">온도 센서</option>
                                <option value="wtr_temperature">
                                    수온 센서
                                </option>
                                <option value="humidity">습도 센서</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>설치 날짜</Form.Label>
                            <Form.Control
                                type="date"
                                name="installationDate"
                                value={sensorData.installationDate}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>모델명</Form.Label>
                            <Form.Control
                                type="text"
                                name="model"
                                value={sensorData.model}
                                onChange={handleChange}
                                placeholder="모델명을 입력하세요"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>
                                임계치 (해당 수치에 도달 시 알림이 발송됩니다.)
                            </Form.Label>
                            <Form.Control
                                type="number"
                                name="alertThreshold"
                                value={sensorData.alertThreshold || ""} // 빈 값이 아닌 기본값 제공
                                onChange={handleChange}
                                placeholder="알림 수치를 입력하세요"
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>데이터 요청 URL</Form.Label>
                            <Form.Control
                                type="text"
                                name="url"
                                value={sensorData.url}
                                onChange={handleChange}
                                placeholder="000.00.0.0/api/get"
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        닫기
                    </Button>
                    <Button variant="primary" onClick={handleSubmit}>
                        {isEditMode ? "수정" : "등록"}
                    </Button>
                </Modal.Footer>
            </Modal>
        </main>
    );
}
export default MyFarm;
