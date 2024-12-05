import express from 'express'
import { signin, signout, signup, updateUser } from '../../controler/authControler.js'
import checkToken from '../../middlewares/tokenMiddleware.js';
import { makeAccessToken, makeRefreshToken } from '../../controler/tokenControler.js';
import { userProfile, resign } from '../../controler/userControler.js';

const authRouter = express.Router();

authRouter.post('/signin', signin);

authRouter.post('/signup', signup);

authRouter.post('/signout', signout);

authRouter.post('/updateUser', checkToken, updateUser);

authRouter.post('/access', makeAccessToken);

authRouter.post('/refresh', makeRefreshToken);

authRouter.post('/profile', userProfile);

authRouter.post('/resign', resign);

export default authRouter;