import { NextFunction } from 'express';

export const handleControllerError = (error: unknown, next: NextFunction) => {
  next(error instanceof Error ? error : new Error(String(error)));
};


