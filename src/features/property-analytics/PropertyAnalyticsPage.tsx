"use client";

import { Card } from "primereact/card";
import { Chart } from "primereact/chart";
import "chart.js/auto";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import { Badge } from "primereact/badge";
import { Dropdown } from "primereact/dropdown";
import { MultiSelect } from "primereact/multiselect";
import { ProgressBar } from "primereact/progressbar";
import { useMemo, useState } from "react";

interface Property {
    id: number;
    title: string;
    price: number;
    type: string;
    category: string;
    location: string;
    area: number;
    views: number;
    clicks: number;
    featured: boolean;
    createdAt: string;
}

interface PropertyAnalyticsPageProps {
    properties?: Property[];
}

export default function PropertyAnalyticsPage({
    properties: initialProperties = []
}: PropertyAnalyticsPageProps) {
    const [globalFilter, setGlobalFilter] = useState<string>("");
    const [typeFilter, setTypeFilter] = useState<string[]>([]);
    const [categoryFilter, setCategoryFilter] = useState<string[]>([]);
    const [sortBy, setSortBy] = useState<string>("clicks");
    const [timeRange, setTimeRange] = useState<string>("week");

    const sortOptions = [
        { label: "En Çok Tıklanan", value: "clicks" },
        { label: "En Çok Görüntülenen", value: "views" },
        { label: "En Yeni", value: "createdAt" },
        { label: "En Pahalı", value: "price" }
    ];

    const timeRangeOptions = [
        { label: "Bu Hafta", value: "week" },
        { label: "Bu Ay", value: "month" },
        { label: "Son 3 Ay", value: "quarter" },
        { label: "Bu Yıl", value: "year" }
    ];

    const typeOptions = [
        { label: "Satılık", value: "Satılık" },
        { label: "Kiralık", value: "Kiralık" }
    ];

    const categoryOptions = [
        { label: "Daire", value: "Daire" },
        { label: "Müstakil", value: "Müstakil" },
        { label: "Villa", value: "Villa" },
        { label: "Ofis", value: "Ofis" },
        { label: "Dükkan", value: "Dükkan" },
        { label: "Arsa", value: "Arsa" }
    ];

    const filteredAndSortedProperties = useMemo(() => {
        let filtered = initialProperties.filter((p) => {
            const okType = typeFilter.length === 0 || typeFilter.includes(p.type);
            const okCategory = categoryFilter.length === 0 || categoryFilter.includes(p.category);
            const text = (p.title + " " + p.location + " " + p.category).toLowerCase();
            const okSearch = !globalFilter || text.includes(globalFilter.toLowerCase());
            return okType && okCategory && okSearch;
        });

        // Sort by selected criteria
        filtered.sort((a, b) => {
            switch (sortBy) {
                case "clicks":
                    return b.clicks - a.clicks;
                case "views":
                    return b.views - a.views;
                case "price":
                    return b.price - a.price;
                case "createdAt":
                    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                default:
                    return 0;
            }
        });

        return filtered;
    }, [initialProperties, typeFilter, categoryFilter, globalFilter, sortBy]);

    // Performance metrics
    const totalClicks = initialProperties.reduce((sum, p) => sum + p.clicks, 0);
    const totalViews = initialProperties.reduce((sum, p) => sum + p.views, 0);
    const avgClickRate = totalViews > 0 ? ((totalClicks / totalViews) * 100) : 0;
    const topPerformer = filteredAndSortedProperties[0];

    // Click-through rate calculation
    const getClickThroughRate = (clicks: number, views: number) => {
        return views > 0 ? ((clicks / views) * 100) : 0;
    };

    // Performance charts
    const performanceChart = useMemo(() => {
        const topProperties = filteredAndSortedProperties.slice(0, 10);
        return {
            data: {
                labels: topProperties.map(p => p.title.substring(0, 25) + "..."),
                datasets: [
                    {
                        label: 'Görüntüleme',
                        data: topProperties.map(p => p.views),
                        backgroundColor: 'rgba(59, 130, 246, 0.6)',
                        borderColor: 'rgb(59, 130, 246)',
                        borderWidth: 1
                    },
                    {
                        label: 'Tıklama',
                        data: topProperties.map(p => p.clicks),
                        backgroundColor: 'rgba(16, 185, 129, 0.6)',
                        borderColor: 'rgb(16, 185, 129)',
                        borderWidth: 1
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                },
                plugins: {
                    legend: {
                        position: 'top' as const,
                    },
                }
            }
        };
    }, [filteredAndSortedProperties]);

    const categoryPerformanceChart = useMemo(() => {
        const categoryStats = initialProperties.reduce((acc, p) => {
            if (!acc[p.category]) {
                acc[p.category] = { clicks: 0, views: 0, count: 0 };
            }
            acc[p.category].clicks += p.clicks;
            acc[p.category].views += p.views;
            acc[p.category].count += 1;
            return acc;
        }, {} as Record<string, { clicks: number; views: number; count: number }>);

        const categories = Object.keys(categoryStats);
        const clickRates = categories.map(cat =>
            categoryStats[cat].views > 0 ?
                (categoryStats[cat].clicks / categoryStats[cat].views) * 100 : 0
        );

        return {
            data: {
                labels: categories,
                datasets: [{
                    data: clickRates,
                    backgroundColor: [
                        "#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7", "#DDA0DD"
                    ]
                }]
            },
            options: {
                cutout: "60%",
                plugins: { legend: { position: "right" } },
                maintainAspectRatio: false
            }
        };
    }, [initialProperties]);

    const formatPrice = (price: number, type: string) => {
        if (type === "Kiralık") {
            return `${price.toLocaleString()} ₺/ay`;
        }
        return `${price.toLocaleString()} ₺`;
    };

    const getPerformanceColor = (clickRate: number) => {
        if (clickRate >= 15) return "text-green-600";
        if (clickRate >= 10) return "text-yellow-600";
        return "text-red-600";
    };

    const getPerformanceIcon = (clickRate: number) => {
        if (clickRate >= 15) return "pi pi-arrow-up";
        if (clickRate >= 10) return "pi pi-minus";
        return "pi pi-arrow-down";
    };

    return (
        <div className="p-4 md:p-6 space-y-6">
            {/* Header */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-blue-100">
                <h1 className="text-3xl font-bold text-blue-800 mb-2">İlan Performans Analitikleri</h1>
                <p className="text-blue-600">Sahibinden.com scraped ilanlarının detaylı performans analizi</p>
                <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                        <span className="text-gray-600">Toplam İlan:</span>
                        <span className="ml-1 font-semibold">{initialProperties.length}</span>
                    </div>
                    <div>
                        <span className="text-gray-600">Toplam Görüntüleme:</span>
                        <span className="ml-1 font-semibold">{totalViews.toLocaleString()}</span>
                    </div>
                    <div>
                        <span className="text-gray-600">Toplam Tıklama:</span>
                        <span className="ml-1 font-semibold">{totalClicks.toLocaleString()}</span>
                    </div>
                    <div>
                        <span className="text-gray-600">Ortalama CTR:</span>
                        <span className="ml-1 font-semibold">{avgClickRate.toFixed(2)}%</span>
                    </div>
                </div>
            </div>

            {/* Performance Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card title="Top 10 İlan Performansı" className="h-[440px]">
                    <Chart type="bar" data={performanceChart.data} options={performanceChart.options} style={{ height: '320px' }} />
                </Card>
                <Card title="Kategori Bazlı Tıklama Oranları (%)" className="h-[440px]">
                    <Chart type="doughnut" data={categoryPerformanceChart.data} options={categoryPerformanceChart.options} style={{ height: '320px' }} />
                </Card>
            </div>

            {/* Filters and Analytics */}
            <Card title="Detaylı İlan Analitikleri">
                <div className="flex flex-wrap gap-2 justify-between items-center pb-4">
                    <div className="flex gap-2 items-center">
                        <span className="p-input-icon-left">
                            <i className="pi pi-search" />
                            <InputText
                                value={globalFilter}
                                onChange={(e) => setGlobalFilter(e.target.value)}
                                placeholder="İlan ara..."
                            />
                        </span>
                        <MultiSelect
                            display="chip"
                            value={typeFilter}
                            onChange={(e) => setTypeFilter(e.value)}
                            options={typeOptions}
                            placeholder="Tür"
                            className="min-w-[8rem]"
                        />
                        <MultiSelect
                            display="chip"
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.value)}
                            options={categoryOptions}
                            placeholder="Kategori"
                            className="min-w-[10rem]"
                        />
                        <Dropdown
                            value={sortBy}
                            onChange={(e) => setSortBy(e.value)}
                            options={sortOptions}
                            placeholder="Sıralama"
                            className="min-w-[12rem]"
                        />
                        <Dropdown
                            value={timeRange}
                            onChange={(e) => setTimeRange(e.value)}
                            options={timeRangeOptions}
                            placeholder="Zaman"
                            className="min-w-[8rem]"
                        />
                    </div>
                    <div className="flex gap-2">
                        <Button icon="pi pi-download" label="Excel'e Aktar" severity="success" size="small" />
                        <Button icon="pi pi-refresh" label="Yenile" severity="info" size="small" />
                    </div>
                </div>

                <DataTable
                    value={filteredAndSortedProperties}
                    paginator
                    rows={15}
                    stripedRows
                    tableStyle={{ minWidth: "100%" }}
                    sortMode="multiple"
                    removableSort
                    globalFilter={globalFilter}
                    globalFilterFields={["title", "location", "category"]}
                    className="w-full"
                >
                    <Column
                        field="title"
                        header="İlan Başlığı"
                        sortable
                        style={{ minWidth: '250px' }}
                        body={(rowData) => (
                            <div>
                                <div className="font-semibold">{rowData.title}</div>
                                <div className="text-xs text-gray-500">{rowData.location}</div>
                            </div>
                        )}
                    />
                    <Column
                        field="type"
                        header="Tür"
                        sortable
                        style={{ minWidth: '80px' }}
                        body={(rowData) => (
                            <Tag
                                value={rowData.type}
                                severity={rowData.type === "Satılık" ? "info" : "warning"}
                            />
                        )}
                    />
                    <Column
                        field="category"
                        header="Kategori"
                        sortable
                        style={{ minWidth: '100px' }}
                        body={(rowData) => (
                            <Tag value={rowData.category} severity="secondary" />
                        )}
                    />
                    <Column
                        field="price"
                        header="Fiyat"
                        sortable
                        style={{ minWidth: '120px' }}
                        body={(rowData) => formatPrice(rowData.price, rowData.type)}
                    />
                    <Column
                        field="views"
                        header="Görüntüleme"
                        sortable
                        style={{ minWidth: '100px' }}
                        body={(rowData) => (
                            <div className="text-center">
                                <div className="font-semibold">{rowData.views.toLocaleString()}</div>
                                <div className="text-xs text-gray-500">görüntüleme</div>
                            </div>
                        )}
                    />
                    <Column
                        field="clicks"
                        header="Tıklama"
                        sortable
                        style={{ minWidth: '100px' }}
                        body={(rowData) => (
                            <div className="text-center">
                                <div className="font-semibold text-green-600">{rowData.clicks.toLocaleString()}</div>
                                <div className="text-xs text-gray-500">tıklama</div>
                            </div>
                        )}
                    />
                    <Column
                        header="Tıklama Oranı"
                        style={{ minWidth: '120px' }}
                        body={(rowData) => {
                            const clickRate = getClickThroughRate(rowData.clicks, rowData.views);
                            return (
                                <div className="text-center">
                                    <div className={`font-semibold ${getPerformanceColor(clickRate)} flex items-center justify-center gap-1`}>
                                        <i className={getPerformanceIcon(clickRate)}></i>
                                        {clickRate.toFixed(2)}%
                                    </div>
                                    <ProgressBar
                                        value={Math.min(clickRate, 20)}
                                        showValue={false}
                                        style={{ height: '4px' }}
                                        className="mt-1"
                                    />
                                </div>
                            );
                        }}
                    />
                    <Column
                        field="featured"
                        header="Durum"
                        style={{ minWidth: '80px' }}
                        body={(rowData) => (
                            <div className="flex flex-col gap-1">
                                {rowData.featured && <Badge value="Öne Çıkan" severity="warning" />}
                                <Badge value="Aktif" severity="success" />
                            </div>
                        )}
                    />
                    <Column
                        header="İşlemler"
                        style={{ minWidth: '120px' }}
                        body={(rowData) => (
                            <div className="flex gap-1">
                                <Button
                                    icon="pi pi-external-link"
                                    size="small"
                                    severity="info"
                                    tooltip="Sahibinden'de Aç"
                                    tooltipOptions={{ position: 'top' }}
                                />
                                <Button
                                    icon="pi pi-chart-line"
                                    size="small"
                                    severity="secondary"
                                    tooltip="Detaylı Analiz"
                                    tooltipOptions={{ position: 'top' }}
                                />
                                <Button
                                    icon="pi pi-bookmark"
                                    size="small"
                                    severity="warning"
                                    tooltip="İşaretle"
                                    tooltipOptions={{ position: 'top' }}
                                />
                            </div>
                        )}
                    />
                </DataTable>
            </Card>

            {/* Top Performer Highlight */}
            {topPerformer && (
                <Card title="🏆 En İyi Performans Gösteren İlan">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="text-xl font-bold text-blue-800 mb-2">{topPerformer.title}</h3>
                            <p className="text-gray-600 mb-4">📍 {topPerformer.location}</p>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <span className="text-sm text-gray-600">Fiyat:</span>
                                    <div className="text-lg font-semibold text-green-600">
                                        {formatPrice(topPerformer.price, topPerformer.type)}
                                    </div>
                                </div>
                                <div>
                                    <span className="text-sm text-gray-600">Kategori:</span>
                                    <div className="text-lg font-semibold">{topPerformer.category}</div>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-center">
                            <div>
                                <div className="text-2xl font-bold text-blue-600">{topPerformer.views}</div>
                                <div className="text-sm text-gray-600">Görüntüleme</div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-green-600">{topPerformer.clicks}</div>
                                <div className="text-sm text-gray-600">Tıklama</div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-orange-600">
                                    {getClickThroughRate(topPerformer.clicks, topPerformer.views).toFixed(1)}%
                                </div>
                                <div className="text-sm text-gray-600">CTR</div>
                            </div>
                        </div>
                    </div>
                </Card>
            )}
        </div>
    );
}
