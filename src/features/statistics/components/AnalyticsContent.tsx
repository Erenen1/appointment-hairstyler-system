import { Card } from "primereact/card";
import { Chart } from "primereact/chart";
import { Button } from "primereact/button";
import { Badge } from "primereact/badge";
import { ChartData, StatisticsStats } from "../types";
import { PreviewBanner } from "./PreviewBanner";

interface AnalyticsContentProps {
    propertyTypeChart: ChartData;
    clicksChart: ChartData;
    stats: StatisticsStats;
    isPreviewMode: boolean;
    onPurchaseClick: () => void;
    onEndPreview: () => void;
    onDeactivatePackage: () => void;
}

export const AnalyticsContent = ({
    propertyTypeChart,
    clicksChart,
    stats,
    isPreviewMode,
    onPurchaseClick,
    onEndPreview,
    onDeactivatePackage
}: AnalyticsContentProps) => {
    return (
        <div className="p-4 md:p-6 space-y-6">
            {/* Preview Mode Warning */}
            {isPreviewMode && (
                <PreviewBanner
                    onPurchaseClick={onPurchaseClick}
                    onEndPreview={onEndPreview}
                />
            )}

            {/* Header */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-blue-100">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-blue-800 mb-2">Emlak İstatistikleri</h1>
                        <p className="text-blue-600">Sahibinden.com scraped ilanlar performans özeti</p>
                        <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">
                            <i className="pi pi-clock"></i>
                            <span>Son güncelleme: {new Date().toLocaleString('tr-TR')}</span>
                            <i className="pi pi-database ml-4"></i>
                            <span>Aktif scraping: Sahibinden.com</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Badge
                            value={isPreviewMode ? "ÖNİZLEME" : "PREMIUM"}
                            severity={isPreviewMode ? "warning" : "success"}
                        />
                        {!isPreviewMode && (
                            <Button
                                icon="pi pi-cog"
                                text
                                rounded
                                tooltip="Paket Ayarları"
                                className="text-blue-600"
                            />
                        )}
                        {/* Demo: Test Button */}
                        {!isPreviewMode && (
                            <Button
                                label="Demo: Paketi Deaktif Et"
                                icon="pi pi-times"
                                text
                                size="small"
                                className="text-red-500 hover:bg-red-50"
                                onClick={onDeactivatePackage}
                            />
                        )}
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
                    <div className="text-4xl font-bold text-blue-600 mb-2">{stats.totalProperties}</div>
                    <div className="text-lg font-semibold text-blue-800">Scraped İlanlar</div>
                    <div className="text-sm text-blue-600">Sahibinden.com&apos;dan çekilen</div>
                </Card>
                <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
                    <div className="text-4xl font-bold text-green-600 mb-2">{stats.totalViews.toLocaleString()}</div>
                    <div className="text-lg font-semibold text-blue-800">Toplam Görüntüleme</div>
                    <div className="text-sm text-blue-600">Sistemimiz üzerinden</div>
                </Card>
                <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
                    <div className="text-4xl font-bold text-orange-600 mb-2">{stats.totalClicks}</div>
                    <div className="text-lg font-semibold text-blue-800">İlan Tıklamaları</div>
                    <div className="text-sm text-blue-600">Sahibinden&apos;e yönlendirme</div>
                </Card>
                <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
                    <div className="text-4xl font-bold text-purple-600 mb-2">{stats.avgPrice.toLocaleString()}₺</div>
                    <div className="text-lg font-semibold text-blue-800">Ortalama Fiyat</div>
                    <div className="text-sm text-blue-600">Scraped ilanlar</div>
                </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card title="Scraped İlan Türü Dağılımı" className="h-[440px]">
                    <div className="text-sm text-gray-600 mb-4">Sahibinden.com&apos;dan çekilen ilanların kategori dağılımı</div>
                    <Chart type="doughnut" data={propertyTypeChart.data} options={propertyTypeChart.options} style={{ height: '300px' }} />
                </Card>
                <Card title="En Çok Tıklanan Scraped İlanlar" className="h-[440px]">
                    <div className="text-sm text-gray-600 mb-4">Sistemimiz üzerinden en çok tıklanan ilanlar</div>
                    <Chart type="doughnut" data={clicksChart.data} options={clicksChart.options} style={{ height: '300px' }} />
                </Card>
            </div>
        </div>
    );
};
