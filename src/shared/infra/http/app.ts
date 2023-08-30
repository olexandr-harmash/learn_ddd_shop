import 'dotenv/config'
import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import fileUpload from "express-fileupload";

const origin = {
    // origin: isProduction ? 'https://dddforum.com' : '*',
    origin: "*"
}

export const app = express();

// set the view engine to ejs
app.set('view engine', process.env.VIEW_ENGINE ?? 'ejs');

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors(origin))
app.use(helmet())
app.use(morgan('combined'))
app.use(fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
}));

app.use(express.static(process.env.VIEW_DIR ?? 'views'));

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`[App]: Listening on port ${port}`)
})