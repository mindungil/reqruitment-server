import express from 'express'
import {applyJob, canncelApply, applicationList} from '../../controler/applicationControler.js'

const applicationRouter = express.Router();

applicationRouter.post('/', applyJob);
applicationRouter.get('/', applicationList);
applicationRouter.delete('/:id', canncelApply);

export default applicationRouter;