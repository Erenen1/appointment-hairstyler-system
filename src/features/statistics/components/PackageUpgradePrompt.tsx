"use client";

import { Card } from "primereact/card";
import { Button } from "primereact/button";

interface PackageUpgradePromptProps {
    onPreviewClick: () => void;
    onMoreInfoClick: () => void;
}

export const PackageUpgradePrompt = ({ onPreviewClick, onMoreInfoClick }: PackageUpgradePromptProps) => {
    return (
        <div className="p-4 md:p-6 space-y-6">
            {/* Header */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-blue-100">
                <h1 className="text-3xl font-bold text-blue-800 mb-2">Emlak İstatistikleri</h1>
                <p className="text-blue-600">Gelişmiş analitik ve raporlama özellikleri</p>
            </div>

            {/* Upgrade Prompt */}
            <div className="min-h-[60vh] flex items-center justify-center">
                <Card className="max-w-2xl w-full text-center border-0 shadow-2xl">
                    <div className="p-8 space-y-6">
                        {/* Lock Icon */}
                        <div className="bg-gradient-to-br from-blue-100 to-purple-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                            <i className="pi pi-lock text-4xl text-blue-600"></i>
                        </div>

                        {/* Title & Description */}
                        <div>
                            <h2 className="text-3xl font-bold text-gray-800 mb-4">Analitik Paketi Gerekli</h2>
                            <p className="text-lg text-gray-600 mb-6">
                                Emlak istatistikleri, scraping verileri ve gelişmiş analitik raporlarına erişim için
                                <span className="font-semibold text-blue-600"> Premium Analitik Paketi</span>&apos;ne sahip olmanız gerekiyor.
                            </p>
                        </div>

                        {/* Features List */}
                        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Premium Analitik Paketi ile:</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-left">
                                <div className="flex items-center gap-2">
                                    <i className="pi pi-check-circle text-green-500"></i>
                                    <span className="text-sm">Sahibinden.com Scraping</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <i className="pi pi-check-circle text-green-500"></i>
                                    <span className="text-sm">Detaylı İlan Analitikleri</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <i className="pi pi-check-circle text-green-500"></i>
                                    <span className="text-sm">Performans Grafikleri</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <i className="pi pi-check-circle text-green-500"></i>
                                    <span className="text-sm">Rekabet Analizi</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <i className="pi pi-check-circle text-green-500"></i>
                                    <span className="text-sm">Otomatik Raporlama</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <i className="pi pi-check-circle text-green-500"></i>
                                    <span className="text-sm">API Entegrasyonu</span>
                                </div>
                            </div>
                        </div>

                        {/* Pricing */}
                        <div className="bg-white border-2 border-blue-200 rounded-xl p-6 mb-6">
                            <div className="flex items-center justify-center gap-2 mb-2">
                                <span className="text-3xl font-bold text-blue-600">₺299</span>
                                <span className="text-gray-500">/ay</span>
                            </div>
                            <p className="text-sm text-gray-600">İlk 30 gün ücretsiz deneme</p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <Button
                                label="Paketi Önizle"
                                icon="pi pi-eye"
                                className="bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 border-0 px-8 py-3 text-white font-semibold text-lg"
                                onClick={onPreviewClick}
                            />
                            <Button
                                label="Daha Fazlası"
                                icon="pi pi-arrow-right"
                                outlined
                                className="border-blue-500 text-blue-600 hover:bg-blue-50 px-8 py-3 font-semibold"
                                onClick={onMoreInfoClick}
                            />
                        </div>

                        {/* Trust Indicators */}
                        <div className="flex items-center justify-center gap-6 pt-6 border-t border-gray-200">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <i className="pi pi-shield text-green-500"></i>
                                <span>SSL Güvenli</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <i className="pi pi-times-circle text-red-500"></i>
                                <span>İstediğiniz Zaman İptal</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <i className="pi pi-phone text-blue-500"></i>
                                <span>7/24 Destek</span>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};
