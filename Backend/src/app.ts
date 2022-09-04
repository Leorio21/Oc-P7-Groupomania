import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import path from 'path';
import { Request, Response, NextFunction } from 'express'


require('dotenv').config();

import userRoutes from './routes/user';
import postRoutes from './routes/post';

const app = express();

app.use(cors());
app.use(helmet());


app.use(express.json());

app.use((req: Request, res: Response, next: NextFunction) => {
    res.setHeader('Cross-Origin-Resource-Policy', '*');
    next();
});

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/auth', userRoutes);

app.use('/api/post', postRoutes);

export default app;
