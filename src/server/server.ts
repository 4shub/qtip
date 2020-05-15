import express from 'express';
import bodyParser from 'body-parser';
import rootRouter from './root/root.router';
const app = express();

app.set('trust proxy', true);

app.use(bodyParser.json());

app.use(express.static('public'));

app.use(rootRouter);

app.listen(4225);

