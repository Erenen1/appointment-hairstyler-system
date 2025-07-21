"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.contactSchemas = void 0;
exports.contactSchemas = {
    ContactMessage: {
        type: 'object',
        properties: {
            id: { type: 'string', format: 'uuid' },
            businessId: { type: 'string', format: 'uuid' },
            name: { type: 'string' },
            email: { type: 'string', format: 'email' },
            subject: { type: 'string', nullable: true },
            message: { type: 'string' },
            replied: { type: 'boolean' },
            repliedAt: { type: 'string', format: 'date-time', nullable: true },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
        },
    },
    CreateContactMessageRequest: {
        type: 'object',
        required: ['name', 'email', 'message'],
        properties: {
            name: { type: 'string', description: 'Gönderen adı' },
            email: { type: 'string', format: 'email', description: 'Gönderen e-posta adresi' },
            subject: { type: 'string', description: 'Mesaj konusu (isteğe bağlı)', nullable: true },
            message: { type: 'string', description: 'Mesaj içeriği' },
        },
    },
    UpdateContactMessageRequest: {
        type: 'object',
        properties: {
            replied: { type: 'boolean', description: 'Mesajın yanıtlanıp yanıtlanmadığı' },
            repliedAt: { type: 'string', format: 'date-time', description: 'Mesajın yanıtlandığı zaman (isteğe bağlı)', nullable: true },
        },
    },
    ContactMessageListResponse: {
        type: 'object',
        properties: {
            data: {
                type: 'array',
                items: { $ref: '#/components/schemas/ContactMessage' },
            },
            pagination: { $ref: '#/components/schemas/PaginationResponse' },
        },
    },
};
//# sourceMappingURL=contact.js.map