import { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import KakaoMap from "./KakaoMap";
import axios from "axios";
import CustomAlert from "../components/CustomAlert";
const Fishfarm = ({ setCurrentComponent, setCurrentMain, refreshData, setLoading }) => {
  const [input, setInput] = useState(""); // 양식장 이름
  const [owner, setOwner] = useState(""); // 소유자
  const [tel, setTel] = useState(""); // 연락처
  const [showModal, setShowModal] = useState(false); // 모달 상태
  const [location, setLocation] = useState({ x: "", y: "" }); // 선택된 위치
  const [tempLocation, setTempLocation] = useState({ x: "", y: "" }); // 임시 위치 저장

  // 모달 핸들러
  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  // 위치 선택 핸들러 (선택 버튼 클릭 시)
  const handleSelectLocation = () => {
    setLocation(tempLocation);
    handleClose();
  };

  // 입력값 확인 후 폼 데이터 전송 함수
  const handleSubmit = async () => {
    if (!input || !owner || !tel || !location.x || !location.y) {
      CustomAlert({
        title: '주의',
        text: '모든 필드는 필수입니다.',
        icon: 'warning',
        confirmButtonText: '확인',
      });
      return;
    }

    const formData = {
      user_email: sessionStorage.getItem("email"),
      farm_name: input,
      farm_owner: owner,
      farm_tel: tel,
      farm_latitude: location.x,
      farm_longitude: location.y,
    };
    console.log(formData);
    setLoading(true);
    try {
      const response = await axios.post("/focus/api/farm/add", formData);
      if (response.data) {
        setLoading(false);
          await CustomAlert({
            text: '양식장이 성공적으로 추가되었습니다!',
            icon: 'success',
            confirmButtonText: '확인',
          });
        refreshData();
        setCurrentMain("")
      } else {
    }
   } catch (error) {
      console.error("양식장 데이터 전송 중 오류 발생", error);
    }
  };

  useEffect(() => {
    console.log(location);
  }, [location]); // location이 변경될 때마다 실행

  return (
    <main>
      <header className="page-header page-header-compact page-header-light border-bottom bg-white mb-4">
        <div className="container-xl px-4 fish_header">
          <div className="page-header-content">
            <div className="row align-items-center justify-content-between pt-3">
              <h1 className="page-header-title">
                <div className="page-header-icon">
                  <i data-feather="user" />
                </div>
                양식장 추가
              </h1>
            </div>
          </div>
        </div>
      </header>

      <div className="container-xl px-4 mt-4">
        <div className="row one">
          <div className="col-xl-12 two">
            <div className="card mb-4 three">
              <div className="card-header">양식장 추가 / 센서 등록</div>
              <div className="card-body">
                <form>
                  <div className="mb-3">
                    <label className="small mb-1" htmlFor="farmName">
                      양식장 이름
                    </label>
                    <input
                      className="form-control"
                      id="farmName"
                      type="text"
                      placeholder="양식장 이름을 입력해주세요."
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="small mb-1" htmlFor="farmOwner">
                      양식장 소유자
                    </label>
                    <input
                      className="form-control"
                      id="farmOwner"
                      type="text"
                      placeholder="양식장 소유자를 입력해주세요."
                      value={owner}
                      onChange={(e) => setOwner(e.target.value)}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="small mb-1" htmlFor="farmTel">
                      양식장 연락처
                    </label>
                    <input
                      className="form-control"
                      id="farmTel"
                      type="text"
                      placeholder="000-0000-0000"
                      value={tel}
                      onChange={(e) => setTel(e.target.value)}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="small mb-1" htmlFor="farmLocation">
                      양식장 위치
                    </label>
                    <div className="d-flex">
                      <input
                        className="form-control"
                        id="farmLocation"
                        type="text"
                        placeholder="양식장 위치를 선택하세요"
                        value={
                          location.x && location.y
                            ? `위도: ${location.x}, 경도: ${location.y}`
                            : "양식장 위치 정보"
                        }
                        readOnly
                      />
                      <button
                        type="button"
                        className="btn btn-primary ms-2 addBtn"
                        onClick={handleShow}
                      >
                        검색
                      </button>
                    </div>
                  </div>

                  <button
                    className="btn btn-primary px-5"
                    type="button"
                    onClick={handleSubmit}
                  >
                    추가하기
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 위치 검색 모달 */}
      <Modal
        show={showModal}
        onHide={handleClose}
        style={{ marginTop: "130px" }} // 모달을 아래로 내림
      >
        <Modal.Header closeButton>
          <Modal.Title>양식장 위치 찾기</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <span>지도를 클릭해주세요!</span>
          <KakaoMap setLocation={setTempLocation} isEditable={true} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            닫기
          </Button>
          <Button variant="primary" onClick={handleSelectLocation}>
            선택
          </Button>
        </Modal.Footer>
      </Modal>
    </main>
  );
};

export default Fishfarm;
