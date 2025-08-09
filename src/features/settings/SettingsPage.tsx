"use client";

import { TabView, TabPanel } from "primereact/tabview";
import { Button } from "primereact/button";
import { useSettings } from "./hooks/useSettings";
import {
    BusinessSettingsTab,
    ProfileSettingsTab,
    SecuritySettingsTab,
    NotificationSettingsTab
} from "./components";

export default function SettingsPage() {
    const {
        activeTab,
        setActiveTab,
        businessSettings,
        userProfile,
        securitySettings,
        setSecuritySettings,
        notificationSettings,
        handleBusinessUpdate,
        handleProfileUpdate,
        handlePasswordChange,
        handleNotificationUpdate,
        handleLogoUpload,
        handleAvatarUpload
    } = useSettings();

    return (
        <div className="p-4 md:p-6 space-y-6">
            {/* Header */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-blue-100">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-blue-800 mb-2">Ayarlar</h1>
                        <p className="text-blue-600">İşletme ve hesap ayarlarınızı yönetin</p>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            icon="pi pi-save"
                            label="Değişiklikleri Kaydet"
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => alert("✅ Tüm ayarlar kaydedildi!")}
                        />
                    </div>
                </div>
            </div>

            {/* Settings Tabs */}
            <TabView
                activeIndex={["business", "profile", "security", "notifications"].indexOf(activeTab)}
                onTabChange={(e) => setActiveTab(["business", "profile", "security", "notifications"][e.index])}
                className="bg-white rounded-xl shadow-sm border border-gray-100"
            >
                <TabPanel
                    header="İşletme"
                    leftIcon="pi pi-building mr-2"
                >
                    <BusinessSettingsTab
                        settings={businessSettings}
                        onUpdate={handleBusinessUpdate}
                        onLogoUpload={handleLogoUpload}
                    />
                </TabPanel>

                <TabPanel
                    header="Profil"
                    leftIcon="pi pi-user mr-2"
                >
                    <ProfileSettingsTab
                        profile={userProfile}
                        onUpdate={handleProfileUpdate}
                        onAvatarUpload={handleAvatarUpload}
                    />
                </TabPanel>

                <TabPanel
                    header="Güvenlik"
                    leftIcon="pi pi-shield mr-2"
                >
                    <SecuritySettingsTab
                        settings={securitySettings}
                        onSettingsChange={setSecuritySettings}
                        onPasswordChange={handlePasswordChange}
                    />
                </TabPanel>

                <TabPanel
                    header="Bildirimler"
                    leftIcon="pi pi-bell mr-2"
                >
                    <NotificationSettingsTab
                        settings={notificationSettings}
                        onUpdate={handleNotificationUpdate}
                    />
                </TabPanel>
            </TabView>
        </div>
    );
}
