import express from 'express'
import signin from '../../controler/authControler'

const router = express.Router();

router.post('/signin', signin);