from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
import pandas as pd
import numpy as np
from datetime import timedelta
from tensorflow.keras.models import load_model
import joblib
from sqlalchemy import create_engine
from fastapi.middleware.cors import CORSMiddleware
app = FastAPI()
# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # React 개발 서버 주소
    allow_credentials=True,
    allow_methods=["*"],                      # 모든 HTTP 메소드 허용 (GET, POST, PUT 등)
    allow_headers=["*"],                      # 모든 헤더 허용
)
# -----------------------------------------------------------------------------
# 1. 모델과 스케일러를 서버 시작 시 미리 로드
# -----------------------------------------------------------------------------
MODEL_PATH = './model.keras'  # 또는 배포 시 저장한 파일명을 사용하세요.
SCALER_PATH = './scaler.pkl'

try:
    model = load_model(MODEL_PATH)
except Exception as e:
    raise RuntimeError(f"모델 로드 실패: {e}")

try:
    scaler = joblib.load(SCALER_PATH)
except Exception as e:
    raise RuntimeError(f"스케일러 로드 실패: {e}")

# -----------------------------------------------------------------------------
# 2. MySQL DB 연결 설정 (환경변수 또는 직접 입력)
# -----------------------------------------------------------------------------
DB_HOST = 'project-db-cgi.smhrd.com'
DB_PORT = 3307
DB_USER = 'mp_24K_DCX13_p3_3'
DB_PASSWORD = 'smhrd3'
DB_NAME = 'mp_24K_DCX13_p3_3'
TABLE_NAME  = 'tb_env_data'

db_url = f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
try:
    engine = create_engine(db_url)
except Exception as e:
    raise RuntimeError(f"DB 연결 실패: {e}")

# -----------------------------------------------------------------------------
# 3. 예측 API 엔드포인트 (/forecast)
# -----------------------------------------------------------------------------
@app.get("/forecast")
def forecast():
    # 3-1. DB에서 데이터 로드 (예시: 전체 데이터 조회)
    try:
        query = f"SELECT * FROM {TABLE_NAME}"
        data_new = pd.read_sql(query, engine)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"DB 데이터 로드 실패: {e}")

    # 3-2. 데이터 전처리
    # CSV 파일과 동일한 전처리 수행 (불필요한 컬럼 제거, 날짜 형변환, 정렬 등)
    try:
        # 불필요한 컬럼 제거 (컬럼명이 없으면 pass)
        data_new = data_new.drop(columns=['op_name'], errors='ignore')
        data_new['observed_at'] = pd.to_datetime(data_new['observed_at'])
        data_new = data_new.sort_values('observed_at').reset_index(drop=True)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"전처리 오류: {e}")

    # 예측 날짜 생성을 위해 마지막 관측 날짜 보존
    date_series = data_new['observed_at'].copy()
    last_date = date_series.iloc[-1]

    # 계절성 및 주기적 피처 생성
    data_new['month'] = data_new['observed_at'].dt.month
    data_new['day_of_year'] = data_new['observed_at'].dt.dayofyear
    data_new['year'] = data_new['observed_at'].dt.year

    def assign_season(month):
        if month in [12, 1, 2]:
            return 'winter'
        elif month in [3, 4, 5]:
            return 'spring'
        elif month in [6, 7, 8]:
            return 'summer'
        else:
            return 'fall'

    data_new['season'] = data_new['month'].apply(assign_season)
    data_new = pd.get_dummies(data_new, columns=['season'])

    # 만약 특정 계절 더미컬럼이 누락되었다면 0으로 채움 (모델 학습 시 사용한 컬럼과 동일하게)
    for col in ['season_fall', 'season_spring', 'season_summer', 'season_winter']:
        if col not in data_new.columns:
            data_new[col] = 0

    data_new['sin_month'] = np.sin(2 * np.pi * data_new['month'] / 12)
    data_new['cos_month'] = np.cos(2 * np.pi * data_new['month'] / 12)
    data_new['sin_day'] = np.sin(2 * np.pi * data_new['day_of_year'] / 365)
    data_new['cos_day'] = np.cos(2 * np.pi * data_new['day_of_year'] / 365)

    # 예측에 사용하지 않는 observed_at 컬럼 제거
    data_new = data_new.drop(columns=['observed_at'])

    # 3-3. 피처 및 타겟 컬럼 재정렬 (모델 학습 시 사용한 순서와 동일해야 함)
    features = [
        'month', 'day_of_year', 'sin_month', 'cos_month',
        'sin_day', 'cos_day', 'season_fall', 'season_spring',
        'season_summer', 'season_winter'
    ]
    targets = ['avg_temp']
    data_new = data_new[features + targets]

    # 3-4. 저장된 scaler를 사용하여 데이터 스케일링
    try:
        data_scaled = scaler.transform(data_new.astype(float))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"스케일링 오류: {e}")

    # 3-5. 입력 시퀀스 생성 (예: 마지막 180일의 데이터 사용)
    sequence_length = 180
    forecast_horizon = 30

    if data_scaled.shape[0] < sequence_length:
        raise HTTPException(status_code=400, detail="예측에 필요한 데이터가 부족합니다.")

    # 타겟 컬럼은 제외하고 피처만 사용 (스케일된 데이터에서 앞쪽 len(features)열)
    input_seq = data_scaled[-sequence_length:, :len(features)]
    input_seq = input_seq.reshape(1, sequence_length, len(features))

    # 3-6. 모델 예측 (향후 30일치)
    try:
        predicted_scaled = model.predict(input_seq)  # shape: (1, 30)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"예측 오류: {e}")

    # 3-7. 예측값을 역변환하여 원래 단위로 복원
    predicted_original = []
    for i in range(forecast_horizon):
        dummy = np.zeros((1, len(features) + 1))
        dummy[0, -1] = predicted_scaled[0, i]
        inv = scaler.inverse_transform(dummy)[0, -1]
        predicted_original.append(inv)

    # 3-8. 향후 30일 날짜 생성
    future_dates = pd.date_range(start=last_date + timedelta(days=1), periods=forecast_horizon, freq='D')

    # 3-9. JSON 형태의 결과 구성
    forecast_list = []
    for date, temp in zip(future_dates, predicted_original):
        forecast_list.append({
            "date": date.strftime("%Y-%m-%d"),
            "temp": round(temp, 1)
        })

    return JSONResponse(content={"forecast": forecast_list})