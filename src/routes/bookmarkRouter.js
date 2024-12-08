import express from 'express'
import { insertBookmark, getBookmark } from '../controler/bookmarkControler.js';
import checkToken from '../middlewares/tokenMiddleware.js';
const bookmarkRouter = express.Router();

bookmarkRouter.post('/', insertBookmark);
bookmarkRouter.get('/', getBookmark);

export default bookmarkRouter;