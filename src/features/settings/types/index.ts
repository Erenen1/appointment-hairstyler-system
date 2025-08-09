export interface BusinessSettings {
    id: number;
    businessName: string;
    businessLogo?: string;
    ownerName: string;
    email: string;
    phone: string;
    address: string;
    website?: string;
    description?: string;
    workingHours: {
        [key: string]: {
            isOpen: boolean;
            openTime: string;
            closeTime: string;
        };
    };
}

export interface UserProfile {
    id: number;
    fullName: string;
    email: string;
    phone: string;
    avatar?: string;
    role: string;
    lastLogin: string;
}

export interface SecuritySettings {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

export interface NotificationSettings {
    emailNotifications: boolean;
    smsNotifications: boolean;
    appointmentReminders: boolean;
    newCustomerAlerts: boolean;
    paymentAlerts: boolean;
}
