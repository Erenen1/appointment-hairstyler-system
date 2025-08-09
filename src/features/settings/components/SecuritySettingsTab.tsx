"use client";

import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Password } from "primereact/password";
import { Divider } from "primereact/divider";
import { SecuritySettings } from "../types";

interface SecuritySettingsTabProps {
    settings: SecuritySettings;
    onSettingsChange: (settings: SecuritySettings) => void;
    onPasswordChange: (passwordData: SecuritySettings) => void;
}

export const SecuritySettingsTab = ({
    settings,
    onSettingsChange,
    onPasswordChange
}: SecuritySettingsTabProps) => {
    const handleInputChange = (field: keyof SecuritySettings, value: string) => {
        onSettingsChange({ ...settings, [field]: value });
    };

    const handleSubmit = () => {
        try {
            onPasswordChange(settings);
            alert("✅ Şifre başarıyla değiştirildi!");
        } catch (error) {
            alert("❌ " + (error as Error).message);
        }
    };

    const passwordHeader = <div className="font-bold mb-3">Şifre Güvenlik Seviyesi</div>;
    const passwordFooter = (
        <>
            <Divider />
            <p className="mt-2">Öneriler:</p>
            <ul className="pl-2 ml-2 mt-0 line-height-3">
                <li>En az bir küçük harf</li>
                <li>En az bir büyük harf</li>
                <li>En az bir sayı</li>
                <li>En az 8 karakter</li>
            </ul>
        </>
    );

    return (
        <div className="space-y-6">
            <Card title="Şifre Değiştir" className="border-0 shadow-md">
                <div className="max-w-md space-y-4">
                    <span className="p-float-label">
                        <Password
                            inputId="currentPassword"
                            value={settings.currentPassword}
                            onChange={(e) => handleInputChange('currentPassword', e.target.value)}
                            toggleMask
                            feedback={false}
                            className="w-full"
                        />
                        <label htmlFor="currentPassword">Mevcut Şifre</label>
                    </span>

                    <span className="p-float-label">
                        <Password
                            inputId="newPassword"
                            value={settings.newPassword}
                            onChange={(e) => handleInputChange('newPassword', e.target.value)}
                            toggleMask
                            header={passwordHeader}
                            footer={passwordFooter}
                            className="w-full"
                        />
                        <label htmlFor="newPassword">Yeni Şifre</label>
                    </span>

                    <span className="p-float-label">
                        <Password
                            inputId="confirmPassword"
                            value={settings.confirmPassword}
                            onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                            toggleMask
                            feedback={false}
                            className="w-full"
                        />
                        <label htmlFor="confirmPassword">Yeni Şifre (Tekrar)</label>
                    </span>

                    <Button
                        label="Şifreyi Değiştir"
                        icon="pi pi-key"
                        onClick={handleSubmit}
                        className="w-full bg-blue-600 hover:bg-blue-700"
                        disabled={!settings.currentPassword || !settings.newPassword || !settings.confirmPassword}
                    />
                </div>
            </Card>

            <Card title="Güvenlik Bilgileri" className="border-0 shadow-md">
                <div className="space-y-4">
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center gap-2 text-green-700">
                            <i className="pi pi-shield text-lg"></i>
                            <span className="font-medium">Hesabınız güvende</span>
                        </div>
                        <p className="text-sm text-green-600 mt-1">
                            Son şifre değişikliği: 15 gün önce
                        </p>
                    </div>

                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-center gap-2 text-blue-700">
                            <i className="pi pi-info-circle text-lg"></i>
                            <span className="font-medium">Güvenlik İpuçları</span>
                        </div>
                        <ul className="text-sm text-blue-600 mt-2 space-y-1">
                            <li>• Şifrenizi düzenli olarak değiştirin</li>
                            <li>• Güçlü ve benzersiz şifreler kullanın</li>
                            <li>• Şifrenizi kimseyle paylaşmayın</li>
                            <li>• Çıkış yapmayı unutmayın</li>
                        </ul>
                    </div>
                </div>
            </Card>
        </div>
    );
};
