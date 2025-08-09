import { Pool } from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

dotenv.config({ path: path.resolve(__dirname, '../../.env.test') }); 

const pool = new Pool({
  user: process.env.DB_USER || 'test_user',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'kuafor_test',
  password: process.env.DB_PASSWORD || 'test_password',
  port: parseInt(process.env.DB_PORT || '5432', 10),
});

/**
 * Executes a SQL file.
 * @param filePath - The path to the SQL file.
 */
const executeSqlFile = async (filePath: string) => {
  const sql = fs.readFileSync(filePath, 'utf8');
  await pool.query(sql);
};

/**
 * Sets up the test database by dropping existing tables, recreating the schema, and seeding data.
 */
export const setupTestDatabase = async () => {
  console.log('Setting up test database...');
  try {
    // Drop all existing tables
    await pool.query(`
      DROP SCHEMA public CASCADE;
      CREATE SCHEMA public;
      GRANT ALL ON SCHEMA public TO public;
    `);

    // Create database schema
    await executeSqlFile(path.resolve(__dirname, '../../src/mock/database.sql'));

    // Seed initial data
    await executeSqlFile(path.resolve(__dirname, '../../src/mock/seed.sql'));

    console.log('Test database setup complete.');
  } catch (error) {
    console.error('Error setting up test database:', error);
    throw error;
  }
};

/**
 * Tears down the test database by ending the connection pool.
 */
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