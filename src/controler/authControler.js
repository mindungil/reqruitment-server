import User from '../models';

// 회원 가입
exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 중복 확인
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: '이미 가입된 이메일입니다.' });
    }

    const newUser = new User({ name, email, password });
    await newUser.save();

    res.status(201).json({ success: true, message: '회원 가입 성공', data: newUser });
  } catch (err) {
    res.status(500).json({ success: false, message: '서버 오류' });
  }
};

exports.login = async (req, res) => {
    try {
        
    } catch(err) {

    }
};
