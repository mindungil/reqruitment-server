import mongoose from 'mongoose';
import { mongodb } from '../config/mongodb.js';
import JobData from '../models/jobOpenings.js';

export const getJobs = async (req, res) => {
    try {
        await mongodb();

        const { page = 1, limit = 20, sortBy = '갱신날짜', order = 'desc', 지역, 경력, 직무분야 } = req.query;

        const pageNumber = parseInt(page, 10);
        const pageSize = parseInt(limit, 10);
        const skip = (pageNumber - 1) * pageSize;

        const filter = {};
        if (지역) filter.지역 = { $regex: 지역, $options: 'i' };
        if (경력) filter.경력 = { $regex: 경력, $options: 'i' };
        if (직무분야) filter.직무분야 = { $regex: 직무분야, $options: 'i' }; // 여러 기술 스택 중 하나라도 포함

        const sortOptions = {};
        sortOptions[sortBy] = order === 'asc' ? 1 : -1;

        const jobs = await JobData.find(filter)
            .sort(sortOptions)
            .skip(skip)
            .limit(pageSize);

        const total = await JobData.countDocuments(filter);

        res.status(200).json({
            success: true,
            message: "채용 공고 목록 조회 성공",
            data:{
                total: total,
                page: pageNumber,
                limit: pageSize,
                totalPages: Math.ceil(total / pageSize),
                jobs: jobs,
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "채용 공고 목록 조회 중 오류 발생",
            error: error.message,
        });
    }
};

export const insertJob = async (req, res) => {
    try {
        await mongodb();

        const newJobData = req.query;
        console.log(newJobData);

        const checkJobData = await JobData.findOne({제목: newJobData.제목});

        if(checkJobData) {
            return res.status(403).json({
                success: false,
                message: '공고 이미 존재'
            });
        };

        await JobData.create(newJobData);

        res.status(200).json({
            success: true,
            message: '공고 등록 성공',
            data: {
                jobData: newJobData
            }
        });
    } catch(err) {
        console.error("공고 등록 중 오류 발생 : ", err);
        throw err;
    }
};

export const deleteJob = async (req, res) => {
    try {
        await mongodb();

        const jobName = req.query.name;
        const checkJob = await JobData.findOne({제목: jobName});
        if(!checkJob) {
            return res.status(403).json({
                success: false,
                message: '제목 오류'
            });
        }

        await JobData.deleteOne({제목: jobName});

        res.status(200).json({
            success: true,
            message: '공고 삭제 성공'
        });
    } catch(err) {
        console.error("공고 삭제 중 오류 : ", err);
        throw err;
    }
};

