import 'dotenv/config';

import app from './src/app.js';

const port = process.env.PORT;

const server = () => {
    app.listen(port, () => {
        console.log(`서버가 실행되었습니다. http://localhost:${port}`);
    });
};

server();