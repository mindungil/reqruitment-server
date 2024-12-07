import express from 'express'
import { insertBookmark, getBookmark } from '../../controler/bookmarkControler.js';

const bookmarkRouter = express.Router();

bookmarkRouter.post('/', insertBookmark);
bookmarkRouter.get('/', getBookmark);

export default bookmarkRouter;