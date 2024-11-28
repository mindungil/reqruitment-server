import requests
from bs4 import BeautifulSoup
import pandas as pd
import time
import os

def crawl_saramin_company(keyword, pages=1, max_retries=3):
    """_summary_

    사람인의 기업 정보 크롤링
    """
    
    companys = []
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
    
    for page in range(1, pages + 1):
        url = f"https://www.saramin.co.kr/zf_user/company-review/company-search?page={page}&recruitCheck=&order=favor&searchWord={keyword}&reviewTags=&revenue=&salary=&employees=&operatingRevenue=&startingSalary=&establishment=&netRevenue=&order=favor&service_comment="
        
        retry = 0
        while retry < max_retries: # 기본값 3회 까지 재시도 -> 재시도 로직 구현
            try:
                response = requests.get(url, headers=headers)
                response.raise_for_status()
                soup = BeautifulSoup(response.text, 'html.parser')

                # 채용공고 목록 가져오기
                company_listings = soup.select('.company_info')

                for company in company_listings:
                    try:
                        name = company.select_one('.title a').text.strip()
                        recruiting = company.select_one('.title .link_employ').text.strip()
                        information = company.select_one('.text_info').text.strip()
                        detail = company.select_one('.title list').text.strip()
                        
                        companys.append({
                            '회사명': name,
                            '현재채용': recruiting,
                            '기업정보': information,
                            '세부정보': detail
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
            
    
    return pd.DataFrame(companys)

# 사용 예시
if __name__ == "__main__":
    # '채용 모집' 키워드로 4페이지 크롤링
    df = crawl_saramin_company('주', pages=20)

    print(df)
    df.to_csv(os.path.join(os.getcwd(), "crawler","crawlingData", 'saraminCrawlingCompany.csv'), index=False)