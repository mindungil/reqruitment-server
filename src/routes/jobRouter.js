import express from 'express'
import { getJobs, insertJob, deleteJob, updateJob, getJobId, fullJobCount, getJobSearchCount } from '../controler/jobControler.js';
const jobRouter = express.Router();

/**
 * @swagger
 * /jobs/
 */
jobRouter.get('/getjobs', getJobs);
jobRouter.get('/getjobs/:id', getJobId);
jobRouter.post('/insertjobs', insertJob);
jobRouter.post('/updatejobs', updateJob);
jobRouter.post('/deletejobs', deleteJob);
jobRouter.post('/count', getJobSearchCount);
jobRouter.get('/fullcount', fullJobCount);

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     JobData:
 *       type: object
 *       properties:
 *         회사명:
 *           type: string
 *           example: "무한상사"
 *         제목:
 *           type: string
 *           example: "백엔드 개발자 모집"
 *         링크:
 *           type: string
 *           format: uri
 *           example: "https://example.com/job-posting"
 *         지역:
 *           type: string
 *           example: "서울"
 *         경력:
 *           type: string
 *           example: "신입/경력"
 *         학력:
 *           type: string
 *           example: "대졸 이상"
 *         고용형태:
 *           type: string
 *           example: "정규직"
 *         마감일:
 *           type: string
 *           format: date
 *           example: "2024-12-31"
 *         직무분야:
 *           type: string
 *           example: "소프트웨어 개발"
 *         기타정보:
 *           type: string
 *           example: "팀원들과 자유롭게 소통하는 업무 환경"
 *         갱신날짜:
 *           type: string
 *           format: date
 *           example: "2024-12-09"
 *     Review:
 *       type: object
 *       properties:
 *         회사:
 *           type: string
 *           example: "무한상사"
 *         작성자:
 *           type: string
 *           example: "길민준"
 *         평점:
 *           type: number
 *           example: 4.5
 *         평가:
 *           type: string
 *           example: "업무 환경이 매우 자유롭고 좋습니다."
 *         등록날짜:
 *           type: string
 *           example: "2024-12-09"
 */

/**
 * @swagger
 * /jobs/getjobs:
 *   get:
 *     summary: 채용 공고 목록 조회
 *     description: 다양한 조건으로 채용 공고 목록을 조회합니다.
 *     tags:
 *       - Jobs
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 20
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           example: "갱신날짜"
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           example: "desc"
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *           example: "서울"
 *       - in: query
 *         name: history
 *         schema:
 *           type: string
 *           example: "신입"
 *       - in: query
 *         name: jobfield
 *         schema:
 *           type: string
 *           example: "소프트웨어 개발"
 *     responses:
 *       200:
 *         description: 성공적으로 공고 목록을 조회했습니다.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "채용 공고 목록 조회 성공"
 *                 data:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                       example: 100
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     limit:
 *                       type: integer
 *                       example: 20
 *                     totalPages:
 *                       type: integer
 *                       example: 5
 *                     jobs:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/JobData'
 *       500:
 *         description: 서버 오류가 발생했습니다.
 */

/**
 * @swagger
 * /jobs/insertjobs:
 *   post:
 *     summary: 새 채용 공고 추가
 *     description: 새로운 채용 공고를 추가합니다.
 *     tags:
 *       - Jobs
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/JobData'
 *     responses:
 *       200:
 *         description: 성공적으로 공고를 추가했습니다.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "공고 등록 성공"
 *                 data:
 *                   type: object
 *                   properties:
 *                     jobData:
 *                       $ref: '#/components/schemas/JobData'
 *       403:
 *         description: 중복된 공고가 존재합니다.
 *       500:
 *         description: 서버 오류가 발생했습니다.
 * /jobs/getjobs/{id}:
 *   get:
 *     summary: 특정 채용 공고 조회
 *     description: 주어진 공고 ID에 해당하는 상세 정보를 반환합니다.
 *     tags:
 *       - Jobs
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "64eabc12345f67890debc123"
 *         description: 채용 공고 ID
 *     responses:
 *       200:
 *         description: 성공적으로 공고 상세 정보를 반환했습니다.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "공고 상세 정보 조회 성공"
 *                 data:
 *                   type: object
 *                   properties:
 *                     job:
 *                       $ref: '#/components/schemas/JobData'
 *                     relatedJobs:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/JobData'
 *       400:
 *         description: 유효하지 않은 공고 ID입니다.
 *       404:
 *         description: 해당 공고를 찾을 수 없습니다.
 *       500:
 *         description: 서버 오류가 발생했습니다.
 */

/**
 * @swagger
 * /jobs/deletejobs:
 *   post:
 *     summary: 채용 공고 삭제
 *     description: 주어진 공고 이름을 기준으로 채용 공고를 삭제합니다.
 *     tags:
 *       - Jobs
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               data:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                     example: "백엔드 개발자 모집"
 *                     description: 삭제하려는 공고 제목
 *     responses:
 *       200:
 *         description: 성공적으로 공고를 삭제했습니다.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "공고 삭제 성공"
 *       403:
 *         description: 삭제하려는 공고를 찾을 수 없습니다.
 *       500:
 *         description: 서버 오류가 발생했습니다.
 */

/**
 * @swagger
 * /jobs/updatejobs:
 *   post:
 *     summary: 채용 공고 업데이트
 *     description: 주어진 데이터를 기반으로 채용 공고를 업데이트합니다.
 *     tags:
 *       - Jobs
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               data:
 *                 $ref: '#/components/schemas/JobData'
 *     responses:
 *       200:
 *         description: 성공적으로 공고 데이터를 업데이트했습니다.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "데이터 수정 성공"
 *                 data:
 *                   type: object
 *                   properties:
 *                     jobData:
 *                       $ref: '#/components/schemas/JobData'
 *       400:
 *         description: 유효하지 않은 요청입니다.
 *       404:
 *         description: 공고 제목을 찾을 수 없습니다.
 *       500:
 *         description: 서버 오류가 발생했습니다.
 */


export default jobRouter;