"use client";

import { Card } from "primereact/card";

interface StatsCardsProps {
    stats: {
        totalProperties: number;
        totalViews: number;
        totalClicks: number;
        avgPrice: number;
        clickRate: number;
    };
}

export const StatsCards = ({ stats }: StatsCardsProps) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            <Card className="text-center border-0 shadow-md">
                <div className="text-3xl font-bold text-blue-600 mb-2">{stats.totalProperties}</div>
                <div className="text-sm text-gray-600">Toplam İlan</div>
            </Card>

            <Card className="text-center border-0 shadow-md">
                <div className="text-3xl font-bold text-green-600 mb-2">{stats.totalViews.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Toplam Görüntüleme</div>
            </Card>

            <Card className="text-center border-0 shadow-md">
                <div className="text-3xl font-bold text-orange-600 mb-2">{stats.totalClicks.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Toplam Tıklama</div>
            </Card>

            <Card className="text-center border-0 shadow-md">
                <div className="text-3xl font-bold text-purple-600 mb-2">₺{Math.round(stats.avgPrice).toLocaleString()}</div>
                <div className="text-sm text-gray-600">Ortalama Fiyat</div>
            </Card>

            <Card className="text-center border-0 shadow-md">
                <div className="text-3xl font-bold text-red-600 mb-2">%{stats.clickRate.toFixed(1)}</div>
                <div className="text-sm text-gray-600">Tıklama Oranı</div>
            </Card>
        </div>
    );
};
