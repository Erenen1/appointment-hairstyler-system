"use client";

import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { FileUpload } from "primereact/fileupload";
import { ToggleButton } from "primereact/togglebutton";
import { BusinessSettings } from "../types";

interface BusinessSettingsTabProps {
    settings: BusinessSettings;
    onUpdate: (settings: Partial<BusinessSettings>) => void;
    onLogoUpload: (file: File) => void;
}

export const BusinessSettingsTab = ({ settings, onUpdate, onLogoUpload }: BusinessSettingsTabProps) => {
    const handleInputChange = (field: keyof BusinessSettings, value: string) => {
        onUpdate({ [field]: value });
    };

    const handleWorkingHoursChange = (day: string, field: 'isOpen' | 'openTime' | 'closeTime', value: boolean | string) => {
        onUpdate({
            workingHours: {
                ...settings.workingHours,
                [day]: {
                    ...settings.workingHours[day],
                    [field]: value
                }
            }
        });
    };

    const dayNames = {
        monday: "Pazartesi",
        tuesday: "Salı",
        wednesday: "Çarşamba",
        thursday: "Perşembe",
        friday: "Cuma",
        saturday: "Cumartesi",
        sunday: "Pazar"
    };

    return (
        <div className="space-y-6">
            {/* Logo ve Temel Bilgiler */}
            <Card title="İşletme Bilgileri" className="border-0 shadow-md">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-1">
                        <label className="block text-sm font-medium mb-2">İşletme Logosu</label>
                        <div className="flex flex-col items-center gap-4">
                            {settings.businessLogo && (
                                <img
                                    src={settings.businessLogo}
                                    alt="Logo"
                                    className="w-32 h-32 object-cover rounded-lg border"
                                />
                            )}
                            <FileUpload
                                mode="basic"
                                name="logo"
                                accept="image/*"
                                maxFileSize={1000000}
                                onSelect={(e) => onLogoUpload(e.files[0])}
                                auto
                                chooseLabel="Logo Yükle"
                                className="w-full"
                            />
                        </div>
                    </div>

                    <div className="lg:col-span-2 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <span className="p-float-label">
                                <InputText
                                    id="businessName"
                                    value={settings.businessName}
                                    onChange={(e) => handleInputChange('businessName', e.target.value)}
                                    className="w-full"
                                />
                                <label htmlFor="businessName">İşletme Adı</label>
                            </span>

                            <span className="p-float-label">
                                <InputText
                                    id="ownerName"
                                    value={settings.ownerName}
                                    onChange={(e) => handleInputChange('ownerName', e.target.value)}
                                    className="w-full"
                                />
                                <label htmlFor="ownerName">İşletme Sahibi</label>
                            </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <span className="p-float-label">
                                <InputText
                                    id="email"
                                    value={settings.email}
                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                    className="w-full"
                                />
                                <label htmlFor="email">E-posta</label>
                            </span>

                            <span className="p-float-label">
                                <InputText
                                    id="phone"
                                    value={settings.phone}
                                    onChange={(e) => handleInputChange('phone', e.target.value)}
                                    className="w-full"
                                />
                                <label htmlFor="phone">Telefon</label>
                            </span>
                        </div>

                        <span className="p-float-label">
                            <InputText
                                id="website"
                                value={settings.website || ""}
                                onChange={(e) => handleInputChange('website', e.target.value)}
                                className="w-full"
                            />
                            <label htmlFor="website">Web Sitesi</label>
                        </span>

                        <span className="p-float-label">
                            <InputTextarea
                                id="address"
                                value={settings.address}
                                onChange={(e) => handleInputChange('address', e.target.value)}
                                className="w-full"
                                rows={2}
                            />
                            <label htmlFor="address">Adres</label>
                        </span>

                        <span className="p-float-label">
                            <InputTextarea
                                id="description"
                                value={settings.description || ""}
                                onChange={(e) => handleInputChange('description', e.target.value)}
                                className="w-full"
                                rows={3}
                            />
                            <label htmlFor="description">İşletme Açıklaması</label>
                        </span>
                    </div>
                </div>
            </Card>

            {/* Çalışma Saatleri */}
            <Card title="Çalışma Saatleri" className="border-0 shadow-md">
                <div className="space-y-4">
                    {Object.entries(dayNames).map(([day, dayName]) => (
                        <div key={day} className="flex items-center gap-4 p-3 border rounded-lg">
                            <div className="w-24 font-medium">{dayName}</div>
                            <ToggleButton
                                checked={settings.workingHours[day]?.isOpen || false}
                                onChange={(e) => handleWorkingHoursChange(day, 'isOpen', e.value)}
                                onLabel="Açık"
                                offLabel="Kapalı"
                                className="w-20"
                            />
                            {settings.workingHours[day]?.isOpen && (
                                <>
                                    <InputText
                                        type="time"
                                        value={settings.workingHours[day]?.openTime || "09:00"}
                                        onChange={(e) => handleWorkingHoursChange(day, 'openTime', e.target.value)}
                                        className="w-32"
                                    />
                                    <span>-</span>
                                    <InputText
                                        type="time"
                                        value={settings.workingHours[day]?.closeTime || "18:00"}
                                        onChange={(e) => handleWorkingHoursChange(day, 'closeTime', e.target.value)}
                                        className="w-32"
                                    />
                                </>
                            )}
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
};
