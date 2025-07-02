import { Request, Response, NextFunction } from 'express';
import logger, { loggerHelpers } from '../config/logger';
interface ExtendedRequest extends Request {
  startTime?: number;
  id?: string;
}
const generateRequestId = (): string => {
  return Math.random().toString(36).substring(2, 9);
};
export const requestLogger = (req: ExtendedRequest, res: Response, next: NextFunction) => {
  const startTime = Date.now();
  const requestId = generateRequestId();
  req.startTime = startTime;
  req.id = requestId;
  logger.http('Incoming Request', {
    requestId,
    method: req.method,
    url: req.originalUrl,
    ip: req.ip || req.socket.remoteAddress,
    userAgent: req.get('User-Agent'),
    referer: req.get('Referer'),
    contentType: req.get('Content-Type'),
    contentLength: req.get('Content-Length'),
    timestamp: new Date().toISOString()
  });
  const originalSend = res.send;
  res.send = function(body) {
    const duration = Date.now() - startTime;
    loggerHelpers.apiResponse(
      req.method,
      req.originalUrl,
      res.statusCode,
      duration,
      {
        requestId,
        ip: req.ip || req.socket.remoteAddress,
        userAgent: req.get('User-Agent'),
        responseSize: body ? Buffer.byteLength(body) : 0
      }
    );
    if (duration > 5000) {
      logger.warn('Slow Request Detected', {
        requestId,
        method: req.method,
        url: req.originalUrl,
        duration: `${duration}ms`,
        statusCode: res.statusCode
      });
    }
    return originalSend.call(this, body);
  };
  next();
};
export const getRequestContext = (req: ExtendedRequest) => ({
  requestId: req.id,
  method: req.method,
  url: req.originalUrl,
  ip: req.ip ||  req.socket.remoteAddress,
}); 