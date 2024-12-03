import mongoose from "mongoose";
import { mongodb } from '../config/mongodb.js';

const start = async () => {
    try {
        await mongodb();
        console.log("연결 성공");
    } catch(err) {
        console.error("연결 오류 : ", err);
        throw err;
    }
};

start();

const applicationSchema = new mongoose.Schema({
    지원공고: String,
    지원자: String,
    지원날짜: String,

});