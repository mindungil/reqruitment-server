import mongoose from 'mongoose';

const userSchema = new mongoose.Schema( {
    이름: String,
    성별: String,
    나이: Number,
    경력: String,
    이메일: String,
    비밀번호: String
})

userSchema.index({이메일: 2}, {unique: true});

export default mongoose.model('User', userSchema);