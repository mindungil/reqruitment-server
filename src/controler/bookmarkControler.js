import redisCli from "../config/redis.js";
import JobData from "../models/jobOpenings.js";
import mongoose from "mongoose";
import { mongodb } from "../config/mongodb.js";

export const insertBookmark = async (req, res) => {
    try {
        await mongodb();

        const { id, user } = req.body.data;

        const jobData = await JobData.findOne({ _id: new mongoose.Types.ObjectId(id) });
        if (!jobData) {
            return res.status(404).json({
                success: false,
                message: "잘못된 공고 Id",
            });
        }

        const jsonJobData = JSON.stringify(jobData);
        const bookmarkKey = `bookmark:${user}`;

        const checkData = await redisCli.sendCommand(['ZSCORE', bookmarkKey, jsonJobData]);

        if (checkData) {
            await redisCli.sendCommand(['ZREM', bookmarkKey, jsonJobData]);
            return res.status(200).json({
                success: true,
                message: "북마크 삭제 완료",
                data: { user },
            });
        } else {
            const timestamp = Date.now();
            await redisCli.sendCommand(['ZADD', bookmarkKey, timestamp.toString(), jsonJobData]);
            return res.status(200).json({
                success: true,
                message: "북마크 저장 완료",
                data: { jobData },
            });
        }
    } catch (err) {
        console.error("북마크 저장 중 오류:", err);
        return res.status(500).json({
            success: false,
            message: "서버 오류 발생",
        });
    }
};

export const getBookmark = async (req, res) => {
    try {
        await mongodb();

        const { user, page = 1, limit = 10 } = req.query;

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "유저 정보 필요",
            });
        }

        const offset = (page - 1) * limit;
        const end = offset + limit - 1;

        const bookmarkKey = `bookmark:${user}`;

        const checkBookmarks = await redisCli.sendCommand([
            "ZREVRANGE",
            bookmarkKey,
            offset.toString(),
            end.toString(),
            "WITHSCORES",
        ]);

        if (!checkBookmarks || checkBookmarks.length === 0) {
            return res.status(200).json({
                success: true,
                message: "북마크 목록이 비어있습니다.",
                data: {
                    bookmarks: [],
                    currentPage: page,
                    totalBookmarks: 0,
                },
            });
        }

        // 전체 북마크 수 확인
        const totalBookmarks = await redisCli.sendCommand(["ZCARD", bookmarkKey]);

        const bookmarks = [];
        for (let i = 0; i < checkBookmarks.length; i += 2) {
            bookmarks.push({
                jobData: JSON.parse(checkBookmarks[i]), // 데이터
                timestamp: parseInt(checkBookmarks[i + 1], 10), // 타임스탬프
            });
        }

        res.status(200).json({
            success: true,
            message: "북마크 조회 성공",
            data: {
                bookmarks,
                currentPage: page,
                totalBookmarks,
            },
        });
    } catch (err) {
        console.error("북마크 조회 중 오류:", err);
        return res.status(500).json({
            success: false,
            message: "서버 오류 발생",
        });
    }
};
