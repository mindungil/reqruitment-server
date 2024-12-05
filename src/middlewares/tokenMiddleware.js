import jwt from 'jsonwebtoken'
import { getAccessToken } from '../models/tokenModel';

function checkToken (res, req, next) {
    try {
        const reqTokenTemp = req.get('Authorization');
        const reqToken = reqTokenTemp.split(' ')[1];

        if (!reqToken) {
            return res.status(403).json({ success: false, message: 'access token이 필요합니다.'});
        }

        const decode = jwt.verify(reqToken, process.env.JWT_ACCESS);

        console.log("요쳥 토큰 유효 확인 : ");
        next();
    } catch(err) {
        console.error("token 미들웨어 오류 : ", err);
        throw err;
    }
};