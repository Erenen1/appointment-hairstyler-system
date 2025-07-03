import { Request } from 'express';

export interface PaginationQuery {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ErrorDetail {
  message: string;
  field?: string;
  code?: string;
}

export interface ApiErrorResponse {
  status: number;
  message: string;
  details?: ErrorDetail[];
  stack?: string;
}

export interface ApiSuccessResponse<T> {
  status: number;
  message: string;
  data: T;
}

export interface PaginatedResponse<T> extends ApiSuccessResponse<T> {
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface RequestLogger extends Request {
  startTime?: number;
  id?: string;
} 