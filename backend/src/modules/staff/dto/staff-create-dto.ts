/**
 * Personel oluşturma DTO
 */
export class StaffCreateDTO {
    fullName: string;
    email: string;
    phone: string;
    specialties?: string;
    serviceIds?: string[];
    avatar?: Express.Multer.File;
    // businessId middleware'den otomatik eklenecek
} 