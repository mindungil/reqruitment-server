import express from 'express'
import {applyJob, canncelApply, applicationList} from '../controler/applicationControler.js'
import checkToken from '../middlewares/tokenMiddleware.js';
const applicationRouter = express.Router();

applicationRouter.post('/', applyJob);
applicationRouter.get('/', applicationList);
applicationRouter.delete('/:id', canncelApply);

export default applicationRouter;