// models/index.js
import mongoose from 'mongoose';
import User from './userModel';
import Review from './reviewModel';
import Favorite from './favoriteModel';
import Application from './applicationModel';
import JobData from './jobOpenings';
import Company from './companys';

// 모든 모델을 하나의 객체로 내보내기
module.exports = {
  User,
  Job,
  Application,
  Review,
  JobData,
  Company,
  Favorite
};
