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
            total,
            page: pageNumber,
            limit: pageSize,
            totalPages: Math.ceil(total / pageSize),
            jobs,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "채용 공고 목록 조회 중 오류 발생",
            error: error.message,
        });
    }
};


