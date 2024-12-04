import User from '../models';
import jwt from 'jsonwebtoken';
import crypto from 'crypto'; // Base64 암호화를 위한 모듈
import RefreshToken from '../models/RefreshToken'; // 새로 생성된 RefreshToken 모델

// 비밀번호 암호화 함수 (Base64 Encoding)
const encryptPassword = (password) => {
  return crypto.createHash('sha256').update(password).digest('base64');
};

// Access Token 생성 함수
const generateAccessToken = (user) => {
  return jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// Refresh Token 생성 함수
const generateRefreshToken = (user) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
  return token;
};

// 회원 가입
exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: '모든 필드를 입력해야 합니다.' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: '이미 가입된 이메일입니다.' });
    }

    const hashedPassword = encryptPassword(password);

    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    const accessToken = generateAccessToken(newUser);
    const refreshToken = generateRefreshToken(newUser);

    // Refresh Token 저장
    await new RefreshToken({ userId: newUser._id, token: refreshToken }).save();

    res.status(201).json({
      success: true,
      message: '회원 가입 성공',
      data: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        accessToken,
        refreshToken,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: '서버 오류', error: err.message });
  }
};

// 로그인
exports.signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: '모든 필드를 입력해야 합니다.' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: '아이디 혹은 비밀번호를 잘못 입력하였습니다.' });
    }

    const hashedPassword = encryptPassword(password);
    if (user.password !== hashedPassword) {
      return res.status(400).json({ success: false, message: '아이디 혹은 비밀번호를 잘못 입력하였습니다.' });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Refresh Token 저장 (기존 토큰은 덮어씀)
    await RefreshToken.findOneAndUpdate(
      { userId: user._id },
      { token: refreshToken },
      { upsert: true }
    );

    res.status(200).json({
      success: true,
      message: '로그인 성공',
      data: { accessToken, refreshToken },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: '서버 오류', error: err.message });
  }
};

// 토큰 갱신
exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ success: false, message: 'Refresh Token이 필요합니다.' });
    }

    const storedToken = await RefreshToken.findOne({ token: refreshToken });
    if (!storedToken) {
      return res.status(403).json({ success: false, message: '유효하지 않은 Refresh Token입니다.' });
    }

    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ success: false, message: 'Refresh Token이 만료되었습니다.' });
      }

      const newAccessToken = generateAccessToken(user);
      res.status(200).json({ success: true, accessToken: newAccessToken });
    });
  } catch (err) {
    res.status(500).json({ success: false, message: '서버 오류', error: err.message });
  }
};

// 로그아웃
exports.logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ success: false, message: 'Refresh Token이 필요합니다.' });
    }

    await RefreshToken.findOneAndDelete({ token: refreshToken });

    res.status(200).json({ success: true, message: '로그아웃 성공' });
  } catch (err) {
    res.status(500).json({ success: false, message: '서버 오류', error: err.message });
  }
};
