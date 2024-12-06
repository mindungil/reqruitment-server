import express from 'express'
import { getJobs, insertJob, deleteJob } from '../../controler/jobControler.js';

const jobRouter = express.Router();

jobRouter.get('/getjobs', getJobs);
jobRouter.post('/insertjobs', insertJob);
// jobRouter.post('/updateJob', updateJob);
jobRouter.post('/deletejobs', deleteJob);

export default jobRouter;