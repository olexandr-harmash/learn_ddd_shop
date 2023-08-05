import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import fileUpload from "express-fileupload";

import {
    v1Router
} from './api/v1';

const origin = {
    // origin: isProduction ? 'https://dddforum.com' : '*',
    origin: "*"
}

const app = express();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors(origin))
app.use(helmet())
app.use(morgan('combined'))
app.use(fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
}));

app.use('/api/v1', v1Router)

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`[App]: Listening on port ${port}`)
})