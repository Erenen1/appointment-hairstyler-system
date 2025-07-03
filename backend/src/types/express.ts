import { PaginationQuery } from './api';

declare global {
  namespace Express {
    interface Request {
      user?: any;
      userId?: string;
      userType?: string;
      superAdmin?: boolean;
    }
  }
}

export {  PaginationQuery };