import express from "express";
import cors from "cors";
import Enum  from "./config/env";
import { corsConfig } from "./config/cors";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";
import { requestLogger } from "./middleware/requestLogger";
import logger, { loggerHelpers } from "./config/logger";
import { LogManager } from "./utils/logUtils";
import { initializeAndSyncDatabase } from "./config/database";
import routes, { setupSwagger } from "./routes";
const app = express();


app.use(cors(corsConfig));
LogManager.ensureLogDirectory();
app.use(requestLogger);
app.use(express.json());
app.use('/', routes);
setupSwagger(app);

const initializeDatabase = async () => {
  try {
    await initializeAndSyncDatabase();
  } catch (error) {
    logger.error('Database initialization failed - shutting down', {
      error: error instanceof Error ? error.message : String(error)
    });
    process.exit(1);
  }
};
console.log(Enum.NODE_ENV);
loggerHelpers.system('Application Started', {
  port: Enum.PORT,
  environment: Enum.NODE_ENV,
  nodeVersion: process.version,
  database: {
    name: Enum.DB_NAME,
    host: Enum.DB_HOST,
    port: Enum.DB_PORT
  }
});

app.use(notFoundHandler);
app.use(errorHandler);

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection', {
    reason,
    promise: promise.toString()
  });
});
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception', {
    error: error.message,
    stack: error.stack
  });
  process.exit(1);
});
const startServer = async () => {
  try {
    await initializeDatabase();
    app.listen(Enum.PORT, () => {
      logger.info(`Server is running on port ${Enum.PORT}`);
      logger.info('Available endpoints:', {
        health: '/health',
        database: '/health/database',
        server: '/health/server',
        liveness: '/health/liveness',
        readiness: '/health/readiness',
        auth: '/api/v1/auth'
      });
      setInterval(() => {
        LogManager.cleanOldLogs(30);
      }, 24 * 60 * 60 * 1000); 
    });
  } catch (error: unknown) {
    logger.error('Failed to start server', { error: error instanceof Error ? error.message : String(error) });
    process.exit(1);
  }
};
if (process.env.NODE_ENV !== 'test') {
  startServer();
}
export default app;