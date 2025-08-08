import { Sequelize } from 'sequelize';
import Enum  from './env';
import logger from './logger';

const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  return 'Bilinmeyen hata';
};
const config = {
  database: Enum.DB_NAME,
  username: Enum.DB_USER,
  password: Enum.DB_PASSWORD,
  host: Enum.DB_HOST,
  port: Enum.DB_PORT,
  dialect: 'postgres' as const,
  logging: true,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  define: {
    timestamps: true,
    underscored: false, 
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  }
};

export const sequelize = new Sequelize(config);

export const testConnection = async (): Promise<boolean> => {
  try {
    await sequelize.authenticate();
    logger.info('Database connection established successfully', {
      database: config.database,
      host: config.host,
      environment: Enum.NODE_ENV
    });
    return true;
  } catch (error) {
    logger.error('Unable to connect to database', {
      error: getErrorMessage(error),
      database: config.database,
      host: config.host
    });
    return false;
  }
};
export const initializeAndSyncDatabase = async (): Promise<void> => {
  try {
    await testConnection();
    const forceSync = true;
    logger.info('Initializing database tables', { 
      forceSync, 
      environment: Enum.NODE_ENV 
    });
    await sequelize.sync({force: forceSync});
    logger.info('Database tables initialized successfully');
  } catch (error) {
    logger.error('Database initialization failed', {
      error: getErrorMessage(error)
    });
    throw error;
  }
};
export const healthCheck = async () => {
  try {
    const startTime = Date.now();
    await sequelize.authenticate();
    const responseTime = Date.now() - startTime;
    return {
      status: 'healthy',
      responseTime: `${responseTime}ms`,
      database: config.database,
      host: config.host
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      error: getErrorMessage(error),
      database: config.database,
      host: config.host
    };
  }
};
export const closeConnection = async (): Promise<void> => {
  try {
    await sequelize.close();
    logger.info('Database connection closed');
  } catch (error) {
    logger.error('Error closing database connection', { 
      error: getErrorMessage(error) 
    });
    throw error;
  }
};
export default sequelize; 