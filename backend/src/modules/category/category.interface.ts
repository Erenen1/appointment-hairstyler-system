/**
 * Kategori veri modeli arayüzü
 */
export interface ICategory {
    id: string;
    name: string;
    description?: string;
    imagePath?: string;
    orderIndex: number;
    isActive: boolean;
    businessId: string; // İşletme ID (zorunlu)
    createdAt?: Date;
    updatedAt?: Date;
} 