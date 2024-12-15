import mongoose from 'mongoose';
import 'dotenv/config';

export const mongodb = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI;
        mongoose.set('strictQuery', false);  // 최신 Mongoose 설정 권장
        await mongoose.connect(mongoURI);
        
        const db = mongoose.connection;
        console.log("연결 성공 !!~~!!");
        
        db.on('error', console.error.bind(console, '연결 실패 : '));
        db.once('open', () => {
          console.log('연결 성공~~');
        });
    } catch(err){
        console.error("DataBase 접속 err : ", err);
        throw err;
    }
};

