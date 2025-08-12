"use client";

import "chart.js/auto";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Property } from "./types";
import { usePropertyAnalytics } from "./hooks/usePropertyAnalytics";
import {
    AnalyticsCharts,
    PropertiesTable
} from "./components";
import { useState } from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from "primereact/dropdown";
import { Toast } from "primereact/toast";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { useRef } from "react";
import { exportPropertyAnalyticsToCsv } from "../../lib/exportUtils";
import { ExportButton } from "../../components/ui/ExportButton";

interface PropertyAnalyticsPageProps {
    properties?: Property[];
}

export default function PropertyAnalyticsPage({
    properties: initialProperties = []
}: PropertyAnalyticsPageProps) {
    const [properties, setProperties] = useState<Property[]>(initialProperties);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [editForm, setEditForm] = useState<Partial<Property>>({});
    const toast = useRef<Toast>(null);

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
    } = usePropertyAnalytics(properties);

    const handleView = (property: Property) => {
        // You can implement a view dialog here if needed
        toast.current?.show({
            severity: 'info',
            summary: 'İlan Detayı',
            detail: `${property.title} ilanı görüntüleniyor`,
            life: 3000
        });
    };

    const handleEdit = (property: Property) => {
        setEditForm(property);
        setShowEditDialog(true);
    };

    const handleDelete = (property: Property) => {
        confirmDialog({
            message: `"${property.title}" ilanını silmek istediğinizden emin misiniz?`,
            header: 'İlan Silme Onayı',
            icon: 'pi pi-exclamation-triangle',
            acceptClassName: 'p-button-danger',
            acceptLabel: 'Evet',
            rejectLabel: 'Hayır',
            accept: () => {
                setProperties(prev => prev.filter(p => p.id !== property.id));
                toast.current?.show({
                    severity: 'success',
                    summary: 'Başarılı',
                    detail: 'İlan başarıyla silindi',
                    life: 3000
                });
            }
        });
    };

    const handleSaveEdit = () => {
        if (!editForm.title || !editForm.price) return;

        setProperties(prev => prev.map(p =>
            p.id === editForm.id ? { ...p, ...editForm } : p
        ));

        setShowEditDialog(false);
        setEditForm({});

        toast.current?.show({
            severity: 'success',
            summary: 'Başarılı',
            detail: 'İlan başarıyla güncellendi',
            life: 3000
        });
    };

    const categoryOptions = [
        { label: "Daire", value: "Daire" },
        { label: "Müstakil", value: "Müstakil" },
        { label: "Villa", value: "Villa" },
        { label: "Ofis", value: "Ofis" },
        { label: "Dükkan", value: "Dükkan" },
        { label: "Arsa", value: "Arsa" }
    ];

    const typeOptions = [
        { label: "Satılık", value: "Satılık" },
        { label: "Kiralık", value: "Kiralık" }
    ];

    return (
        <div className="p-4 md:p-6 space-y-6">
            <Toast ref={toast} />
            <ConfirmDialog />

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

            {/* Featured Properties Section */}
            {topProperties.length > 0 && (
                <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
                    <div className="text-center mb-6">
                        <h2 className="text-2xl font-bold text-amber-800 mb-2">⭐ Öne Çıkan İlanlar</h2>
                        <p className="text-amber-600">En yüksek performans gösteren ilanlarınız</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {topProperties.slice(0, 3).map((property) => (
                            <div key={property.id} className="bg-white rounded-lg p-4 border border-amber-200 hover:shadow-md transition-shadow">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="font-semibold text-gray-800 truncate">{property.title}</h3>
                                    <span className="px-2 py-1 bg-amber-100 text-amber-800 text-xs font-medium rounded-full">
                                        ⭐ Öne Çıkan
                                    </span>
                                </div>
                                <p className="text-sm text-gray-600 mb-2">{property.location}</p>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="font-semibold text-green-600">₺{property.price.toLocaleString()}</span>
                                    <span className="text-gray-500">{property.views} görüntüleme</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            )}

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
                        <ExportButton
                            onExport={() => {
                                exportPropertyAnalyticsToCsv(filteredProperties);
                                toast.current?.show({
                                    severity: 'success',
                                    summary: 'Başarılı',
                                    detail: 'İlan analitikleri CSV formatında indirildi',
                                    life: 3000
                                });
                            }}
                            label="Excel İndir"
                        />
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
                    onView={handleView}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            </Card>

            {/* Edit Property Dialog */}
            <Dialog
                header="İlan Düzenle"
                visible={showEditDialog}
                style={{ width: "600px" }}
                onHide={() => {
                    setShowEditDialog(false);
                    setEditForm({});
                }}
            >
                <div className="grid gap-4">
                    <span className="p-float-label">
                        <InputText
                            id="title"
                            value={editForm.title || ""}
                            onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                            className="w-full"
                        />
                        <label htmlFor="title">İlan Başlığı</label>
                    </span>

                    <div className="grid grid-cols-2 gap-3">
                        <span className="p-float-label">
                            <Dropdown
                                inputId="type"
                                value={editForm.type || ""}
                                onChange={(e) => setEditForm({ ...editForm, type: e.value })}
                                options={typeOptions}
                                className="w-full"
                            />
                            <label htmlFor="type">İlan Türü</label>
                        </span>
                        <span className="p-float-label">
                            <Dropdown
                                inputId="category"
                                value={editForm.category || ""}
                                onChange={(e) => setEditForm({ ...editForm, category: e.value })}
                                options={categoryOptions}
                                className="w-full"
                            />
                            <label htmlFor="category">Kategori</label>
                        </span>
                    </div>

                    <span className="p-float-label">
                        <InputText
                            id="location"
                            value={editForm.location || ""}
                            onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                            className="w-full"
                        />
                        <label htmlFor="location">Konum</label>
                    </span>

                    <div className="grid grid-cols-2 gap-3">
                        <span className="p-float-label">
                            <InputNumber
                                inputId="price"
                                value={editForm.price || 0}
                                onValueChange={(e) => setEditForm({ ...editForm, price: Number(e.value) || 0 })}
                                className="w-full"
                                suffix=" ₺"
                                min={0}
                                mode="decimal"
                            />
                            <label htmlFor="price">Fiyat</label>
                        </span>
                        <span className="p-float-label">
                            <InputNumber
                                inputId="area"
                                value={editForm.area || 0}
                                onValueChange={(e) => setEditForm({ ...editForm, area: Number(e.value) || 0 })}
                                className="w-full"
                                suffix=" m²"
                                min={0}
                                mode="decimal"
                            />
                            <label htmlFor="area">Alan</label>
                        </span>
                    </div>
                </div>

                <div className="flex justify-end gap-2 mt-6">
                    <Button
                        label="Vazgeç"
                        outlined
                        onClick={() => {
                            setShowEditDialog(false);
                            setEditForm({});
                        }}
                    />
                    <Button
                        label="Kaydet"
                        icon="pi pi-check"
                        onClick={handleSaveEdit}
                        severity="success"
                    />
                </div>
            </Dialog>
        </div>
    );
}