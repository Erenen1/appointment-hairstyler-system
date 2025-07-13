import { PaginationQuery } from './api';
import { JwtPayload } from '../utils/jwtUtils';

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
      userId?: string;
      userType?: string;
      superAdmin?: boolean;
      id?: string;
      startTime?: number;
    }
  }
}

export { PaginationQuery };