/**
 * Şifre değiştirme için veri transfer nesnesi
 */
export interface ChangePasswordDto {
    currentPassword: string;
    newPassword: string;
} 