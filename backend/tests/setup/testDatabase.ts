import { Pool } from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { sequelize } from '../../src/config/database';

dotenv.config({ path: path.resolve(__dirname, '../../.env.test') });

const pool = new Pool({
  user: process.env.DB_USER || 'test_user',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'kuafor_test',
  password: process.env.DB_PASSWORD || 'test_password',
  port: parseInt(process.env.DB_PORT || '5432', 10),
});
export const teardownTestDatabase = async () => {
  console.log('Tearing down test database...');
  try {
    await pool.end();
    console.log('Test database teardown complete.');
  } catch (error) {
    console.error('Error tearing down test database:', error);
    throw error;
  }
};

export const initializeAndSyncDatabase = async (): Promise<void> => {
  try {
    const forceSync = false;

    await sequelize.sync({ force: forceSync });
  } catch (error) {
    throw error;
  }
};
initializeAndSyncDatabase();
