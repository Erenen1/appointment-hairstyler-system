"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.contentSchemas = void 0;
exports.contentSchemas = {
    GalleryCategory: {
        type: 'object',
        properties: {
            id: { type: 'string', format: 'uuid' },
            businessId: { type: 'string', format: 'uuid' },
            name: { type: 'string' },
            description: { type: 'string', nullable: true },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
        },
    },
    CreateGalleryCategoryRequest: {
        type: 'object',
        required: ['name'],
        properties: {
            name: { type: 'string', description: 'Galeri kategori adı' },
            description: { type: 'string', description: 'Galeri kategori açıklaması (isteğe bağlı)', nullable: true },
        },
    },
    UpdateGalleryCategoryRequest: {
        type: 'object',
        properties: {
            name: { type: 'string', description: 'Galeri kategori adı' },
            description: { type: 'string', description: 'Galeri kategori açıklaması (isteğe bağlı)', nullable: true },
        },
    },
    GalleryCategoryListResponse: {
        type: 'object',
        properties: {
            data: {
                type: 'array',
                items: { $ref: '#/components/schemas/GalleryCategory' },
            },
            pagination: { $ref: '#/components/schemas/PaginationResponse' },
        },
    },
    GalleryImage: {
        type: 'object',
        properties: {
            id: { type: 'string', format: 'uuid' },
            businessId: { type: 'string', format: 'uuid' },
            categoryId: { type: 'string', format: 'uuid', nullable: true },
            title: { type: 'string' },
            description: { type: 'string', nullable: true },
            imageUrl: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
        },
    },
    CreateGalleryImageRequest: {
        type: 'object',
        required: ['title', 'image'],
        properties: {
            categoryId: { type: 'string', format: 'uuid', description: 'Kategori ID"si (isteğe bağlı)', nullable: true },
            title: { type: 'string', description: 'Resim başlığı' },
            description: { type: 'string', description: 'Resim açıklaması (isteğe bağlı)', nullable: true },
            image: { type: 'string', format: 'binary', description: 'Resim dosyası' },
        },
    },
    UpdateGalleryImageRequest: {
        type: 'object',
        properties: {
            categoryId: { type: 'string', format: 'uuid', description: 'Kategori ID"si (isteğe bağlı)', nullable: true },
            title: { type: 'string', description: 'Resim başlığı' },
            description: { type: 'string', description: 'Resim açıklaması (isteğe bağlı)', nullable: true },
            image: { type: 'string', format: 'binary', description: 'Resim dosyası (isteğe bağlı)' },
        },
    },
    GalleryImageListResponse: {
        type: 'object',
        properties: {
            data: {
                type: 'array',
                items: { $ref: '#/components/schemas/GalleryImage' },
            },
            pagination: { $ref: '#/components/schemas/PaginationResponse' },
        },
    },
};
//# sourceMappingURL=content.js.map