import express from "express"

const app = express();
const port = process.env.port || 3000;

app.use(bodyParser.json());

app.listen(port, () => {
    console.log(`서버에 연결되었습니다. port: ${port}`);
})