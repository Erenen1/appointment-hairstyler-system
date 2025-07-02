import express from "express";
import cors from "cors";
import { Enum } from "./config/env";
import { sessionConfig, corsConfig } from "./config/session";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";
import { requestLogger } from "./middleware/requestLogger";
import logger, { loggerHelpers } from "./config/logger";
import { LogManager } from "./utils/logUtils";
import { initializeAndSyncDatabase } from "./config/database";
import routes, { setupSwagger } from "./routes";

const app = express();

LogManager.ensureLogDirectory();

app.use(requestLogger);

app.use(sessionConfig);

app.use(express.json());
app.use(cors(corsConfig));

// Routes
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

// Uygulama başlatıldığında log
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

// 404 handler - Bu artık en sona gelecek
app.use(notFoundHandler);

// Global error handler - Bu da en sona
app.use(errorHandler);

// Unhandled rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection', {
    reason,
    promise: promise.toString()
  });
});

// Uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception', {
    error: error.message,
    stack: error.stack
  });
  process.exit(1);
});

// Sunucu başlat
const startServer = async () => {
  try {
    // Database bağlantısını test et
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
      
      // Log dizini temizliği (günlük)
      setInterval(() => {
        LogManager.cleanOldLogs(30);
      }, 24 * 60 * 60 * 1000); // 24 saat
    });
  } catch (error: unknown) {
    logger.error('Failed to start server', { error: error instanceof Error ? error.message : String(error) });
    process.exit(1);
  }
};

// Production'da server'ı başlat, test'te başlatma
if (process.env.NODE_ENV !== 'test') {
  startServer();
}

// Test için app'i export et
export default app;