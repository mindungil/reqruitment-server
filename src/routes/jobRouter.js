import express from 'express'
import { getJobs, insertJob, deleteJob, updateJob, getJobId } from '../../controler/jobControler.js';
import checkToken from '../../middlewares/tokenMiddleware.js';
const jobRouter = express.Router();

jobRouter.get('/getjobs', getJobs);
jobRouter.get('/getjobs/:id', getJobId);
jobRouter.post('/insertjobs', insertJob);
jobRouter.post('/updatejobs', updateJob);
jobRouter.post('/deletejobs', deleteJob);


export default jobRouter;