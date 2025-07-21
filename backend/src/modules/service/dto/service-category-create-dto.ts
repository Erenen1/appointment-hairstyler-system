/**
 * Hizmet kategorisi oluşturma DTO
 */
export class ServiceCategoryCreateDTO {
    name: string;
    description?: string;
    orderIndex?: number;
    isActive?: boolean;
} 