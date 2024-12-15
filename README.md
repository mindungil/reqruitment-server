# Recruitment Server

## 프로젝트 소개

**Recruitment Server**는 구인구직 플랫폼의 백엔드 서버로, 구직자와 채용 공고를 연결하는 다양한 기능을 제공합니다. 이 프로젝트는 MVC를 기반으로 하여, Node.js(Express.js)로 개발되었으며, MongoDB와 Redis를 데이터베이스로 활용합니다.  
또한 JWT 기반 인증 시스템과 Swagger를 이용한 API 문서화를 통해 보안성과 사용성을 강화하였습니다.  

### 주요 특징
- **사람인 웹 크롤링**:  
  사람인 사이트에서 채용 공고와 회사 정보를 크롤링하여 데이터를 수집하고 저장했습니다.
- **웹 크롤링 이해 및 적용**:
  - 사람인에서 채용 공고 데이터를 크롤링하여 수집.
  - 데이터를 NoSQL(MongoDB, redis)로 구조화하여 저장.
- **REST API 개발**:
  - 수집한 데이터를 기반으로 다양한 기능의 API를 개발.
  - 회원 인증 및 권한 부여 기능 구현.
- **문서화 및 인증**:
  - Swagger를 이용한 API 문서화.
  - JWT 기반 인증 시스템 적용.

---

## 프로젝트 특징 및 기능

### 주요 기능
1. **회원 관리**  
   - 회원 가입 및 로그인
   - JWT를 이용한 인증 및 권한 관리 (토큰 관리)
   - 회원 정보 수정 및 비밀번호 변경
   - 로그인 로그 기록

2. **채용 공고 관리**  
   - 공고 목록 조회 및 상세 정보 제공
   - 공고 등록 기능 제공
   - 검색 및 필터링(지역, 경력, 기술 스택 등)
   - 관련 공고 추천

3. **지원 관리**  
   - 채용 공고에 지원하기
   - 지원 이력 관리 및 상태 업데이트
   - 지원 취소 및 상세 내역 확인

4. **북마크 관리**  
   - 채용 공고 북마크 사용자별 추가/제거 (토글 처리)
   - 북마크 목록 관리, 페이지네이션 및 필터링

---

## 기술 스택

