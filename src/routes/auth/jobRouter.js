import express from 'express'
import { getJobs, insertJob, deleteJob, updateJob, getJobDetails } from '../../controler/jobControler.js';

const jobRouter = express.Router();

jobRouter.get('/getjobs', getJobs);
jobRouter.post('/insertjobs', insertJob);
jobRouter.post('/updatejobs', updateJob);
jobRouter.post('/deletejobs', deleteJob);
jobRouter.get('/getjobdetails', getJobDetails);

export default jobRouter;