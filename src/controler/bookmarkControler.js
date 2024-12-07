import redisCli from "../config/redis.js";
import JobData from "../models/jobOpenings.js";
import mongoose from "mongoose";
import { mongodb } from "../config/mongodb.js";

export const insertBookmark = async (req, res) => {
    try {
        await mongodb();

        const { id, user } = req.body.data;

        const jobData = await JobData.findOne({_id: new mongoose.Types.ObjectId(id)});
        if(!jobData) {
            return res.status(404).json({
                success: false,
                message: "잘못된 공고 Id"
            })
        }

        const jsonJobData = JSON.stringify(jobData);
        const checkData = await redisCli.get(`bookmark:${user}:${id}`);

        let redisData;

        console.log(checkData);

        if(checkData) {
            redisData = await redisCli.del(`bookmark:${user}:${id}`);

            return res.status(200).json({
                success: true,
                message: '북마크 삭제 완료',
                data: {
                    user: user
                }
            });
        }
        else{
            redisData = await redisCli.set(`bookmark:${user}:${id}`, jsonJobData);
            res.status(200).json({
                success: true,
                message: '북마크 저장 완료',
                data: {
                    jobData: redisData
                }
            });
        }
    } catch(err) {
        console.log("북마크 저장 중 오류 : ", err);
        throw err;
    }
};

export const getBookmark = async (req, res) => {
    try {
        await mongodb();

        const { user } = req.body.data;

        if(!user) {
            return res.status(404).json({
                success: false,
                message: '유저 정보 필요'
            });
        }

        const checkBookmark = await redisCli.get(`bookmark:${user}`);
        const bookmarkList = JSON.stringify(checkBookmark);

        res.status(200).json({
            success: true,
            message: '북마크 조회 성공',
            data: {
                bookmark: bookmarkList
            }
        });
    } catch(err) {
        console.error("북마크 조회 중 오류 : ", err);
        throw err;
    }
};