/**
 * Admin güncelleme için veri transfer nesnesi
 * Tüm alanlar opsiyonel
 */
export interface UpdateAdminDto {
    fullName?: string;
    email?: string;
    phone?: string;
    isActive?: boolean;
}