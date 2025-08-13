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
import { ExportButton, ResponsiveHero } from "../../components/ui";
import { Checkbox } from "primereact/checkbox";

interface PropertyAnalyticsPageProps {
    properties?: Property[];
}

export default function PropertyAnalyticsPage({
    properties: initialProperties = []
}: PropertyAnalyticsPageProps) {
    const [properties, setProperties] = useState<Property[]>(initialProperties);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [showAddDialog, setShowAddDialog] = useState(false);
    const [editForm, setEditForm] = useState<Partial<Property>>({});
    const [addForm, setAddForm] = useState<Partial<Property>>({
        title: '',
        description: '',
        price: 0,
        type: '',
        category: '',
        location: '',
        city: '',
        district: '',
        address: '',
        area: 0,
        rooms: '',
        age: 0,
        floor: 0,
        heating: '',
        furnished: false,
        parking: false,
        elevator: false,
        featured: false
    });
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

    const handleSaveAdd = () => {
        if (!addForm.title || !addForm.price || !addForm.type || !addForm.category || !addForm.location) {
            toast.current?.show({
                severity: 'error',
                summary: 'Hata',
                detail: 'Lütfen tüm zorunlu alanları doldurun',
                life: 3000
            });
            return;
        }

        const newProperty: Property = {
            id: Math.max(...properties.map(p => p.id)) + 1,
            title: addForm.title!,
            price: addForm.price!,
            type: addForm.type!,
            category: addForm.category!,
            location: addForm.location!,
            area: addForm.area || 0,
            views: 0,
            clicks: 0,
            featured: addForm.featured || false,
            createdAt: new Date().toISOString()
        };

        setProperties(prev => [newProperty, ...prev]);
        setShowAddDialog(false);
        resetAddForm();

        toast.current?.show({
            severity: 'success',
            summary: 'Başarılı',
            detail: 'Yeni ilan başarıyla eklendi',
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

    const cityOptions = [
        { label: "Ankara", value: "Ankara" },
        { label: "İstanbul", value: "İstanbul" },
        { label: "İzmir", value: "İzmir" },
        { label: "Bursa", value: "Bursa" },
        { label: "Antalya", value: "Antalya" }
    ];

    const districtOptions = [
        { label: "Merkez", value: "Merkez" },
        { label: "Çankaya", value: "Çankaya" },
        { label: "Bahçelievler", value: "Bahçelievler" },
        { label: "Keçiören", value: "Keçiören" },
        { label: "Mamak", value: "Mamak" }
    ];

    const resetAddForm = () => {
        setAddForm({
            title: '',
            description: '',
            price: 0,
            type: '',
            category: '',
            location: '',
            city: '',
            district: '',
            address: '',
            area: 0,
            rooms: '',
            age: 0,
            floor: 0,
            heating: '',
            furnished: false,
            parking: false,
            elevator: false,
            featured: false
        });
    };

    return (
        <div className="p-4 md:p-6 space-y-6">
            <Toast ref={toast} />
            <ConfirmDialog />

            {/* Hero Section */}
            <ResponsiveHero
                title="İlan Analitikleri"
                subtitle="Emlak ilanlarınızın performansını analiz edin, detaylı raporlar alın ve stratejik kararlar verin"
                icon="pi-chart-line"
                iconBgColor="bg-gradient-to-br from-indigo-500 to-purple-600"
                gradient={{ from: 'indigo-50', to: 'purple-100' }}
                borderColor="border-indigo-200"
            />

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
                                style={{ paddingLeft: '2.5rem', paddingRight: '1.5rem' }}
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
                        <Button
                            label="Yeni İlan Ekle"
                            icon="pi pi-plus"
                            className="bg-green-600 hover:bg-green-700 border-green-600"
                            onClick={() => setShowAddDialog(true)}
                        />
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

            {/* Add Property Dialog */}
            <Dialog
                header="Yeni İlan Ekle"
                visible={showAddDialog}
                style={{ width: "800px" }}
                onHide={() => {
                    setShowAddDialog(false);
                    setAddForm({});
                }}
            >
                <div className="grid gap-4">
                    {/* Basic Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <span className="p-float-label">
                            <InputText
                                id="title"
                                value={addForm.title || ""}
                                onChange={(e) => setAddForm({ ...addForm, title: e.target.value })}
                                className="w-full"
                            />
                            <label htmlFor="title">İlan Başlığı *</label>
                        </span>

                        <span className="p-float-label">
                            <InputText
                                id="description"
                                value={addForm.description || ""}
                                onChange={(e) => setAddForm({ ...addForm, description: e.target.value })}
                                className="w-full"
                            />
                            <label htmlFor="description">Açıklama</label>
                        </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <span className="p-float-label">
                            <Dropdown
                                inputId="type"
                                value={addForm.type || ""}
                                onChange={(e) => setAddForm({ ...addForm, type: e.value })}
                                options={typeOptions}
                                className="w-full"
                                placeholder="İlan Türü Seçin"
                            />
                            <label htmlFor="type">İlan Türü *</label>
                        </span>

                        <span className="p-float-label">
                            <Dropdown
                                inputId="category"
                                value={addForm.category || ""}
                                onChange={(e) => setAddForm({ ...addForm, category: e.value })}
                                options={categoryOptions}
                                className="w-full"
                                placeholder="Kategori Seçin"
                            />
                            <label htmlFor="category">Kategori *</label>
                        </span>

                        <span className="p-float-label">
                            <InputText
                                id="rooms"
                                value={addForm.rooms || ""}
                                onChange={(e) => setAddForm({ ...addForm, rooms: e.target.value })}
                                className="w-full"
                            />
                            <label htmlFor="rooms">Oda Sayısı</label>
                        </span>
                    </div>

                    {/* Location Information */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <span className="p-float-label">
                            <Dropdown
                                inputId="city"
                                value={addForm.city || ""}
                                onChange={(e) => setAddForm({ ...addForm, city: e.value })}
                                options={cityOptions}
                                className="w-full"
                                placeholder="Şehir Seçin"
                            />
                            <label htmlFor="city">Şehir</label>
                        </span>

                        <span className="p-float-label">
                            <Dropdown
                                inputId="district"
                                value={addForm.district || ""}
                                onChange={(e) => setAddForm({ ...addForm, district: e.value })}
                                options={districtOptions}
                                className="w-full"
                                placeholder="İlçe Seçin"
                            />
                            <label htmlFor="district">İlçe</label>
                        </span>

                        <span className="p-float-label">
                            <InputText
                                id="location"
                                value={addForm.location || ""}
                                onChange={(e) => setAddForm({ ...addForm, location: e.target.value })}
                                className="w-full"
                            />
                            <label htmlFor="location">Konum *</label>
                        </span>
                    </div>

                    <span className="p-float-label">
                        <InputText
                            id="address"
                            value={addForm.address || ""}
                            onChange={(e) => setAddForm({ ...addForm, address: e.target.value })}
                            className="w-full"
                        />
                        <label htmlFor="address">Detaylı Adres</label>
                    </span>

                    {/* Property Details */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <span className="p-float-label">
                            <InputNumber
                                inputId="price"
                                value={addForm.price || 0}
                                onValueChange={(e) => setAddForm({ ...addForm, price: Number(e.value) || 0 })}
                                className="w-full"
                                suffix=" ₺"
                                min={0}
                                mode="decimal"
                            />
                            <label htmlFor="price">Fiyat *</label>
                        </span>

                        <span className="p-float-label">
                            <InputNumber
                                inputId="area"
                                value={addForm.area || 0}
                                onValueChange={(e) => setAddForm({ ...addForm, area: Number(e.value) || 0 })}
                                className="w-full"
                                suffix=" m²"
                                min={0}
                                mode="decimal"
                            />
                            <label htmlFor="area">Alan (m²)</label>
                        </span>

                        <span className="p-float-label">
                            <InputNumber
                                inputId="age"
                                value={addForm.age || 0}
                                onValueChange={(e) => setAddForm({ ...addForm, age: Number(e.value) || 0 })}
                                className="w-full"
                                suffix=" yıl"
                                min={0}
                                mode="decimal"
                            />
                            <label htmlFor="age">Bina Yaşı</label>
                        </span>

                        <span className="p-float-label">
                            <InputNumber
                                inputId="floor"
                                value={addForm.floor || 0}
                                onValueChange={(e) => setAddForm({ ...addForm, floor: Number(e.value) || 0 })}
                                className="w-full"
                                min={0}
                                mode="decimal"
                            />
                            <label htmlFor="floor">Kat</label>
                        </span>
                    </div>

                    {/* Features */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                            <h4 className="font-semibold text-gray-700">Özellikler</h4>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="flex items-center gap-2">
                                    <Checkbox
                                        inputId="featured"
                                        checked={addForm.featured || false}
                                        onChange={(e) => setAddForm({ ...addForm, featured: e.checked })}
                                    />
                                    <label htmlFor="featured" className="text-sm">Öne Çıkan</label>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Checkbox
                                        inputId="furnished"
                                        checked={addForm.furnished || false}
                                        onChange={(e) => setAddForm({ ...addForm, furnished: e.checked })}
                                    />
                                    <label htmlFor="furnished" className="text-sm">Eşyalı</label>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Checkbox
                                        inputId="parking"
                                        checked={addForm.parking || false}
                                        onChange={(e) => setAddForm({ ...addForm, parking: e.checked })}
                                    />
                                    <label htmlFor="parking" className="text-sm">Otopark</label>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Checkbox
                                        inputId="elevator"
                                        checked={addForm.elevator || false}
                                        onChange={(e) => setAddForm({ ...addForm, elevator: e.checked })}
                                    />
                                    <label htmlFor="elevator" className="text-sm">Asansör</label>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <h4 className="font-semibold text-gray-700">Isıtma</h4>
                            <Dropdown
                                value={addForm.heating || ""}
                                onChange={(e) => setAddForm({ ...addForm, heating: e.value })}
                                options={[
                                    { label: "Merkezi", value: "Merkezi" },
                                    { label: "Kombi", value: "Kombi" },
                                    { label: "Doğalgaz", value: "Doğalgaz" },
                                    { label: "Soba", value: "Soba" }
                                ]}
                                placeholder="Isıtma Türü Seçin"
                                className="w-full"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-2 mt-6">
                    <Button
                        label="Vazgeç"
                        outlined
                        onClick={() => {
                            setShowAddDialog(false);
                            setAddForm({
                                title: '',
                                description: '',
                                price: 0,
                                type: '',
                                category: '',
                                location: '',
                                city: '',
                                district: '',
                                address: '',
                                area: 0,
                                rooms: '',
                                age: 0,
                                floor: 0,
                                heating: '',
                                furnished: false,
                                parking: false,
                                elevator: false,
                                featured: false
                            });
                        }}
                    />
                    <Button
                        label="İlan Ekle"
                        icon="pi pi-plus"
                        onClick={handleSaveAdd}
                        severity="success"
                    />
                </div>
            </Dialog>

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