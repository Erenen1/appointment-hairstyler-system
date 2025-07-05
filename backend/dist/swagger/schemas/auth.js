"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authSchemas = void 0;
exports.authSchemas = {
    LoginRequest: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
            email: { type: 'string', format: 'email', example: 'admin@example.com' },
            password: { type: 'string', example: 'password123' }
        }
    },
    LoginResponse: {
        type: 'object',
        properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Giriş başarılı' },
            data: {
                type: 'object',
                properties: {
                    user: {
                        type: 'object',
                        properties: {
                            id: { type: 'integer', example: 1 },
                            fullName: { type: 'string', example: 'Admin User' },
                            email: { type: 'string', format: 'email', example: 'admin@example.com' },
                            userType: { type: 'string', example: 'admin' },
                            phone: { type: 'string', example: '1234567890' },
                            isActive: { type: 'boolean', example: true },
                            lastLogin: { type: 'string', format: 'date-time', nullable: true }
                        }
                    }
                }
            },
            timestamp: { type: 'string', format: 'date-time' }
        }
    },
    ProfileResponse: {
        type: 'object',
        properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Kullanıcı bilgileri getirildi' },
            data: {
                type: 'object',
                properties: {
                    id: { type: 'integer', example: 1 },
                    fullName: { type: 'string', example: 'Admin User' },
                    email: { type: 'string', format: 'email', example: 'admin@example.com' },
                    userType: { type: 'string', example: 'admin' },
                }
            },
            timestamp: { type: 'string', format: 'date-time' }
        }
    },
    LogoutResponse: {
        type: 'object',
        properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Çıkış başarılı' },
            timestamp: { type: 'string', format: 'date-time' }
        }
    }
};
//# sourceMappingURL=auth.js.map