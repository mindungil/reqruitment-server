import mongoose from "mongoose";
import { mongodb } from '../config/mongodb.js';

const applicationSchema = new mongoose.Schema({
    지원공고: String,
    지원자: String,
    지원날짜: String,

});

module.exports = mongoose.model('applicationss', applicationSchema);