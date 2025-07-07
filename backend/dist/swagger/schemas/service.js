"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serviceSchemas = void 0;
exports.serviceSchemas = {
    ServiceCategory: {
        type: 'object',
        properties: {
            id: { type: 'integer', example: 1 },
            name: { type: 'string', example: 'Saç Bakımı' },
            description: { type: 'string', example: 'Saç bakım hizmetleri' },
            isActive: { type: 'boolean', example: true },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
        }
    },
    Service: {
        type: 'object',
        properties: {
            id: { type: 'integer', example: 1 },
            categoryId: { type: 'integer', example: 1 },
            slug: { type: 'string', example: 'sac-kesimi' },
            title: { type: 'string', example: 'Saç Kesimi' },
            description: { type: 'string', example: 'Profesyonel saç kesimi hizmeti' },
            duration: { type: 'integer', example: 60 },
            price: { type: 'number', format: 'decimal', example: 100.00 },
            isActive: { type: 'boolean', example: true },
            isPopular: { type: 'boolean', example: false },
            category: {
                type: 'object',
                properties: {
                    id: { type: 'integer', example: 1 },
                    name: { type: 'string', example: 'Saç Bakımı' }
                }
            },
            staffMembers: {
                type: 'array',
                items: { $ref: '#/components/schemas/ServiceStaffMember' }
            },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
        }
    },
    ServiceStaffMember: {
        type: 'object',
        properties: {
            id: { type: 'string', format: 'uuid', example: '123e4567-e89b-12d3-a456-426614174000' },
            fullName: { type: 'string', example: 'Ahmet Yılmaz' },
            specialties: { type: 'string', example: 'Saç kesimi, sakal tıraşı' },
            avatar: { type: 'string', format: 'uri', example: 'https://example.com/avatar.jpg' },
            canProvideService: { type: 'boolean', example: true }
        }
    },
    CreateServiceRequest: {
        type: 'object',
        required: ['categoryId', 'title', 'duration', 'price'],
        properties: {
            slug: { type: 'string', minLength: 2, maxLength: 100, example: 'sac-kesimi' },
            categoryId: { type: 'integer', minimum: 1, example: 1 },
            title: { type: 'string', minLength: 2, maxLength: 100, example: 'Saç Kesimi' },
            description: { type: 'string', maxLength: 500, example: 'Profesyonel saç kesimi hizmeti' },
            duration: { type: 'integer', minimum: 15, maximum: 480, example: 60 },
            price: { type: 'number', format: 'decimal', minimum: 0, example: 100.00 },
            staffIds: {
                type: 'array',
                items: { type: 'string', format: 'uuid' },
                minItems: 0,
                example: ['123e4567-e89b-12d3-a456-426614174000', '456e7890-e12b-34d5-a678-901234567890']
            },
            isPopular: { type: 'boolean', example: false },
            isActive: { type: 'boolean', example: true }
        }
    },
    UpdateServiceRequest: {
        type: 'object',
        properties: {
            categoryId: { type: 'integer', minimum: 1, example: 1 },
            slug: { type: 'string', minLength: 2, maxLength: 100, example: 'sac-kesimi' },
            title: { type: 'string', minLength: 2, maxLength: 100, example: 'Saç Kesimi' },
            description: { type: 'string', maxLength: 500, example: 'Profesyonel saç kesimi hizmeti' },
            duration: { type: 'integer', minimum: 15, maximum: 480, example: 60 },
            price: { type: 'number', format: 'decimal', minimum: 0, example: 100.00 },
            staffIds: {
                type: 'array',
                items: { type: 'string', format: 'uuid' },
                minItems: 0,
                example: ['123e4567-e89b-12d3-a456-426614174000', '456e7890-e12b-34d5-a678-901234567890']
            },
            isPopular: { type: 'boolean', example: false },
            isActive: { type: 'boolean', example: true }
        }
    },
    CreateCategoryRequest: {
        type: 'object',
        required: ['name'],
        properties: {
            name: { type: 'string', minLength: 2, maxLength: 100, example: 'Saç Bakımı' },
            description: { type: 'string', maxLength: 500, example: 'Saç bakım hizmetleri' }
        }
    },
    UpdateCategoryRequest: {
        type: 'object',
        properties: {
            name: { type: 'string', minLength: 2, maxLength: 100, example: 'Saç Bakımı' },
            description: { type: 'string', maxLength: 500, example: 'Saç bakım hizmetleri' },
            isActive: { type: 'boolean', example: true }
        }
    }
};
//# sourceMappingURL=service.js.map