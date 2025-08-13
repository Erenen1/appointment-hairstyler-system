"use client";

import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { UserProfile } from "../types";

interface ProfileSettingsTabProps {
    profile: UserProfile;
    onUpdate: (profile: Partial<UserProfile>) => void;
}

export const ProfileSettingsTab = ({ profile, onUpdate }: ProfileSettingsTabProps) => {
    const handleInputChange = (field: keyof UserProfile, value: string) => {
        onUpdate({ [field]: value });
    };

    return (
        <div className="space-y-6">
            <Card title="Profil Bilgileri" className="border-0">
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <span className="p-float-label">
                            <InputText
                                id="fullName"
                                value={profile.fullName}
                                onChange={(e) => handleInputChange('fullName', e.target.value)}
                                className="w-full"
                            />
                            <label htmlFor="fullName">Ad Soyad</label>
                        </span>

                        <span className="p-float-label">
                            <InputText
                                id="email"
                                value={profile.email}
                                onChange={(e) => handleInputChange('email', e.target.value)}
                                className="w-full"
                                type="email"
                            />
                            <label htmlFor="fullName">E-posta</label>
                        </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <span className="p-float-label">
                            <InputText
                                id="phone"
                                value={profile.phone}
                                onChange={(e) => handleInputChange('phone', e.target.value)}
                                className="w-full"
                            />
                            <label htmlFor="phone">Telefon</label>
                        </span>

                        <span className="p-float-label">
                            <InputText
                                id="role"
                                value={profile.role}
                                onChange={(e) => handleInputChange('role', e.target.value)}
                                className="w-full"
                            />
                            <label htmlFor="role">Rol</label>
                        </span>
                    </div>

                    <div className="p-4 bg-blue-50 rounded-lg">
                        <div className="flex items-center gap-2 text-blue-700">
                            <i className="pi pi-info-circle"></i>
                            <span className="font-medium">Son Giriş:</span>
                            <span>{new Date(profile.lastLogin).toLocaleString('tr-TR')}</span>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
};
