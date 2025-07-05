import { Request, Response, NextFunction } from 'express';
import logger, { loggerHelpers } from '../config/logger';
import { RequestLogger } from '../types/api';


const generateRequestId = (): string => {
  return Math.random().toString(36).substring(2, 9);
};

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now();
  const oldSend = res.send;

  res.send = function(body) {
    const duration = Date.now() - startTime;
    loggerHelpers.apiResponse(
      req.method,
      req.originalUrl,
      res.statusCode,
      duration,
      {
        requestId: (req as RequestLogger).id,
        userId: req.session?.user?.id as any,
        userType: req.session?.user?.userType as any
      }
    );
    return oldSend.apply(res, arguments as any);
  };

  next();
};

export const getRequestContext = (req: RequestLogger) => ({
  requestId: req.id,
  method: req.method,
  url: req.originalUrl,
  ip: req.ip ||  req.socket.remoteAddress,
}); 