/**
 * Müşteri veri modeli arayüzü
 */
export interface ICustomer {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    notes: string;
    isActive: boolean;
    businessId: string; // İşletme ID (zorunlu)
    createdAt?: Date;
    updatedAt?: Date;
}
