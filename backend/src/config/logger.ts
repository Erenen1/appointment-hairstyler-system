import winston from 'winston';
import path from 'path';

// Log formatı tanımlama
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.json(),
  winston.format.prettyPrint()
);

// Console formatı (development için daha okunabilir)
const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: 'HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    let metaStr = '';
    if (Object.keys(meta).length > 0) {
      metaStr = '\n' + JSON.stringify(meta, null, 2);
    }
    return `[${timestamp}] ${level}: ${message}${metaStr}`;
  })
);

// Log dosyalarının saklanacağı klasör
const logDir = path.join(process.cwd(), 'logs');

// Winston logger konfigürasyonu
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: logFormat,
  defaultMeta: { 
    service: 'kuafor-backend',
    environment: process.env.NODE_ENV || 'development'
  },
  transports: [
    // Error log dosyası
    new winston.transports.File({
      filename: path.join(logDir, 'error.log'),
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      )
    }),

    // Combined log dosyası (tüm loglar)
    new winston.transports.File({
      filename: path.join(logDir, 'combined.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 5,
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      )
    }),

    // Access log dosyası (HTTP istekleri için)
    new winston.transports.File({
      filename: path.join(logDir, 'access.log'),
      level: 'http',
      maxsize: 5242880, // 5MB
      maxFiles: 10,
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      )
    })
  ],
  
  // Hata durumunda logger'ın kendisi çökmemesi için
  exitOnError: false,

  // Silent mode (test ortamında logları susturmak için)
  silent: process.env.NODE_ENV === 'test'
});

// Development ortamında console'a da log yaz
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: consoleFormat,
    level: 'debug'
  }));
}

// Production ortamında sadece error ve warn seviyelerini console'a yaz
if (process.env.NODE_ENV === 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.simple()
    ),
    level: 'warn'
  }));
}

export default logger;

// Logger helper metodları
export const loggerHelpers = {
  /**
   * Database işlemleri için log
   */
  database: (operation: string, table: string, duration?: number, meta?: any) => {
    logger.info('Database Operation', {
      type: 'database',
      operation,
      table,
      duration: duration ? `${duration}ms` : undefined,
      ...meta
    });
  },

  /**
   * API yanıtları için log
   */
  apiResponse: (method: string, url: string, statusCode: number, duration: number, meta?: any) => {
    const logLevel = statusCode >= 400 ? 'warn' : 'info';
    logger.log(logLevel, 'API Response', {
      type: 'api_response',
      method,
      url,
      statusCode,
      duration: `${duration}ms`,
      ...meta
    });
  },

  /**
   * Authentication işlemleri için log
   */
  auth: (action: string, userId?: number, ip?: string, meta?: any) => {
    logger.info('Authentication', {
      type: 'authentication',
      action,
      userId,
      ip,
      ...meta
    });
  },

  /**
   * Business logic işlemleri için log
   */
  business: (action: string, meta?: any) => {
    logger.info('Business Logic', {
      type: 'business',
      action,
      ...meta
    });
  },

  /**
   * System events için log
   */
  system: (event: string, meta?: any) => {
    logger.info('System Event', {
      type: 'system',
      event,
      ...meta
    });
  }
}; 