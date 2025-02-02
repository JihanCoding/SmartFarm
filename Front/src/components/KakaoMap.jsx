import { useEffect } from "react";

const KakaoMap = ({ setLocation, initialPosition, isEditable }) => {
  const kakaoApiKey = import.meta.env.VITE_KAKAO_API_KEY;
  
  useEffect(() => {
    // 카카오 지도 스크립트 로드
    const script = document.createElement("script");
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${kakaoApiKey}&autoload=false`;
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
      window.kakao.maps.load(() => {
        const container = document.getElementById("map");

        // 기본 위치 설정 (props로 받은 값이 있으면 사용)
        const centerLat = initialPosition?.lat ? parseFloat(initialPosition.lat.toFixed(6)) : 34.343106;
        const centerLng = initialPosition?.lng ? parseFloat(initialPosition.lng.toFixed(6)) : 126.697788;

        const options = {
          center: new window.kakao.maps.LatLng(centerLat, centerLng),
          level: 10,  // 초기 확대 레벨 설정
          scrollwheel: false, // 마우스 휠 확대/축소 비활성화
          disableDoubleClickZoom: true, // 더블클릭 확대 방지
        };

        // 지도 생성
        const map = new window.kakao.maps.Map(container, options);

        // 마우스 휠 동작 부드럽게 설정
        map.setZoomable(true);

        // 마커 생성 및 초기 위치 설정
        const marker = new window.kakao.maps.Marker({
          position: new window.kakao.maps.LatLng(centerLat, centerLng),
        });

        marker.setMap(map);

        // 클릭 가능 여부에 따라 이벤트 리스너 추가
        if (isEditable) {
          window.kakao.maps.event.addListener(map, "click", function (mouseEvent) {
            const latlng = mouseEvent.latLng;

            // 위도 경도 값 소수점 6자리로 제한
            const lat = parseFloat(latlng.getLat().toFixed(6));
            const lng = parseFloat(latlng.getLng().toFixed(6));

            // 마커 위치 이동
            marker.setPosition(latlng);

            // 위도 경도 상태 업데이트
            setLocation({
              x: lat,
              y: lng,
            });
          });
        } else {
          // 클릭 비활성화: 클릭 이벤트 제거
          window.kakao.maps.event.removeListener(map, "click");
        }
      });
    };

    // 컴포넌트 언마운트 시 스크립트 제거
    return () => {
      script.remove();
    };
  }, [initialPosition, isEditable]);

  return (
    <div>
      <div id="map" style={{ width: "100%", height: "300px" }}></div>
    </div>
  );
};

export default KakaoMap;
