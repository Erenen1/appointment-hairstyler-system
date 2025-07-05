"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.customerSchemas = void 0;
exports.customerSchemas = {
    Customer: {
        type: 'object',
        properties: {
            id: { type: 'integer', example: 1 },
            fullName: { type: 'string', example: 'Ayşe Kaya' },
            phone: { type: 'string', example: '+90 555 111 2233' },
            email: { type: 'string', format: 'email', example: 'ayse@example.com' },
            notes: { type: 'string', example: 'Hassas cilt' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
        }
    },
    CreateCustomerRequest: {
        type: 'object',
        required: ['fullName', 'phone'],
        properties: {
            fullName: { type: 'string', minLength: 2, maxLength: 100, example: 'Ayşe Kaya' },
            phone: { type: 'string', pattern: '^[0-9+\\-\\s()]+$', example: '+90 555 111 2233' },
            email: { type: 'string', format: 'email', example: 'ayse@example.com' },
            notes: { type: 'string', maxLength: 500, example: 'Hassas cilt' }
        }
    },
    UpdateCustomerRequest: {
        type: 'object',
        properties: {
            fullName: { type: 'string', minLength: 2, maxLength: 100, example: 'Ayşe Kaya' },
            phone: { type: 'string', pattern: '^[0-9+\\-\\s()]+$', example: '+90 555 111 2233' },
            email: { type: 'string', format: 'email', example: 'ayse@example.com' },
            notes: { type: 'string', maxLength: 500, example: 'Hassas cilt' }
        }
    },
    CustomerListResponse: {
        type: 'object',
        properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Müşteriler başarıyla listelendi' },
            data: {
                type: 'array',
                items: { $ref: '#/components/schemas/Customer' }
            },
            pagination: { $ref: '#/components/schemas/PaginationInfo' },
            timestamp: { type: 'string', format: 'date-time' }
        }
    }
};
//# sourceMappingURL=customer.js.map