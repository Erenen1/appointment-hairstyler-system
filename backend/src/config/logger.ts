import winston from 'winston';
import path from 'path';
import Enum from './env';

const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.json(),
  winston.format.prettyPrint()
);

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

const logDir = path.join(process.cwd(), 'logs');
const logger = winston.createLogger({
  level: Enum.LOG_LEVEL || 'info',
  format: logFormat,
  defaultMeta: { 
    service: 'kuafor-backend',
    environment: Enum.NODE_ENV || 'development'
  },
  transports: [
    new winston.transports.File({
      filename: path.join(logDir, 'error.log'),
      level: 'error',
      maxsize: 5242880, 
      maxFiles: 5,
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      )
    }),
    new winston.transports.File({
      filename: path.join(logDir, 'combined.log'),
      maxsize: 5242880, 
      maxFiles: 5,
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      )
    }),
    new winston.transports.File({
      filename: path.join(logDir, 'access.log'),
      level: 'http',
      maxsize: 5242880, 
      maxFiles: 10,
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      )
    })
  ],
  exitOnError: false,
  silent: Enum.NODE_ENV === 'test'
});
if (Enum.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: consoleFormat,
    level: 'debug'
  }));
}
if (Enum.NODE_ENV === 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.simple()
    ),
    level: 'warn'
  }));
}
export default logger;
export const loggerHelpers = {
  database: (operation: string, table: string, duration?: number, meta?: any) => {
    logger.info('Database Operation', {
      type: 'database',
      operation,
      table,
      duration: duration ? `${duration}ms` : undefined,
      ...meta
    });
  },
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
  auth: (action: string, userId?: number, ip?: string, meta?: any) => {
    logger.info('Authentication', {
      type: 'authentication',
      action,
      userId,
      ip,
      ...meta
    });
  },
  business: (action: string, meta?: any) => {
    logger.info('Business Logic', {
      type: 'business',
      action,
      ...meta
    });
  },
  system: (event: string, meta?: any) => {
    logger.info('System Event', {
      type: 'system',
      event,
      ...meta
    });
  }
}; 