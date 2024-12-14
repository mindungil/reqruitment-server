import express from 'express'
import {applyJob, canncelApply, applicationList, getApplicationCount} from '../controler/applicationControler.js'
import checkToken from '../middlewares/tokenMiddleware.js';
const applicationRouter = express.Router();

/**
 * @swagger
 * /applications:
 *  post:
 *      summary: 공고 지원
 *      description: 사용자가 특정 공고에 지원합니다.
 *      tags: [Applications]
 *      security:
 *       - bearerAuth: []
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Application'
 *      responses:
 *          200:
 *              description: 공고 지원 완료
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Application'
 *          403:
 *              description: 지원공고 ID 오류
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              success:
 *                                  type: boolean
 *                                  example: false
 *                              message:
 *                                  type: string
 *                                  example: 지원공고 ID가 일치하지 않습니다.
 *          403:
 *              description: 지원자 정보 DB에 존재하지 않음
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              success:
 *                                  type: boolean
 *                                  example: false
 *                              message:
 *                                  type: string
 *                                  example: 지원자 정보(이메일)가 DB에 존재하지 않음
 *          404:
 *              description: 지원자가 이미 지원한 공고
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              success:
 *                                  type: boolean
 *                                  example: false
 *                              message:
 *                                  type: string
 *                                  example: 이미 지원자가 지원된 공고입니다.
 *          500:
 *              description: 공고 지원 실패
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              success:
 *                                  type: boolean
 *                                  example: false
 *                              message:
 *                                  type: string
 *                                  example: 공고 지원 실패
 *                          
 */ 
applicationRouter.post('/', applyJob);

/**
 * @swagger
 * /applications:
 *   get:
 *     summary: 지원 내역 조회
 *     description: 지원자의 지원 내역을 조회합니다. 검색 조건(user, status)와 정렬 조건(sort)을 설정할 수 있습니다.
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: user
 *         schema:
 *           type: string
 *         description: 지원자 이름을 검색합니다 (부분 검색 가능).
 *       - in: query
 *         name: 상태
 *         schema:
 *           type: string
 *         description: 지원 상태를 검색합니다 (부분 검색 가능, 접수, 진행, 완료 존재 ).
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: 지원 날짜를 기준으로 정렬합니다. `asc`는 오름차순, `desc`는 내림차순입니다.
 *     responses:
 *       200:
 *         description: 지원 내역 조회 성공
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
 *                   example: 지원 내역 조회 성공
 *                 data:
 *                   type: object
 *                   properties:
 *                     applicationList:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Application'
 *       500:
 *         description: 서버 오류로 인해 지원 내역 조회 실패
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: 지원 내역 조회 중 오류 발생
 *                 error:
 *                   type: string
 *                   example: "데이터베이스 연결 실패"
 */

applicationRouter.get('/', applicationList);

/**
 * @swagger
 * /applications/{id}:
 *   delete:
 *     summary: 지원 내역 취소
 *     description: 특정 지원 ID에 대한 공고 지원 내역을 취소합니다.
 *     tags:
 *       - Applications
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: 취소할 지원 내역의 ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 지원 취소 성공
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
 *                   example: "공고 지원 취소 완료"
 *       400:
 *         description: 잘못된 요청
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "유효하지 않은 공고 지원 ID입니다."
 *       404:
 *         description: 지원 내역이 존재하지 않음
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "지원 내역이 존재하지 않습니다."
 *       500:
 *         description: 서버 오류
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "서버 내부 오류"
 */
applicationRouter.delete('/:id', canncelApply);

/**
 * @swagger
 * /applications/count:
 *   get:
 *     summary: 회사별 지원 횟수 조회
 *     description: 특정 회사의 지원 횟수를 조회합니다.
 *     tags:
 *       - Applications
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: company
 *         required: true
 *         schema:
 *           type: string
 *           example: "(주)알레르망"
 *         description: 조회하려는 회사 이름
 *     responses:
 *       200:
 *         description: 지원 횟수 조회 성공
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
 *                   example: "지원 횟수 조회 성공"
 *                 data:
 *                   type: object
 *                   properties:
 *                     ApplicationCount:
 *                       type: integer
 *                       example: 5
 *       404:
 *         description: 회사 또는 지원 횟수 데이터가 존재하지 않음
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "지원 횟수 또는 회사가 존재하지 않습니다."
 *       500:
 *         description: 서버 오류
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "서버 내부 오류"
 */
applicationRouter.get('/count', getApplicationCount);

export default applicationRouter;

