/**
 * Personel veri modeli arayüzü
 */
export interface IStaff {
    id?: string;
    fullName: string;
    email: string;
    phone: string;
    avatar?: string;
    specialties?: string;
    isActive: boolean;
    businessId: string; // İşletme ID (zorunlu)
    createdAt?: Date;
    updatedAt?: Date;
    services?: IStaffServiceRelation[];
}

/**
 * Personel-Hizmet ilişkisi veri modeli arayüzü
 */
export interface IStaffService {
    id: string;
    staffId: string;
    serviceId: string;
    isActive: boolean;
    businessId: string; // İşletme ID (zorunlu)
    createdAt?: Date;
}

/**
 * Personel-Hizmet ilişkisi için genişletilmiş arayüz
 */
export interface IStaffServiceRelation extends IStaffService {
    service?: {
        id: string;
        title: string;
        description?: string;
        price: number;
        duration: number;
        category?: {
            id: string;
            name: string;
        };
    };
} 