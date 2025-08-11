"use client";

import "chart.js/auto";
import { Card } from "primereact/card";
import { Property } from "./types";
import { usePropertyAnalytics } from "./hooks/usePropertyAnalytics";
import {
    AnalyticsCharts,
    PropertiesTable
} from "./components";

interface PropertyAnalyticsPageProps {
    properties?: Property[];
}

export default function PropertyAnalyticsPage({
    properties: initialProperties = []
}: PropertyAnalyticsPageProps) {
    const {
        filterState,
        setGlobalFilter,
        setTypeFilter,
        setCategoryFilter,
        setSortBy,
        setTimeRange,
        sortOptions,
        timeRangeOptions,
        uniqueTypes,
        uniqueCategories,
        filteredProperties,
        topProperties,
        stats,
        typeDistributionChart,
        performanceChart
    } = usePropertyAnalytics(initialProperties);

    return (
        <div className="p-4 md:p-6 space-y-6">
            {/* Hero Section */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-100 rounded-xl p-8 border border-indigo-200">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full mb-6 shadow-lg">
                        <i className="pi pi-chart-line text-white text-3xl"></i>
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-3">İlan Analitikleri</h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Emlak ilanlarınızın performansını analiz edin, detaylı raporlar alın ve stratejik kararlar verin
                    </p>
                </div>
            </div>

            {/* Stats Cards with Icons */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-all duration-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-blue-600 mb-2">Toplam İlan</p>
                            <p className="text-3xl font-bold text-blue-800">{stats.totalProperties}</p>
                            <p className="text-xs text-blue-600">Aktif ilan sayısı</p>
                        </div>
                        <div className="w-14 h-14 bg-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
                            <i className="pi pi-home text-white text-xl"></i>
                        </div>
                    </div>
                </Card>

                <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-lg transition-all duration-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-green-600 mb-2">Toplam Görüntüleme</p>
                            <p className="text-3xl font-bold text-green-800">{stats.totalViews.toLocaleString()}</p>
                            <p className="text-xs text-green-600">İlan görüntüleme</p>
                        </div>
                        <div className="w-14 h-14 bg-green-500 rounded-2xl flex items-center justify-center shadow-lg">
                            <i className="pi pi-eye text-white text-xl"></i>
                        </div>
                    </div>
                </Card>

                <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 hover:shadow-lg transition-all duration-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-orange-600 mb-2">Toplam Tıklama</p>
                            <p className="text-3xl font-bold text-orange-800">{stats.totalClicks.toLocaleString()}</p>
                            <p className="text-xs text-orange-600">İlan tıklama</p>
                        </div>
                        <div className="w-14 h-14 bg-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                            <i className="pi pi-mouse text-white text-xl"></i>
                        </div>
                    </div>
                </Card>

                <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-lg transition-all duration-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-purple-600 mb-2">Ortalama Fiyat</p>
                            <p className="text-3xl font-bold text-purple-800">₺{Math.round(stats.avgPrice).toLocaleString()}</p>
                            <p className="text-xs text-purple-600">İlan fiyat ortalaması</p>
                        </div>
                        <div className="w-14 h-14 bg-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                            <i className="pi pi-wallet text-white text-xl"></i>
                        </div>
                    </div>
                </Card>

                <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200 hover:shadow-lg transition-all duration-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-red-600 mb-2">Tıklama Oranı</p>
                            <p className="text-3xl font-bold text-red-800">%{stats.clickRate.toFixed(1)}</p>
                            <p className="text-xs text-red-600">Görüntüleme/Tıklama</p>
                        </div>
                        <div className="w-14 h-14 bg-red-500 rounded-2xl flex items-center justify-center shadow-lg">
                            <i className="pi pi-percentage text-white text-xl"></i>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Charts */}
            <AnalyticsCharts
                typeDistributionChart={typeDistributionChart}
                performanceChart={performanceChart}
            />

            {/* Filters and Table */}
            <Card className="bg-white rounded-xl border-0 shadow-sm">
                <div className="flex flex-wrap gap-4 justify-between items-center pb-6 border-b border-gray-100">
                    <div className="flex gap-3 items-center">
                        <span className="p-input-icon-left">
                            <i className="pi pi-search" />
                            <input
                                type="text"
                                value={filterState.global}
                                onChange={(e) => setGlobalFilter(e.target.value)}
                                placeholder="İlan ara..."
                                className="w-80 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </span>
                        <select
                            value={filterState.type.length > 0 ? filterState.type[0] : ""}
                            onChange={(e) => setTypeFilter(e.target.value ? [e.target.value] : [])}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="">Tüm Türler</option>
                            {uniqueTypes.map((type) => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                        <select
                            value={filterState.category.length > 0 ? filterState.category[0] : ""}
                            onChange={(e) => setCategoryFilter(e.target.value ? [e.target.value] : [])}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="">Tüm Kategoriler</option>
                            {uniqueCategories.map((category) => (
                                <option key={category} value={category}>{category}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => {
                                // CSV Export Function
                                const headers = [
                                    "ID", "İlan Başlığı", "Tür", "Kategori", "Konum", "Fiyat",
                                    "Alan (m²)", "Görüntüleme", "Tıklama", "Tıklama Oranı", "Durum", "Oluşturulma Tarihi"
                                ];

                                const csvData = filteredProperties.map(property => {
                                    const clickRate = property.views > 0 ? (property.clicks / property.views) * 100 : 0;
                                    return [
                                        property.id,
                                        property.title,
                                        property.type,
                                        property.category,
                                        property.location,
                                        property.price,
                                        property.area,
                                        property.views,
                                        property.clicks,
                                        `${clickRate.toFixed(1)}%`,
                                        property.featured ? "Öne Çıkan" : "Normal",
                                        new Date(property.createdAt).toLocaleDateString('tr-TR')
                                    ];
                                });

                                const csvContent = [headers, ...csvData]
                                    .map(row => row.map(field => `"${field}"`).join(','))
                                    .join('\n');

                                const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                                const link = document.createElement('a');
                                const url = URL.createObjectURL(blob);
                                link.setAttribute('href', url);
                                link.setAttribute('download', `ilan_analitikleri_${new Date().toISOString().split('T')[0]}.csv`);
                                link.style.visibility = 'hidden';
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                            }}
                            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-2 transition-colors duration-200"
                        >
                            <i className="pi pi-download"></i>
                            CSV İndir
                        </button>
                        <select
                            value={filterState.sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            {sortOptions.map((option) => (
                                <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                        </select>
                        <select
                            value={filterState.timeRange}
                            onChange={(e) => setTimeRange(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            {timeRangeOptions.map((option) => (
                                <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Table Header */}
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">İlan Listesi</h2>
                    <p className="text-gray-600">Tüm ilanların detaylı analizi ve performans metrikleri</p>
                </div>

                <PropertiesTable
                    properties={filteredProperties}
                    globalFilter={filterState.global}
                />
            </Card>
        </div>
    );
}