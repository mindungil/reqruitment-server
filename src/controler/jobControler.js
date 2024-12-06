import mongoose from 'mongoose';
import { mongodb } from '../config/mongodb.js';
import JobData from '../models/jobOpenings.js';

export const getJobs = async (req, res) => {
    try {
        await mongodb();

        const { id, page = 1, limit = 20, sortBy = '갱신날짜', order = 'desc', 지역, 경력, 직무분야 } = req.query;

        if (id) {
            // id로 특정 공고 상세 조회
            const job = await JobData.findOneAndUpdate(
                { _id: id },
                { $inc: { 조회수: 1 } }, 
                { new: true }
            );

            if (!job) {
                return res.status(404).json({
                    success: false,
                    message: "해당 공고를 찾을 수 없습니다.",
                });
            }

            const relatedJobs = await JobData.find({
                $or: [
                    { 지역: job.지역 },
                    { 직무분야: job.직무분야 },
                ],
                _id: { $ne: id },
            })
                .limit(5)
                .sort({ 갱신날짜: -1 });

            return res.status(200).json({
                success: true,
                message: "공고 상세 정보 조회 성공",
                data: {
                    jobData: job,
                    relatedJobData: relatedJobs
                }
            });
        }

        // id가 없을 경우 기존 페이징 로직
        const pageNumber = parseInt(page, 10);
        const pageSize = parseInt(limit, 10);
        const skip = (pageNumber - 1) * pageSize;

        const filter = {};
        if (지역) filter.지역 = { $regex: 지역, $options: 'i' };
        if (경력) filter.경력 = { $regex: 경력, $options: 'i' };
        if (직무분야) filter.직무분야 = { $regex: 직무분야, $options: 'i' };

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
            data: {
                total: total,
                page: pageNumber,
                limit: pageSize,
                totalPages: Math.ceil(total / pageSize),
                jobs: jobs,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "채용 공고 목록 조회 중 오류 발생",
            error: error.message,
        });
    }
};



export const deleteJob = async (req, res) => {
    try {
        await mongodb();

        const jobName = req.body.data.제목;
        const checkJob = await JobData.findOne({제목: jobName});
        
        console.log(checkJob);

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

export const updateJob = async (req, res) => {
    try {
        await mongodb(); // MongoDB 연결

        const newData = req.body.data;
        if (!newData || !newData.제목) {
            return res.status(400).json({
                success: false,
                message: '유효하지 않은 요청',
            });
        }

        let oldData = await JobData.findOne({ 제목: newData.제목 });
        if (!oldData) {
            return res.status(404).json({
                success: false,
                message: '공고 제목 오류',
            });
        }

        const updatedData = await JobData.findOneAndUpdate(
            { 제목: newData.제목 }, // 조건
            { $set: newData }, // 업데이트할 데이터
            { new: true } // 수정된 데이터를 반환
        );

        res.status(200).json({
            success: true,
            message: '데이터 수정 성공',
            data: {
                jobData: updatedData,
            }
        });
    } catch (err) {
        console.error('데이터 수정 중 오류: ', err);
        res.status(500).json({
            success: false,
            message: '서버 오류',
        });
    }
};