import mongoose from 'mongoose';
import { mongodb } from '../config/mongodb.js';

const start = async () => {
    try{
        await mongodb();
        console.log("연결 성공");
    } catch(err) {
        console.error("연결 오류 : ", err);
        throw err;
    }
};

start();

const userSchema = new mongoose( {
    이름: String,
    성별: String,
    나이: Number,
    경력: String,
    이메일: String
})

userSchema.index({이메일: 1}, {unique: true});

