import express from 'express'
import { getJobs, searchJobs } from '../../controler/jobControler.js';

const jobRouter = express.Router();

jobRouter.get('/getjob', getJobs);
jobRouter.get('/searchjobs', searchJobs);
// jobRouter.get('/filterJob', filterJob);
// jobRouter.get('/sortJob', sortJob);
// jobRouter.post('/insertJob', insertJob);
// jobRouter.post('/updateJob', updateJob);
// jobRouter.post('/deleteJob', deleteJob);

export default jobRouter;