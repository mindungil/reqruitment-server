import express from 'express'
import { signin, signout, signup, updateUser } from '../controler/authControler.js'
import checkToken from '../middlewares/tokenMiddleware.js';
import { makeAccessToken, makeRefreshToken } from '../controler/tokenControler.js';
import { userProfile, resign } from '../controler/userControler.js';

const authRouter = express.Router();

authRouter.post('/login', signin);

authRouter.post('/register', signup);

authRouter.post('/logout', signout);

authRouter.put('/profile', checkToken, updateUser);

authRouter.post('/refresh', makeAccessToken);

authRouter.get('/profile', checkToken, userProfile);

authRouter.post('/resigns', checkToken, resign);

export default authRouter;