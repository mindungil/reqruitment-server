import express from 'express'
import { getJobs } from '../../controler/jobControler.js';

const jobRouter = express.Router();

jobRouter.get('/getjob', getJobs);
// jobRouter.get('/searchJob', searchJob);
// jobRouter.get('/filterJob', filterJob);
// jobRouter.get('/sortJob', sortJob);
// jobRouter.post('/insertJob', insertJob);
// jobRouter.post('/updateJob', updateJob);
// jobRouter.post('/deleteJob', deleteJob);

export default jobRouter;