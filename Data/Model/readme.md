모델 관련 실행 순서

<!-- Python 루트로 이동 -->
1. cd data/model

<!-- 가상환경 실행 -->
2. predict\Scripts\activate.bat

<!-- Fast API 루트로 이동 -->
3. cd ../

<!-- Fast API 서버 구동 -->
4. uvicorn predict:app --host 0.0.0.0 --port 5000 --reload

<!-- 예측 값 요청 URL -->
5. http://localhost:5000/forecast
