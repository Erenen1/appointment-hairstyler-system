import { useState } from "react";
import { BusinessSettings, UserProfile, SecuritySettings, NotificationSettings } from "../types";

export const useSettings = () => {
    const [activeTab, setActiveTab] = useState<string>("business");

    // Mock data - gerçek uygulamada API'den gelecek
    const [businessSettings, setBusinessSettings] = useState<BusinessSettings>({
        id: 1,
        businessName: "Estate Pro Emlak",
        businessLogo: undefined,
        ownerName: "Ahmet Yılmaz",
        email: "info@estatepro.com",
        phone: "+90 532 123 45 67",
        address: "Ataşehir, İstanbul",
        website: "www.estatepro.com",
        description: "Güvenilir emlak danışmanlığı",
        workingHours: {
            monday: { isOpen: true, openTime: "09:00", closeTime: "18:00" },
            tuesday: { isOpen: true, openTime: "09:00", closeTime: "18:00" },
            wednesday: { isOpen: true, openTime: "09:00", closeTime: "18:00" },
            thursday: { isOpen: true, openTime: "09:00", closeTime: "18:00" },
            friday: { isOpen: true, openTime: "09:00", closeTime: "18:00" },
            saturday: { isOpen: true, openTime: "10:00", closeTime: "16:00" },
            sunday: { isOpen: false, openTime: "00:00", closeTime: "00:00" }
        }
    });

    const [userProfile, setUserProfile] = useState<UserProfile>({
        id: 1,
        fullName: "Ahmet Yılmaz",
        email: "ahmet@estatepro.com",
        phone: "+90 532 123 45 67",
        avatar: undefined,
        role: "İşletme Sahibi",
        lastLogin: new Date().toISOString()
    });

    const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
        emailNotifications: true,
        smsNotifications: true,
        appointmentReminders: true,
        newCustomerAlerts: true,
        paymentAlerts: true
    });

    const handleBusinessUpdate = (updatedSettings: Partial<BusinessSettings>) => {
        setBusinessSettings(prev => ({ ...prev, ...updatedSettings }));
        // API call simulation
        console.log("İşletme ayarları güncellendi:", updatedSettings);
    };

    const handleProfileUpdate = (updatedProfile: Partial<UserProfile>) => {
        setUserProfile(prev => ({ ...prev, ...updatedProfile }));
        // API call simulation
        console.log("Profil güncellendi:", updatedProfile);
    };

    const handlePasswordChange = (passwordData: SecuritySettings) => {
        // Password validation
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            throw new Error("Yeni şifreler eşleşmiyor!");
        }
        if (passwordData.newPassword.length < 6) {
            throw new Error("Şifre en az 6 karakter olmalıdır!");
        }

        // API call simulation
        console.log("Şifre değiştirildi");
        setSecuritySettings({
            currentPassword: "",
            newPassword: "",
            confirmPassword: ""
        });
    };

    const handleNotificationUpdate = (updatedNotifications: Partial<NotificationSettings>) => {
        setNotificationSettings(prev => ({ ...prev, ...updatedNotifications }));
        // API call simulation
        console.log("Bildirim ayarları güncellendi:", updatedNotifications);
    };

    const handleLogoUpload = (file: File) => {
        // File upload simulation
        const reader = new FileReader();
        reader.onload = (e) => {
            const result = e.target?.result as string;
            setBusinessSettings(prev => ({ ...prev, businessLogo: result }));
            console.log("Logo yüklendi");
        };
        reader.readAsDataURL(file);
    };

    const handleAvatarUpload = (file: File) => {
        // File upload simulation
        const reader = new FileReader();
        reader.onload = (e) => {
            const result = e.target?.result as string;
            setUserProfile(prev => ({ ...prev, avatar: result }));
            console.log("Avatar yüklendi");
        };
        reader.readAsDataURL(file);
    };

    const handleLogout = () => {
        // Logout simulation
        console.log("Çıkış yapılıyor...");
        // Gerçek uygulamada: localStorage.clear(), redirect to login, etc.
        alert("Çıkış yapıldı! (Simülasyon)");
    };

    return {
        // State
        activeTab,
        setActiveTab,
        businessSettings,
        userProfile,
        securitySettings,
        setSecuritySettings,
        notificationSettings,

        // Actions
        handleBusinessUpdate,
        handleProfileUpdate,
        handlePasswordChange,
        handleNotificationUpdate,
        handleLogoUpload,
        handleAvatarUpload,
        handleLogout
    };
};
