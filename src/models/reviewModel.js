import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    회사: String,
    작성자: String,
    평점: Number,
    평가: String,
    등록날짜: String,
});

module.exports = mongoose.model('reviews', reviewSchema);