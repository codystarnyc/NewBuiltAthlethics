import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { env } from './config/env';
import routes from './routes';
import { errorHandler } from './middleware/errorHandler';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: false }));

if (env.isDev) {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { status: false, message: 'Too many requests, please try again later' },
});
app.use('/api', limiter);

app.use('/api', routes);

// Legacy route: old mobile app hits /apiv2/order/* directly
app.use(routes);

app.get('*', (_req, res) => {
  res.status(404).json({ status: false, message: 'Route not found' });
});

app.use(errorHandler);

app.listen(env.port, () => {
  console.log(`ImageUploadAPI v2 running on port ${env.port} [${env.nodeEnv}]`);
});

export default app;
