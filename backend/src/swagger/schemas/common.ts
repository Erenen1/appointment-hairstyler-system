export const commonSchemas = {
  ApiSuccessResponse: {
    type: 'object',
    properties: {
      success: { type: 'boolean', example: true },
      message: { type: 'string', example: 'İşlem başarılı' },
      data: { type: 'object' },
      pagination: { $ref: '#/components/schemas/Pagination' },
      timestamp: { type: 'string', format: 'date-time' }
    }
  },
  ErrorResponse: {
    type: 'object',
    properties: {
      success: { type: 'boolean', example: false },
      type: {
        type: 'string',
        enum: [
          'VALIDATION_ERROR',
          'AUTHENTICATION_ERROR',
          'AUTHORIZATION_ERROR',
          'NOT_FOUND',
          'CONFLICT',
          'INTERNAL_SERVER_ERROR',
          'BAD_REQUEST',
          'RATE_LIMIT_EXCEEDED',
          'DATABASE_ERROR'
        ]
      },
      message: { type: 'string' },
      errors: {
        type: 'array',
        items: { $ref: '#/components/schemas/ErrorDetail' }
      },
      timestamp: { type: 'string', format: 'date-time' },
      path: { type: 'string' }
    }
  },
  ErrorDetail: {
    type: 'object',
    properties: {
      field: { type: 'string' },
      message: { type: 'string' },
      code: { type: 'string' }
    }
  },
  Pagination: {
    type: 'object',
    properties: {
      currentPage: { type: 'integer', example: 1 },
      totalPages: { type: 'integer', example: 10 },
      totalItems: { type: 'integer', example: 100 },
      itemsPerPage: { type: 'integer', example: 10 }
    }
  },
  PaginationInfo: {
    type: 'object',
    properties: {
      currentPage: { type: 'number', example: 1 },
      totalPages: { type: 'number', example: 5 },
      totalItems: { type: 'number', example: 50 },
      itemsPerPage: { type: 'number', example: 10 },
      hasNextPage: { type: 'boolean', example: true },
      hasPrevPage: { type: 'boolean', example: false }
    }
  }
};

export const commonResponses = {
  UnauthorizedError: {
    description: 'Yetkisiz erişim',
    content: {
      'application/json': {
        schema: { $ref: '#/components/schemas/ErrorResponse' }
      }
    }
  },
  ForbiddenError: {
    description: 'Yetkisiz işlem',
    content: {
      'application/json': {
        schema: { $ref: '#/components/schemas/ErrorResponse' }
      }
    }
  },
  ValidationError: {
    description: 'Doğrulama hatası',
    content: {
      'application/json': {
        schema: { $ref: '#/components/schemas/ErrorResponse' }
      }
    }
  },
  InternalError: {
    description: 'Sunucu hatası',
    content: {
      'application/json': {
        schema: { $ref: '#/components/schemas/ErrorResponse' }
      }
    }
  }
}; 