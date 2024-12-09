import express from 'express'
import { signin, signout, signup, updateUser } from '../controler/authControler.js'
import checkToken from '../middlewares/tokenMiddleware.js';
import { makeAccessToken, makeRefreshToken } from '../controler/tokenControler.js';
import { userProfile, resign } from '../controler/userControler.js';

const authRouter = express.Router();

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: 사용자 로그인
 *     description: 사용자가 이메일과 비밀번호를 이용해 로그인하고, Access Token 및 Refresh Token을 발급받습니다.
 *     tags:
 *       - Authentication
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
 *                   email:
 *                     type: string
 *                     description: 사용자의 이메일 주소
 *                     example: "user@example.com"
 *                   password:
 *                     type: string
 *                     description: 사용자의 비밀번호
 *                     example: "password123"
 *     responses:
 *       200:
 *         description: 로그인 성공
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
 *                   example: "로그인 성공"
 *                 data:
 *                   type: object
 *                   properties:
 *                     refreshToken:
 *                       type: string
 *                       description: 발급된 Refresh Token
 *                       example: "eyJhbGciOiJIUzI1NiIsInR5..."
 *                     accessToken:
 *                       type: string
 *                       description: 발급된 Access Token
 *                       example: "eyJhbGciOiJIUzI1NiIsInR5..."
 *       400:
 *         description: 잘못된 요청 (입력 오류 또는 인증 실패)
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
 *                   example: "입력 오류 - 1."
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
 *                   example: "서버 오류"
 *                 error:
 *                   type: string
 *                   description: 오류 메시지
 *                   example: "Cannot connect to the database"
 */
authRouter.post('/login', signin);

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: 사용자 회원가입
 *     description: 사용자 정보를 입력받아 새로운 계정을 생성합니다.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: 회원가입 성공
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
 *                   example: "회원 가입 성공"
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *                       properties:
 *                         name:
 *                           type: string
 *                           example: "홍길동"
 *                         email:
 *                           type: string
 *                           example: "user@example.com"
 *       400:
 *         description: 잘못된 요청 (필드 누락 또는 이메일 중복)
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
 *                   example: "모든 필드를 입력해야 합니다."
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
 *                   example: "서버 오류"
 *                 error:
 *                   type: string
 *                   description: 오류 메시지
 *                   example: "Cannot save user to the database"
 */

authRouter.post('/register', signup);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: 사용자 로그아웃
 *     description: 사용자의 Refresh Token을 삭제하여 로그아웃을 처리합니다.
 *     tags:
 *       - Authentication
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
 *                   email:
 *                     type: string
 *                     description: 로그아웃하려는 사용자의 이메일 주소
 *                     example: "user@example.com"
 *     responses:
 *       200:
 *         description: 로그아웃 성공
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
 *                   example: "로그아웃 성공"
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
 *                   example: "서버 오류"
 *                 error:
 *                   type: string
 *                   description: 오류 메시지
 *                   example: "Cannot delete token from Redis"
 */
authRouter.post('/logout', signout);

/**
 * @swagger
 * /auth/profile:
 *   put:
 *     summary: 사용자 프로필 업데이트
 *     description: 유효한 Access Token이 필요하며, 사용자 정보를 업데이트합니다.
 *     tags:
 *       - User
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
 *                   email:
 *                     type: string
 *                     description: 사용자의 이메일 주소
 *                     example: "user@example.com"
 *                   password:
 *                     type: string
 *                     description: 변경할 비밀번호
 *                     example: "newpassword123"
 *                   history:
 *                     type: string
 *                     description: 변경할 경력 정보
 *                     example: "5년 경력의 프로젝트 매니저"
 *                   residence:
 *                     type: string
 *                     description: 변경할 거주지 정보
 *                     example: "서울특별시"
 *     responses:
 *       200:
 *         description: 업데이트 성공
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
 *                   example: "유저 업데이트 완료"
 *                 data:
 *                   type: object
 *                   properties:
 *                     userName:
 *                       type: object
 *                       properties:
 *                         user:
 *                           type: string
 *                           example: "홍길동"
 *       403:
 *         description: 토큰 인증 실패 또는 접근 권한 없음
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
 *                   example: "access token이 필요합니다."
 *       404:
 *         description: 요청 데이터 누락
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
 *                   example: "요청에 이메일 필요"
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
 *                   example: "서버 오류"
 */
