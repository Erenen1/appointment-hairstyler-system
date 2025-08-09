"use client";

import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { FileUpload } from "primereact/fileupload";
import { Avatar } from "primereact/avatar";
import { UserProfile } from "../types";

interface ProfileSettingsTabProps {
    profile: UserProfile;
    onUpdate: (profile: Partial<UserProfile>) => void;
    onAvatarUpload: (file: File) => void;
}

export const ProfileSettingsTab = ({ profile, onUpdate, onAvatarUpload }: ProfileSettingsTabProps) => {
    const handleInputChange = (field: keyof UserProfile, value: string) => {
        onUpdate({ [field]: value });
    };

    return (
        <div className="space-y-6">
            <Card title="Profil Bilgileri" className="border-0 shadow-md">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Avatar */}
                    <div className="lg:col-span-1">
                        <label className="block text-sm font-medium mb-2">Profil Fotoğrafı</label>
                        <div className="flex flex-col items-center gap-4">
                            <Avatar
                                image={profile.avatar}
                                icon={!profile.avatar ? "pi pi-user" : undefined}
                                size="xlarge"
                                shape="circle"
                                className="border-4 border-blue-100"
                            />
                            <FileUpload
                                mode="basic"
                                name="avatar"
                                accept="image/*"
                                maxFileSize={1000000}
                                onSelect={(e) => onAvatarUpload(e.files[0])}
                                auto
                                chooseLabel="Fotoğraf Yükle"
                                className="w-full"
                            />
                        </div>
                    </div>

                    {/* Profile Info */}
                    <div className="lg:col-span-3 space-y-4">
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
                                <label htmlFor="email">E-posta</label>
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
                </div>
            </Card>
        </div>
    );
};
