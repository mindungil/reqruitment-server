import jwt from 'jsonwebtoken'

export default function checkToken (req, res, next) {
    try {
        const reqTokenTemp = req.get('authorization');
        
        if(!reqTokenTemp) {
            res.status(403).json({
                success: false,
                message: '요청 토큰을 읽는 데 실패하였습니다.'
            });
        };

        const reqToken = reqTokenTemp.split(' ')[1];

        if (!reqToken) {
            return res.status(403).json({ success: false, message: 'access token이 필요합니다.'});
        }

        const decode = jwt.verify(reqToken, process.env.JWT_SECRET);

        console.log("요쳥 토큰 유효 확인 : ");
        next();
    } catch(err) {
        console.error("token 미들웨어 오류 : ", err);
        throw err;
    }
};