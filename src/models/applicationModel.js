import mongoose from "mongoose";
import { mongodb } from '../config/mongodb.js';

const applicationSchema = new mongoose.Schema({
    지원공고: String,
    회사명: String,
    지원자: String,
    이메일: String,
    지원날짜: String,
    지원상태: String,
});

export default mongoose.model('Application', applicationSchema);