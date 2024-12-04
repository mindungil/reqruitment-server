import express from 'express'
import {signup} from '../../controler/authControler'

const router = express.Router();

router.post('/signup', signup);