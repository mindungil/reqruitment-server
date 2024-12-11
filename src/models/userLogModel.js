import mongoose from "mongoose";

const userLogSchema = new mongoose.Schema({
    이름: String,
    이메일: String,
    시간: String
});

export default mongoose.model('UserLog', userLogSchema);