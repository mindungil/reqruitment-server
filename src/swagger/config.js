import swaggerJSDoc from 'swagger-jsdoc'

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Reqruitment-server', // 문서 제목
    version: '1.0.0', // 버전
    description: 'Reqruitment, Back-end server using saramin webcrawling', // 설명
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT"
      }
    },
    schemas: {
      Application: {
        type: "object",
        properties: {
          지원공고: {
            type: "string",
            example: "6747ff9777fcb5c0128d7573"
          },
          회사명: {
            type: "string",
            example: "(주)알레르망"
          },
          지원자: {
            type: "string",
            example: "길민준",
          },
          이메일: {
            type: "string",
            example: "user@example.com"
          },
          지원날짜: {
            type: "string",
            example: "2024-12-09",
          },
          지원상태: {
            type: "string",
            example: "접수",
          },
        },
      },
      Company: {
        type: "object",
        properties: {
          회사명: {
            type: "string",
            example: "무한상사",
          },
          채용중: {
            type: "Number",
            example: 3,
          },
          기업규모: {
            type: "string",
            example: "중견기업",
          },
          사업분야: {
            type: "string",
            example: "IT",
          },
          존속기간: {
            type: "string",
            example: "3개월",
          },
          CEO: {
            type: "string",
            example: "길민준",
          },
          세부정보: {
            type: "string",
            example: "자유로운 출근"
          },
        },
      },
      Favorite: {
        type: "object",
        properties: {
          공고명: {
            type: "string",
            example: "웹 개발자 모집",
          },
          등록자: {
            type: "string",
            example: "길민준",
          },
          등록날짜: {
            type: "string",
            example: "2024-12-09",
          },
        },
      },
      JobData: {
        type: "object",
        properties: {
          회사명: {
            type: "string",
            example: "무한상사",
          },
          제목: {
            type: "string",
            example: "백엔드 개발자 모집",
          },
          링크: {
            type: "string",
            format: "uri",
            example: "https://example.com/job-posting",
          },
          지역: {
            type: "string",
            example: "서울",
          },
          경력: {
            type: "string",
            example: "신입/경력",
          },
          학력: {
            type: "string",
            example: "대졸 이상",
          },
          고용형태: {
            type: "string",
            example: "정규직",
          },
          마감일: {
            type: "string",
            format: "date",
            example: "2024-12-31",
          },
          직무분야: {
            type: "string",
            example: "소프트웨어 개발",
          },
          기타정보: {
            type: "string",
            example: "팀원들과 자유롭게 소통하는 업무 환경",
          },
          갱신날짜: {
            type: "string",
            format: "date",
            example: "2024-12-09",
          },
        },
      },
      Review: {
        type: "object",
        properties: {
          회사: {
            type: "string",
            example: "무한상사",
          },
          작성자: {
            type: "string",
            example: "길민준",
          },
          평점: {
            type: "number",
            example: 4.5,
          },
          평가: {
            type: "string",
            example: "업무 환경이 매우 자유롭고 좋습니다.",
          },
          등록날짜: {
            type: "string",
            example: "2024-12-09",
          },
        },
      },
      User: {
        type: "object",
        properties: {
          이름: {
            type: "string",
            example: "길민준",
          },
          성별: {
            type: "string",
            example: "남성",
          },
          나이: {
            type: "number",
            example: 30,
          },
          경력: {
            type: "string",
            example: "5년",
          },
          이메일: {
            type: "string",
            example: "user@example.com",
          },
          거주지: {
            type: "string",
            example: "전북특별자치도 전주시",
          },
          비밀번호: {
            type: "string",
            format: "password",
            example: "password123",
          },
        },
      },
    },
  },
  servers: [
    { url: 'http://localhost:3000', description: 'Local Server' },
  ],
};

const options = {
  swaggerDefinition,
  apis: ['src/routes/*.js'], // JSDoc 주석이 포함된 파일 경로
};

const swaggerSpec =  swaggerJSDoc(options);

export default swaggerSpec;
