import { Card } from "primereact/card";
import { Chart } from "primereact/chart";
import { Badge } from "primereact/badge";
import { Button } from "primereact/button";
import { ChartData, StatisticsStats } from "../types";
import { ResponsiveGrid, ResponsiveStatsCard, ResponsiveHero } from "../../../components/ui";

interface AnalyticsContentProps {
    propertyTypeChart: ChartData;
    clicksChart: ChartData;
    stats: StatisticsStats;
}

export const AnalyticsContent = ({
    propertyTypeChart,
    clicksChart,
    stats
}: AnalyticsContentProps) => {
    return (
        <div className="p-2 sm:p-4 md:p-6 space-y-4 sm:space-y-6">
            {/* Enhanced Page Header */}
            <ResponsiveHero
                title="Emlak İstatistikleri"
                subtitle="Sahibinden.com'dan çekilen ilanların detaylı performans analizi ve istatistiksel verileri"
                icon="pi-chart-line"
                iconBgColor="bg-gradient-to-br from-blue-500 to-indigo-600"
                gradient={{ from: 'blue-50', to: 'purple-100' }}
                borderColor="border-blue-200"
            >
                {/* Status Badges */}
                <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-3 mb-4">
                    <Badge
                        value="LIVE DATA"
                        severity="success"
                        className="text-xs sm:text-sm"
                    />
                    <Badge
                        value="REAL-TIME"
                        severity="info"
                        className="text-xs sm:text-sm"
                    />
                    <Badge
                        value="ÜCRETSİZ"
                        severity="warning"
                        className="text-xs sm:text-sm"
                    />
                </div>

                {/* Header Actions & Info */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 lg:gap-8">
                    {/* Left Side - Info */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                            <i className="pi pi-clock text-blue-500"></i>
                            <span>Son güncelleme: <strong>{new Date().toLocaleString('tr-TR')}</strong></span>
                        </div>
                        <div className="flex items-center gap-2">
                            <i className="pi pi-database text-indigo-500"></i>
                            <span>Veri kaynağı: <strong>Sahibinden.com</strong></span>
                        </div>
                        <div className="flex items-center gap-2">
                            <i className="pi pi-sync text-green-500"></i>
                            <span>Scraping durumu: <strong>Aktif</strong></span>
                        </div>
                    </div>

                    {/* Right Side - Actions */}
                    <div className="flex flex-col sm:flex-row items-center gap-3">
                        <Button
                            icon="pi pi-download"
                            label="Rapor İndir"
                            size="small"
                            severity="secondary"
                            outlined
                            className="w-full sm:w-auto"
                        />
                        <Button
                            icon="pi pi-refresh"
                            label="Yenile"
                            size="small"
                            severity="info"
                            outlined
                            className="w-full sm:w-auto"
                        />
                        <Button
                            icon="pi pi-cog"
                            label="Ayarlar"
                            size="small"
                            severity="help"
                            outlined
                            className="w-full sm:w-auto"
                        />
                    </div>
                </div>
            </ResponsiveHero>

            {/* Stats Cards */}
            <ResponsiveGrid cols={{ mobile: 1, tablet: 2, desktop: 4 }} gap="gap-4 sm:gap-6">
                <ResponsiveStatsCard
                    title="Scraped İlanlar"
                    value={stats.totalProperties}
                    subtitle="Sahibinden.com'dan çekilen"
                    icon="pi-home"
                    iconBgColor="bg-blue-500"
                    gradient={{ from: 'blue-50', to: 'blue-100' }}
                    borderColor="border-blue-200"
                />
                <ResponsiveStatsCard
                    title="Toplam Görüntüleme"
                    value={stats.totalViews.toLocaleString()}
                    subtitle="Sistemimiz üzerinden"
                    icon="pi-eye"
                    iconBgColor="bg-green-500"
                    gradient={{ from: 'green-50', to: 'green-100' }}
                    borderColor="border-green-200"
                />
                <ResponsiveStatsCard
                    title="İlan Tıklamaları"
                    value={stats.totalClicks}
                    subtitle="Sahibinden'e yönlendirme"
                    icon="pi-mouse"
                    iconBgColor="bg-orange-500"
                    gradient={{ from: 'orange-50', to: 'orange-100' }}
                    borderColor="border-orange-200"
                />
                <ResponsiveStatsCard
                    title="Ortalama Fiyat"
                    value={`${stats.avgPrice.toLocaleString()}₺`}
                    subtitle="Scraped ilanlar"
                    icon="pi-wallet"
                    iconBgColor="bg-purple-500"
                    gradient={{ from: 'purple-50', to: 'purple-100' }}
                    borderColor="border-purple-200"
                />
            </ResponsiveGrid>

            {/* Charts */}
            <ResponsiveGrid cols={{ mobile: 1, desktop: 2 }} gap="gap-4 sm:gap-6">
                <Card title="Scraped İlan Türü Dağılımı" className="h-auto min-h-[380px] sm:h-[420px]">
                    <div className="text-sm text-gray-600 mb-4">Sahibinden.com&apos;dan çekilen ilanların kategori dağılımı</div>
                    <div className="w-full h-[280px] sm:h-[320px]">
                        <Chart
                            type="doughnut"
                            data={propertyTypeChart.data}
                            options={propertyTypeChart.options}
                            style={{ height: '100%', width: '100%' }}
                        />
                    </div>
                </Card>
                <Card title="En Çok Tıklanan Scraped İlanlar" className="h-auto min-h-[380px] sm:h-[420px]">
                    <div className="text-sm text-gray-600 mb-4">Sistemimiz üzerinden en çok tıklanan ilanlar</div>
                    <div className="w-full h-[280px] sm:h-[320px]">
                        <Chart
                            type="bar"
                            data={clicksChart.data}
                            options={clicksChart.options}
                            style={{ height: '100%', width: '100%' }}
                        />
                    </div>
                </Card>
            </ResponsiveGrid>
        </div>
    );
};
