import mongoose from 'mongoose';
import { mongodb } from '../config/mongodb.js';
import JobData from '../models/jobOpenings.js';

export const getJobs = async (req, res) => {
    try {
        await mongodb();

        const { page = 1, limit = 10 } = req.query;

        const pageNumber = parseInt(page, 10);
        const pageSize = parseInt(limit, 10);
        const skip = (pageNumber - 1) * pageSize;

        const jobs = await JobData.find()
            .sort({ 갱신날짜: -1 }) // 갱신날짜 기준으로 최신순 정렬
            .skip(skip) // 페이지 시작점
            .limit(pageSize) // 페이지당 항목 수

        const total = await JobData.countDocuments();

        res.status(200).json({
            success: true,
            message: "공고 목록 페이지네이션",
            total,
            page: pageNumber,
            limit: pageSize,
            totalPages: Math.ceil(total / pageSize),
            jobs,
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: '서버 에러 발생', 
            error: error.message 
        });
    }
};
