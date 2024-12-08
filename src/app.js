import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import authRouter from "./routes/authRouter.js";
import cors from 'cors'
import { mongodb } from "./config/mongodb.js";
import jobRouter from "./routes/jobRouter.js";
import applicationRouter from "./routes/applicationRouter.js";
import bookmarkRouter from "./routes/bookmarkRouter.js"
import checkToken from "./middlewares/tokenMiddleware.js";

dotenv.config(); 

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({ exposedHeaders: ['Authorization', 'X-Refresh-Token'] }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("This is a Reqruitment-server");
});


app.use("/auth", authRouter);
app.use("/jobs", checkToken, jobRouter);
app.use("/applications", checkToken, applicationRouter);
app.use("/bookmarks", checkToken, bookmarkRouter);

app.listen(port, () => {
  console.log(`서버에 연결되었습니다. port: ${port} http://localhost:${port}/`);
});
