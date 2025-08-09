/**
 * Personel güncelleme DTO
 */
export class StaffUpdateDTO {
    fullName?: string;
    email?: string;
    phone?: string;
    specialties?: string;
    isActive?: boolean;
    serviceIds?: string[];
    avatar?: Express.Multer.File;
} 