import mongoose from "mongoose";
import { mongodb } from "../config/mongodb";

const start = async () => {
    try {
        await mongodb();
        console.log("연결 성공");
    } catch(err){
        console.error("연결 오류 : ", err);
        throw err;
    }
};

start();

const favoriteSchema = new mongoose.Schema({
    공고명: String,
    등록자: String,
    등록날짜: String,
});