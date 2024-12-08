import express from 'express'
import { getJobs, insertJob, deleteJob, updateJob, getJobId, fullJobCount, getJobSearchCount } from '../controler/jobControler.js';
const jobRouter = express.Router();

jobRouter.get('/getjobs', getJobs);
jobRouter.get('/getjobs/:id', getJobId);
jobRouter.post('/insertjobs', insertJob);
jobRouter.post('/updatejobs', updateJob);
jobRouter.post('/deletejobs', deleteJob);
jobRouter.post('/count', getJobSearchCount);
jobRouter.get('/fullcount', fullJobCount);


export default jobRouter;