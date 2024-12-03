import mongoose from "mongoose";
import { mongodb } from "../config/mongodb";

const start = async () => {
    try {
        await mongodb();
        console.log("연결 성공");
    } catch(err) {
        console.error("연결 오류 : ", err);
        throw err;
    }
};

const reviewSchema = new mongoose.Schema({
    회사: String,
    작성자: String,
    평점: Number,
    평가: String,
    등록날짜: String,
});