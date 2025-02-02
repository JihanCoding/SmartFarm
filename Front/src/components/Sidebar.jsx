import { useEffect } from "react";
import { deleteFarm } from "../api/farm";
import { deleteSensor } from "../api/sensor";
import CustomAlert from "./CustomAlert";

function Sidebar({
  setCurrentMain,
  currentMain,
  setCurrentComponent,
  currentComponent,
  sideFarm,
  sensor,
  refreshData
}) {
  useEffect(() => {
    console.log("Sidebar (sideFarm):", sideFarm, "로드완료");
    console.log("currentMain", currentMain);
    console.log("sensor", sensor)
  }, [currentMain]);

  const deleteFarmSide = async (farm_index, farm_name, user_email) => {
    const userEmail = sessionStorage.getItem("email");
  
    // SweetAlert2 호출 및 대기
    await CustomAlert({
      title: '삭제 확인',
      text: '정말 해당 농장을 삭제하겠습니까?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: '삭제',
      cancelButtonText: '취소',
      onConfirm: async () => {
        try {
          // 1. 농장에 연결된 센서 목록 가져오기 및 센서 삭제
          const sensors = findMySensor(farm_name, user_email);
          const deletePromises = sensors.map((item) =>
            deleteSensor(item.sensor_id, userEmail, farm_name, item.sensor_name)
          );
  
          // 2. 모든 센서 삭제 완료 대기
          const results = await Promise.all(deletePromises);
  
          // 3. 결과 확인
          const allDeleted = results.every(Boolean);
  
          if (allDeleted) {
            // 4. 센서가 모두 삭제되었을 때 농장 삭제
            const deleteResult = await deleteFarm(farm_index);
  
            if (deleteResult) {
              await CustomAlert({
                text: '농장이 성공적으로 삭제되었습니다!',
                icon: 'success',
                confirmButtonText: '확인',
              });
              refreshData();
              setCurrentMain("");
            } else {
              console.error('농장 삭제에 실패했습니다.');
            }
          } else {
            console.error('일부 센서가 삭제되지 않았습니다.');
          }
        } catch (error) {
          console.error('삭제 중 오류 발생:', error);
        }
      },
      onCancel: () => {
        // 취소 버튼을 눌렀을 때 실행
        console.log('삭제가 취소되었습니다.');
      },
    });
  };
  
  

  const findMySensor = (farm_name, user_email) =>{
    const filteredSensors = sensor.filter(item => 
        item.farm_name === farm_name && item.user_email === user_email
      );
      return filteredSensors;
  }
  return (
    <div id="layoutSidenav_nav">
      <nav className="sidenav shadow-right sidenav-light">
        {/* 양식장 메뉴 */}
        <div className="sidenav-menu">
          <div className="nav accordion" id="accordionSidenav">
            {/* Sidenav Menu Heading (Core)*/}
            <div className="sidenav-menu-heading">관리자 페이지</div>
            {/* Sidenav Accordion (Dashboard)*/}
            <a
              className="nav-link"
              href="#"
              data-bs-toggle="collapse"
              data-bs-target="#collapseDashboards"
              aria-expanded="true"
              aria-controls="collapseDashboards"
            >
              <div className="nav-link-icon">
                <i data-feather="activity" />
              </div>
              양식장
              <div className="sidenav-collapse-arrow">
                <i className="fas fa-angle-down" />
              </div>
            </a>
            <div
              className="collapse show"
              id="collapseDashboards"
              data-bs-parent="#accordionSidenav"
            >
              {/* 양식장 메뉴 하부 컨텐츠 */}
              {sideFarm.map((item, key) => (
                <nav
                  key={key}
                  className="sidenav-menu-nested nav accordion"
                  id="accordionSidenavPages"
                >
                  <div
                    className="farm-item-container"
                    style={{ display: "inline-flex", alignItems: "center" }}
                  >
                    <a
                      className={`detail ${
                        currentMain === `MyFarm${key}`
                          ? "selected-farm disabled"
                          : ""
                      }`}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        minWidth: "100%",
                      }}
                      onClick={(e) => {
                        if (currentMain === `MyFarm${key}`) {
                          e.preventDefault(); // 클릭 차단
                          return;
                        }
                        setCurrentMain(`MyFarm${key}`);
                      }}
                    >
                      <span>{item.farm_name}</span>
                      <span
                        className="farmDeleteBtn"
                        onClick={(e) => {
                            e.stopPropagation()
                            deleteFarmSide(item.farm_index, item.farm_name, sessionStorage.getItem("email"))
                        }}
                        style={{
                          marginLeft: "5px",
                          display: "flex",
                          alignItems: "center", // 세로 중앙 정렬
                          justifyContent: "flex-start", // 가로는 왼쪽 정렬
                          width: "24px",
                          height: "24px",
                        }}
                      >
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          style={{ width: "18px", height: "18px" }}
                        >
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6l-1 14H6L5 6" />
                          <line x1="10" y1="11" x2="10" y2="17" />
                          <line x1="14" y1="11" x2="14" y2="17" />
                          <path d="M9 6V4h6v2" />
                        </svg>
                      </span>
                    </a>
                  </div>
                </nav>
              ))}
            </div>

            {/* 양식장 추가 버튼 */}
            <button
              className="mx-auto my-2 py-2 px-5 side-btn"
              onClick={() => {
                setCurrentMain("FishFarm");
              }}
            >
              <p>새 양식장 추가</p> <span>+</span>
            </button>
          </div>
        </div>
        {/* Sidenav Footer*/}
        <div className="sidenav-footer">
          <div className="sidenav-footer-content">
            <div className="sidenav-footer-subtitle">Logged in as:</div>
            <div className="sidenav-footer-title">team Focus</div>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Sidebar;
