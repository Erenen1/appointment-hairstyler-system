import dotenv from 'dotenv';

dotenv.config({ path: '.env.test' });

export class TestEnvironment {
  static setup(): void {
    // Test için environment variables
    process.env.NODE_ENV = 'test';
    process.env.DB_HOST = process.env.DB_HOST || 'localhost';
    process.env.DB_PORT = process.env.DB_PORT || '5433';
    process.env.DB_NAME = process.env.DB_NAME || 'kuafor_test';
    process.env.DB_USER = process.env.DB_USER || 'test_user';
    process.env.DB_PASSWORD = process.env.DB_PASSWORD || 'test_password';
    process.env.SESSION_SECRET = process.env.SESSION_SECRET || 'test_session_secret_for_testing_only';
    process.env.PORT = process.env.PORT || '3001';
    
    // Logger'ı sessiz yap
    process.env.LOG_LEVEL = 'error';
}

  static getDatabaseConfig() {
    return {
      database: process.env.DB_NAME || 'kuafor_test',
      username: process.env.DB_USER || 'test_user', 
      password: process.env.DB_PASSWORD || 'test_password',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5433'),
      dialect: 'postgres' as const
    };
  }

} 