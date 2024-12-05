import express from 'express'
import { getJobs, searchJobs, sortJobs } from '../../controler/jobControler.js';

const jobRouter = express.Router();

jobRouter.get('/getjobs', getJobs);
// jobRouter.post('/insertJob', insertJob);
// jobRouter.post('/updateJob', updateJob);
// jobRouter.post('/deleteJob', deleteJob);

export default jobRouter;