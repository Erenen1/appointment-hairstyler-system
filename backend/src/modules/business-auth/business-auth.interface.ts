/**
 * Business (İşletme) veri yapısı interface'i
 */
export interface IBusiness {
  id: string;
  businessName: string;
  ownerName: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
  logo?: string;
  isActive: boolean;
  settings: IBusinessSettings;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

/**
 * Business ayarları yapısı
 */
export interface IBusinessSettings {
  workingHours?: IWorkingHours;
  theme?: IThemeSettings;
  notifications?: INotificationSettings;
}

/**
 * Çalışma saatleri yapısı
 */
export interface IWorkingHours {
  monday?: IDaySchedule;
  tuesday?: IDaySchedule;
  wednesday?: IDaySchedule;
  thursday?: IDaySchedule;
  friday?: IDaySchedule;
  saturday?: IDaySchedule;
  sunday?: IDaySchedule;
}

/**
 * Günlük program yapısı
 */
export interface IDaySchedule {
  isOpen: boolean;
  openTime?: string;
  closeTime?: string;
  breakStart?: string;
  breakEnd?: string;
}

/**
 * Tema ayarları
 */
export interface IThemeSettings {
  primaryColor?: string;
  secondaryColor?: string;
  logoUrl?: string;
  businessDescription?: string;
}

/**
 * Bildirim ayarları
 */
export interface INotificationSettings {
  emailEnabled: boolean;
  smsEnabled: boolean;
  reminderHours: number;
}

/**
 * API yanıtları için Business interface'i (hassas bilgiler çıkarılmış)
 */
export interface IBusinessResponse extends Omit<IBusiness, 'password' | 'deletedAt'> {
  // password ve deletedAt çıkarılmış
}

/**
 * Business login DTO
 */
export interface BusinessLoginDto {
  email: string;
  password: string;
}

/**
 * Business register DTO
 */
export interface BusinessRegisterDto {
  businessName: string;
  ownerName: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
}

/**
 * Business profil güncelleme DTO
 */
export interface BusinessUpdateDto {
  businessName?: string;
  ownerName?: string;
  phone?: string;
  address?: string;
  logo?: string;
  settings?: Partial<IBusinessSettings>;
}

/**
 * Business şifre değiştirme DTO
 */
export interface BusinessChangePasswordDto {
  currentPassword: string;
  newPassword: string;
}

/**
 * JWT payload business için
 */
export interface BusinessJwtPayload {
  businessId: string; // Business ID
  businessName: string; // Business adı
  role: 'business'; // Sadece business rolü
  exp?: number;
  iat?: number;
} 