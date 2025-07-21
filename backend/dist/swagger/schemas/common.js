"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commonResponses = exports.commonSchemas = void 0;
exports.commonSchemas = {
    IdParam: {
        type: 'string',
        format: 'uuid',
        description: 'UUID formatında ID',
    },
    PageQuery: {
        type: 'integer',
        format: 'int32',
        description: 'Sayfa numarası (varsayılan: 1)',
        minimum: 1,
        default: 1,
    },
    LimitQuery: {
        type: 'integer',
        format: 'int32',
        description: 'Sayfa başına öğe sayısı (varsayılan: 10)',
        minimum: 1,
        default: 10,
    },
    SearchQuery: {
        type: 'string',
        description: 'Arama sorgusu (isteğe bağlı)',
    },
    Error: {
        type: 'object',
        properties: {
            message: { type: 'string' },
            status: { type: 'number' },
        },
    },
    BaseResponse: {
        type: 'object',
        properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
        },
    },
    PaginationResponse: {
        type: 'object',
        properties: {
            totalItems: { type: 'integer' },
            totalPages: { type: 'integer' },
            currentPage: { type: 'integer' },
            limit: { type: 'integer' },
        },
    },
};
exports.commonResponses = {
    UnauthorizedError: {
        description: 'Yetkisiz erişim. Geçersiz veya eksik kimlik doğrulama belirteci.',
        content: {
            'application/json': {
                schema: {
                    $ref: '#/components/schemas/Error',
                },
            },
        },
    },
    NotFoundError: {
        description: 'Kaynak bulunamadı.',
        content: {
            'application/json': {
                schema: {
                    $ref: '#/components/schemas/Error',
                },
            },
        },
    },
    ForbiddenError: {
        description: 'Bu işleme yetkiniz yok.',
        content: {
            'application/json': {
                schema: {
                    $ref: '#/components/schemas/Error',
                },
            },
        },
    },
    ValidationError: {
        description: 'Geçersiz giriş verileri.',
        content: {
            'application/json': {
                schema: {
                    $ref: '#/components/schemas/Error',
                },
            },
        },
    },
    InternalServerError: {
        description: 'Beklenmedik bir sunucu hatası oluştu.',
        content: {
            'application/json': {
                schema: {
                    $ref: '#/components/schemas/Error',
                },
            },
        },
    },
};
//# sourceMappingURL=common.js.map