import { Router, Express } from 'express';
import swaggerUi from 'swagger-ui-express';
import { healthCheck, sequelize } from '../config/database';

const router = Router();

router.get('/health', async (_req, res) => {
  const db = await healthCheck();
  res.json({ status: 'ok', db });
});

router.get('/health/database', async (_req, res) => {
  const db = await healthCheck();
  res.json(db);
});

router.get('/health/server', (_req, res) => {
  res.json({ status: 'ok', uptime: process.uptime(), pid: process.pid, memory: process.memoryUsage() });
});

router.get('/health/liveness', (_req, res) => { res.status(204).send(); });
router.get('/health/readiness', async (_req, res) => {
  try { await sequelize.authenticate(); res.status(204).send(); } catch { res.status(503).send(); }
});

export const setupSwagger = (_app: Express) => {
  const swaggerDocument = {
    openapi: '3.0.0',
    info: { title: 'Real Estate SaaS API', version: '1.0.0' },
    paths: {
      '/health': { get: { summary: 'Health' } },
    },
  } as any;
  _app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
};

export default router;


