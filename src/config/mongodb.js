import mongoose from 'mongoose';

export const mongodb = async () => {
    try {
        const mongoURI = 'mongodb://localhost:27017/job_opening';
        mongoose.set('strictQuery', false);  // 최신 Mongoose 설정 권장
        await mongoose.connect(mongoURI);
        
        const db = mongoose.connection;

        db.on('error', console.error.bind(console, '연결 실패 : '));
        db.once('open', () => {
          console.log('연결 성공');
        });
    } catch(err){
        console.error("DataBase 접속 err : ", err);
        throw err;
    }
};

