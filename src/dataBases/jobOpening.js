import mongoose from 'mongoose';
import fs from 'fs';
import csv from 'csv-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import { mongodb } from '../config/mongodb.js';

const start = async ()=> {
  try{
      await mongodb();
      console.log("연걸 성공");
  }catch(err){
    console.error("연결 오류 : ", err);
    throw err;
  }
};

start();

const jobDataSchema = new mongoose.Schema({
    회사명: String,
    제목: String, // 공고에서 제목이 유일하므로, 공고 중복 방지
    링크: String,
    지역: String,
    경력: String,
    학력: String,
    고용형태: String,
    마감일: String,
    직무분야: String,
    기타정보: String,
    갱신날짜: String,
  });

jobDataSchema.index({제목: 1}, {unique: true});

const jobData = mongoose.model('job_data', jobDataSchema);
  
  // 파일 경로 설정
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const filePath = path.resolve(__dirname, '../../crawler/jobData.csv');
 
// 파일 존재 확인
if (!fs.existsSync(filePath)) {
  console.error('CSV 파일이 존재하지 않습니다:', filePath);
  process.exit(1);
}
  
const jobs = [];  // 데이터를 일괄 저장할 배열
  
  // CSV 파일 읽고 데이터 저장
fs.createReadStream(filePath)
  .pipe(csv())
  .on('data', (row) => {
    jobs.push(row);  // 일괄 저장을 위해 배열에 추가
  })
  .on('end', async () => {
    try {
      await jobData.insertMany(jobs, {ordered: false});
      console.log('모든 데이터가 저장되었습니다.');
    } catch (error) {
      if (error.code === 11000) {
        console.log(`중복된 데이터 무시되고 저장`);
      } else {
        console.error(`에러 발생: ${error}`);
      }
    } finally {
      mongoose.disconnect().then(() => {
        console.log('MongoDB 연결이 종료되었습니다.');
    });
    }
  })
  .on('error', (error) => {
    console.error('CSV 파일 처리 중 에러 발생:', error);
    mongoose.disconnect();
  });