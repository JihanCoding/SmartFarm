import subprocess
import time
import logging
import os
from datetime import datetime
from threading import Thread

# 환경 변수 설정 (UTF-8 강제 적용)
os.environ["PYTHONIOENCODING"] = "utf-8"

# 실행할 스크립트 파일 경로
news_script_path = "./Crawling/news.py"
weather_script_path = "./Crawling/weather.py"
risa_script_path = "./Model/risa.py"

# 실행 주기 (초 단위)
news_interval = 1800  # 30분
weather_interval = 300  # 5분
risa_interval = 1800  # 30분

# 로그 설정 함수
def setup_logger(log_filename):
    logger = logging.getLogger(log_filename)
    logger.setLevel(logging.INFO)

    # 로그 포맷 설정
    formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')

    # 파일 핸들러 추가 (UTF-8 설정)
    file_handler = logging.FileHandler(log_filename, encoding='utf-8')
    file_handler.setFormatter(formatter)

    # 콘솔 핸들러 추가
    console_handler = logging.StreamHandler()
    console_handler.setFormatter(formatter)

    # 핸들러 추가 (중복 방지)
    if not logger.handlers:
        logger.addHandler(file_handler)
        logger.addHandler(console_handler)

    return logger

# 각각의 로거 설정
news_logger = setup_logger("news.log")
weather_logger = setup_logger("weather.log")
risa_logger = setup_logger("risa.log")

def run_script(script_path, logger, interval, script_name):
    while True:
        logger.info(f"{script_name} 스크립트를 실행합니다...")
        try:
            result = subprocess.run(
                ["python", script_path],
                capture_output=True,
                text=True,
                encoding="utf-8",  # 인코딩을 utf-8로 강제
                errors="replace"   # 디코딩 오류 발생 시 대체 문자 삽입
            )
            
            if result.stdout:
                logger.info(f"{script_name} 실행 완료. 결과:\n{result.stdout}")
            if result.stderr:
                logger.error(f"{script_name} 실행 중 오류 발생:\n{result.stderr}")

        except Exception as e:
            logger.error(f"{script_name} 스크립트 실행 중 예외 발생: {e}")

        logger.info(f"다음 실행까지 {interval // 60}분 대기 중...\n")
        time.sleep(interval)

if __name__ == "__main__":
    # 뉴스 크롤링 스크립트 실행 (30분마다)
    news_thread = Thread(target=run_script, args=(news_script_path, news_logger, news_interval, "뉴스"))
    news_thread.start()

    # 날씨 크롤링 스크립트 실행 (5분마다)
    weather_thread = Thread(target=run_script, args=(weather_script_path, weather_logger, weather_interval, "날씨"))
    weather_thread.start()

    # 실시간 데이터 스크립트 실행 (30분마다)
    risa_thread = Thread(target=run_script, args=(risa_script_path, risa_logger, risa_interval, "실시간 데이터"))
    risa_thread.start()

    # 모든 스레드가 종료될 때까지 대기
    news_thread.join()
    weather_thread.join()
    risa_thread.join()
