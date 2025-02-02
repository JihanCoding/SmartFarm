import subprocess
import sys
import pymysql
from selenium import webdriver as wb
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.common.exceptions import TimeoutException, WebDriverException, NoSuchElementException
from webdriver_manager.chrome import ChromeDriverManager
from bs4 import BeautifulSoup as bs
import re
import time
import pandas as pd

# MariaDB 연결 정보 설정
DB_HOST = 'project-db-cgi.smhrd.com'
DB_PORT = 3307
DB_USER = 'mp_24K_DCX13_p3_3'
DB_PASSWORD = 'smhrd3'
DB_NAME = 'mp_24K_DCX13_p3_3'

# MariaDB 연결 함수
def connect_to_db():
    return pymysql.connect(
        host=DB_HOST,
        port=DB_PORT,
        user=DB_USER,
        password=DB_PASSWORD,
        database=DB_NAME,
        charset='utf8mb4',
        cursorclass=pymysql.cursors.DictCursor  # DictCursor 사용
    )

# 날씨 크롤링 함수
def crawl_weather():
    options = wb.ChromeOptions()
    options.add_argument('--headless')  # GUI 없이 실행
    options.add_argument('--no-sandbox')
    options.add_argument('--disable-dev-shm-usage')
    options.add_argument('--disable-gpu')
    options.add_argument('--disable-extensions')

    s = Service(ChromeDriverManager().install())

    try:
        driver = wb.Chrome(service=s, options=options)
        driver.set_page_load_timeout(30)  # 타임아웃 설정
        driver.get('https://search.naver.com/search.naver?sm=tab_hty.top&where=nexearch&ssc=tab.nx.all&query=완도+날씨')
        time.sleep(3)  # 페이지 로드 대기

        soup = bs(driver.page_source, 'lxml')

        # 날씨 데이터 크롤링
        wh_class = soup.select_one(
            '#main_pack .weather_info .weather_graphic .weather_main i'
        )
        wh_icon = f"https://ssl.pstatic.net/sstatic/keypage/outside/scui/weather_new_new/img/weather_svg_v2/icon_flat_{wh_class.get('class')[1].split('_')[1]}.svg" if wh_class else None

        def extract_number(text):
            match = re.search(r"[-+]?\d*\.\d+|\d+", text)
            return float(match.group()) if match else 0.0

        wh_curTp = extract_number(soup.select_one('.weather_graphic .temperature_text strong').text)
        wh_difTp = extract_number(soup.select_one('.temperature_info p').text)
        wh_flTp = extract_number(soup.select_one('.temperature_info dl div:nth-child(1)').text)
        wh_humid = extract_number(soup.select_one('.temperature_info dl div:nth-child(2)').text)
        wh_wdSp = extract_number(soup.select_one('.temperature_info dl div:nth-child(3)').text)

        driver.quit()

        weather = [{
            'wh_icon': wh_icon,
            'wh_curTp': wh_curTp,
            'wh_difTp': wh_difTp,
            'wh_flTp': wh_flTp,
            'wh_humid': wh_humid,
            'wh_wdSp': wh_wdSp
        }]

        return weather

    except (TimeoutException, WebDriverException, NoSuchElementException) as e:
        print(f"[ERROR] 크롤링 중 오류 발생: {e}")
        driver.quit()
        return []

# MariaDB에 데이터 삽입 (중복 검사 추가, 디버깅 메시지 강화)
def insert_weather_into_db(weather_data):
    connection = connect_to_db()
    try:
        with connection.cursor() as cursor:
            for weather in weather_data:
                # 중복 데이터 확인 쿼리
                sql_check = '''
                SELECT COUNT(*) AS count FROM tb_weather 
                WHERE wh_curTp = %s 
                  AND wh_humid = %s 
                  AND wh_wdSp = %s 
                  AND DATE(created_at) = CURDATE()
                '''
                cursor.execute(sql_check, (weather['wh_curTp'], weather['wh_humid'], weather['wh_wdSp']))
                result = cursor.fetchone()

                count = result['count'] if isinstance(result, dict) else result[0]  # 키 또는 인덱스로 처리

                if count == 0:  # 중복 데이터가 없는 경우에만 삽입
                    sql_insert = '''
                    INSERT INTO tb_weather 
                    (wh_icon, wh_curTp, wh_difTp, wh_flTp, wh_humid, wh_wdSp, created_at) 
                    VALUES (%s, %s, %s, %s, %s, %s, CURRENT_TIMESTAMP)
                    '''
                    cursor.execute(sql_insert, (
                        weather['wh_icon'],
                        weather['wh_curTp'],
                        weather['wh_difTp'],
                        weather['wh_flTp'],
                        weather['wh_humid'],
                        weather['wh_wdSp']
                    ))

                    print("=" * 80)
                    print(f"[DB INSERT] 테이블: tb_weather")
                    print(f"  - 현재 온도: {weather['wh_curTp']}°C")
                    print(f"  - 체감 온도: {weather['wh_flTp']}°C")
                    print(f"  - 습도: {weather['wh_humid']}%")
                    print(f"  - 풍속: {weather['wh_wdSp']} m/s")
                    print(f"  - 삽입 시간: {pd.Timestamp.now()}")
                    print("=" * 80)
                else:
                    print("=" * 80)
                    print(f"[DB SKIP] 중복된 날씨 데이터 존재 (테이블: tb_weather)")
                    print(f"  - 현재 온도: {weather['wh_curTp']}°C")
                    print(f"  - 체감 온도: {weather['wh_flTp']}°C")
                    print(f"  - 습도: {weather['wh_humid']}%")
                    print(f"  - 풍속: {weather['wh_wdSp']} m/s")
                    print(f"  - 중복 확인 시간: {pd.Timestamp.now()}")
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

# 실행 부분
if __name__ == "__main__":
    weather_list = crawl_weather()
    if weather_list:
        insert_weather_into_db(weather_list)
    else:
        print("[INFO] 새로운 날씨 데이터가 없습니다.")
