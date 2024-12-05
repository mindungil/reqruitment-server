import jwt from 'jsonwebtoken'
import { getAccessToken } from '../models/tokenModel';

function checkToken (res, req, next) {
    try {
        const {email} = req.body;
        const reqToken = req.get('Authentication');
        const serverToken = getAccessToken(email);
    
        if (!reqToken) {
            return res.status(403).json({ success: false, message: 'access token이 필요합니다.'});
        }
        if(!serverToken) {
            return res.status(501).json({ success: false, message: '서버 오류, 재 로그인 필요'});
        }

        if(jwt.verify(reqToken, serverToken)) {
            return res.status(403).json({ success: false, message: 'access token이 올바르지 않습니다'});
        } else {
            return res.status(200).json({ success: true, message: 'access token이 유효한 요청입니다'});
            next();
        }

    } catch(err) {
        console.error("미들웨어 오류 : ", err);
        throw err;
    }
};