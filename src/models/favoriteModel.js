import mongoose from "mongoose";

const favoriteSchema = new mongoose.Schema({
    공고명: String,
    등록자: String,
    등록날짜: String,
});

export default mongoose.model('Favorite', favoriteSchema);