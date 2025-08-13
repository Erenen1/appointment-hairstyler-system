"use client";

import { Card } from "primereact/card";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import { Badge } from "primereact/badge";
import { Dropdown } from "primereact/dropdown";
import { MultiSelect } from "primereact/multiselect";
import { InputNumber } from "primereact/inputnumber";
import { Dialog } from "primereact/dialog";
import { Checkbox } from "primereact/checkbox";
import { InputTextarea } from "primereact/inputtextarea";
import { useMemo, useState } from "react";
import { useCrudOperations } from "../../hooks";
import { PropertyActionButtons, PropertyStatsCard } from "../../components/ui";
import { ExportButton } from "../../components/ui/ExportButton";
import { exportPropertiesToCsv } from "../../lib/exportUtils";
import { Toast } from "primereact/toast";
import { ConfirmDialog } from "primereact/confirmdialog";

interface Property {
    id: number;
    title: string;
    price: number;
    type: string;
    category: string;
    location: string;
    area: number;
    rooms: string;
    views: number;
    clicks: number;
    featured: boolean;
    status: string;
    agentId: number;
    createdAt: string;
}

interface Agent {
    id: number;
    fullName: string;
    phone: string;
    email: string;
}

interface PropertiesPageProps {
    properties?: Property[];
    agents?: Agent[];
}

