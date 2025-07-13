import { Request, Response, NextFunction } from 'express';
import logger, { loggerHelpers } from '../config/logger';

const generateRequestId = (): string => {
  return Math.random().toString(36).substring(2, 9);
};

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now();
  const requestId = generateRequestId();
  
  // Request'e id ekle
  req.id = requestId;
  req.startTime = startTime;
  
  const oldSend = res.send;

  res.send = function(body) {
    const duration = Date.now() - startTime;
    loggerHelpers.apiResponse(
      req.method,
      req.originalUrl,
      res.statusCode,
      duration,
      {
        requestId: req.id,
        userId: req.user?.id,
        userType: req.user?.userType
      }
    );
    return oldSend.apply(res, arguments as any);
  };

  next();
};

export const getRequestContext = (req: Request) => ({
  requestId: req.id,
  method: req.method,
  url: req.originalUrl,
  ip: req.ip || req.socket?.remoteAddress,
}); 