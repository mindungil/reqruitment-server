import jwt from 'jsonwebtoken'
import { getRefreshToken, storeRefreshToken, storeAccessToken, deleteAccessToken } from '../models/tokenModel.js';

export const generateAccessToken = async (refreshToken) => {
    return jwt.sign({ token: refreshToken }, `${process.env.JWT_SECRET}`, { expiresIn: '1h' });
  };

export const generateRefreshToken = async (user) => {
    return jwt.sign({ id: user._id }, `${process.env.JWT_REFRESH_SECRET}}`, { expiresIn: '14d' });
  };

export const makeAccessToken = async (req, res) => {
    const userRefreshTokenTemp = await req.get('X-Refresh-Token'); // 클라이언트는 hedaer에 요청 할 때 Authentication-refreshToken 의 key로 
    const userRefreshToken = userRefreshTokenTemp.split(' ')[1];
    const serverRefreshToken = await getRefreshToken(req.body.email);  // 엑세스 토큰을 요청 할 때는 이메일도 보내줘야함.

    console.log(serverRefreshToken);
    console.log(userRefreshToken);
    if(userRefreshToken == serverRefreshToken){ //redis에 저장된 token과 유저의 헤더 토큰 비교
        const newAccessToken = await generateAccessToken(userRefreshToken);   // refersh token 전달 ---- >>>> access token이 만료 되었을 때만.

        res.set('Authorization', `Bearer ${newAccessToken}`);
        await deleteAccessToken(req.body.email);
        await storeAccessToken(req.body.email, newAccessToken);
        
        res.status(200).json({
            success: true,
            message: 'access 토큰 발급 및 저장 성공',
            data: {
                newAccessToken: newAccessToken
            }
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
        message: `재 로그인 필요`
    });
};