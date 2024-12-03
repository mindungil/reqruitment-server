import express from "express"
import bodyParser from "body-parser";

const app = express();
const port = process.env.port || 3000;

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

app.get('/', (req, res)=> {
    res.send("hello");
})

app.listen(port, () => {
    console.log(`서버에 연결되었습니다. port: ${port} http://localhost:${port}/`);
});