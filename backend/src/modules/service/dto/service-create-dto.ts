/**
 * Hizmet oluşturma DTO
 */
export class ServiceCreateDTO {
    categoryId: string;
    title: string;
    slug?: string;
    description?: string;
    duration: string;
    price: string;
    isActive?: boolean;
    orderIndex?: number;
    benefits?: any;
    includes?: any;
    recommendedFor?: any;
    beforeAfterImages?: any;
    staffIds?: string[];
} 