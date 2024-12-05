import { mongodb } from "../config/mongodb.js";
import User from "../models/userModel.js";
import { encryptPassword } from "./authControler.js";

export const userProfile = async (req, res) => {
    try {
        await mongodb();

        const findEmail = req.body.email;

        const userFind = await User.findOne({이메일: findEmail});

        if(!userFind) {
            return res.status(403).json({
                success: false,
                message: "이메일이 잘못되었습니다."
            });
        }

        return res.status(200).json({
                success: true,
                message: "회원 정보 응답",
                data: {
                    name: userFind.이름,
                    sex: userFind.성별,
                    age: userFind.나이,
                    history: userFind.경력,
                    email: userFind.이메일,
                    residence: userFind.거주지
                }
        });

    } catch(err) {
        console.error("회원 정보 조회 오류 : ", err);
        throw err;
    }
};

export const resign = async (req, res) => {
    try {
        await mongodb();

        const userEmail = req.body.email;
        const userPasswordTemp = req.body.password;
        
        const userPassword = encryptPassword(userPasswordTemp);

        const findUser = await User.findOne({이메일: userEmail}, {비밀번호: userPassword});
        if(!findUser) {
            return res.status(403).json({
                success: false,
                message: "로그인 정보가 일치하지 않거나 회원이 존재하지 않습니다."
            });
        }
        
        await User.deleteOne({이메일: userEmail});

        return res.status(200).json({
            success: true,
            message: "회원 정보 삭제"
        });
    } catch(err) {
        console.log("회원 정보 삭제 오류 : ", err);
        throw err;
    }
};