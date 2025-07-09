import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import { config } from './config.js';
import contactsRouter from '../src/routers/contacts.js';
import { welcome } from './utils/wellcome.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';

export const setupServer = () => {
  const app = express();

  app.use(cors());

  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );


  app.get('/', (req, res) => {
    const accept = req.headers.accept || '';
    if (accept.includes('text/html')) {
      res.send(welcome());
    }
    res.status(200).json({status: 200, message: 'Hello. Wellcome to contacts!' });
  });

app.use(contactsRouter);

  app.use(notFoundHandler);

  app.use(errorHandler);

  app.listen(config.port, () => {
    console.log(`Server is running on port ${config.port}`);
  });
};
