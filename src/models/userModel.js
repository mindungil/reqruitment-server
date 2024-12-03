import mongoose from 'mongoose';

const userSchema = new mongoose( {
    이름: String,
    성별: String,
    나이: Number,
    경력: String,
    이메일: String
})

userSchema.index({이메일: 1}, {unique: true});

module.exports = mongoose.model('users', userSchema);