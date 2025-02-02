import axios from "axios";
import { useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
const Alert = ({ alram, setCurrentComponent, sideFarm, handleReloadRequest, setCurrentMain, refreshData }) => {
    useEffect(()=>{
        console.log("Alert (alram):", alram, "로드완료");
        console.log("Alert (sideFarm):", sideFarm, "로드완료");
    },[alram])
    const updateAlert = async (item) => {
        try {
            const response = await axios.post("/focus/api/alert/update", {
                user_email: sessionStorage.getItem("email"),
                farm_name: item.farm_name,
                sensor_name: item.sensor_name,
                alert_msg: item.alert_msg,
                sensing_at: item.sensing_at
            });
            if(response){
                refreshData();
            }
        } catch (error) {
            console.error("API 요청 실패:", error);
        }
    };

    return (
        <>
            {alram.map((item, index) => {
                const sideDataIndex = sideFarm.findIndex(data => data.farm_name === item.farm_name);
                
                const isReceived = item.received_yn === 'y';

                return (
                    <a
                        className="dropdown-item dropdown-notifications-item"
                        href="#"
                        key={index}
                        onClick={async (e) => {
                            e.preventDefault();  // 페이지 이동 방지
                            updateAlert(item);
                            handleReloadRequest();
                            setCurrentMain(`MyFarm${sideDataIndex}`);
                            
                        }}
                    >
                        <div className={`dropdown-notifications-item-icon ${isReceived ? 'bg-success' : 'bg-danger'}`}>
                            <FontAwesomeIcon icon={isReceived ? faCheckCircle : faExclamationTriangle} />
                        </div>
                        <div className="dropdown-notifications-item-content">
                            <div className="dropdown-notifications-item-content-details">
                                {item.alerted_at.replace("T", " ")}
                            </div>
                            <div className="dropdown-notifications-item-content-text">
                                {item.farm_name}의 {item.alert_msg}
                            </div>
                        </div>
                    </a>
                );
            })}
        </>
    );
};

export default Alert;
