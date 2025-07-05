"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminSchemas = void 0;
exports.adminSchemas = {
    Admin: {
        type: 'object',
        properties: {
            id: { type: 'integer', example: 1 },
            fullName: { type: 'string', example: 'Admin User' },
            email: { type: 'string', format: 'email', example: 'admin@example.com' },
            phone: { type: 'string', example: '1234567890' },
            isActive: { type: 'boolean', example: true },
            lastLogin: { type: 'string', format: 'date-time', nullable: true },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
        }
    },
    CreateAdminRequest: {
        type: 'object',
        required: ['username', 'password', 'fullName', 'email'],
        properties: {
            password: { type: 'string', minLength: 6, maxLength: 100, example: 'password123' },
            fullName: { type: 'string', minLength: 2, maxLength: 100, example: 'Admin User' },
            email: { type: 'string', format: 'email', example: 'admin@example.com' },
            phone: { type: 'string', example: '1234567890' }
        }
    },
    CreateAdminResponse: {
        type: 'object',
        properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Admin başarıyla oluşturuldu' },
            data: { $ref: '#/components/schemas/Admin' },
            timestamp: { type: 'string', format: 'date-time' }
        }
    }
};
//# sourceMappingURL=admin.js.map