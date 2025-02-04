모델 관련 실행 순서

<!-- Python 루트로 이동 -->
1. cd data/model

<!-- 가상환경 실행 -->
2. predict\Scripts\activate.bat

<!-- Fast API 루트로 이동 -->
3. cd ../

<!-- Fast API 서버 구동 -->
4. uvicorn predict:app --host 0.0.0.0 --port 5000 --reload
   uvicorn predict:app --host 127.0.0.1 --port 5000 --reload

<!-- 예측 값 요청 URL -->
5. http://localhost:5000/focus/model/forecast

<!-- 센서 데이터 추가 -->
http://localhost:8088/focus/api/sensing/from?user_email=test1@naver.com&farm_name=%EC%8A%A4%EB%A7%88%ED%8A%B8%ED%8C%9C&sensor_name=%ED%85%8C%EC%8A%A4%ED%8A%B81&sensor_res=88