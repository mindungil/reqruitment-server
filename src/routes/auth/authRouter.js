import express from 'express'
import { signin, signout, signup, updateUser } from '../../controler/authControler.js'

const authRouter = express.Router();

authRouter.post('/signin', signin);

authRouter.post('/signup', signup);

authRouter.post('/signout', signout);

authRouter.post('/updateUser', tokenMiddleware, updateUser);

export default authRouter;