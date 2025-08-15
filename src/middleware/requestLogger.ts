import { Request, Response, NextFunction } from 'express';

export const requestLogger = (req: Request, _res: Response, next: NextFunction) => {
  const start = Date.now();
  const { method, url } = req;
  // basit log; gerçek logger entegrasyonu config/logger.ts eklendiğinde genişletilebilir
  // eslint-disable-next-line no-console
  console.log(`[REQ] ${method} ${url}`);
  _res.on('finish', () => {
    // eslint-disable-next-line no-console
    console.log(`[RES] ${method} ${url} -> ${_res.statusCode} (${Date.now() - start}ms)`);
  });
  next();
};


