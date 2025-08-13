"use client";

import { Button } from "primereact/button";
import { useRouter } from "next/navigation";

export default function NotFound() {
    const router = useRouter();

    const handleGoBack = () => {
        router.back();
    };

    const handleGoHome = () => {
        router.push("/admin");
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-6">
            <div className="max-w-3xl mx-auto text-center">
                {/* Simple 404 Header */}
                <div className="mb-8">
                    <h1 className="text-6xl md:text-7xl font-black text-slate-300 mb-4">
                        404
                    </h1>
                    <div className="w-24 h-1 bg-slate-300 mx-auto rounded-full"></div>
                </div>

                {/* Main Content */}
                <div className="space-y-8">
                    {/* Title and Description */}
                    <div className="space-y-4">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-800">
                            Sayfa Bulunamadı
                        </h2>

                        <p className="text-lg text-slate-600 leading-relaxed max-w-xl mx-auto">
                            Aradığınız sayfa mevcut değil veya kaldırıldı.
                            <br className="hidden md:block" />
                            Lütfen doğru URL&apos;yi kontrol edin veya aşağıdaki seçeneklerden birini kullanın.
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button
                            label="Geri Dön"
                            icon="pi pi-arrow-left"
                            severity="danger"
                            onClick={handleGoBack}
                            className="flex-1 sm:flex-none px-8 py-3 text-base font-medium"
                        />

                        <Button
                            label="Ana Sayfa"
                            icon="pi pi-home"
                            severity="info"
                            onClick={handleGoHome}
                            className="flex-1 sm:flex-none px-8 py-3 text-base font-medium"
                        />
                    </div>

                    {/* Contact Information */}
                    <div className="max-w-2xl mx-auto">
                        <h3 className="text-xl font-bold text-slate-800 mb-4">
                            İletişim Bilgileri
                        </h3>

                        <div className="space-y-3 text-left max-w-md mx-auto">
                            <div className="flex items-center space-x-3">
                                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                                    <i className="pi pi-envelope text-blue-600 text-sm"></i>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 font-medium">E-posta</p>
                                    <p className="text-slate-700 text-sm">info@emlakplatformu.com</p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-3">
                                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                                    <i className="pi pi-phone text-green-600 text-sm"></i>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 font-medium">Telefon</p>
                                    <p className="text-slate-700 text-sm">+90 (212) 555 0123</p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-3">
                                <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                                    <i className="pi pi-clock text-purple-600 text-sm"></i>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 font-medium">Çalışma Saatleri</p>
                                    <p className="text-slate-700 text-sm">Pazartesi - Cuma: 09:00 - 18:00</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-8 text-center">
                        <div className="w-16 h-px bg-slate-300 mx-auto mb-4"></div>
                        <p className="text-slate-500 text-sm font-medium">
                            RealEstate Pro
                        </p>
                        <p className="text-slate-400 text-xs mt-2 max-w-md mx-auto">
                            Profesyonel emlak yönetimi çözümleri ile işinizi büyütün
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
