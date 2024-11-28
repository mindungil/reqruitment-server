import fs from "fs";
import csvParser from "csv-parser";
import { createClient } from "redis";

require('dotenv').config();

// Redis 클라이언트 생성
const redisClient = createClient({
  socket: {
    host: process.env.REDIS_HOST, // Redis 클라우드 호스트 주소
    port: process.env.REDIS_PORT,   // Redis 클라우드 포트
  },
  password: process.env.REDIS_PASSWORD, // Redis 클라우드 비밀번호
});

redisClient.on('error', (err) => console.error('Redis Client Error', err));

async function main() {
  try {
    await redisClient.connect(); // Redis 클라우드 연결
    console.log('Connected to Redis Cloud');

    // CSV 파일 읽기
    const filePath = '../../crawler/saramin_crawling.csv'; // CSV 파일 경로
    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on('data', async (row) => {
        // 고유 키 생성
        const uniqueKey = `${row.회사명}:${row.제목}`;

        // 데이터를 JSON으로 저장
        await redisClient.set(uniqueKey, JSON.stringify(row));

        // 또는 Hash로 저장
        /*
        await redisClient.hSet(uniqueKey, {
          회사명: row.회사명,
          제목: row.제목,
          링크: row.링크,
          지역: row.지역,
          경력: row.경력,
          학력: row.학력,
          고용형태: row.고용형태,
          마감일: row.마감일,
          직무분야: row.직무분야,
          기타정보: row.기타정보,
        });
        */
      })
      .on('end', async () => {
        console.log('CSV file processed and data saved to Redis Cloud');
        await redisClient.quit(); // Redis 연결 종료
      })
      .on('error', (err) => {
        console.error('Error reading CSV file:', err);
      });
  } catch (err) {
    console.error('Error connecting to Redis Cloud:', err);
  }
}

main();
