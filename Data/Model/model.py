# =============================================================================
# 1. 필요한 라이브러리 임포트
# =============================================================================
import pandas as pd
import numpy as np
from sklearn.preprocessing import MinMaxScaler
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import GRU, Dense, Dropout, Bidirectional
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.losses import Huber
from tensorflow.keras.callbacks import EarlyStopping
import tensorflow as tf
import random
import os
import joblib

# =============================================================================
# 2. 재현성을 위한 시드 고정
# =============================================================================
seed_value = 42
np.random.seed(seed_value)
random.seed(seed_value)
tf.random.set_seed(seed_value)
os.environ['PYTHONHASHSEED'] = str(seed_value)

# =============================================================================
# 3. 데이터 불러오기 및 전처리
# =============================================================================
data = pd.read_csv('../env.csv', encoding='euc-kr')
data = data.drop(columns=['op_name', 'Unnamed: 7'])
data['observed_at'] = pd.to_datetime(data['observed_at'])
data = data.sort_values('observed_at').reset_index(drop=True)

# 계절 및 주기적 피처 추가
data['month'] = data['observed_at'].dt.month
data['day_of_year'] = data['observed_at'].dt.dayofyear
data['year'] = data['observed_at'].dt.year

def assign_season(month):
    if month in [12, 1, 2]:
        return 'winter'
    elif month in [3, 4, 5]:
        return 'spring'
    elif month in [6, 7, 8]:
        return 'summer'
    else:
        return 'fall'

data['season'] = data['month'].apply(assign_season)
data = pd.get_dummies(data, columns=['season'])

data['sin_month'] = np.sin(2 * np.pi * data['month'] / 12)
data['cos_month'] = np.cos(2 * np.pi * data['month'] / 12)
data['sin_day'] = np.sin(2 * np.pi * data['day_of_year'] / 365)
data['cos_day'] = np.cos(2 * np.pi * data['day_of_year'] / 365)

data = data.dropna()
data = data.drop(columns=['observed_at'])

# =============================================================================
# 4. 피처와 타겟 컬럼 설정 및 재정렬
# =============================================================================
features = [
    'month', 'day_of_year', 'sin_month', 'cos_month', 
    'sin_day', 'cos_day', 'season_fall', 'season_spring', 
    'season_summer', 'season_winter'
]
# 여기서는 avg_temp 단일 변수를 타겟으로 사용
targets = ['avg_temp']

data = data[features + targets]

# =============================================================================
# 5. 데이터 분할 (70% train, 30% test)
# =============================================================================
train_size = int(len(data) * 0.7)
train_df = data.iloc[:train_size].copy()
test_df  = data.iloc[train_size:].copy()

# =============================================================================
# 6. 스케일링 적용 (학습 시 fit, test 시 transform)
# =============================================================================
scaler = MinMaxScaler()
train_df[features + targets] = scaler.fit_transform(train_df[features + targets].astype(float))
test_df[features + targets]  = scaler.transform(test_df[features + targets].astype(float))
joblib.dump(scaler, 'scaler.pkl')  # 배포 시 동일한 스케일러 사용

# =============================================================================
# 7. 시퀀스 생성 함수 (다단계 예측: forecast_horizon일치 타겟)
# =============================================================================
forecast_horizon = 30  # 앞으로 30일 예측

def create_sequences(data_array, sequence_length, forecast_horizon):
    sequences = []
    target_sequences = []
    for i in range(len(data_array) - sequence_length - forecast_horizon + 1):
        seq = data_array[i:i+sequence_length, :len(features)]
        target_seq = data_array[i+sequence_length:i+sequence_length+forecast_horizon, len(features)]
        sequences.append(seq)
        target_sequences.append(target_seq)
    return np.array(sequences, dtype=np.float32), np.array(target_sequences, dtype=np.float32)

sequence_length = 180  # 예: 180일의 시퀀스 사용

train_sequences, train_targets = create_sequences(train_df.values, sequence_length, forecast_horizon)
test_sequences, test_targets   = create_sequences(test_df.values, sequence_length, forecast_horizon)

# =============================================================================
# 8. 모델 구성 및 학습 (Direct Multi-step Forecasting)
# =============================================================================
model = Sequential()
model.add(Bidirectional(GRU(128, activation='tanh', return_sequences=True),
                        input_shape=(sequence_length, len(features))))
model.add(Dropout(0.1))
model.add(GRU(128, activation='tanh'))
model.add(Dropout(0.1))
model.add(Dense(forecast_horizon))  # forecast_horizon일치 예측

model.compile(optimizer=Adam(learning_rate=0.0005), loss=Huber(delta=1.0))

early_stopping = EarlyStopping(monitor='val_loss', patience=7, restore_best_weights=True)

model.fit(train_sequences, train_targets,
          epochs=50,
          batch_size=64,
          validation_data=(test_sequences, test_targets),
          callbacks=[early_stopping])

# =============================================================================
# 9. 모델 저장 (.keras 형식)
# =============================================================================
model.save('model.keras')