"use client";

import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { ToggleButton } from "primereact/togglebutton";
import { BusinessSettings } from "../types";

interface BusinessSettingsTabProps {
    settings: BusinessSettings;
    onUpdate: (updates: Partial<BusinessSettings>) => void;
}

export const BusinessSettingsTab = ({ settings, onUpdate }: BusinessSettingsTabProps) => {
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
        <div className="space-y-8 w-full max-w-7xl mx-auto">
            {/* Hesap Doğrulama Formu */}
            <Card title={
                <div className="flex items-center gap-3">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                            <i className="pi pi-verified text-blue-600 mr-3 text-2xl"></i>
                            Hesabı Doğrula
                        </h2>
                        <p className="text-sm text-gray-600">Firma bilgilerinizi doğrulayarak hesabınızı aktifleştirin</p>
                    </div>
                </div>
            } className="border-0 bg-white">
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                    {/* Sol Taraf - Hesap Doğrulama */}
                    <div className="space-y-6">
                        {/* Firma Bilgileri */}
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
                            <div className="flex items-center gap-3 mb-6">
                                <h3 className="text-xl font-semibold text-gray-800">🏢 Firma Bilgileri</h3>
                            </div>

                            <div className="space-y-5">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        <i className="pi pi-id-card text-blue-500 mr-2"></i>
                                        Tüzel kişi tam unvanı *
                                    </label>
                                    <InputText
                                        placeholder="Firma tam unvanı"
                                        className="w-full h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        <i className="pi pi-credit-card text-green-500 mr-2"></i>
                                        Vergi kimlik numarası *
                                    </label>
                                    <InputText
                                        placeholder="Vergi kimlik numarası"
                                        className="w-full h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        <i className="pi pi-map-marker text-red-500 mr-2"></i>
                                        Açık adresi *
                                    </label>
                                    <InputText
                                        placeholder="Firma açık adresi"
                                        className="w-full h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        <i className="pi pi-phone text-purple-500 mr-2"></i>
                                        Telefon *
                                    </label>
                                    <InputText
                                        placeholder="Firma telefon numarası"
                                        className="w-full h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Kayıtlı elektronik posta (KEP) adresi *
                                    </label>
                                    <InputText
                                        placeholder="KEP adresi"
                                        className="w-full h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* İDARİ İLETİŞİM SORUMLUSU BİLGİLERİ */}
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-100">
                            <div className="flex items-center gap-3 mb-6">
                                <h3 className="text-xl font-semibold text-gray-800">👤 İDARİ İLETİŞİM SORUMLUSU BİLGİLERİ</h3>
                            </div>

                            <div className="space-y-5">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        <i className="pi pi-user-edit text-green-500 mr-2"></i>
                                        Ad soyad *
                                    </label>
                                    <InputText
                                        placeholder="İletişim sorumlusu ad soyad"
                                        className="w-full h-11 border-gray-300 focus:border-green-500 focus:ring-green-500 rounded-lg"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        <i className="pi pi-envelope text-green-500 mr-2"></i>
                                        İletişim sorumlusu e-posta adresi *
                                    </label>
                                    <InputText
                                        placeholder="E-posta adresi"
                                        className="w-full h-11 border-gray-300 focus:border-green-500 focus:ring-green-500 rounded-lg"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        <i className="pi pi-mobile text-green-500 mr-2"></i>
                                        Cep telefonu *
                                    </label>
                                    <InputText
                                        placeholder="05_________"
                                        className="w-full h-11 border-gray-300 focus:border-green-500 focus:ring-green-500 rounded-lg"
                                    />
                                    <p className="text-xs text-gray-600 mt-2 flex items-center gap-2">
                                        <i className="pi pi-info-circle text-blue-500"></i>
                                        Yazılacak numaraya SMS ile doğrulama kodu gönderilecektir.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* ENTEGRE OLUNMASI İSTENEN İLAN PLATFORMU BİLGİLERİ */}
                        <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-100">
                            <div className="flex items-center gap-3 mb-6">
                                <h3 className="text-xl font-semibold text-gray-800">🌐 ENTEGRE OLUNMASI İSTENEN İLAN PLATFORMU BİLGİLERİ</h3>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    <i className="pi pi-link text-purple-500 mr-2"></i>
                                    Websitesi (URL) *
                                </label>
                                <InputText
                                    placeholder="https://www.example.com"
                                    className="w-full h-11 border-gray-300 focus:border-purple-500 focus:ring-purple-500 rounded-lg"
                                />
                            </div>
                        </div>

                        {/* Güvenlik Bilgisi */}
                        <div className="bg-gradient-to-r from-gray-50 to-slate-50 p-6 rounded-xl border border-gray-200">
                            <div className="flex items-center gap-3 mb-4">
                                <h4 className="text-lg font-semibold text-gray-800">🔒 Güvenlik</h4>
                            </div>
                            <p className="text-sm text-gray-600 mb-3">
                                Bilgileriniz bizde güvende
                            </p>
                            <a href="#" className="text-sm text-blue-600 hover:text-blue-800 underline font-medium flex items-center gap-2">
                                <i className="pi pi-external-link"></i>
                                KVKK Aydınlatma Metni
                            </a>
                        </div>
                    </div>

                    {/* Sağ Taraf - Çalışma Saatleri */}
                    <div>
                        <Card title={
                            <div className="flex items-center gap-3">
                                <h3 className="text-xl font-semibold text-gray-800">🕒 Çalışma Saatleri</h3>
                            </div>
                        } className="border-0 !shadow-none bg-white h-fit">
                            <div className="space-y-4">
                                <p className="text-sm text-gray-600 mb-6">
                                    Çalışma saatlerinizi belirleyin
                                </p>

                                {Object.entries(dayNames).map(([day, dayName]) => {
                                    const isOpen = settings.workingHours[day]?.isOpen || false;
                                    const isSunday = day === 'sunday';

                                    return (
                                        <div
                                            key={day}
                                            className={`flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-lg transition-all duration-300 ${isSunday
                                                ? isOpen
                                                    ? 'border border-orange-200 bg-orange-50 hover:bg-orange-100' // Pazar açık - yeşil
                                                    : 'border border-red-300 bg-red-50 hover:bg-red-100' // Pazar kapalı - kırmızı
                                                : isOpen
                                                    ? 'border border-orange-200 bg-orange-50 hover:bg-orange-100' // Diğer günler açık - turuncu
                                                    : 'border border-transparent bg-transparent' // Diğer günler kapalı - şeffaf
                                                }`}
                                        >
                                            <div className="w-24 font-medium text-gray-800 flex items-center gap-2">
                                                <i className={`pi ${isOpen
                                                    ? isSunday
                                                        ? 'pi-check-circle text-green-500' // Pazar açık - yeşil tick
                                                        : 'pi-check-circle text-green-500' // Diğer günler açık - yeşil tick
                                                    : isSunday
                                                        ? 'pi-times-circle text-red-500' // Pazar kapalı - kırmızı çarpı
                                                        : 'pi-times-circle text-gray-400' // Diğer günler kapalı - gri çarpı
                                                    } transition-all duration-300`}></i>
                                                {dayName}
                                            </div>

                                            <ToggleButton
                                                checked={isOpen}
                                                onChange={(e) => handleWorkingHoursChange(day, 'isOpen', e.value)}
                                                onLabel="Açık"
                                                offLabel="Kapalı"
                                                className={`w-24 h-10 text-sm font-medium rounded-lg transition-all duration-300 ${isSunday
                                                    ? isOpen
                                                        ? 'bg-green-600 hover:bg-green-700 border-green-600 text-white' // Pazar açık - yeşil
                                                        : 'bg-red-600 hover:bg-red-700 border-red-600 text-white' // Pazar kapalı - kırmızı
                                                    : isOpen
                                                        ? 'bg-orange-600 hover:bg-orange-700 border-orange-600 text-white' // Diğer günler açık - turuncu
                                                        : 'bg-gray-200 hover:bg-gray-300 border-gray-200 text-gray-700' // Diğer günler kapalı - gri
                                                    }`}
                                            />

                                            {isOpen && (
                                                <div className="flex items-center gap-3 animate-in slide-in-from-left-2 duration-300">
                                                    <InputText
                                                        type="time"
                                                        value={settings.workingHours[day]?.openTime || "09:00"}
                                                        onChange={(e) => handleWorkingHoursChange(day, 'openTime', e.target.value)}
                                                        className={`w-32 h-10 text-sm border-gray-300 focus:ring-2 rounded-lg transition-all duration-300 ${isSunday
                                                            ? 'focus:border-green-500 focus:ring-green-500' // Pazar açık - yeşil focus
                                                            : 'focus:border-orange-500 focus:ring-orange-500' // Diğer günler - turuncu focus
                                                            }`}
                                                    />
                                                    <span className="text-gray-500 font-medium">-</span>
                                                    <InputText
                                                        type="time"
                                                        value={settings.workingHours[day]?.closeTime || "18:00"}
                                                        onChange={(e) => handleWorkingHoursChange(day, 'closeTime', e.target.value)}
                                                        className={`w-32 h-10 text-sm border-gray-300 focus:ring-2 rounded-lg transition-all duration-300 ${isSunday
                                                            ? 'focus:border-green-500 focus:ring-green-500' // Pazar açık - yeşil focus
                                                            : 'focus:border-orange-500 focus:ring-orange-500' // Diğer günler - turuncu focus
                                                            }`}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </Card>
                    </div>
                </div>
            </Card>
        </div>
    );
};
