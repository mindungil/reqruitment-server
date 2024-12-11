import mongoose from 'mongoose';
import { mongodb } from '../config/mongodb.js';
import JobData from '../models/jobOpenings.js';

async function incrementSearchCount(jobId) {
    const key = `searchJobCount:${jobId}`;
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
};

export const getJobs = async (req, res) => {
    try {
        await mongodb();

        const { page = 1, limit = 20, sortBy = '갱신날짜', order = 'desc', location, history, jobfield } = req.query;

        const pageNumber = parseInt(page, 10);
        const pageSize = parseInt(limit, 10);
        const skip = (pageNumber - 1) * pageSize;

        const filter = {};
        if (location) filter.지역 = { $regex: location, $options: 'i' };
        if (history) filter.경력 = { $regex: history, $options: 'i' };
        if (jobfield) filter.직무분야 = { $regex: jobfield, $options: 'i' }; // 여러 기술 스택 중 하나라도 포함

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

        const newJobData = req.body; // name : 공고명
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

        const jobName = req.body.data.name;
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

        const jobData = req.body.data;
        const { id } = req.body;
        const newData = jobData;
        if (!newData || !id) {
            return res.status(400).json({
                success: false,
                message: '유효하지 않은 요청',
            });
        }

        let oldData = await JobData.findById(id);
        if (!oldData) {
            return res.status(404).json({
                success: false,
                message: '공고 id 오류',
            });
        }

        const objectId = new mongoose.Types.ObjectId(id);
        const updatedData = await JobData.findOneAndUpdate(
            { _id: objectId  }, // 조건
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
export const getJobId = async (req, res) => {
    try {
        await mongodb();

        const { id } = req.params;

        // ObjectId 유효성 확인
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "유효하지 않은 공고 ID입니다.",
            });
        }

        const job = await JobData.findOne({ _id: new mongoose.Types.ObjectId(id) });

        if (!job) {
            return res.status(404).json({
                success: false,
                message: "해당 공고를 찾을 수 없습니다.",
            });
        }

        incrementSearchCount(id);

        const relatedJobs = await JobData.find({
            $or: [
                { 지역: job.지역 },
                { 직무분야: job.직무분야 },
            ],
            _id: { $ne: new mongoose.Types.ObjectId(id) }, // new 키워드 추가
        })
            .limit(5)
            .sort({ 갱신날짜: -1 });

        res.status(200).json({
            success: true,
            message: "공고 상세 정보 조회 성공",
            data: {
                job,
                relatedJobs,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "공고 상세 정보 조회 중 오류 발생",
            error: error.message,
        });
    }
};

export const getJobSearchCount = async (req, res) => {
    try {
        const id = req.body.data;

        const count = await redisCli.get(`searchJobCount:${id}`);

        if(!count) {
            return res.status(404).json({
                success: false,
                message: '공고 id 가 존재하지 않거나 조회 횟수가 없습니다.'
            });
        }

         res.status(200).json({
            success: true,
            message: '조회 횟수 출력 성공',
            data: {
                searchCount: count
            }
         });
    } catch(err) {
        console.error('공고 조회 횟수 출력 중 오류 : ', err);
        throw err;
    }
};

export const fullJobCount = async (req, res) => {
    try {
        await mongodb();

        const fullCount = await JobData.countDocuments();

        res.status(200).json({
            success: true,
            message: '전체 공고 개수 조회',
            data: {
                jobCount: fullCount
            }
        });
    } catch(err) {
        console.error("전체 공고 조회 중 오류 : ", err);
        throw err;
    }
};