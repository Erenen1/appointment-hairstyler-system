/**
 * Hizmet kategorisi veri modeli arayüzü
 */
export interface IServiceCategory {
    id: string;
    name: string;
    description?: string;
    imagePath?: string;
    orderIndex: number;
    isActive: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

/**
 * Hizmet veri modeli arayüzü
 */
export interface IService {
    id: string;
    categoryId: string;
    slug: string;
    title: string;
    description?: string;
    duration: string;
    price: string;
    isActive: boolean;
    orderIndex: number;
    benefits?: any;
    includes?: any;
    recommendedFor?: any;
    beforeAfterImages?: any;
    createdAt?: Date;
    updatedAt?: Date;
    category?: IServiceCategory;
    images?: IServiceImage[];
    staffMembers?: IServiceStaff[];
}

/**
 * Hizmet resmi veri modeli arayüzü
 */
export interface IServiceImage {
    id: string;
    serviceId: string;
    imagePath: string;
    isMain: boolean;
    orderIndex: number;
    createdAt?: Date;
}

/**
 * Hizmet-Personel ilişkisi veri modeli arayüzü
 */
export interface IServiceStaff {
    id: string;
    fullName: string;
    isActive?: boolean;
    StaffService?: {
        isActive: boolean;
    };
} 