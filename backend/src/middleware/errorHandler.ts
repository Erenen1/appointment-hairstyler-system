import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils';
import logger from '../config/logger';
import { getRequestContext } from './requestLogger';

export const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let apiError: ApiError;
  if (error instanceof ApiError) {
    apiError = error;
  }
  else if (error.name && error.name.startsWith('Sequelize')) {
    apiError = ApiError.fromSequelize(error);
    logger.error('Database Error', {
      ...getRequestContext(req),
      error: {
        name: error.name,
        message: error.message,
        sql: error.sql,
        parameters: error.parameters
      },
      stack: error.stack
    });
  }
  else {
    logger.error('Unexpected Error', {
      ...getRequestContext(req),
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack
      }
    });
    apiError = ApiError.internal('Beklenmeyen bir hata oluştu');
  }
  apiError.path = req.originalUrl;
  const logLevel = apiError.statusCode >= 500 ? 'error' : 'warn';
  logger.log(logLevel, 'API Error Response', {
    ...getRequestContext(req),
    error: {
      type: apiError.type,
      message: apiError.message,
      statusCode: apiError.statusCode,
      errors: apiError.errors
    }
  });
  const responseData: any = {
    success: apiError.success || false,
    type: apiError.type || 'INTERNAL_SERVER_ERROR',
    message: apiError.message || 'Bilinmeyen hata',
    errors: apiError.errors,
    timestamp: apiError.timestamp || new Date().toISOString(),
    path: apiError.path || req.originalUrl
  };
  if (process.env.NODE_ENV === 'development' && error.stack) {
    responseData.stack = error.stack;
  }
  res.status(apiError.statusCode || 500).json(responseData);
};

export const notFoundHandler = (req: Request, res: Response): void => {
  const apiError = ApiError.notFound(`${req.originalUrl} endpoint'i bulunamadı`);
  apiError.path = req.originalUrl;
  logger.warn('404 Not Found', {
    ...getRequestContext(req),
    endpoint: req.originalUrl
  });
  const responseData = {
    success: false,
    type: apiError.type,
    message: apiError.message,
    errors: apiError.errors,
    timestamp: apiError.timestamp,
    path: apiError.path
  };
  res.status(404).json(responseData);
}; 