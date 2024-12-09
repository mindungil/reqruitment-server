import express from 'express'
import { insertBookmark, getBookmark } from '../controler/bookmarkControler.js';
import checkToken from '../middlewares/tokenMiddleware.js';
const bookmarkRouter = express.Router();

bookmarkRouter.post('/', insertBookmark);
bookmarkRouter.get('/', getBookmark);

/**
 * @swagger
 * /bookmarks:
 *   post:
 *     summary: 북마크 저장 또는 삭제
 *     description: 사용자가 특정 공고를 북마크에 저장하거나 삭제합니다.
 *     tags:
 *       - Bookmarks
 *     security:
 *       - bearerAuth: []  # 토큰 기반 인증 명시
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
 *                   id:
 *                     type: string
 *                     example: "64f4ba4e6f527ab0c01234ab"
 *                     description: 북마크할 공고의 MongoDB ObjectId
 *                   user:
 *                     type: string
 *                     example: "user123"
 *                     description: 북마크를 저장하거나 삭제할 사용자의 ID
 *     responses:
 *       200:
 *         description: 북마크 저장 또는 삭제 성공
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
 *                   example: "북마크 저장 완료"
 *                 data:
 *                   type: object
 *                   additionalProperties: true
 *       404:
 *         description: 잘못된 공고 ID
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
 *                   example: "잘못된 공고 Id"
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
 *                   example: "서버 오류 발생"
 *
 *   get:
 *     summary: 북마크 조회
 *     description: 특정 사용자의 북마크 목록을 조회합니다.
 *     tags:
 *       - Bookmarks
 *     security:
 *       - bearerAuth: []  # 토큰 기반 인증 명시
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
 *                   user:
 *                     type: string
 *                     example: "user123"
 *                     description: 조회할 사용자의 ID
 *                   page:
 *                     type: integer
 *                     example: 1
 *                     description: 페이지 번호 (기본값: 1)
 *                   limit:
 *                     type: integer
 *                     example: 10
 *                     description: 페이지 당 항목 수 (기본값: 10)
 *     responses:
 *       200:
 *         description: 북마크 조회 성공
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
 *                   example: "북마크 조회 성공"
 *                 data:
 *                   type: object
 *                   properties:
 *                     bookmarks:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           jobData:
 *                             type: object
 *                             additionalProperties: true
 *                             description: 공고 데이터
 *                           timestamp:
 *                             type: integer
 *                             example: 1630518382000
 *                             description: 북마크 저장 시점의 타임스탬프
 *                     currentPage:
 *                       type: integer
 *                       example: 1
 *                       description: 현재 페이지 번호
 *                     totalBookmarks:
 *                       type: integer
 *                       example: 42
 *                       description: 북마크된 총 항목 수
 *       404:
 *         description: 유저 정보 없음
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
 *                   example: "유저 정보 필요"
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
 *                   example: "서버 오류 발생"
 */


export default bookmarkRouter;