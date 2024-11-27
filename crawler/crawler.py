import requests
from bs4 import BeautifulSoup
import pandas as pd
import time


def crawl_saramin(keyword, pages=1, max_retries=3):
    """
    사람인 채용공고를 크롤링하는 함수

    Args:
        keyword (str): 검색할 키워드
        pages (int): 크롤링할 페이지 수
        max_retries (int): 요청 실패 시 재시도 횟수

    Returns:
        DataFrame: 채용공고 정보가 담긴 데이터프레임
    """

    jobs = []
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }

    for page in range(1, pages + 1):
        url = f"https://www.saramin.co.kr/zf_user/search/recruit?searchType=search&searchword={keyword}&recruitPage={page}&recruitSort=relation&recruitPageCount=100"

        retry = 0
        while retry < max_retries: # 기본값 3회 까지 재시도 -> 재시도 로직 구현
            try:
                response = requests.get(url, headers=headers)
                response.raise_for_status()
                soup = BeautifulSoup(response.text, 'html.parser')

                # 채용공고 목록 가져오기
                job_listings = soup.select('.item_recruit')

                for job in job_listings:
                    try:
                        # 회사명
                        company = job.select_one('.corp_name a').text.strip()

                        # 채용 제목
                        title = job.select_one('.job_tit a').text.strip()

                        # 채용 링크
                        link = 'https://www.saramin.co.kr' + job.select_one('.job_tit a')['href']

                        # 지역, 경력, 학력, 고용형태
                        conditions = job.select('.job_condition span')
                        location = conditions[0].text.strip() if len(conditions) > 0 else ''
                        experience = conditions[1].text.strip() if len(conditions) > 1 else ''
                        education = conditions[2].text.strip() if len(conditions) > 2 else ''
                        employment_type = conditions[3].text.strip() if len(conditions) > 3 else ''

                        # 마감일
                        deadline = job.select_one('.job_date .date').text.strip()

                        # 직무 분야
                        job_sector = job.select_one('.job_sector')
                        sector = job_sector.text.strip() if job_sector else ''

                        # 기타 정보 (배지)
                        other_badge = job.select_one('.area_badge .badge')
                        badge = other_badge.text.strip() if other_badge else ''

                        jobs.append({
                            '회사명': company,
                            '제목': title,
                            '링크': link,
                            '지역': location,
                            '경력': experience,
                            '학력': education,
                            '고용형태': employment_type,
                            '마감일': deadline,
                            '직무분야': sector,
                            '기타정보': badge
                        })

                    except AttributeError as e:
                        print(f"항목 파싱 중 에러 발생: {e}")
                        continue

                print(f"{page}페이지 크롤링 완료")
                time.sleep(3)  # 서버 부하 방지를 위한 딜레이
                break  # 성공적으로 처리되었으므로 재시도 루프 종료

            except requests.RequestException as e:
                retry += 1
                print(f"페이지 요청 중 에러 발생: {e}")
                print(f"재시도 {retry}/{max_retries}회")
                time.sleep(5)  # 재시도 전에 딜레이 추가

        if retry == max_retries:
            print(f"{page}페이지 요청이 {max_retries}회 실패하여 건너뜁니다.")

    return pd.DataFrame(jobs)


# 사용 예시
if __name__ == "__main__":
    # '채용 모집' 키워드로 4페이지 크롤링
    df = crawl_saramin('채용 모집', pages=5)

    print(df)
    df.to_csv('./saramin_crawling.csv', index=False)
