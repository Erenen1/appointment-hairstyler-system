import { Response } from 'express';
import { ApiError } from './ApiError';
export const handleControllerError = (
  error: unknown, 
  res: Response, 
  defaultMessage: string = 'Sunucu hatası'
): void => {
  if (error instanceof ApiError) {
    res.status(error.statusCode).json(error.toJSON());
  } else {
    res.status(500).json(ApiError.internal(defaultMessage).toJSON());
  }
};
export const getPaginationOptions = (page: number, limit: number) => {
  const offset = (page - 1) * limit;
  return {
    offset,
    limit
  };
};
export const formatPaginationResponse = (totalItems: number, currentPage: number, itemsPerPage: number) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  return {
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    hasNext: currentPage < totalPages,
    hasPrev: currentPage > 1
  };
};