export default function PropertiesPage({
    properties: initialProperties = [],
    agents: initialAgents = []
}: PropertiesPageProps) {
    const [properties, setProperties] = useState<Property[]>(initialProperties);
    const [selected, setSelected] = useState<Property | null>(null);
    const [globalFilter, setGlobalFilter] = useState<string>("");
    const [typeFilter, setTypeFilter] = useState<string[]>([]);
    const [categoryFilter, setCategoryFilter] = useState<string[]>([]);
    const [statusFilter, setStatusFilter] = useState<string[]>([]);

    const defaultForm: Partial<Property> = {
        id: 0,
        title: "",
        price: 0,
        type: "Satılık",
        category: "Daire",
        location: "",
        area: 0,
        rooms: "2+1",
        description: "",
        featured: false,
        status: "active",
        agentId: 1
    };

    const {
        showDialog,
        setShowDialog,
        form,
        setForm,
        dialogMode,
        toast,
        openAdd,
        openEdit,
        handleDelete,
        handleSave,
        resetForm
    } = useCrudOperations<Property>(properties, defaultForm, 'id', setProperties);

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

    const statusOptions = [
        { label: "Aktif", value: "active" },
        { label: "Pasif", value: "inactive" },
        { label: "Satıldı", value: "sold" },
        { label: "Kiralandı", value: "rented" }
    ];

    const roomOptions = [
        { label: "1+1", value: "1+1" },
        { label: "2+1", value: "2+1" },
        { label: "3+1", value: "3+1" },
        { label: "4+1", value: "4+1" },
        { label: "5+1", value: "5+1" },
        { label: "5+2", value: "5+2" }
    ];

    const filteredProperties = useMemo(() => {
        return properties.filter((p) => {
            const okType = typeFilter.length === 0 || typeFilter.includes(p.type);
            const okCategory = categoryFilter.length === 0 || categoryFilter.includes(p.category);
            const okStatus = statusFilter.length === 0 || statusFilter.includes(p.status);
            const text = (p.title + " " + p.location + " " + p.category).toLowerCase();
            const okSearch = !globalFilter || text.includes(globalFilter.toLowerCase());
            return okType && okCategory && okStatus && okSearch;
        });
    }, [properties, typeFilter, categoryFilter, statusFilter, globalFilter]);

    const handleOpenEdit = () => {
        if (!selected) return;
        openEdit(selected);
    };

    const handleOpenDelete = () => {
        if (!selected) return;
        handleDelete(selected, selected.title);
    };

    const getTypeTag = (type: string) => {
        return (
            <Tag
                value={type}
                severity={type === "Satılık" ? "info" : "warning"}
            />
        );
    };

    const getCategoryTag = (category: string) => {
        const severities: Record<string, any> = {
            "Daire": "secondary",
            "Müstakil": "success",
            "Villa": "danger",
            "Ofis": "info",
            "Dükkan": "warning",
            "Arsa": "contrast"
        };
        return (
            <Tag
                value={category}
                severity={severities[category] || "secondary"}
            />
        );
    };

    const getStatusBadge = (status: string) => {
        const configs: Record<string, any> = {
            "active": { label: "Aktif", severity: "success" },
            "inactive": { label: "Pasif", severity: "secondary" },
            "sold": { label: "Satıldı", severity: "danger" },
            "rented": { label: "Kiralandı", severity: "info" }
        };
        const config = configs[status] || { label: status, severity: "secondary" };
        return <Badge value={config.label} severity={config.severity} />;
    };

    const formatPrice = (price: number, type: string) => {
        if (type === "Kiralık") {
            return `${price.toLocaleString()} ₺/ay`;
        }
        return `${price.toLocaleString()} ₺`;
    };

    const getAgentName = (agentId: number) => {
        const agent = initialAgents.find(a => a.id === agentId);
        return agent ? agent.fullName : "Bilinmiyor";
    };

    // Stats
    const totalProperties = properties.length;
    const activeProperties = properties.filter(p => p.status === "active").length;
    const totalViews = properties.reduce((sum, p) => sum + (p.views || 0), 0);
    const featuredProperties = properties.filter(p => p.featured).length;

    const validateForm = () => {
        return !!(form.title && form.price > 0);
    };

    const createProperty = (formData: Partial<Property>): Property => {
        return {
            id: Math.max(0, ...properties.map(p => p.id)) + 1,
            title: formData.title || "",
            price: formData.price || 0,
            type: formData.type || "Satılık",
            category: formData.category || "Daire",
            location: formData.location || "",
            area: formData.area || 0,
            rooms: formData.rooms || "2+1",
            views: 0,
            clicks: 0,
            featured: formData.featured || false,
            status: formData.status || "active",
            agentId: formData.agentId || 1,
            createdAt: new Date().toISOString()
        };
    };

    const updateProperty = (id: number, formData: Partial<Property>): Property => {
        const existingProperty = properties.find(p => p.id === id);
        if (!existingProperty) throw new Error('Property not found');

        return {
            ...existingProperty,
            title: formData.title || existingProperty.title,
            price: formData.price || existingProperty.price,
            type: formData.type || existingProperty.type,
            category: formData.category || existingProperty.category,
            location: formData.location || existingProperty.location,
            area: formData.area || existingProperty.area,
            rooms: formData.rooms || existingProperty.rooms,
            featured: formData.featured ?? existingProperty.featured,
            status: formData.status || existingProperty.status,
            agentId: formData.agentId || existingProperty.agentId
        };
    };

    return (
        <div className="p-4 md:p-6 space-y-6">
            <Toast ref={toast} />
            <ConfirmDialog />

            {/* Header Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <PropertyStatsCard
                    title="Toplam İlan"
                    value={totalProperties}
                    subtitle="Toplam ilan sayısı"
                />
                <PropertyStatsCard
                    title="Aktif İlan"
                    value={activeProperties}
                    subtitle="Aktif ilan sayısı"
                />
                <PropertyStatsCard
                    title="Toplam Görüntüleme"
                    value={totalViews.toLocaleString()}
                    subtitle="Toplam görüntüleme sayısı"
                />
                <PropertyStatsCard
                    title="Öne Çıkan İlan"
                    value={featuredProperties}
                    subtitle="Öne çıkan ilan sayısı"
                />
            </div>

            {/* Properties Management */}
            <Card title="İlan Yönetimi">
                <div className="flex flex-wrap gap-2 justify-between items-center pb-3">
                    <div className="flex gap-2 items-center">
                        <span className="p-input-icon-left">
                            <i className="pi pi-search" />
                            <InputText
                                value={globalFilter}
                                onChange={(e) => setGlobalFilter(e.target.value)}
                                placeholder="İlan ara..."
                                style={{ paddingLeft: '2.5rem', paddingRight: '1.5rem' }}
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
                        <MultiSelect
                            display="chip"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.value)}
                            options={statusOptions}
                            placeholder="Durum"
                            className="min-w-[8rem]"
                        />
                    </div>
                    <div className="flex gap-2">
                        <ExportButton
                            onExport={() => {
                                exportPropertiesToCsv(filteredProperties);
                                toast.current?.show({
                                    severity: 'success',
                                    summary: 'Başarılı',
                                    detail: 'Emlak ilanları CSV formatında indirildi',
                                    life: 3000
                                });
                            }}
                            label="Excel İndir"
                        />
                        <Button icon="pi pi-plus" label="Yeni İlan" onClick={openAdd} />
                        <Button icon="pi pi-pencil" label="Düzenle" onClick={handleOpenEdit} disabled={!selected} />
                        <Button icon="pi pi-trash" label="Sil" severity="danger" onClick={handleOpenDelete} disabled={!selected} />
                    </div>
                </div>

                <DataTable
                    value={filteredProperties}
                    paginator
                    rows={10}
                    stripedRows
                    tableStyle={{ minWidth: "100%" }}
                    selectionMode="single"
                    selection={selected}
                    onSelectionChange={(e) => setSelected(e.value as Property)}
                    sortMode="multiple"
                    removableSort
                    globalFilter={globalFilter}
                    globalFilterFields={["title", "location", "category"]}
                    className="w-full"
                >
                    <Column field="title" header="Başlık" sortable style={{ minWidth: '200px' }} />
                    <Column field="type" header="Tür" sortable style={{ minWidth: '100px' }} body={(rowData) => getTypeTag(rowData.type)} />
                    <Column field="category" header="Kategori" sortable style={{ minWidth: '120px' }} body={(rowData) => getCategoryTag(rowData.category)} />
                    <Column field="location" header="Konum" sortable style={{ minWidth: '150px' }} />
                    <Column field="area" header="Alan (m²)" sortable style={{ minWidth: '100px' }} body={(rowData) => `${rowData.area} m²`} />
                    <Column field="rooms" header="Oda" sortable style={{ minWidth: '80px' }} />
                    <Column field="price" header="Fiyat" sortable style={{ minWidth: '120px' }} body={(rowData) => formatPrice(rowData.price, rowData.type)} />
                    <Column field="views" header="Görüntüleme" sortable style={{ minWidth: '100px' }} body={(rowData) => (rowData.views || 0).toLocaleString()} />
                    <Column field="clicks" header="Tıklama" sortable style={{ minWidth: '100px' }} body={(rowData) => (rowData.clicks || 0).toLocaleString()} />
                    <Column field="agentId" header="Emlakçı" sortable style={{ minWidth: '150px' }} body={(rowData) => getAgentName(rowData.agentId)} />
                    <Column field="status" header="Durum" style={{ minWidth: '100px' }} body={(rowData) => getStatusBadge(rowData.status)} />
                    <Column field="featured" header="Öne Çıkan" style={{ minWidth: '100px' }} body={(rowData) => rowData.featured ? <i className="pi pi-star text-yellow-500"></i> : ""} />
                </DataTable>
            </Card>

            {/* Property Form Dialog */}
            <Dialog
                header={dialogMode === "add" ? "Yeni İlan Ekle" : "İlan Düzenle"}
                visible={showDialog}
                style={{ width: "800px" }}
                onHide={() => {
                    setShowDialog(false);
                    resetForm(defaultForm);
                }}
            >
                <div className="grid gap-4">
                    <span className="p-float-label">
                        <InputText
                            id="title"
                            value={form.title}
                            onChange={(e) => setForm({ ...form, title: e.target.value })}
                            className="w-full"
                        />
                        <label htmlFor="title">İlan Başlığı</label>
                    </span>

                    <div className="grid grid-cols-2 gap-3">
                        <span className="p-float-label">
                            <Dropdown
                                inputId="type"
                                value={form.type}
                                onChange={(e) => setForm({ ...form, type: e.value })}
                                options={typeOptions}
                                className="w-full"
                            />
                            <label htmlFor="type">İlan Türü</label>
                        </span>
                        <span className="p-float-label">
                            <Dropdown
                                inputId="category"
                                value={form.category}
                                onChange={(e) => setForm({ ...form, category: e.value })}
                                options={categoryOptions}
                                className="w-full"
                            />
                            <label htmlFor="category">Kategori</label>
                        </span>
                    </div>

                    <span className="p-float-label">
                        <InputText
                            id="location"
                            value={form.location}
                            onChange={(e) => setForm({ ...form, location: e.target.value })}
                            className="w-full"
                        />
                        <label htmlFor="location">Konum</label>
                    </span>

                    <div className="grid grid-cols-3 gap-3">
                        <span className="p-float-label">
                            <InputNumber
                                inputId="area"
                                value={form.area}
                                onValueChange={(e) => setForm({ ...form, area: Number(e.value || 0) })}
                                className="w-full"
                                suffix=" m²"
                                min={0}
                            />
                            <label htmlFor="area">Alan</label>
                        </span>
                        <span className="p-float-label">
                            <Dropdown
                                inputId="rooms"
                                value={form.rooms}
                                onChange={(e) => setForm({ ...form, rooms: e.value })}
                                options={roomOptions}
                                className="w-full"
                            />
                            <label htmlFor="rooms">Oda Sayısı</label>
                        </span>
                        <span className="p-float-label">
                            <InputNumber
                                inputId="price"
                                value={form.price}
                                onValueChange={(e) => setForm({ ...form, price: Number(e.value || 0) })}
                                className="w-full"
                                suffix=" ₺"
                                min={0}
                                mode="decimal"
                            />
                            <label htmlFor="price">Fiyat</label>
                        </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <span className="p-float-label">
                            <Dropdown
                                inputId="agent"
                                value={form.agentId}
                                onChange={(e) => setForm({ ...form, agentId: e.value })}
                                options={initialAgents.map(a => ({ label: a.fullName, value: a.id }))}
                                className="w-full"
                            />
                            <label htmlFor="agent">Sorumlu Emlakçı</label>
                        </span>
                        <span className="p-float-label">
                            <Dropdown
                                inputId="status"
                                value={form.status}
                                onChange={(e) => setForm({ ...form, status: e.value })}
                                options={statusOptions}
                                className="w-full"
                            />
                            <label htmlFor="status">Durum</label>
                        </span>
                    </div>

                    <span className="p-float-label">
                        <InputTextarea
                            id="description"
                            value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                            className="w-full"
                            rows={3}
                        />
                        <label htmlFor="description">Açıklama</label>
                    </span>

                    <div className="flex items-center gap-2">
                        <Checkbox
                            inputId="featured"
                            checked={form.featured}
                            onChange={(e) => setForm({ ...form, featured: e.checked ?? false })}
                        />
                        <label htmlFor="featured">Öne Çıkan İlan</label>
                    </div>

                    <div className="flex justify-end gap-2">
                        <Button
                            label="Vazgeç"
                            outlined
                            onClick={() => {
                                setShowDialog(false);
                                resetForm(defaultForm);
                            }}
                        />
                        <Button
                            label="Kaydet"
                            icon="pi pi-check"
                            onClick={() => handleSave(validateForm, createProperty, updateProperty)}
                        />
                    </div>
                </div>
            </Dialog>
        </div>
    );
}
