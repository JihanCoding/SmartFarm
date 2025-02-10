<div align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:00509d,100:003f88&height=250&section=header&text=스마트%20김%20양식%20관리%20서비스&fontSize=45&fontColor=ffffff&fontAlign=50&fontAlignY=40&width=1400" />
</div>

---

## 📖 **프로젝트 소개**  
김 양식의 스마트한 미래를 위한 관리 시스템!  
AI와 실시간 환경 데이터를 활용하여 해수 온도 변화에 신속히 대응하고 양식 효율을 극대화합니다.  
양식장의 성공적인 운영을 돕기 위한 최적의 솔루션을 제공하는 서비스입니다. 🐟

---

## 🎯 **주요 기능**

### ✨ **메인 페이지 (Main Page)**  
- 양식장 **등록/수정/삭제** 기능 구현  
- 실시간 관측소 데이터 **모니터링** 및 **경고 알림** 제공  
- 실시간 뉴스 및 관측소별 데이터 시각화 기능  

---

### 📋 **내 양식장 페이지 (My Page)**  
- 센서 **등록/수정/삭제** 기능 구현  
- 양식장 위치 정보(위도, 경도) 및 센서 데이터 관리  
- 실시간 센서 데이터 **모니터링** 및 경고 알림 제공  

---

### 🗺️ **양식장 추가 페이지 (Register Page)**  
- Kakao Map Open API를 이용하여 양식장 위치 지정 기능 구현  

---

### 📡 **실시간 데이터 크롤링 (Live Data Crawling)**  
- **네이버 뉴스** 크롤링 및 DB 연동  
- **네이버 날씨** 크롤링 및 DB 연동  
- 과거 수온 데이터 크롤링 및 DB 연동  

---

### 🤖 **모델링 (Modeling)**  
- **Bidirectional GRU**를 이용한 AI 모델 생성  
- DB 최신 데이터를 이용한 예측 데이터 생성  
- **FastAPI**를 이용한 REST API 구현  

---

## 🔔 **사용자 맞춤 알림**  
- 설정 조건에 따라 즉시 **푸시 알림** 발송  
- 사용자별 알림 **설정 및 관리** 가능  

---

## 🛠️ **기술 스택**

<div align="center">
  
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)
![MariaDB](https://img.shields.io/badge/MariaDB-003545?style=for-the-badge&logo=mariadb&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![TensorFlow](https://img.shields.io/badge/TensorFlow-FF6F00?style=for-the-badge&logo=tensorflow&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)

</div>

---

## 🗓️ **프로젝트 일정**  
📅 **6주간의 프로젝트 로드맵!**

| 주차  | 주요 작업 내용                        |
|-------|----------------------------------------|
| 1주차 | 프로젝트 기획 및 요구사항 분석          |
| 2주차 | 데이터베이스 설계 및 백엔드 API 개발    |
| 3주차 | 프론트엔드 개발 및 UI 디자인           |
| 4주차 | AI 모델 개발 및 통합                   |
| 5주차 | 테스트 및 디버깅                       |
| 6주차 | 시연 및 사용자 피드백 수집             |

---

## 🛠️ **트러블슈팅**

### 🛑 **문제:** CORS 이슈 발생  
**상황:** 프론트엔드와 백엔드 간 통신 시 CORS 에러 발생  
**해결:** Spring Boot에서 특정 포트 접근을 허용하는 CORS 설정 추가  

### 🛑 **문제:** 가독성 저하 이슈 발생  
**상황:** 비동기 요청 누적으로 인한 코드 누적 및 가독성 저하  
**해결:** 비동기 요청 관리를 위한 API 분리 및 기능별 정리  

### 🛑 **문제:** 문제 추적 난항 이슈 발생  
**상황:** 무분별한 로드 함수 분포로 인한 문제 부분 추적 난항  
**해결:** 데이터 전체 관리를 위한 Loading 컴포넌트 구현  

---

## 📸 **시연 화면**

<div align="center">
<img src="https://github.com/JihanCoding/SmartFarm/blob/main/focusm.gif?raw=true" alt="시연 화면" width="500" />
</div>

---

## 📚 **참고 자료**

- [강찬수, 『생산량 세계 3위 완도 양식장···NASA가 께낸 뜻밖의 한국전통』, 중앙일보, 2021년 4월 24일](https://www.joongang.co.kr/article/24042630)
- [서승식, 『해양 오염에 기후 변화···김 양식도 바다 아닌 육상에서』, KBS 뉴스, 2024년 9월 16일](https://news.kbs.co.kr/news/pc/view/view.do?ncd=8060660)
- [노승운, 『육상에서 자라는 김, 전복이 이끈다』, 시사우리신문, 2025년 1월 13일](https://www.urinews.co.kr/82066)
- [김경록, 『완도 바다에 짝 깔린 보물···정부도 "배우고 싶다"』, YTN자막뉴스](https://www.youtube.com/watch?v=dxkrA347E8M)
- [국립해양조사원 바다누리 해양정보 서비스](http://www.khoa.go.kr/oceangrid/khoa/intro.do)
- [국립수산과학원 실시간 해양수산환경 관측시스템](https://www.nifs.go.kr/risa/pastRisalnfoDown.risa)
- [신용식 교수님 자문자료 전남시그랜트센터](http://www.honamsg.org/)

---

> "양식장의 미래는 스마트 관리에 달려 있습니다. 김 양식 산업의 새로운 가능성을 함께 만들어 갑시다!" 🌟
