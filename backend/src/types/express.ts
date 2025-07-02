import { Request } from 'express';

/**
 * Authenticated request interface
 * Tüm controller'larda ortak kullanım için
 */
export interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    username: string;
    role: 'admin' | 'staff';
    email?: string;
    fullName?: string;
  };
}

/**
 * Pagination interface
 */
export interface PaginationQuery {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
} 