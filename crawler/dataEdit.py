import csv
import os

# 입력 파일과 출력 파일 경로 설정
input_file = os.path.join(os.getcwd() + "\crawler", 'saramin_crawling.csv')  # 입력 파일 이름
output_file = os.path.join(os.getcwd() + "\crawler", 'jobData.csv')

# "등록일"과 관련된 데이터를 떼어내는 함수
def extract_register_date(data):
    if "등록일" in data:
        parts = data.split("등록일")
        return parts[0].strip(), "등록일" + parts[1].strip() if len(parts) > 1 else ""
    if "수정일" in data:
        parts = data.split("수정일")
        return parts[0].strip(), "수정일" + parts[1].strip() if len(parts) > 1 else ""
    return data, ""

# "외"를 제거하는 함수
def extract_data(data):
    if ", 외" in data:
        return data
    if " 외" in data:
        return data.split(" 외")[0].strip()
    
    return data

# CSV 읽기 및 수정
with open(input_file, mode="r", encoding="utf-8") as infile, open(output_file, mode="w", encoding="utf-8", newline="") as outfile:
    reader = csv.reader(infile)
    writer = csv.writer(outfile)

    # 헤더 수정 (새로운 컬럼 추가)
    headers = next(reader)
    headers.append("갱신날짜")  # 새로운 컬럼 이름 추가
    writer.writerow(headers)

    # 각 행 처리
    for row in reader:
        if len(row) > 8:  # 데이터가 있는 열을 가정 (여기서는 9번째 열)
            original_data = row[8]  # 기존 데이터를 가져옵니다

            # "등록일" 또는 "수정일" 데이터 분리
            remaining_data, register_date = extract_register_date(original_data)

            # "외" 제거 처리
            clean_data = extract_data(remaining_data)

            # 기존 데이터 및 새로운 컬럼 업데이트
            row[8] = clean_data  # 수정된 데이터
            row.append(register_date)  # 새로운 열 추가

        writer.writerow(row)

print("데이터 처리가 완료되었습니다!")
