import { Request, Response, NextFunction } from 'express';
import logger, { loggerHelpers } from '../config/logger';

// Request genişletme
interface ExtendedRequest extends Request {
  startTime?: number;
  id?: string;
}

/**
 * Request ID oluşturucu
 */
const generateRequestId = (): string => {
  return Math.random().toString(36).substring(2, 9);
};

/**
 * Request logger middleware
 */
export const requestLogger = (req: ExtendedRequest, res: Response, next: NextFunction) => {
  const startTime = Date.now();
  const requestId = generateRequestId();
  
  // Request bilgilerini req objesine ekle
  req.startTime = startTime;
  req.id = requestId;

  // Request başlangıç logu
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

  // Response bittiğinde log
  const originalSend = res.send;
  res.send = function(body) {
    const duration = Date.now() - startTime;
    
    // API response log
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

    // Yavaş request uyarısı (5 saniyeden uzun)
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

/**
 * Request bilgilerini log context'e eklemek için helper
 */
export const getRequestContext = (req: ExtendedRequest) => ({
  requestId: req.id,
  method: req.method,
  url: req.originalUrl,
  ip: req.ip ||  req.socket.remoteAddress,
}); 