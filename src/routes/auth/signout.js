import express, { Router } from 'express'
import signout from '../../controler/authControler'

const router = express.Router();

router.post('/signout', signout);
