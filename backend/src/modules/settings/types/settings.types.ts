export interface BusinessSettingsDTO {
  businessName: string;
  businessLogo?: string;
  ownerName?: string;
  email?: string;
  phone?: string;
  address?: string;
  website?: string;
  description?: string;
  workingHours?: Record<string, any>;
}

export interface NotificationSettingsDTO {
  emailNotifications: boolean;
  smsNotifications: boolean;
  appointmentReminders: boolean;
  newCustomerAlerts: boolean;
  paymentAlerts: boolean;
}

export interface ProfileDTO {
  fullName?: string;
  email?: string;
  phone?: string;
  avatar?: string;
}

export interface ChangePasswordDTO {
  currentPassword: string;
  newPassword: string;
}


