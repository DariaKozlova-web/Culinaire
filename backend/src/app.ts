import '#db';
import cors from 'cors';
import express from 'express';
import cookieParser from 'cookie-parser';
import { authRouter, categoryRouter, chefRouter, recipeRouter, profileRouter } from '#routes';
import { errorHandler } from '#middlewares';
import { CLIENT_BASE_URL } from '#config';

const app = express();
const port = process.env.PORT || '3000';

app.use(
  cors({
    origin: CLIENT_BASE_URL, // for use with credentials, origin(s) need to be specified
    credentials: true, // sends and receives secure cookies
    exposedHeaders: ['WWW-Authenticate'] // needed to send the refresh trigger
  })
);

app.use(express.json(), cookieParser());

app.get('/error', (req, res) => {
  throw new Error('Something went wrong', { cause: { status: 418 } });
});

app.use('/auth', authRouter);

app.use('/profile', profileRouter);

app.use('/categories', categoryRouter);

app.use('/chefs', chefRouter);

app.use('/recipes', recipeRouter);

app.use('*splat', (req, res) => {
  res.status(404).json({ message: 'Not found' });
});
app.use(errorHandler);

app.listen(port, () => {
  console.info(`Auth server listening on port ${port}`);
});
