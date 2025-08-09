"use client";

import { Card } from "primereact/card";
import { Chart } from "primereact/chart";
import "chart.js/auto";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import { useMemo, useState } from "react";
import { Badge } from "primereact/badge";

import properties from "@/mocks/properties.json";

// Transform properties data for analytics
const mockProperties = properties.map(p => ({
    id: p.id,
    title: p.title,
    location: p.location,
    price: p.price,
    views: p.views,
    clicks: p.clicks,
    type: p.type,
    category: p.category,
    featured: p.featured,
    agentId: p.agentId,
    area: p.area,
    rooms: p.rooms,
    createdAt: p.createdAt
}));

type FilterType = "most-clicked" | "most-viewed" | "featured" | "all";
type CardVariation = "compact" | "detailed" | "showcase";

export default function AdminDashboard() {
    const [activeFilter, setActiveFilter] = useState<FilterType>("most-clicked");
    const [cardVariation, setCardVariation] = useState<CardVariation>("compact");

    const filteredProperties = useMemo(() => {
        let filtered = [...mockProperties];

        switch (activeFilter) {
            case "most-clicked":
                filtered = filtered.sort((a, b) => b.clicks - a.clicks).slice(0, 7);
                break;
            case "most-viewed":
                filtered = filtered.sort((a, b) => b.views - a.views).slice(0, 7);
                break;
            case "featured":
                filtered = filtered.filter(p => p.featured);
                break;
            case "all":
            default:
                break;
        }

        return filtered;
    }, [activeFilter]);

    // Charts data
    const propertyTypeChart = useMemo(() => {
        const types = mockProperties.reduce((acc, prop) => {
            acc[prop.category] = (acc[prop.category] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        return {
            data: {
                labels: Object.keys(types),
                datasets: [{
                    data: Object.values(types),
                    backgroundColor: [
                        "#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7", "#DDA0DD", "#98D8C8"
                    ]
                }]
            },
            options: {
                cutout: "60%",
                plugins: { legend: { position: "bottom" } },
                maintainAspectRatio: false
            }
        };
    }, []);

    const clicksChart = useMemo(() => {
        const topProperties = mockProperties
            .sort((a, b) => b.clicks - a.clicks)
            .slice(0, 5);

        return {
            data: {
                labels: topProperties.map(p => p.title.substring(0, 20) + "..."),
                datasets: [{
                    data: topProperties.map(p => p.clicks),
                    backgroundColor: ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7"]
                }]
            },
            options: {
                cutout: "50%",
                plugins: { legend: { position: "right" } },
                maintainAspectRatio: false
            }
        };
    }, []);

    const getFilterTitle = () => {
        switch (activeFilter) {
            case "most-clicked": return "Bu Haftanın En Çok Tıklanan İlanları";
            case "most-viewed": return "Bu Haftanın En Çok Görüntülenen İlanları";
            case "featured": return "Öne Çıkan İlanlar";
            default: return "Tüm İlanlar";
        }
    };

    const formatPrice = (price: number, type: string) => {
        if (type === "Kiralık") {
            return `${price.toLocaleString()} ₺/ay`;
        }
        return `${price.toLocaleString()} ₺`;
    };

    const renderPropertyCard = (property: any) => {
        switch (cardVariation) {
            case "detailed":
                return (
                    <Card key={property.id} className="mb-4 shadow-lg hover:shadow-xl transition-shadow">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-gray-200 h-48 rounded-lg flex items-center justify-center">
                                <i className="pi pi-image text-4xl text-gray-400"></i>
                            </div>
                            <div className="col-span-2">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-xl font-bold text-blue-800">{property.title}</h3>
                                    {property.featured && <Badge value="Öne Çıkan" severity="success" />}
                                </div>
                                <p className="text-gray-600 mb-2">📍 {property.location}</p>
                                <div className="flex gap-2 mb-3">
                                    <Tag value={property.type} severity={property.type === "Satılık" ? "info" : "warning"} />
                                    <Tag value={property.category} severity="secondary" />
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-2xl font-bold text-green-600">
                                        {formatPrice(property.price, property.type)}
                                    </span>
                                    <div className="flex gap-4 text-sm text-gray-500">
                                        <span>👁 {property.views}</span>
                                        <span>🖱 {property.clicks}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                );

            case "showcase":
                return (
                    <Card key={property.id} className="mb-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 shadow-lg">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="text-lg font-bold text-blue-800">{property.title}</h3>
                            <span className="text-xl font-bold text-green-600">
                                {formatPrice(property.price, property.type)}
                            </span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-600">📍 {property.location}</span>
                            <div className="flex gap-3">
                                <span className="bg-blue-100 px-2 py-1 rounded text-blue-700">👁 {property.views}</span>
                                <span className="bg-green-100 px-2 py-1 rounded text-green-700">🖱 {property.clicks}</span>
                            </div>
                        </div>
                    </Card>
                );

            default: // compact
                return (
                    <Card key={property.id} className="mb-3 hover:bg-gray-50 transition-colors">
                        <div className="flex justify-between items-center">
                            <div>
                                <h4 className="font-semibold text-blue-800">{property.title}</h4>
                                <p className="text-sm text-gray-600">{property.location}</p>
                            </div>
                            <div className="text-right">
                                <div className="font-bold text-green-600">{formatPrice(property.price, property.type)}</div>
                                <div className="text-xs text-gray-500">🖱 {property.clicks} tık</div>
                            </div>
                        </div>
                    </Card>
                );
        }
    };

    const totalProperties = mockProperties.length;
    const totalViews = mockProperties.reduce((sum, p) => sum + p.views, 0);
    const totalClicks = mockProperties.reduce((sum, p) => sum + p.clicks, 0);
    const avgPrice = Math.round(mockProperties.reduce((sum, p) => sum + p.price, 0) / totalProperties);

    return (
        <div className="p-4 md:p-6 space-y-6">
            {/* Header */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-blue-100">
                <h1 className="text-3xl font-bold text-blue-800 mb-2">Emlak Analitik Paneli</h1>
                <p className="text-blue-600">Sahibinden.com scraped ilanlar performans özeti</p>
                <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">
                    <i className="pi pi-clock"></i>
                    <span>Son güncelleme: {new Date().toLocaleString('tr-TR')}</span>
                    <i className="pi pi-database ml-4"></i>
                    <span>Aktif scraping: Sahibinden.com</span>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
                    <div className="text-4xl font-bold text-blue-600 mb-2">{totalProperties}</div>
                    <div className="text-lg font-semibold text-blue-800">Scraped İlanlar</div>
                    <div className="text-sm text-blue-600">Sahibinden.com'dan çekilen</div>
                </Card>
                <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
                    <div className="text-4xl font-bold text-green-600 mb-2">{totalViews.toLocaleString()}</div>
                    <div className="text-lg font-semibold text-blue-800">Toplam Görüntüleme</div>
                    <div className="text-sm text-blue-600">Sistemimiz üzerinden</div>
                </Card>
                <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
                    <div className="text-4xl font-bold text-orange-600 mb-2">{totalClicks}</div>
                    <div className="text-lg font-semibold text-blue-800">İlan Tıklamaları</div>
                    <div className="text-sm text-blue-600">Sahibinden'e yönlendirme</div>
                </Card>
                <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
                    <div className="text-4xl font-bold text-purple-600 mb-2">{avgPrice.toLocaleString()}₺</div>
                    <div className="text-lg font-semibold text-blue-800">Ortalama Fiyat</div>
                    <div className="text-sm text-blue-600">Scraped ilanlar</div>
                </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card title="Scraped İlan Türü Dağılımı" className="h-[440px]">
                    <div className="text-sm text-gray-600 mb-4">Sahibinden.com'dan çekilen ilanların kategori dağılımı</div>
                    <Chart type="doughnut" data={propertyTypeChart.data} options={propertyTypeChart.options} style={{ height: '300px' }} />
                </Card>
                <Card title="En Çok Tıklanan Scraped İlanlar" className="h-[440px]">
                    <div className="text-sm text-gray-600 mb-4">Sistemimiz üzerinden en çok tıklanan ilanlar</div>
                    <Chart type="doughnut" data={clicksChart.data} options={clicksChart.options} style={{ height: '300px' }} />
                </Card>
            </div>

            {/* Property Analytics */}

        </div>
    );
}