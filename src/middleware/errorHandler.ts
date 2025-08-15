import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils';

export const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let apiError: ApiError;
  apiError = error;
  if (error instanceof ApiError) {
  }
  else if (error.name && error.name.startsWith('Sequelize')) {
    apiError = ApiError.fromSequelize(error);
  }
  else {
    apiError = ApiError.internal('Beklenmeyen bir hata oluştu');
  }
  apiError.path = req.originalUrl;
  const logLevel = apiError.statusCode >= 500 ? 'error' : 'warn';
  const responseData: any = {
    success: apiError.success || false,
    type: apiError.type || 'INTERNAL_SERVER_ERROR',
    message: apiError.message || 'Bilinmeyen hata',
    errors: apiError.errors,
    timestamp: apiError.timestamp || new Date().toISOString(),
    path: apiError.path || req.originalUrl
  };
  if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === "test" && error.stack) {
    responseData.stack = error.stack;
  }
  res.status(apiError.statusCode || 500).json(responseData);
};

export const notFoundHandler = (req: Request, res: Response): void => {
  const apiError = ApiError.notFound(`${req.originalUrl} endpoint'i bulunamadı`);
  apiError.path = req.originalUrl;
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