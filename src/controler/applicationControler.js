import Application from '../models/applicationModel.js'
import User from '../models/userModel.js';
import JobData from '../modes/jobOpenings.js'
import { mongodb } from '../config/mongodb.js';
import redisCli from '../config/redis.js';
import mongoose from 'mongoose';
import { incrementApplicationCount, decrementApplicationCount } from '../models/redisCountModel.js'

export const getApplicationCount = async (req,res) => {
    try {
        const { company } = req.query;
        const dataId = `applicationCount:${company}`
        const count = await redisCli.get(dataId);

        console.log("helo");

        if(!count) {
            return res.status(404).json({
                success:true,
                message: '지원 횟수 또는 회사가 존재하지 않습니다.'
            });
        }

        res.status(200).json({
            success: true,
            message: '지원 횟수 조회 성공',
            data: {
                ApplicationCount: count
            }
        });
    } catch(err) {
        console.log("지원 횟수 조회 중 오류 : ", err);
        throw err;
    }
}


export const applyJob = async (req, res) => {
    try {
        await mongodb();

        const applyData = req.body;

        const userEmail = applyData.이메일;
        const userData = await User.findOne({이메일: userEmail});

        if(!userData) {
            return res.status(403).json({
                success: false,
                message: '지원자 정보가 DB에 존재하지 않습니다.'
            });
        }

        const checkJobData = await JobData.findById(applyData.지원공고);
        if(!checkJobData)  {
            return res.status(402).json({
                sucess: false,
                message: '지원공고 ID가 일치하지 않습니다.'
            })
        }

        const checkApplyData = await Application.findOne({지원자: applyData.지원자, 이메일: userEmail, 지원공고: applyData.지원공고});
        if(checkApplyData) {
            return res.status(404).json({
                success: false,
                message: '이미 지원자가 지원된 공고입니다.'
            });
        }

        const insertApplyData = await Application.create(applyData);

        if(!insertApplyData) {
            return res.status(500).json({
                success: false,
                message: '공고 지원 실패'
            });
        }

        await incrementApplicationCount(applyData.회사명);

        res.status(200).json({
            success: true,
            message: '공고 지원 완료',
            data: {
                applyData: insertApplyData
            }
        });
    } catch(err) {
        console.error("공고 지원 중 오류 : ", err);
        throw err;
    }
};

export const canncelApply = async (req, res) => {
    try {
        await mongodb();

        const id = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "유효하지 않은 공고 지원 ID입니다.",
            });
        }

        const applyData = await Application.findOne({_id: new mongoose.Types.ObjectId(id)});

        if(!applyData) {
            return res.status(404).json({
                success: false,
                message: '지원 내역이 존재하지 않습니다.'
            });
        }

        await decrementApplicationCount(applyData.회사명);
        await Application.deleteOne({_id: new mongoose.Types.ObjectId(id)});

        res.status(200).json({
            success: true,
            message: '공고 지원 취소 완료'
        });
    } catch(err){
        console.error("공고 지원 취소 중 오류 : ", err);
        throw err;
    }
};

export const applicationList = async (req, res) => {
    try {
        await mongodb();

        const { user } = req.query;
        const { status } = req.query;  
        const { sort } = req.query; 

        const query = {}
        
        if(user) query.지원자 = user;
        if(status) query.지원상태 = status;
    
        console.log('query :', query);

        const sortCondition = {};
        if (sort === "asc") {
            sortCondition.지원날짜 = 1;
        } else if (sort === "desc") {
            sortCondition.지원날짜 = -1; 
        }   
        const applications = await Application.find(query).sort(sortCondition);

        res.status(200).json({
            success: true,
            message: "지원 내역 조회 성공",
            data: {
                applicationList: applications
            }
        });
    } catch (err) {
        console.error("지원 내역 조회 중 오류 :", err);
        res.status(500).json({
            success: false,
            message: "지원 내역 조회 중 오류 발생",
            error: err.message,
        });
    }
};
