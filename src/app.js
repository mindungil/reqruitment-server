import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import authRouter from "./routes/auth/authRouter.js";
import { mongodb } from "./config/mongodb.js";

dotenv.config(); 

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("hello");
});

app.use("/auth", authRouter);

app.listen(port, () => {
  console.log(`서버에 연결되었습니다. port: ${port} http://localhost:${port}/`);
});
