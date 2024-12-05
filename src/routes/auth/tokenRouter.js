import express from 'express'
import { makeAccessToken, makeRefreshToken } from '../../controler/tokenControler';

const app = express.Router();

app.post('/access', makeAccessToken);
app.post('/refresh', makeRefreshToken);