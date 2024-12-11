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

## 폴더 구조

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
