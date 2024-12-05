import express from 'express'
import { makeAccessToken, makeRefreshToken } from '../../controler/tokenControler.js';

const tokenRouter = express.Router();

tokenRouter.post('/access', makeAccessToken);
tokenRouter.post('/refresh', makeRefreshToken);

export default tokenRouter;