import User from '../models/userModel.js';
import crypto from 'crypto'; // Base64 암호화를 위한 모듈
import { storeRefreshToken, deleteRefreshToken, storeAccessToken } from '../models/tokenModel.js';
import { mongodb } from '../config/mongodb.js';
import { generateAccessToken, generateRefreshToken } from './tokenControler.js';

// 비밀번호 암호화 함수 (Base64 Encoding)
const encryptPassword = (password) => {
  return crypto.createHash('sha256').update(password).digest('base64');
};

// 회원 가입
export const signup = async (req, res) => {
  try {
    await mongodb();
    const { name, sex, age, history, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: '모든 필드를 입력해야 합니다.' });
    }

    const existingUser = await User.findOne({ 이메일: email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: '이미 가입된 이메일입니다.' });
    }

    const hashedPassword = encryptPassword(password);

    const newUser = new User({ 이름: name, 성별: sex, 나이: age, 경력: history, 이메일: email, 비밀번호: hashedPassword });
    await newUser.save();

    res.status(201).json({
      success: true,
      message: '회원 가입 성공',
      data: { user: newUser },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: '서버 오류', error: err.message });
  }
};

// 로그인
export const signin = async (req, res) => {
  try {
    await mongodb();
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: '모든 필드를 입력해야 합니다.' });
    }

    const user = await User.findOne({ 이메일: email }).exec();
    if (!user) {
      return res.status(400).json({ success: false, message: '아이디 혹은 비밀번호를 잘못 입력하였습니다 - 1.' });
    }

    const hashedPassword = encryptPassword(password);
    if (user.비밀번호 !== hashedPassword) {
      return res.status(400).json({ success: false, message: '아이디 혹은 비밀번호를 잘못 입력하였습니다 - 2.' });
    }

    const refreshToken = generateRefreshToken(user);
    const accessToken = generateAccessToken(refreshToken);

    // Refresh Token Redis에 저장
    await storeRefreshToken(email, refreshToken);
    await storeAccessToken(email, accessToken);

    res.set('Authorization', `Bearer ${accessToken}`); // 헤더로 클라이언트에 엑세스 토큰 보내주기
    res.set('X-Refresh-Token', `Bearer ${refreshToken}`);

    res.status(200).json({
      success: true,
      message: '로그인 성공',
      data: {user: user},
    });
  } catch (err) {
    res.status(500).json({ success: false, message: '서버 오류', error: err.message });
  }
};

// 토큰 갱신


// 로그아웃
export const signout = async (req, res) => {
  try {
    const { email } = req.user;

    // Redis에서 Refresh Token 삭제
    await deleteRefreshToken(email);

    res.status(200).json({ success: true, message: '로그아웃 성공' });
  } catch (err) {
    res.status(500).json({ success: false, message: '서버 오류', error: err.message });
  }
};
