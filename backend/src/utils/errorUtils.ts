/**
 * Error handling utilities
 */

export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  if (error && typeof error === 'object' && 'message' in error) {
    return String(error.message);
  }
  return 'Bilinmeyen hata';
};

export const getErrorDetails = (error: unknown): {
  message: string;
  name?: string;
  stack?: string;
} => {
  if (error instanceof Error) {
    return {
      message: error.message,
      name: error.name,
      stack: error.stack
    };
  }
  
  return {
    message: getErrorMessage(error)
  };
};

export const isError = (error: unknown): error is Error => {
  return error instanceof Error;
}; 