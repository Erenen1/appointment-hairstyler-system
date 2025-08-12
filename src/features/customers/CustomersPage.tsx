"use client";

import { useState, useMemo } from "react";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import { Badge } from "primereact/badge";
import { Dropdown } from "primereact/dropdown";
import { MultiSelect } from "primereact/multiselect";
import { InputNumber } from "primereact/inputnumber";
import { InputTextarea } from "primereact/inputtextarea";
import { Toast } from "primereact/toast";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { useRef } from "react";
import { Customer, CustomerForm } from "./types";
import {
    ResponsiveHero,
    ResponsiveStatsCard,
    ResponsiveGrid,
    ResponsiveDialog,
    VirtualDataTable
} from "../../components/ui";
import { exportCustomersToCsv } from "../../lib/exportUtils";

interface CustomersPageProps {
    customers?: Customer[];
}

export default function CustomersPage({ customers: initialCustomers = [] }: CustomersPageProps) {
    const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
    const [selected, setSelected] = useState<Customer | null>(null);
    const [globalFilter, setGlobalFilter] = useState<string>("");
    const [priorityFilter, setPriorityFilter] = useState<string[]>([]);
    const [typeFilter, setTypeFilter] = useState<string[]>([]);
    const [showDetailDialog, setShowDetailDialog] = useState(false);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
    const [editingForm, setEditingForm] = useState<CustomerForm | null>(null);
    const [showNewCustomerDialog, setShowNewCustomerDialog] = useState(false);
    const [newCustomerForm, setNewCustomerForm] = useState<CustomerForm>({
        fullName: "",
        email: "",
        phone: "",
        address: "",
        profession: "",
        budget: 0,
        preferredType: "Satılık",
        preferredCategory: "Daire",
        preferredDistricts: [],
        minArea: 0,
        maxArea: 0,
        minRooms: "",
        requirements: [],
        priority: "medium",
        notes: "",
        assignedAgent: 1
    });
    const toast = useRef<Toast>(null);

    const priorityOptions = [
        { label: "Yüksek", value: "high" },
        { label: "Orta", value: "medium" },
        { label: "Düşük", value: "low" }
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

    const districtOptions = [
        "Kadıköy", "Beşiktaş", "Şişli", "Beyoğlu", "Fatih", "Üsküdar", "Maltepe", "Ataşehir"
    ];

    const filteredCustomers = useMemo(() => {
        return customers.filter((c) => {
            const okPriority = priorityFilter.length === 0 || priorityFilter.includes(c.priority);
            const okType = typeFilter.length === 0 || typeFilter.includes(c.preferredType);
            const text = (c.fullName + " " + c.phone + " " + c.email + " " + c.profession).toLowerCase();
            const okSearch = !globalFilter || text.includes(globalFilter.toLowerCase());
            return okPriority && okType && okSearch;
        });
    }, [customers, priorityFilter, typeFilter, globalFilter]);

    const getPriorityBadge = (priority: string) => {
        const configs: Record<string, { label: string; severity: "danger" | "warning" | "success" | "secondary" }> = {
            "high": { label: "Yüksek", severity: "danger" },
            "medium": { label: "Orta", severity: "warning" },
            "low": { label: "Düşük", severity: "success" }
        };
        const config = configs[priority] || { label: priority, severity: "secondary" };
        return <Badge value={config.label} severity={config.severity} />;
    };

    const getTypeTag = (type: string) => {
        return (
            <Tag
                value={type}
                severity={type === "Satılık" ? "info" : "warning"}
            />
        );
    };

    const formatBudget = (budget: number, type: string) => {
        if (type === "Kiralık") {
            return `${budget.toLocaleString()} ₺/ay`;
        }
        return `${budget.toLocaleString()} ₺`;
    };

    const getStatusSeverity = (isActive: boolean) => {
        return isActive ? "success" : "secondary";
    };

    // Customer Operations
    const handleViewDetails = (customer: Customer) => {
        setSelected(customer);
        setShowDetailDialog(true);
    };

    const handleEditCustomer = (customer: Customer) => {
        setEditingCustomer(customer);
        setEditingForm({
            fullName: customer.fullName,
            email: customer.email,
            phone: customer.phone,
            address: customer.address,
            profession: customer.profession,
            budget: customer.budget,
            preferredType: customer.preferredType,
            preferredCategory: customer.preferredCategory,
            preferredDistricts: customer.preferredDistricts,
            minArea: customer.minArea,
            maxArea: customer.maxArea,
            minRooms: customer.minRooms,
            requirements: customer.requirements,
            priority: customer.priority,
            notes: customer.notes,
            assignedAgent: customer.assignedAgent
        });
        setShowEditDialog(true);
    };

    const handleUpdateCustomer = () => {
        if (editingCustomer && editingForm) {
            const updatedCustomer = {
                ...editingCustomer,
                ...editingForm,
                lastContact: new Date().toISOString()
            };

            setCustomers(prev => prev.map(c =>
                c.id === editingCustomer.id ? updatedCustomer : c
            ));

            setShowEditDialog(false);
            setEditingCustomer(null);
            setEditingForm(null);

            toast.current?.show({
                severity: 'success',
                summary: 'Başarılı',
                detail: 'Müşteri bilgileri güncellendi',
                life: 3000
            });
        }
    };

    const handleDeleteCustomer = (customerId: number) => {
        confirmDialog({
            message: `"${customers.find(c => c.id === customerId)?.fullName}" müşterisini silmek istediğinizden emin misiniz?`,
            header: 'Müşteri Silme Onayı',
            icon: 'pi pi-exclamation-triangle',
            acceptClassName: 'p-button-danger',
            acceptLabel: 'Evet',
            rejectLabel: 'Hayır',
            accept: () => {
                setCustomers(prev => prev.filter(c => c.id !== customerId));
                toast.current?.show({
                    severity: 'success',
                    summary: 'Başarılı',
                    detail: 'Müşteri silindi',
                    life: 3000
                });
            }
        });
    };

    // Stats
    const totalCustomers = customers.length;
    const activeCustomers = customers.filter(c => c.isActive).length;
    const highPriorityCustomers = customers.filter(c => c.priority === "high").length;
    const totalBudget = customers.reduce((sum, c) => sum + c.budget, 0);

    // Table Columns
    const columns = [
        { field: 'id', header: 'ID', sortable: true, style: { minWidth: '60px' }, mobileHidden: true },
        { field: 'fullName', header: 'Ad Soyad', sortable: true, style: { minWidth: '150px' } },
        { field: 'phone', header: 'Telefon', sortable: true, style: { minWidth: '120px' } },
        { field: 'email', header: 'E-posta', sortable: true, style: { minWidth: '180px' }, mobileHidden: true },
        { field: 'profession', header: 'Meslek', sortable: true, style: { minWidth: '120px' }, mobileHidden: true },
        {
            field: 'preferredType',
            header: 'İlgi Alanı',
            sortable: true,
            style: { minWidth: '100px' },
            body: (rowData: Customer) => getTypeTag(rowData.preferredType)
        },
        {
            field: 'budget',
            header: 'Bütçe',
            sortable: true,
            style: { minWidth: '120px' },
            body: (rowData: Customer) => formatBudget(rowData.budget, rowData.preferredType)
        },
        {
            field: 'preferredCategory',
            header: 'Kategori',
            sortable: true,
            style: { minWidth: '100px' },
            mobileHidden: true
        },
        {
            field: 'priority',
            header: 'Öncelik',
            sortable: true,
            style: { minWidth: '100px' },
            body: (rowData: Customer) => getPriorityBadge(rowData.priority)
        },
        {
            field: 'isActive',
            header: 'Durum',
            style: { minWidth: '80px' },
            body: (rowData: Customer) => (
                <Tag
                    value={rowData.isActive ? "Aktif" : "Pasif"}
                    severity={getStatusSeverity(rowData.isActive)}
                />
            )
        },
        {
            field: 'lastContact',
            header: 'Son İletişim',
            sortable: true,
            style: { minWidth: '120px' },
            mobileHidden: true,
            body: (rowData: Customer) => new Date(rowData.lastContact).toLocaleDateString('tr-TR')
        },
        {
            field: 'favoriteProperties',
            header: 'Favori',
            style: { minWidth: '80px' },
            mobileHidden: true,
            body: (rowData: Customer) => `${rowData.favoriteProperties.length} İlan`
        },
        {
            header: 'İşlemler',
            style: { minWidth: '150px' },
            body: (rowData: Customer) => (
                <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
            <Button
                icon="pi pi-eye"
                size="small"
                severity="info"
                text
                tooltip="Detayları Görüntüle"
                onClick={() => handleViewDetails(rowData)}
                        className="w-full sm:w-auto"
            />
            <Button
                icon="pi pi-pencil"
                size="small"
                severity="warning"
                text
                tooltip="Düzenle"
                onClick={() => handleEditCustomer(rowData)}
                        className="w-full sm:w-auto"
            />
            <Button
                icon="pi pi-trash"
                size="small"
                severity="danger"
                text
                tooltip="Sil"
                onClick={() => handleDeleteCustomer(rowData.id)}
                        className="w-full sm:w-auto"
            />
        </div>
            ),
            frozen: true
        }
    ];

    // Filters
    const filters = [
        {
            key: 'priority',
            label: 'Öncelik Filtresi',
            options: priorityOptions,
            value: priorityFilter,
            onChange: setPriorityFilter,
            type: 'multiselect' as const
        },
        {
            key: 'type',
            label: 'Tür Filtresi',
            options: typeOptions,
            value: typeFilter,
            onChange: setTypeFilter,
            type: 'multiselect' as const
        }
    ];

    // Actions
    const actions = [
        {
            label: 'Yeni Müşteri',
            icon: 'pi pi-plus',
            onClick: () => setShowNewCustomerDialog(true),
            className: 'bg-blue-600 hover:bg-blue-700 border-blue-600'
        }
    ];

    return (
        <div className="p-2 sm:p-4 md:p-6 space-y-4 sm:space-y-6">
            <Toast ref={toast} />
            <ConfirmDialog />

            {/* Hero Section */}
            <ResponsiveHero
                title="Müşteri Yönetimi"
                subtitle="Müşteri portföyünüzü profesyonel şekilde yönetin, analiz edin ve geliştirin"
                icon="pi-users"
                iconBgColor="bg-gradient-to-br from-blue-500 to-indigo-600"
            />

            {/* Stats Cards */}
            <ResponsiveGrid cols={{ mobile: 1, tablet: 2, desktop: 4 }} gap="gap-4 sm:gap-6">
                <ResponsiveStatsCard
                    title="Toplam Müşteri"
                    value={totalCustomers}
                    subtitle="Kayıtlı müşteri sayısı"
                    icon="pi-users"
                    iconBgColor="bg-blue-500"
                    gradient={{ from: 'blue-50', to: 'blue-100' }}
                    borderColor="border-blue-200"
                />
                <ResponsiveStatsCard
                    title="Aktif Müşteri"
                    value={activeCustomers}
                    subtitle="Aktif müşteri sayısı"
                    icon="pi-check-circle"
                    iconBgColor="bg-green-500"
                    gradient={{ from: 'green-50', to: 'green-100' }}
                    borderColor="border-green-200"
                />
                <ResponsiveStatsCard
                    title="Öncelikli"
                    value={highPriorityCustomers}
                    subtitle="Yüksek öncelikli"
                    icon="pi-exclamation-triangle"
                    iconBgColor="bg-red-500"
                    gradient={{ from: 'red-50', to: 'red-100' }}
                    borderColor="border-red-200"
                />
                <ResponsiveStatsCard
                    title="Toplam Bütçe"
                    value={`${(totalBudget / 1000000).toFixed(1)}M ₺`}
                    subtitle="Müşteri bütçeleri"
                    icon="pi-wallet"
                    iconBgColor="bg-purple-500"
                    gradient={{ from: 'purple-50', to: 'purple-100' }}
                    borderColor="border-purple-200"
                />
            </ResponsiveGrid>

            {/* Customer Management */}
            <Card className="bg-white rounded-xl border-0 shadow-sm">
                <VirtualDataTable
                    data={filteredCustomers}
                    columns={columns}
                    globalFilterFields={["fullName", "phone", "email", "profession"]}
                    globalFilter={globalFilter}
                    onGlobalFilterChange={setGlobalFilter}
                    filters={filters}
                    actions={actions}
                    exportButton={{
                        label: "Excel İndir",
                        onClick: () => {
                                exportCustomersToCsv(filteredCustomers);
                                toast.current?.show({
                                    severity: 'success',
                                    summary: 'Başarılı',
                                    detail: 'Müşteri listesi CSV formatında indirildi',
                                    life: 3000
                                });
                        }
                    }}
                    selectionMode="single"
                    selection={selected}
                    onSelectionChange={(e) => setSelected(e as Customer)}
                    virtualScrollerOptions={{ itemSize: 46 }}
                />
            </Card>

            {/* Customer Detail Dialog */}
            <ResponsiveDialog
                visible={showDetailDialog}
                onHide={() => setShowDetailDialog(false)}
                header={
                    <div className="flex items-center gap-3">
                        <i className="pi pi-user text-blue-600 text-xl"></i>
                        <span>Müşteri Detayları</span>
                    </div>
                }
            >
                {selected && (
                    <div className="space-y-4 sm:space-y-6">
                        {/* Basic Info */}
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 sm:p-6 border border-blue-200">
                            <h3 className="text-lg sm:text-xl font-bold text-blue-800 mb-4 flex items-center gap-2">
                                <i className="pi pi-info-circle"></i>
                                Temel Bilgiler
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                <div className="flex items-center gap-2">
                                    <i className="pi pi-user text-blue-600"></i>
                                    <span><strong>Ad Soyad:</strong> {selected.fullName}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <i className="pi pi-phone text-blue-600"></i>
                                    <span><strong>Telefon:</strong> {selected.phone}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <i className="pi pi-envelope text-blue-600"></i>
                                    <span><strong>E-posta:</strong> {selected.email}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <i className="pi pi-briefcase text-blue-600"></i>
                                    <span><strong>Meslek:</strong> {selected.profession}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <i className="pi pi-wallet text-blue-600"></i>
                                    <span><strong>Bütçe:</strong> {formatBudget(selected.budget, selected.preferredType)}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <i className="pi pi-home text-blue-600"></i>
                                    <span><strong>İlgi Alanı:</strong> {selected.preferredType}</span>
                                </div>
                            </div>
                        </div>

                        {/* Property Preferences */}
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 sm:p-6 border border-green-200">
                            <h3 className="text-lg sm:text-xl font-bold text-green-800 mb-4 flex items-center gap-2">
                                <i className="pi pi-home"></i>
                                Gayrimenkul Tercihleri
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                <div>
                                    <strong>Kategori:</strong> {selected.preferredCategory}
                                </div>
                                <div>
                                    <strong>Alan:</strong> {selected.minArea} - {selected.maxArea} m²
                                </div>
                                <div>
                                    <strong>Oda Sayısı:</strong> {selected.minRooms}
                                </div>
                            </div>

                            <div className="mt-4">
                                <strong>Tercih Edilen Bölgeler:</strong>
                                <div className="flex gap-2 mt-2 flex-wrap">
                                    {selected.preferredDistricts.map((district, index) => (
                                        <Tag key={index} value={district} severity="info" />
                                    ))}
                                </div>
                            </div>

                            <div className="mt-4">
                                <strong>Gereksinimler:</strong>
                                <div className="flex gap-2 mt-2 flex-wrap">
                                    {selected.requirements.map((req, index) => (
                                        <Tag key={index} value={req} severity="secondary" />
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Activity Info */}
                        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 sm:p-6 border border-purple-200">
                            <h3 className="text-lg sm:text-xl font-bold text-purple-800 mb-4 flex items-center gap-2">
                                <i className="pi pi-chart-line"></i>
                                Aktivite Bilgileri
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                <div>
                                    <strong>Kayıt Tarihi:</strong> {new Date(selected.registrationDate).toLocaleDateString('tr-TR')}
                                </div>
                                <div>
                                    <strong>Son İletişim:</strong> {new Date(selected.lastContact).toLocaleDateString('tr-TR')}
                                </div>
                                <div>
                                    <strong>Favori İlanlar:</strong> {selected.favoriteProperties.length} adet
                                </div>
                                <div>
                                    <strong>Görüntülenen İlanlar:</strong> {selected.viewedProperties.length} adet
                                </div>
                            </div>
                        </div>

                        {selected.notes && (
                            <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl p-4 sm:p-6 border border-orange-200">
                                <h3 className="text-lg sm:text-xl font-bold text-orange-800 mb-4 flex items-center gap-2">
                                    <i className="pi pi-sticky-note"></i>
                                    Notlar
                                </h3>
                                <p className="text-gray-700 leading-relaxed">{selected.notes}</p>
                            </div>
                        )}

                        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-gray-200">
                            <Button
                                label="Düzenle"
                                icon="pi pi-pencil"
                                onClick={() => {
                                    setShowDetailDialog(false);
                                    handleEditCustomer(selected);
                                }}
                                className="bg-blue-600 hover:bg-blue-700 border-blue-600 w-full sm:w-auto"
                            />
                            <Button
                                label="Kapat"
                                icon="pi pi-times"
                                outlined
                                onClick={() => setShowDetailDialog(false)}
                                className="w-full sm:w-auto"
                            />
                        </div>
                    </div>
                )}
            </ResponsiveDialog>

            {/* Customer Edit Dialog */}
            <ResponsiveDialog
                visible={showEditDialog}
                onHide={() => setShowEditDialog(false)}
                header={
                    <div className="flex items-center gap-3">
                        <i className="pi pi-pencil text-orange-600 text-xl"></i>
                        <span>Müşteri Düzenle</span>
                    </div>
                }
            >
                {editingForm && (
                    <div className="space-y-4 sm:space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Ad Soyad</label>
                                <InputText
                                    value={editingForm.fullName}
                                    onChange={(e) => setEditingForm({ ...editingForm, fullName: e.target.value })}
                                    className="w-full"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">E-posta</label>
                                <InputText
                                    value={editingForm.email}
                                    onChange={(e) => setEditingForm({ ...editingForm, email: e.target.value })}
                                    className="w-full"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Telefon</label>
                                <InputText
                                    value={editingForm.phone}
                                    onChange={(e) => setEditingForm({ ...editingForm, phone: e.target.value })}
                                    className="w-full"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Meslek</label>
                                <InputText
                                    value={editingForm.profession}
                                    onChange={(e) => setEditingForm({ ...editingForm, profession: e.target.value })}
                                    className="w-full"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Bütçe</label>
                                <InputNumber
                                    value={editingForm.budget}
                                    onValueChange={(e) => setEditingForm({ ...editingForm, budget: e.value || 0 })}
                                    className="w-full"
                                    mode="currency"
                                    currency="TRY"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">İlgi Alanı</label>
                                <Dropdown
                                    value={editingForm.preferredType}
                                    onChange={(e) => setEditingForm({ ...editingForm, preferredType: e.value })}
                                    options={typeOptions}
                                    className="w-full"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Kategori</label>
                                <Dropdown
                                    value={editingForm.preferredCategory}
                                    onChange={(e) => setEditingForm({ ...editingForm, preferredCategory: e.value })}
                                    options={categoryOptions}
                                    className="w-full"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Öncelik</label>
                                <Dropdown
                                    value={editingForm.priority}
                                    onChange={(e) => setEditingForm({ ...editingForm, priority: e.value })}
                                    options={priorityOptions}
                                    className="w-full"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Tercih Edilen Bölgeler</label>
                            <MultiSelect
                                value={editingForm.preferredDistricts}
                                onChange={(e) => setEditingForm({ ...editingForm, preferredDistricts: e.value })}
                                options={districtOptions}
                                className="w-full"
                                display="chip"
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Alan (m²)</label>
                                <InputNumber
                                    value={editingForm.minArea}
                                    onValueChange={(e) => setEditingForm({ ...editingForm, minArea: e.value || 0 })}
                                    className="w-full"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Maksimum Alan (m²)</label>
                                <InputNumber
                                    value={editingForm.maxArea}
                                    onValueChange={(e) => setEditingForm({ ...editingForm, maxArea: e.value || 0 })}
                                    className="w-full"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Notlar</label>
                            <InputTextarea
                                value={editingForm.notes}
                                onChange={(e) => setEditingForm({ ...editingForm, notes: e.target.value })}
                                className="w-full"
                                rows={4}
                            />
                        </div>

                        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-gray-200">
                            <Button
                                label="İptal"
                                icon="pi pi-times"
                                outlined
                                onClick={() => setShowEditDialog(false)}
                                className="w-full sm:w-auto"
                            />
                            <Button
                                label="Güncelle"
                                icon="pi pi-check"
                                onClick={handleUpdateCustomer}
                                className="bg-green-600 hover:bg-green-700 border-green-600 w-full sm:w-auto"
                            />
                        </div>
                    </div>
                )}
            </ResponsiveDialog>

            {/* New Customer Dialog */}
            <ResponsiveDialog
                visible={showNewCustomerDialog}
                onHide={() => setShowNewCustomerDialog(false)}
                header={
                    <div className="flex items-center gap-3">
                        <i className="pi pi-plus text-green-600 text-xl"></i>
                        <span>Yeni Müşteri Ekle</span>
                    </div>
                }
            >
                <div className="space-y-4 sm:space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Ad Soyad</label>
                            <InputText
                                value={newCustomerForm.fullName}
                                onChange={(e) => setNewCustomerForm({ ...newCustomerForm, fullName: e.target.value })}
                                className="w-full"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">E-posta</label>
                            <InputText
                                value={newCustomerForm.email}
                                onChange={(e) => setNewCustomerForm({ ...newCustomerForm, email: e.target.value })}
                                className="w-full"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Telefon</label>
                            <InputText
                                value={newCustomerForm.phone}
                                onChange={(e) => setNewCustomerForm({ ...newCustomerForm, phone: e.target.value })}
                                className="w-full"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Meslek</label>
                            <InputText
                                value={newCustomerForm.profession}
                                onChange={(e) => setNewCustomerForm({ ...newCustomerForm, profession: e.target.value })}
                                className="w-full"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Bütçe</label>
                            <InputNumber
                                value={newCustomerForm.budget}
                                onValueChange={(e) => setNewCustomerForm({ ...newCustomerForm, budget: e.value || 0 })}
                                className="w-full"
                                mode="currency"
                                currency="TRY"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">İlgi Alanı</label>
                            <Dropdown
                                value={newCustomerForm.preferredType}
                                onChange={(e) => setNewCustomerForm({ ...newCustomerForm, preferredType: e.value })}
                                options={typeOptions}
                                className="w-full"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Kategori</label>
                            <Dropdown
                                value={newCustomerForm.preferredCategory}
                                onChange={(e) => setNewCustomerForm({ ...newCustomerForm, preferredCategory: e.value })}
                                options={categoryOptions}
                                className="w-full"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Öncelik</label>
                            <Dropdown
                                value={newCustomerForm.priority}
                                onChange={(e) => setNewCustomerForm({ ...newCustomerForm, priority: e.value })}
                                options={priorityOptions}
                                className="w-full"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Tercih Edilen Bölgeler</label>
                        <MultiSelect
                            value={newCustomerForm.preferredDistricts}
                            onChange={(e) => setNewCustomerForm({ ...newCustomerForm, preferredDistricts: e.value })}
                            options={districtOptions}
                            className="w-full"
                            display="chip"
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Alan (m²)</label>
                            <InputNumber
                                value={newCustomerForm.minArea}
                                onValueChange={(e) => setNewCustomerForm({ ...newCustomerForm, minArea: e.value || 0 })}
                                className="w-full"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Maksimum Alan (m²)</label>
                            <InputNumber
                                value={newCustomerForm.maxArea}
                                onValueChange={(e) => setNewCustomerForm({ ...newCustomerForm, maxArea: e.value || 0 })}
                                className="w-full"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Notlar</label>
                        <InputTextarea
                            value={newCustomerForm.notes}
                            onChange={(e) => setNewCustomerForm({ ...newCustomerForm, notes: e.target.value })}
                            className="w-full"
                            rows={4}
                        />
                    </div>

                    <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-gray-200">
                        <Button
                            label="İptal"
                            icon="pi pi-times"
                            outlined
                            onClick={() => setShowNewCustomerDialog(false)}
                            className="w-full sm:w-auto"
                        />
                        <Button
                            label="Müşteri Ekle"
                            icon="pi pi-check"
                            onClick={() => {
                                const newCustomer: Customer = {
                                    ...newCustomerForm,
                                    id: Math.max(...customers.map(c => c.id)) + 1,
                                    address: newCustomerForm.address || "İstanbul",
                                    dateOfBirth: new Date().toISOString(),
                                    isActive: true,
                                    registrationDate: new Date().toISOString(),
                                    lastContact: new Date().toISOString(),
                                    favoriteProperties: [],
                                    viewedProperties: [],
                                    requirements: []
                                };
                                setCustomers(prev => [...prev, newCustomer]);
                                setShowNewCustomerDialog(false);
                                setNewCustomerForm({
                                    fullName: "",
                                    email: "",
                                    phone: "",
                                    address: "",
                                    profession: "",
                                    budget: 0,
                                    preferredType: "Satılık",
                                    preferredCategory: "Daire",
                                    preferredDistricts: [],
                                    minArea: 0,
                                    maxArea: 0,
                                    minRooms: "",
                                    requirements: [],
                                    priority: "medium",
                                    notes: "",
                                    assignedAgent: 1
                                });
                                toast.current?.show({
                                    severity: 'success',
                                    summary: 'Başarılı',
                                    detail: 'Yeni müşteri eklendi',
                                    life: 3000
                                });
                            }}
                            className="bg-green-600 hover:bg-green-700 border-green-600 w-full sm:w-auto"
                        />
                    </div>
                </div>
            </ResponsiveDialog>
        </div>
    );
}

