// models/index.js
import mongoose from 'mongoose';
import users from './userModel';
import reviews from './reviewModel';
import favorites from './favoriteModel';
import applications from './applicationModel';
import jobDatas from './jobOpenings';
import companys from './companys';

// 모든 모델을 하나의 객체로 내보내기
module.exports = {
  users,
  jobs,
  applications,
  reviews,
  jobDatas,
  companys,
  favorites
};
