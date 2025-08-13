import { Sequelize } from 'sequelize';
import Enum  from './env';
import { initModels } from '../models';

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
  logging: false,
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

    return true;
  } catch (error) {
    return false;
  }
};
export const initializeAndSyncDatabase = async (): Promise<void> => {
  try {
    await testConnection();
    const forceSync = false;
    initModels(sequelize);
    // Gerekli şemaları oluştur
    const schemas = [
      'core',
      'auth',
      'crm',
      'listings',
      'schedule',
      'finance',
      'messaging',
      'settings',
      'geo',
      'analytics',
    ];
    for (const schema of schemas) {
      try { await (sequelize as any).createSchema(schema); } catch { /* mevcut olabilir */ }
    }
    await sequelize.sync({ force: forceSync, alter: true });
  } catch (error) {
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
  } catch (error) {
    throw error;
  }
};
export default sequelize; 