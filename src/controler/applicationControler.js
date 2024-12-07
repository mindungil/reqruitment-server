import Application from '../models/applicationModel.js'
import { mongodb } from '../config/mongodb.js';
import redisCli from '../config/redis.js';
import mongoose from 'mongoose';

async function incrementApplicationCount(companyName) {
    const key = `applicationCount:${companyName}`;
    try {
        const currentValue = await redisCli.get(key);
        if (currentValue === null) {
            await redisCli.set(key, 1);
            console.log(`Key :'${key}'`);
        } else {
            const newValue = parseInt(currentValue, 10) + 1;
            await redisCli.set(key, newValue);
            console.log(`Key :'${key}' -> ${newValue}`);
        }
    } catch (err) {
        console.error('redis count 저장 오류:', err);
    }
}

async function decrementApplicationCount(companyName) {
    const key = `applicationCount:${companyName}`;
    try {
        const currentValue = await redisCli.get(key);
        if (currentValue === null) {
            console.log(`Key '${key}'가 존재하지 않습니다.`);
        } else {
            const newValue = Math.max(0, parseInt(currentValue, 10) - 1); 
            await redisCli.set(key, newValue);
            console.log(`Key '${key}' -> ${newValue}`);
        }
    } catch (err) {
        console.error('redis count 저장 오류:', err);
    }
}


export const applyJob = async (req, res) => {
    try {
        await mongodb();

        const applyData = req.body.data;

        const insertApplyData = await Application.create(applyData);

        if(!insertApplyData) {
            return res.status(404).json({
                success: false,
                message: '공고 지원 실패'
            });
        }

        await incrementApplicationCount(applyData.회사명);

        res.status(200).json({
            success: true,
            message: '공고 지원 완료',
            data: {
                applyData: applyData
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
            res.status(404).json({
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
        query.지원자 = { $regex: user, $option: 'i'};
        query.지원상태 = { $regex: status, $option: 'i'};
    

        // 정렬 조건 설정
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
        // 에러 처리
        console.error("지원 내역 조회 중 오류 :", err);
        res.status(500).json({
            success: false,
            message: "지원 내역 조회 중 오류 발생",
            error: err.message,
        });
    }
};
