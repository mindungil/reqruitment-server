import jwt from 'jsonwebtoken'
import { getRefreshToken, storeRefreshToken, storeAccessToken } from '../models/tokenModel';

export const generateAccessToken = (refreshToken) => {
    return jwt.sign({ token: refreshToken }, process.env.JWT_SECRET, { expiresIn: '1h' });
  };

export const generateRefreshToken = (user) => {
    return jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '14d' });
  };

export const makeAccessToken = (req, res) => {
    const userRefreshToken = req.get('Authentication-refreshToken'); // 클라이언트는 hedaer에 요청 할 때 Authentication-refreshToken 의 key로 
    const newAccessToken = generateAccessToken(userRefreshToken);   // refersh token 전달 ---- >>>> access token이 만료 되었을 때만.
    const serverRefreshToken = getRefreshToken(req.body.이메일);  // 엑세스 토큰을 요청 할 때는 이메일도 보내줘야함.

    if(userRefreshToken == serverRefreshToken){
        res.set('Authentication',newAccessToken);
        res.status(200).json({
            success: true,
            message: 'access 토큰 발급 성공',
        });
    }
    else {
        res.status(403).json({
            success: false,
            message: 'refresh token 만료'
        });
    }
};

export const makeRefreshToken = (req, res) => {
    res.status(200).json({
        success: true,
        message: `refresh token이 만료되었습니다. 다시 로그인 하세요.`
    });
};