import subprocess
import sys

# 필요한 패키지 목록
required_packages = [
    'pymysql',
    'requests',
    'pandas'
]

def install_packages(packages):
    """필요한 패키지를 확인하고 없으면 설치하는 함수"""
    for package in packages:
        try:
            __import__(package)
            print(f"'{package}' 패키지가 이미 설치되어 있습니다.")
        except ImportError:
            print(f"'{package}' 패키지가 없습니다. 설치를 진행합니다.")
            result = subprocess.run([sys.executable, "-m", "pip", "install", package], capture_output=True, text=True)
            if result.returncode == 0:
                print(f"'{package}' 패키지 설치 완료!")
            else:
                print(f"'{package}' 패키지 설치 실패! 오류 메시지: {result.stderr}")
                sys.exit(1)  # 설치 실패 시 프로그램 종료

# 패키지 설치 확인 및 설치 수행
install_packages(required_packages)

# 필요한 패키지 import (설치 후 진행)
import pymysql
import requests
import pandas as pd

# MariaDB 연결 정보 설정
DB_HOST = 'project-db-cgi.smhrd.com'
DB_PORT = 3307
DB_USER = 'mp_24K_DCX13_p3_3'
DB_PASSWORD = 'smhrd3'
DB_NAME = 'mp_24K_DCX13_p3_3'

# Open API 엔드포인트 및 키
API_URL = 'https://www.nifs.go.kr/bweb/OpenAPI_json'
API_KEY = 'risaList&key=qPwOeIrU-2412-OVTBYX-0974'

# MariaDB에 연결하는 함수
def connect_to_db():
    return pymysql.connect(
        host=DB_HOST,
        port=DB_PORT,
        user=DB_USER,
        password=DB_PASSWORD,
        database=DB_NAME,
        charset='utf8mb4',
        cursorclass=pymysql.cursors.DictCursor
    )

# Open API 데이터 가져오는 함수
def fetch_api_data():
    response = requests.get(f"{API_URL}?id={API_KEY}")
    if response.status_code == 200:
        data = response.json()
        unique_data = {}
        for item in data['body']['item']:
            unique_data[item['sta_nam_kor']] = item  # 중복 데이터 제거
        return list(unique_data.values())
    else:
        print("API 요청 실패:", response.status_code)
        return []
    
# MariaDB에 데이터 삽입 (중복 검사 추가, 디버깅 메시지 개선)
def insert_data_into_db(data_list):
    connection = connect_to_db()
    df = pd.DataFrame(data_list)
    df['datetime'] = pd.to_datetime(df['obs_dat'] + ' ' + df['obs_tim'])  # 관측일시 생성

    try:
        with connection.cursor() as cursor:
            for _, row in df.iterrows():
                # 중복 데이터 확인 쿼리
                sql_check = '''
                SELECT COUNT(*) AS count FROM tb_risa 
                WHERE op_name = %s AND observed_at = %s
                '''
                cursor.execute(sql_check, (row['sta_nam_kor'], row['datetime']))
                result = cursor.fetchone()
                
                count = result['count'] if isinstance(result, dict) else result[0]  # 키 또는 인덱스로 처리

                if count == 0:  # 중복 데이터가 없는 경우에만 삽입
                    sql_insert = '''
                    INSERT INTO tb_risa (op_name, observed_at, water_temp) 
                                     VALUES (%s, %s, %s)
                    '''
                    cursor.execute(sql_insert, (
                        row['sta_nam_kor'], row['datetime'], row['wtr_tmp']
                    ))
                    print("=" * 80)
                    print(f"[DB INSERT] 테이블: tb_risa")
                    print(f"  - 관측소: {row['sta_nam_kor']}")
                    print(f"  - 수온: {row['wtr_tmp']}°C")
                    print(f"  - 관측일시: {row['datetime']}")
                    print(f"  - 삽입 시간: {pd.Timestamp.now()}")
                    print("=" * 80)
                else:
                    print("=" * 80)
                    print(f"[DB SKIP] 중복된 데이터 존재 (테이블: tb_risa)")
                    print(f"  - 관측소: {row['sta_nam_kor']}")
                    print(f"  - 수온: {row['wtr_tmp']}°C")
                    print(f"  - 관측일시: {row['datetime']}")
                    print(f"  - 삽입 스킵 시간: {pd.Timestamp.now()}")
                    print("=" * 80)

        connection.commit()
    except pymysql.MySQLError as e:
        print("=" * 80)
        print(f"[ERROR] 데이터 삽입 중 오류 발생")
        print(f"  - 오류 메시지: {e}")
        print("=" * 80)
    finally:
        connection.close()
        print("[INFO] 데이터베이스 연결이 종료되었습니다.")


# 실행 부분 (한 번만 실행)
if __name__ == "__main__":
    data_list = fetch_api_data()
    if data_list:
        insert_data_into_db(data_list)
