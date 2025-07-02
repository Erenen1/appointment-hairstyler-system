import { Sequelize } from 'sequelize';
import { TestEnvironment } from './testEnvironment';

export class TestDatabase {
  private static sequelize: Sequelize | null = null;
  private static models: any = null;

  static async initialize(): Promise<void> {
    try {
      // Test environment values
      const dbConfig = TestEnvironment.getDatabaseConfig();
      
      this.sequelize = new Sequelize({
        database: dbConfig.database,
        username: dbConfig.username,
        password: dbConfig.password,
        host: dbConfig.host,
        port: dbConfig.port,
        dialect: 'postgres',
        logging: console.log, // Test sırasında SQL loglarını kapat
        pool: {
          max: 5,
          min: 0,
          acquire: 30000,
          idle: 10000
        }
      });

      // Connection'ı test et
      await this.sequelize.authenticate();
      
      // Modelleri require et (CommonJS formatında)
      this.models = require('../../src/models');
      
      // Tabloları oluştur (force: true ile mevcut tabloları sil)
      await this.sequelize.sync({ force: true });
      
      console.log('✅ Test database initialized and synced');
    } catch (error) {
      console.error('❌ Test database initialization failed:', error);
      throw error;
    }
  }

  static async clean(): Promise<void> {
    if (!this.sequelize) return;

    try {
      // Daha güvenli cleanup - önce table'ların var olup olmadığını kontrol et
      const [results] = await this.sequelize.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_type = 'BASE TABLE'
      `);
      
      const existingTables = (results as any[]).map(row => row.table_name);
      
      // Temizlenecek tablolar (foreign key constraints için sıra önemli)
      const tableOrder = [
        'AppointmentHistories',
        'StaffServices', 
        'Appointments',
        'ServiceImages',
        'Services',
        'ServiceCategories',
        'GalleryImages',
        'GalleryCategories',
        'ContactMessages',
        'EmailTemplates',
        'SmsTemplates',
        'SiteSettings',
        'SpecialDays',
        'BusinessHours',
        'BusinessInfo',
        'Staff',
        'Customers',
        'admin'
      ];

      for (const tableName of tableOrder) {
        if (existingTables.includes(tableName)) {
          await this.sequelize.query(`TRUNCATE "${tableName}" RESTART IDENTITY CASCADE;`);
        }
      }
      
    } catch (error) {
      // Cleanup error'ları sessizce devam et
      console.debug('Database cleanup warning:', error);
    }
  }

  static async close(): Promise<void> {
    if (this.sequelize) {
      await this.sequelize.close();
      this.sequelize = null;
      this.models = null;
    }
  }

  static async forceClose(): Promise<void> {
    if (this.sequelize) {
      try {
        await this.sequelize.close();
      } catch (error) {
        console.warn('Warning during force close:', error);
      } finally {
        this.sequelize = null;
        this.models = null;
      }
    }
  }

  static getSequelize(): Sequelize {
    if (!this.sequelize) {
      throw new Error('Test database not initialized');
    }
    return this.sequelize;
  }

  static getModels() {
    if (!this.models) {
      throw new Error('Test models not initialized');
    }
    return this.models;
  }
} 