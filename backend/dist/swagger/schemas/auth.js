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
                    token: {
                        type: 'string',
                        description: 'JWT authentication token',
                        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJlbWFpbCI6ImFkbWluQGV4YW1wbGUuY29tIiwidXNlclR5cGUiOiJhZG1pbiIsImZ1bGxOYW1lIjoiQWRtaW4gVXNlciIsImlhdCI6MTcwMDAwMDAwMCwiZXhwIjoxNzAwMDg2NDAwfQ.example-signature'
                    },
                    user: {
                        type: 'object',
                        properties: {
                            id: { type: 'string', example: '1' },
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
                    user: {
                        type: 'object',
                        properties: {
                            id: { type: 'string', example: '1' },
                            fullName: { type: 'string', example: 'Admin User' },
                            email: { type: 'string', format: 'email', example: 'admin@example.com' },
                            userType: { type: 'string', example: 'admin' }
                        }
                    }
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
    },
    JWTPayload: {
        type: 'object',
        description: 'JWT token payload structure',
        properties: {
            id: { type: 'string', description: 'User ID' },
            email: { type: 'string', format: 'email', description: 'User email' },
            userType: { type: 'string', enum: ['admin'], description: 'User type' },
            fullName: { type: 'string', description: 'User full name' },
            iat: { type: 'integer', description: 'Issued at timestamp' },
            exp: { type: 'integer', description: 'Expiration timestamp' }
        }
    }
};
//# sourceMappingURL=auth.js.map