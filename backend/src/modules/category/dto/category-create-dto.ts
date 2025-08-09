/**
 * Kategori oluşturma DTO
 */
export class CategoryCreateDTO {
    name: string;
    description?: string;
    orderIndex?: number;
    isActive?: boolean;
} 