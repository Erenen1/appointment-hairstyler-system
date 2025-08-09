"use client";

import { Button } from "primereact/button";

interface PreviewBannerProps {
    onPurchaseClick: () => void;
    onEndPreview: () => void;
}

export const PreviewBanner = ({ onPurchaseClick, onEndPreview }: PreviewBannerProps) => {
    return (
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl p-4 shadow-lg">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <i className="pi pi-eye text-2xl"></i>
                    <div>
                        <h3 className="font-bold text-lg">ÖNİZLEME MODU</h3>
                        <p className="text-sm opacity-90">Tüm özellikleri ücretsiz keşfedin!</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <i className="pi pi-infinity text-2xl"></i>
                    <span className="text-sm font-semibold">Süresiz</span>
                </div>
            </div>
            <div className="mt-3 flex gap-3">
                <Button
                    label="Paketi Satın Al"
                    icon="pi pi-shopping-cart"
                    size="small"
                    className="bg-white text-blue-600 hover:bg-gray-100 border-0 font-semibold"
                    onClick={onPurchaseClick}
                />
                <Button
                    label="Önizlemeyi Sonlandır"
                    icon="pi pi-times"
                    size="small"
                    outlined
                    className="border-white text-white hover:bg-white hover:text-blue-600"
                    onClick={onEndPreview}
                />
            </div>
        </div>
    );
};
