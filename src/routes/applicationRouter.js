import express from 'express'
import {applyJob, canncelApply, applicationList, getApplicationCount} from '../controler/applicationControler.js'
import checkToken from '../middlewares/tokenMiddleware.js';
const applicationRouter = express.Router();

applicationRouter.post('/', applyJob);
applicationRouter.get('/', applicationList);
applicationRouter.delete('/:id', canncelApply);
applicationRouter.get('/count', getApplicationCount);

export default applicationRouter;