[![stackticon](https://firebasestorage.googleapis.com/v0/b/stackticon-81399.appspot.com/o/images%2F1733896332435?alt=media&token=7b9ad24c-a468-4d6e-8832-bd1ab3bbee1d)](https://github.com/msdio/stackticon)

### **Backend**
- Node.js, Express.js  
- MongoDB, Redis  

### **Authentication**
- JWT (Access/Refresh Token 기반 인증)  

### **API Documentation**
- Swagger  

### **웹 크롤링**
- Python
- BeautifulSoup, Requests (requirement.txt에 명시)

---

## API 엔드포인트 목록

### 1. 공고 지원
- **URL**: `/applications`
- **메서드**: `POST`
- **설명**: 사용자가 특정 공고에 지원합니다.
- **요청**: `application/json` 형식의 지원 정보
- **응답**
  - `200`: 공고 지원 성공
  - `402`, `403`, `404`, `500`: 다양한 오류 코드와 메시지 반환

### 2. 지원 내역 조회
- **URL**: `/applications`
- **메서드**: `GET`
- **설명**: 지원자의 지원 내역을 조회합니다.
- **쿼리 파라미터**
  - `user`: 지원자 이름 검색
  - `status`: 지원 상태 검색 (접수, 진행, 완료)
  - `sort`: 지원 날짜 기준 정렬 (`asc` 또는 `desc`)
- **응답**
  - `200`: 지원 내역 조회 성공
  - `500`: 서버 오류

### 3. 지원 내역 취소
- **URL**: `/applications/{id}`
- **메서드**: `DELETE`
- **설명**: 특정 지원 ID에 대한 지원 내역을 취소합니다.
- **파라미터**
  - `id`: 취소할 지원 내역의 ID
- **응답**
  - `200`: 지원 취소 성공
  - `400`, `404`, `500`: 다양한 오류 코드와 메시지 반환

### 4. 회사별 지원 횟수 조회
- **URL**: `/applications/count`
- **메서드**: `GET`
- **설명**: 특정 회사의 지원 횟수를 조회합니다.
- **쿼리 파라미터**
  - `company`: 조회하려는 회사 이름
- **응답**
  - `200`: 지원 횟수 조회 성공
  - `404`, `500`: 다양한 오류 코드와 메시지 반환

### 5. 사용자 로그인
- **URL**: `/auth/login`
- **메서드**: `POST`
- **설명**: 사용자가 이메일과 비밀번호를 사용해 로그인하고, Access Token 및 Refresh Token을 발급받습니다.
- **요청**: `application/json` 형식의 로그인 정보
- **응답**
  - `200`: 로그인 성공
  - `400`: 입력 오류 또는 인증 실패
  - `500`: 서버 오류

### 6. 사용자 회원가입
- **URL**: `/auth/register`
- **메서드**: `POST`
- **설명**: 사용자 정보를 입력받아 새로운 계정을 생성합니다.
- **요청**: `application/json` 형식의 사용자 정보
- **응답**
  - `201`: 회원가입 성공
  - `400`: 필드 누락 또는 이메일 중복
  - `500`: 서버 오류

### 7. 사용자 로그아웃
- **URL**: `/auth/logout`
- **메서드**: `POST`
- **설명**: Refresh Token을 삭제하여 사용자를 로그아웃 처리합니다.
- **요청**: `application/json` 형식의 사용자 정보
- **응답**
  - `200`: 로그아웃 성공
  - `500`: 서버 오류

### 8. 사용자 프로필 업데이트
- **URL**: `/auth/profile`
- **메서드**: `PUT`
- **설명**: Access Token 인증 후 사용자의 프로필 정보를 업데이트합니다.
- **요청**: `application/json` 형식의 업데이트 정보
- **응답**
  - `200`: 업데이트 성공
  - `403`: 인증 실패 또는 권한 없음
  - `404`: 요청 데이터 누락
  - `500`: 서버 오류

### 9. Access Token 재발급
- **URL**: `/auth/refresh`
- **메서드**: `POST`
- **설명**: Refresh Token을 사용해 새로운 Access Token을 발급받습니다.
- **요청**: `application/json` 형식의 사용자 이메일 및 Refresh Token
- **응답**
  - `200`: Access Token 발급 성공
  - `403`: Refresh Token이 유효하지 않음
  - `500`: 서버 오류

### 10. 사용자 프로필 조회
- **URL**: `/auth/profile`
- **메서드**: `GET`
- **설명**: Access Token 인증 후 사용자의 프로필 정보를 조회합니다.
- **요청**: 이메일 및 Access Token
- **응답**
  - `200`: 프로필 조회 성공
  - `403`: 인증 실패 또는 정보 없음
  - `500`: 서버 오류

### 11. 회원 탈퇴
- **URL**: `/auth/resign`
- **메서드**: `POST`
- **설명**: 사용자의 이메일과 비밀번호를 받아 회원 정보를 삭제합니다.
- **요청**: `application/json` 형식의 사용자 정보
- **응답**
  - `200`: 회원 탈퇴 성공
  - `403`: 잘못된 이메일 또는 비밀번호
  - `500`: 서버 오류

### 12. 북마크 저장 또는 삭제
- **URL**: `/bookmarks`
- **메서드**: `POST`
- **설명**: 사용자가 특정 공고를 북마크에 저장하거나 삭제합니다.
- **요청**: `application/json` 형식의 공고 ID 및 사용자 정보보
- **응답**
  - `200`: 북마크 저장 또는 삭제 성공
  - `404`: 잘못된 공고 ID
  - `500`: 서버 오류

### 13. 북마크 조회
- **URL**: `/bookmarks`
- **메서드**: `GET`
- **설명**: 특정 사용자의 북마크 목록을 조회합니다.
- **요청**: 사용자 정보 및 페이지네이션 쿼리 파라미터터
- **응답**
  - `200`: 북마크 조회 성공
  - `404`: 유저 정보 없음
  - `500`: 서버 오류

### 14. 채용 공고 목록 조회

- **URL**: `/jobs/getjobs`
- **메서드**: `GET`
- **설명**: 다양한 조건으로 채용 공고 목록을 조회합니다.
- **요청**: 페이지네이션 정보 및 검색 조건 쿼리 파라미터
- **응답**
  - `200`: 성공적으로 공고 목록을 조회함
  - `500`: 서버 오류

### 15. 특정 채용 공고 조회

- **URL**: `/jobs/getjobs/{id}`
- **메서드**: `GET`
- **설명**: 주어진 공고 ID에 해당하는 상세 정보를 반환합니다.
- **요청**: 조회할 공고 ID
- **응답**
  - `200`: 성공적으로 공고 상세 정보를 반환함
  - `400`: 유효하지 않은 공고 ID
  - `404`: 해당 공고를 찾을 수 없음
  - `500`: 서버 오류

### 16. 새 채용 공고 추가
- **URL**: `/jobs/insertjobs`
- **메서드**: `POST`
- **설명**: 새로운 채용 공고를 추가합니다.
- **요청**: `application/json` 형식의 공고 데이터
- **응답**
  - `200`: 성공적으로 공고를 추가함
  - `403`: 중복된 공고가 존재함
  - `500`: 서버 오류

### 17. 채용 공고 삭제
- **URL**: `/jobs/deletejobs`
- **메서드**: `POST`
- **설명**: 주어진 공고 이름을 기준으로 채용 공고를 삭제합니다.
- **요청**: `application/json` 형식의 공고 제목 데이터
- **응답**
  - `200`: 성공적으로 공고를 삭제함
  - `403`: 삭제하려는 공고를 찾을 수 없음
  - `500`: 서버 오류

#### 18. 채용 공고 업데이트
- **URL**: `/jobs/updatejobs`
- **메서드**: `POST`
- **설명**: 주어진 데이터를 기반으로 채용 공고를 업데이트합니다.
- **요청**: `application/json` 형식의 공고 데이터 및 ID
- **응답**
  - `200`: 성공적으로 공고 데이터를 업데이트함
  - `400`: 유효하지 않은 요청
  - `404`: 공고를 찾을 수 없음
  - `500`: 서버 오류

---

## 폴더 구조
```
📦src
 ┣ 📂config
 ┃ ┣ 📜mongodb.js
 ┃ ┗ 📜redis.js
 ┣ 📂controler
 ┃ ┣ 📜applicationControler.js
 ┃ ┣ 📜authControler.js
 ┃ ┣ 📜bookmarkControler.js
 ┃ ┣ 📜jobControler.js
 ┃ ┣ 📜tokenControler.js
 ┃ ┗ 📜userControler.js
 ┣ 📂middlewares
 ┃ ┗ 📜tokenMiddleware.js
 ┣ 📂models
 ┃ ┣ 📜applicationModel.js
 ┃ ┣ 📜companys.js
 ┃ ┣ 📜favoriteModel.js
 ┃ ┣ 📜jobOpenings.js
 ┃ ┣ 📜redisCountModel.js
 ┃ ┣ 📜reviewModel.js
 ┃ ┣ 📜tokenModel.js
 ┃ ┣ 📜userLogModel.js
 ┃ ┗ 📜userModel.js
 ┣ 📂routes
 ┃ ┣ 📜applicationRouter.js
 ┃ ┣ 📜authRouter.js
 ┃ ┣ 📜bookmarkRouter.js
 ┃ ┗ 📜jobRouter.js
 ┣ 📂swagger
 ┃ ┗ 📜config.js
 ┣ 📜app.js
```
---
## 설치 및 실행 가이드

### 1. 프로젝트 클론 및 의존성 설치
```bash
# 프로젝트 클론
git clone https://github.com/your-repo/recruitment-server.git

# 프로젝트 폴더로 이동
cd recruitment-server

# Node.js 의존성 설치
npm install

# Python 의존성 설치
pip install -r requirement.txt
```
### 2. 크롤링 코드 실행 방법
1. Python 의존성 설치 후 crawlerjobOpening.py, crawlerCompany.py 실행
2. dataEdit.py를 실행하여 크롤링 한 데이터 정제
3. crawler/crawlingData 경로에에 jobData.scv, saraminCrawlingCompany.csv 생성 확인인

### 3. 크롤링 데이터 DB 연동
- **jobData.csv**: src/models/jobOpenings.js 실행
- **saraminCrawlingCompany.csv**: src/models/companys.js 실행

***크롤링 코드와 DB 저장 코드가 별개의 로직으로 구분!!***

### 4. 환경변수 설정
***프로젝트 루트에 .env 생성***
- **JWT_SECRET**: Access 토큰 검증 키
- **JWT_REFRESH_SECRET**: Refresh 토큰 검증 키
- **PORT**: 백엔드 서버를 생성할 포트
- **SWAGGER_PORT**: swagger가 생성될 주소

### 4. API 문서 확인
Swagger를 통해 API 문서를 확인할 수 있습니다:  
`http://<server-host>:<port>/api-docs`
---

## 커밋 가이드
- **Feat**: 새로운 기능 추가  
- **Fix**: 버그 수정  
- **Style**: 코드 포맷팅  
- **Refactor**: 코드 리팩토링  
- **Docs**: 문서 수정  
- **Chore**: 빌드, 패키지 작업 등  

### Git Flow 전략
- **main**: 최종 브랜치  
- **develop**: 개발 브랜치
- **feature**: 기능 단위 개발 브랜치  

---

## 기여 가이드라인

이 프로젝트에 기여하고 싶으신가요? 환영합니다! 아래 단계를 따라주세요:
1. 프로젝트를 Fork하고 로컬에 클론하세요.
2. 새로운 브랜치를 생성하세요:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. 변경 사항을 커밋하세요.
4. 원경 저장소에 푸시하세요.
    ```bash
    git push origin faeture/your-feature-name
    ```
5. PR(Pull Request)를 생성하세요.

## 문의

문의 사항이 있으시면 아래 이메일로 연락주세요.
**Email : alswnsrlf12@naver.com**
