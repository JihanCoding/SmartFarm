import subprocess
import sys
import pymysql
from selenium import webdriver as wb
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.common.desired_capabilities import DesiredCapabilities
from selenium.webdriver.chrome.options import Options
from selenium.common.exceptions import TimeoutException, WebDriverException
from webdriver_manager.chrome import ChromeDriverManager
from bs4 import BeautifulSoup as bs
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

# 뉴스 크롤링 함수 (네이버 뉴스)
def crawl_news():
    options = wb.ChromeOptions()
    options.add_argument('--headless')  # GUI 없이 실행
    options.add_argument('--no-sandbox')
    options.add_argument('--disable-dev-shm-usage')
    options.add_argument('--disable-gpu')
    options.add_argument('--disable-extensions')
    options.add_argument('log-level=3')  # 로깅 최소화

    s = Service(ChromeDriverManager().install())
    
    try:
        driver = wb.Chrome(service=s, options=options)
        driver.set_page_load_timeout(30)  # 타임아웃 설정

        driver.get('https://search.naver.com/search.naver?where=news&query=%EA%B9%80%20%EC%96%91%EC%8B%9D&sm=tab_opt&sort=1&photo=0&field=0&pd=1&ds=2025.01.16&de=2025.01.23&docid=&related=0&mynews=0&office_type=0&office_section_code=0&news_office_checked=&nso=so%3Add%2Cp%3A1w&is_sug_officeid=0&office_category=0&service_area=0')
        time.sleep(2)  # 초기 로딩 대기

        # 스크롤 다운 (최대 50번 제한)
        max_scrolls = 50
        current_scroll = 0
        last_height = driver.execute_script('return document.body.scrollHeight')

        while current_scroll < max_scrolls:
            driver.find_element(By.TAG_NAME, 'body').send_keys(Keys.END)
            time.sleep(1)
            new_height = driver.execute_script('return document.body.scrollHeight')
            if last_height == new_height:
                break
            last_height = new_height
            current_scroll += 1

        soup = bs(driver.page_source, 'lxml')

        newstit = soup.select('div > div > div.news_contents > a.news_tit')
        newscon = soup.select('div > div > div.news_contents > div > div > a')
        newslink = soup.select('div > div > div.news_contents > a.dsc_thumb')
        newsimg = soup.select('div > div > div.news_contents > a.dsc_thumb > img')

        news = []

        for i in range(len(newslink)):
            news.append({
            'title' : newstit[i].text,
            'content' : newscon[i].text,
            'link' : newslink[i].get('href'),
            'img' : newsimg[i].get('src')
            })

        driver.quit()
        return news

    except (TimeoutException, WebDriverException) as e:
        print(f"[ERROR] 크롤링 중 오류 발생: {e}")
        driver.quit()
        return []

# MariaDB에 데이터 삽입 (중복 검사 추가, 디버깅 메시지 개선)
def insert_news_into_db(news_list):
    connection = connect_to_db()
    try:
        with connection.cursor() as cursor:
            for news in news_list:
                # 중복 데이터 확인 쿼리
                sql_check = """
                SELECT COUNT(*) AS count FROM tb_news WHERE news_title = %s
                """
                cursor.execute(sql_check, (news['title'],))
                result = cursor.fetchone()

                if result['count'] == 0:  # 중복되지 않을 경우에만 삽입
                    sql_insert = '''
                    INSERT INTO tb_news (news_title, news_content, news_url, news_file, created_at) 
                                     VALUES (%s, %s, %s, %s, CURRENT_TIMESTAMP)
                    '''
                    cursor.execute(sql_insert, (news['title'], news['content'], news['link'], news['img']))
                    
                    print("=" * 80)
                    print(f"[DB INSERT] 테이블: tb_news")
                    print(f"  - 뉴스 제목: {news['title']}")
                    print(f"  - 뉴스 링크: {news['link']}")
                    print(f"  - 삽입 시간: {pd.Timestamp.now()}")
                    print("=" * 80)
                else:
                    print("=" * 80)
                    print(f"[DB SKIP] 중복된 뉴스 발견 (테이블: tb_news)")
                    print(f"  - 뉴스 제목: {news['title']}")
                    print(f"  - 뉴스 링크: {news['link']}")
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

# 실행 부분
if __name__ == "__main__":
    news_list = crawl_news()
    if news_list:
        insert_news_into_db(news_list)
    else:
        print("[INFO] 새로운 뉴스 데이터가 없습니다.")
