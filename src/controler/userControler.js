import { mongodb } from "../config/mongodb";
import User from "../models/userModel";

export const userProfile = async (req, res) => {
    try {
        await mongodb();

        const findEmail = req.body.email;

        const userFind = await User.findOne({이메일: findEmail}) | [];
        if(!userFind) {
            res.status(403).json({
                success: false,
                message: "이메일이 잘못되었습니다."
            });
        }

        res.status(200).json({
            success: true,
            message: "회원 정보 응답",
            data: {
                name: 이름,
                sex: 성별,
                age: 나이,
                history: 경력,
                email: 이메일,
                residence: 거주지
            }
        });

    } catch(err) {
        console.error("회원 정보 조회 오류 : ", err);
        throw err;
    }
}