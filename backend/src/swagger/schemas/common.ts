/**
 * @swagger
 * components:
 *   schemas:
 *     SuccessResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: İşlem başarılı
 *         data:
 *           type: object
 *     
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         message:
 *           type: string
 *           example: Bir hata oluştu
 *         error:
 *           type: string
 *     
 *     PaginationMeta:
 *       type: object
 *       properties:
 *         total:
 *           type: integer
 *           example: 100
 *         page:
 *           type: integer
 *           example: 1
 *         limit:
 *           type: integer
 *           example: 10
 *         totalPages:
 *           type: integer
 *           example: 10
 *     
 *     PaginatedResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           type: array
 *           items: {}
 *         meta:
 *           $ref: '#/components/schemas/PaginationMeta'
 */ 

/**
 * Common Swagger Schemas
 */

export const commonSchemas = {
  ApiResponse: {
    type: 'object',
    properties: {
      success: { type: 'boolean' },
      message: { type: 'string' },
      data: { type: 'object' },
      timestamp: { type: 'string', format: 'date-time' }
    }
  },

  ErrorResponse: {
    type: 'object',
    properties: {
      success: { type: 'boolean', example: false },
      message: { type: 'string', example: 'Hata mesajı' },
      error: { type: 'string', example: 'VALIDATION_ERROR' },
      timestamp: { type: 'string', format: 'date-time' }
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
  },

  ValidationErrorResponse: {
    type: 'object',
    properties: {
      success: { type: 'boolean', example: false },
      message: { type: 'string', example: 'Validation error' },
      errors: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            field: { type: 'string', example: 'email' },
            message: { type: 'string', example: 'Geçerli bir e-posta adresi girin' }
          }
        }
      },
      timestamp: { type: 'string', format: 'date-time' }
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
        schema: { $ref: '#/components/schemas/ValidationErrorResponse' }
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