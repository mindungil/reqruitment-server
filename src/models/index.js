// models/index.js
import User from './userModel.js';
import Review from './reviewModel.js';
import Favorite from './favoriteModel.js';
import Application from './applicationModel.js';
import JobData from './jobOpenings.js';
import Company from './companys.js';

// 모든 모델을 하나의 객체로 내보내기
export default{
  User,
  Application,
  Review,
  JobData,
  Company,
  Favorite
};