authRouter.put('/profile', checkToken, updateUser);

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: Access Token 재발급
 *     description: 유효한 Refresh Token을 사용하여 새로운 Access Token을 발급합니다.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: 사용자의 이메일 주소
 *                 example: "user@example.com"
 *     parameters:
 *       - in: header
 *         name: X-Refresh-Token
 *         required: true
 *         schema:
 *           type: string
 *         description: Bearer 형식의 Refresh Token (e.g., "Bearer <token>")
 *     responses:
 *       200:
 *         description: 새로운 Access Token 발급 성공
 *         headers:
 *           Authorization:
 *             description: 새롭게 발급된 Access Token
 *             schema:
 *               type: string
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
 *                   example: "access 토큰 발급 성공"
 *       403:
 *         description: Refresh Token이 유효하지 않거나 만료됨
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
 *                   example: "refresh token 만료"
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
 *                   example: "서버 오류"
 *                 error:
 *                   type: string
 *                   description: 오류 메시지
 *                   example: "Internal Server Error"
 */
authRouter.post('/refresh', makeAccessToken);

/**
 * @swagger
 * /auth/profile:
 *   get:
 *     summary: 사용자 프로필 조회
 *     description: 이메일을 사용해 사용자 프로필 정보를 조회합니다. 유효한 Access Token이 필요합니다.
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []  # 토큰 기반 인증 명시
 *     parameters:
 *       - in: query
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *         description: 조회할 사용자의 이메일 주소
 *         example: "user@example.com"
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *         description: Bearer 형식의 Access Token (e.g., "Bearer <token>")
 *     responses:
 *       200:
 *         description: 사용자 프로필 조회 성공
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
 *                   example: "회원 정보 응답 성공"
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "12345abcde"
 *                     name:
 *                       type: string
 *                       example: "홍길동"
 *                     sex:
 *                       type: string
 *                       example: "남성"
 *                     age:
 *                       type: number
 *                       example: 29
 *                     history:
 *                       type: string
 *                       example: "경력 5년"
 *                     email:
 *                       type: string
 *                       example: "user@example.com"
 *                     residence:
 *                       type: string
 *                       example: "서울특별시"
 *       403:
 *         description: 사용자 정보가 없거나 입력 오류
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
 *                   example: "입력 오류"
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
 *                   example: "서버 오류"
 *                 error:
 *                   type: string
 *                   description: 오류 메시지
 *                   example: "Internal Server Error"
 */
authRouter.get('/profile', checkToken, userProfile);

/**
 * @swagger
 * /auth/resign:
 *   post:
 *     summary: 회원 탈퇴
 *     description: 사용자의 이메일과 비밀번호를 받아 해당 사용자의 정보를 삭제합니다.
 *     tags:
 *       - Authentication
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
 *                   email:
 *                     type: string
 *                     example: "user@example.com"
 *                     description: 탈퇴를 요청하는 사용자의 이메일
 *                   password:
 *                     type: string
 *                     example: "password123"
 *                     description: 탈퇴를 요청하는 사용자의 비밀번호
 *     responses:
 *       200:
 *         description: 회원 정보 삭제 성공
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
 *                   example: "회원 정보 삭제 성공"
 *       403:
 *         description: 정보 오류 (잘못된 이메일 또는 비밀번호)
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
 *                   example: "정보 오류"
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
 *                   example: "회원 정보 삭제 오류"
 */
authRouter.post('/resign', checkToken, resign);

export default authRouter;