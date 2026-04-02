import express from 'express';
import path from 'path';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { env } from './config/env';
import routes from './routes';
import adminRoutes from './routes/admin.routes';
import { errorHandler } from './middleware/errorHandler';

const app = express();

app.use(helmet({ contentSecurityPolicy: false, crossOriginEmbedderPolicy: false }));
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

// Admin dashboard runtime config (from env; never send client secret to the browser)
app.get('/admin/config.js', (_req, res) => {
  res.type('application/javascript');
  res.set('Cache-Control', 'no-store');
  const payload = {
    API_URL: '',
    fitnessOnDemand: {
      flexUrl: env.fitnessOnDemand.flexUrl,
      managementUrl: env.fitnessOnDemand.managementUrl,
      clientId: env.fitnessOnDemand.clientId,
      adminEmail: env.fitnessOnDemand.adminEmail,
    },
  };
  res.send(`window.__CONFIG__ = ${JSON.stringify(payload)};`);
});

// Admin dashboard (served as static HTML)
app.use('/admin', express.static(path.join(__dirname, 'admin')));

// Admin API
app.use('/api/admin', adminRoutes);

// Main API routes
app.use('/api', routes);

// Legacy route: old mobile app hits root-level endpoints directly
app.use(routes);

app.use((_req, res) => {
  res.status(404).json({ status: false, message: 'Route not found' });
});

app.use(errorHandler);

app.listen(env.port, () => {
  console.log(`Built Athletics API running on port ${env.port} [${env.nodeEnv}]`);
  console.log(`Admin dashboard: http://localhost:${env.port}/admin`);
});

export default app;
