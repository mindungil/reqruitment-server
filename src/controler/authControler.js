import User from '../models';
import jwt from 'jsonwebtoken';
import crypto from 'crypto'; // Base64 암호화를 위한 모듈

// 비밀번호 암호화 함수 (Base64 Encoding)
const encryptPassword = (password) => {
  return crypto.createHash('sha256').update(password).digest('base64');
};

// 회원 가입
exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 필수 값 확인
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: '모든 필드를 입력해야 합니다.' });
    }

    // 중복 확인
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: '이미 가입된 이메일입니다.' });
    }

    // 비밀번호 암호화
    const hashedPassword = encryptPassword(password);

    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ success: true, message: '회원 가입 성공', data: { id: newUser._id, name: newUser.name, email: newUser.email } });
  } catch (err) {
    res.status(500).json({ success: false, message: '서버 오류', error: err.message });
  }
};

// 로그인
exports.signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 필수 값 확인
    if (!email || !password) {
      return res.status(400).json({ success: false, message: '모든 필드를 입력해야 합니다.' });
    }

    // 사용자 찾기
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: '아이디 혹은 비밀번호를 잘못 입력하였습니다.' });
    }

    // 비밀번호 검증
    const hashedPassword = encryptPassword(password);
    if (user.password !== hashedPassword) {
      return res.status(400).json({ success: false, message: '아이디 혹은 비밀번호를 잘못 입력하였습니다.' });
    }

    // JWT 토큰 발급
    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ success: true, message: '로그인 성공', token });
  } catch (err) {
    res.status(500).json({ success: false, message: '서버 오류', error: err.message });
  }
};

// 회원 정보 수정
exports.updateProfile = async (req, res) => {
  try {
    const { id } = req.params; // 회원 ID
    const { name, email, password } = req.body;

    // 사용자 찾기
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: '사용자를 찾을 수 없습니다.' });
    }

    // 데이터 업데이트
    if (name) user.name = name;
    if (email) user.email = email;
    if (password) user.password = encryptPassword(password);

    await user.save();

    res.status(200).json({ success: true, message: '회원 정보가 성공적으로 수정되었습니다.', data: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ success: false, message: '서버 오류', error: err.message });
  }
};
