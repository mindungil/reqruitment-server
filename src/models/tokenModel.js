import redisCli from '../config/redis.js';

// 토큰 저장 (14일 만료)
export const storeRefreshToken = async (userEmail, refreshToken) => {
  try {
    await redisCli.setEx(`refreshToken:${userEmail}`, 1209600, refreshToken); // 14일 = 1209600초
    console.log(`Refresh token stored for ${userEmail}`);
  } catch (error) {
    console.error('Error storing refresh token:', error.message);
    throw new Error('Failed to store refresh token');
  }
};

// 토큰 조회
export const getRefreshToken = async (userEmail) => {
  try {
    const token = await redisCli.get(`refreshToken:${userEmail}`);
    if (!token) throw new Error('Token not found');
    return token;
  } catch (error) {
    console.error('Error fetching refresh token:', error.message);
    throw new Error('Failed to fetch refresh token');
  }
};

// 토큰 삭제
export const deleteRefreshToken = async (userEmail) => {
  try {
    const result = await redisCli.del(`refreshToken:${userEmail}`);
    if (result === 0) throw new Error('Token not found or already deleted');
    console.log(`Refresh token deleted for ${userEmail}`);
  } catch (error) {
    console.error('Error deleting refresh token:', error.message);
    throw new Error('Failed to delete refresh token');
  }
};

// 모든 토큰 삭제
export const clearAllTokens = async () => {
  try {
    const keys = await redisCli.keys('refreshToken:*');
    if (keys.length) {
      await redisCli.del(keys);
      console.log('All refresh tokens cleared.');
    } else {
      console.log('No tokens to clear.');
    }
  } catch (error) {
    console.error('Error clearing all tokens:', error.message);
    throw new Error('Failed to clear all tokens');
  }
};

export const storeAccessToken = async (userEmail, accessToken) => {
  try {
    await redisCli.setEx(`accessToken:${userEmail}`, 3600, accessToken);
    console.log(`access Token stored for ${userEmail}`);
  } catch (error) {
    console.error('Error storing access token:', error.message);
    throw new Error('Failed to store access token');
  }
};

export const getAccessToken = async (userEmail, accessToken) => {
  try {
    const token = await redisCli.get(`accessToken:${userEmail}`);
    if(!token) throw new Error('Token not found');
    return token;
  } catch(err) {
    console.error('Error fetching acess token:', err.message);
    throw new Error('Failed to fetch access token');
  }
};

export const deleteAccessToken = async (userEmail) => {
  try {
    const result = await redisCli.del(`accessToken:${userEmail}`);
    if (result === 0) throw new Error('Token not found or already deleted');
    console.log(`Access token deleted for ${userEmail}`);
  } catch (error) {
    console.error('Error deleting Access token:', error.message);
    throw new Error('Failed to delete Access token');
  }
};