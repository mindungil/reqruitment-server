import express from 'express'
import { getJobs, insertJob, deleteJob, updateJob } from '../../controler/jobControler.js';

const jobRouter = express.Router();

jobRouter.get('/getjobs', getJobs);
jobRouter.post('/insertjobs', insertJob);
jobRouter.post('/updatejobs', updateJob);
jobRouter.post('/deletejobs', deleteJob);

export default jobRouter;