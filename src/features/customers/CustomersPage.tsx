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
    VirtualDataTable,
    SearchBar
} from "../../components/ui";
import { exportCustomersToCsv } from "../../lib/exportUtils";

interface CustomersPageProps {
    customers?: Customer[];
}

export default function CustomersPage({ customers: initialCustomers = [] }: CustomersPageProps) {
    const [customers, setCustomers] = useState<Customer[]>(initialCustomers || []);
    const [selected, setSelected] = useState<Customer | null>(null);
    const [globalFilter, setGlobalFilter] = useState<string>("");
    const [seriousBuyerFilter, setSeriousBuyerFilter] = useState<string[]>([]);
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
        dateOfBirth: "",
        profession: "",
        budget: 0,
        preferredType: "Satılık",
        preferredCategory: "Daire",
        preferredDistricts: [],
        minArea: 0,
        maxArea: 0,
        minRooms: "",
        requirements: [],
        isSeriousBuyer: false,
        customerNotes: "",
        assignedAgent: 1
    });
    const toast = useRef<Toast>(null);

    const seriousBuyerOptions = [
        { label: "Ciddi Alıcı", value: "true" },
        { label: "Değil", value: "false" }
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
            if (!c) return false;
            const okSeriousBuyer = seriousBuyerFilter.length === 0 || seriousBuyerFilter.includes(c.isSeriousBuyer?.toString() || 'false');
            const okType = typeFilter.length === 0 || typeFilter.includes(c.preferredType || '');
            const text = ((c.fullName || '') + " " + (c.phone || '') + " " + (c.email || '') + " " + (c.profession || '')).toLowerCase();
            const okSearch = !globalFilter || text.includes(globalFilter.toLowerCase());
            return okSeriousBuyer && okType && okSearch;
        });
    }, [customers, seriousBuyerFilter, typeFilter, globalFilter]);

    const getSeriousBuyerBadge = (isSeriousBuyer: boolean | undefined) => {
        if (isSeriousBuyer === undefined) return <span className="text-gray-500">-</span>;
        return isSeriousBuyer ?
            <Badge value="Ciddi Alıcı" severity="danger" /> :
            <Badge value="Değil" severity="secondary" />;
    };

    const getTypeTag = (type: string | undefined) => {
        if (!type) return <span className="text-gray-500">-</span>;
        return (
            <Tag
                value={type}
                severity={type === "Satılık" ? "info" : "warning"}
            />
        );
    };

    const formatBudget = (budget: number | undefined, type: string | undefined) => {
        if (!budget || !type) return '-';
        if (type === "Kiralık") {
            return `${budget.toLocaleString()} ₺/ay`;
        }
        return `${budget.toLocaleString()} ₺`;
    };



    // Customer Operations
    const handleViewDetails = (customer: Customer) => {
        setSelected(customer);
        setShowDetailDialog(true);
    };

    const handleEditCustomer = (customer: Customer) => {
        setEditingCustomer(customer);
        setEditingForm({
            fullName: customer.fullName || '',
            email: customer.email || '',
            phone: customer.phone || '',
            address: customer.address || '',
            dateOfBirth: customer.dateOfBirth || '',
            profession: customer.profession || '',
            budget: customer.budget || 0,
            preferredType: customer.preferredType || 'Satılık',
            preferredCategory: customer.preferredCategory || 'Daire',
            preferredDistricts: customer.preferredDistricts || [],
            minArea: customer.minArea || 0,
            maxArea: customer.maxArea || 0,
            minRooms: customer.minRooms || '',
            requirements: customer.requirements || [],
            isSeriousBuyer: customer.isSeriousBuyer || false,
            customerNotes: customer.customerNotes || '',
            assignedAgent: customer.assignedAgent || 1
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
        const customerToDelete = customers.find(c => c?.id === customerId);
        if (!customerToDelete) return;

        confirmDialog({
            message: `"${customerToDelete.fullName || 'Bilinmeyen Müşteri'}" müşterisini silmek istediğinizden emin misiniz?`,
            header: 'Müşteri Silme Onayı',
            icon: 'pi pi-exclamation-triangle',
            acceptClassName: 'p-button-danger',
            acceptLabel: 'Evet',
            rejectLabel: 'Hayır',
            accept: () => {
                setCustomers(prev => prev.filter(c => c?.id !== customerId));
                toast.current?.show({
                    severity: 'success',
                    summary: 'Başarılı',
                    detail: 'Müşteri silindi',
                    life: 3000
                });
            }
        });
    };



    // Table Columns
    const columns = [
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
            field: 'isSeriousBuyer',
            header: 'Ciddi Alıcı',
            sortable: true,
            style: { minWidth: '120px' },
            body: (rowData: Customer) => getSeriousBuyerBadge(rowData.isSeriousBuyer)
        },
        {
            field: 'lastContact',
            header: 'Son İletişim',
            sortable: true,
            style: { minWidth: '120px' },
            mobileHidden: true,
            body: (rowData: Customer) => {
                if (!rowData.lastContact) return '-';
                try {
                    return new Date(rowData.lastContact).toLocaleDateString('tr-TR');
                } catch {
                    return '-';
                }
            }
        },
        {
            field: 'customerNotes',
            header: 'Müşteri Notu',
            style: { minWidth: '150px' },
            mobileHidden: true,
            body: (rowData: Customer) => (
                <span className="text-sm text-gray-600 truncate block max-w-[150px]" title={rowData.customerNotes || ''}>
                    {rowData.customerNotes || '-'}
                </span>
            )
        },
        {
            field: 'actions',
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
                        onClick={() => handleDeleteCustomer(rowData.id || 0)}
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
            key: 'seriousBuyer',
            label: 'Ciddi Alıcı Filtresi',
            options: seriousBuyerOptions,
            value: seriousBuyerFilter,
            onChange: setSeriousBuyerFilter,
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



            {/* Customer Management */}
            <Card className="bg-white rounded-xl border-0 shadow-sm">
                <VirtualDataTable
                    data={filteredCustomers || []}
                    columns={columns}
                    globalFilterFields={["fullName", "phone", "email", "profession"]}
                    globalFilter={globalFilter}
                    onGlobalFilterChange={setGlobalFilter}
                    filters={filters}
                    actions={actions}
                    exportButton={{
                        label: "Excel İndir",
                        onClick: () => {
                            if (filteredCustomers && filteredCustomers.length > 0) {
                                exportCustomersToCsv(filteredCustomers);
                                toast.current?.show({
                                    severity: 'success',
                                    summary: 'Başarılı',
                                    detail: 'Müşteri listesi CSV formatında indirildi',
                                    life: 3000
                                });
                            } else {
                                toast.current?.show({
                                    severity: 'warn',
                                    summary: 'Uyarı',
                                    detail: 'Dışa aktarılacak müşteri bulunamadı',
                                    life: 3000
                                });
                            }
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
                {selected ? (
                    <div className="space-y-4 sm:space-y-6">
                        {/* Basic Info */}
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 sm:p-6 border border-blue-200">
                            <h3 className="text-lg sm:text-xl font-bold text-blue-800 mb-4 flex items-center gap-2">
                                <i className="pi pi-info-circle"></i>
                                Kişisel Bilgiler
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
                                    <i className="pi pi-map-marker text-blue-600"></i>
                                    <span><strong>Adres:</strong> {selected.address || 'Belirtilmemiş'}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <i className="pi pi-calendar text-blue-600"></i>
                                    <span><strong>Doğum Tarihi:</strong> {selected.dateOfBirth ? new Date(selected.dateOfBirth).toLocaleDateString('tr-TR') : 'Belirtilmemiş'}</span>
                                </div>
                            </div>
                        </div>

                        {/* Financial & Preferences */}
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 sm:p-6 border border-green-200">
                            <h3 className="text-lg sm:text-xl font-bold text-green-800 mb-4 flex items-center gap-2">
                                <i className="pi pi-wallet"></i>
                                Finansal Bilgiler ve Tercihler
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                <div className="flex items-center gap-2">
                                    <i className="pi pi-money-bill text-green-600"></i>
                                    <span><strong>Bütçe:</strong> {formatBudget(selected.budget, selected.preferredType)}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <i className="pi pi-home text-green-600"></i>
                                    <span><strong>İlgi Alanı:</strong> {selected.preferredType}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <i className="pi pi-tag text-green-600"></i>
                                    <span><strong>Kategori:</strong> {selected.preferredCategory}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <i className="pi pi-exclamation-triangle text-green-600"></i>
                                    <span><strong>Ciddi Alıcı:</strong> {selected.isSeriousBuyer ? 'Evet' : 'Hayır'}</span>
                                </div>
                            </div>
                        </div>

                        {/* Property Preferences */}
                        <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-4 sm:p-6 border border-orange-200">
                            <h3 className="text-lg sm:text-xl font-bold text-orange-800 mb-4 flex items-center gap-2">
                                <i className="pi pi-home text-orange-600"></i>
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
                                    {selected.preferredDistricts?.map((district, index) => (
                                        <Tag key={index} value={district} severity="info" />
                                    )) || <span className="text-gray-500">Belirtilmemiş</span>}
                                </div>
                            </div>

                            <div className="mt-4">
                                <strong>Gereksinimler:</strong>
                                <div className="flex gap-2 mt-2 flex-wrap">
                                    {selected.requirements?.map((req, index) => (
                                        <Tag key={index} value={req} severity="secondary" />
                                    )) || <span className="text-gray-500">Belirtilmemiş</span>}
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
                                    <strong>Kayıt Tarihi:</strong> {selected.registrationDate ? new Date(selected.registrationDate).toLocaleDateString('tr-TR') : '-'}
                                </div>
                                <div>
                                    <strong>Son İletişim:</strong> {selected.lastContact ? new Date(selected.lastContact).toLocaleDateString('tr-TR') : '-'}
                                </div>
                                <div>
                                    <strong>Görüntülenen İlanlar:</strong> {selected.viewedProperties?.length || 0} adet
                                </div>
                                <div>
                                    <strong>Atanan Acenta:</strong> {selected.assignedAgent || 'Belirtilmemiş'}
                                </div>
                            </div>
                        </div>

                        {selected.customerNotes && (
                            <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl p-4 sm:p-6 border border-orange-200">
                                <h3 className="text-lg sm:text-xl font-bold text-orange-800 mb-4 flex items-center gap-2">
                                    <i className="pi pi-sticky-note"></i>
                                    Müşteri Notu
                                </h3>
                                <p className="text-gray-700 leading-relaxed">{selected.customerNotes}</p>
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
                ) : (
                    <div className="text-center text-gray-500 py-8">
                        <i className="pi pi-exclamation-triangle text-4xl mb-4"></i>
                        <p>Müşteri bilgileri yüklenemedi</p>
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
                        {/* Personal Information */}
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
                            <h4 className="text-md font-semibold text-blue-800 mb-3 flex items-center gap-2">
                                <i className="pi pi-user text-blue-600"></i>
                                Kişisel Bilgiler
                            </h4>
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
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Adres</label>
                                    <InputText
                                        value={editingForm.address}
                                        onChange={(e) => setEditingForm({ ...editingForm, address: e.target.value })}
                                        className="w-full"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Doğum Tarihi</label>
                                    <InputText
                                        type="date"
                                        value={editingForm.dateOfBirth ? new Date(editingForm.dateOfBirth).toISOString().split('T')[0] : ''}
                                        onChange={(e) => setEditingForm({ ...editingForm, dateOfBirth: e.target.value })}
                                        className="w-full"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Financial & Preferences */}
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
                            <h4 className="text-md font-semibold text-green-800 mb-3 flex items-center gap-2">
                                <i className="pi pi-wallet text-green-600"></i>
                                Finansal Bilgiler ve Tercihler
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Ciddi Alıcı</label>
                                    <Dropdown
                                        value={editingForm.isSeriousBuyer.toString()}
                                        onChange={(e) => setEditingForm({ ...editingForm, isSeriousBuyer: e.value === 'true' })}
                                        options={seriousBuyerOptions}
                                        className="w-full"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Property Preferences */}
                        <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-4 border border-orange-200">
                            <h4 className="text-md font-semibold text-orange-800 mb-3 flex items-center gap-2">
                                <i className="pi pi-home text-orange-600"></i>
                                Gayrimenkul Tercihleri
                            </h4>
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

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
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

                            <div className="mt-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Oda Sayısı</label>
                                <InputText
                                    value={editingForm.minRooms}
                                    onChange={(e) => setEditingForm({ ...editingForm, minRooms: e.target.value })}
                                    className="w-full"
                                    placeholder="Örn: 2+1"
                                />
                            </div>
                        </div>

                        {/* Additional Information */}
                        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-200">
                            <h4 className="text-md font-semibold text-indigo-800 mb-3 flex items-center gap-2">
                                <i className="pi pi-sticky-note text-indigo-600"></i>
                                Ek Bilgiler
                            </h4>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Müşteri Notu</label>
                                <InputTextarea
                                    value={editingForm.customerNotes}
                                    onChange={(e) => setEditingForm({ ...editingForm, customerNotes: e.target.value })}
                                    className="w-full"
                                    rows={4}
                                    placeholder="Müşteri hakkında özel notlar..."
                                />
                            </div>
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
                    {/* Personal Information */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
                        <h4 className="text-md font-semibold text-blue-800 mb-3 flex items-center gap-2">
                            <i className="pi pi-user text-blue-600"></i>
                            Kişisel Bilgiler
                        </h4>
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
                                <label className="block text-sm font-medium text-gray-700 mb-2">Adres</label>
                                <InputText
                                    value={newCustomerForm.address}
                                    onChange={(e) => setNewCustomerForm({ ...newCustomerForm, address: e.target.value })}
                                    className="w-full"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Doğum Tarihi</label>
                                <InputText
                                    type="date"
                                    value={newCustomerForm.dateOfBirth}
                                    onChange={(e) => setNewCustomerForm({ ...newCustomerForm, dateOfBirth: e.target.value })}
                                    className="w-full"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Financial & Preferences */}
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
                        <h4 className="text-md font-semibold text-green-800 mb-3 flex items-center gap-2">
                            <i className="pi pi-wallet text-green-600"></i>
                            Finansal Bilgiler ve Tercihler
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                                <label className="block text-sm font-medium text-gray-700 mb-2">Ciddi Alıcı</label>
                                <Dropdown
                                    value={newCustomerForm.isSeriousBuyer.toString()}
                                    onChange={(e) => setNewCustomerForm({ ...newCustomerForm, isSeriousBuyer: e.value === 'true' })}
                                    options={seriousBuyerOptions}
                                    className="w-full"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Property Preferences */}
                    <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-4 border border-orange-200">
                        <h4 className="text-md font-semibold text-orange-800 mb-3 flex items-center gap-2">
                            <i className="pi pi-home text-orange-600"></i>
                            Gayrimenkul Tercihleri
                        </h4>
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

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
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

                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Oda Sayısı</label>
                            <InputText
                                value={newCustomerForm.minRooms}
                                onChange={(e) => setNewCustomerForm({ ...newCustomerForm, minRooms: e.target.value })}
                                className="w-full"
                                placeholder="Örn: 2+1"
                            />
                        </div>
                    </div>

                    {/* Additional Information */}
                    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-200">
                        <h4 className="text-md font-semibold text-indigo-800 mb-3 flex items-center gap-2">
                            <i className="pi pi-sticky-note text-indigo-600"></i>
                            Ek Bilgiler
                        </h4>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Müşteri Notu</label>
                            <InputTextarea
                                value={newCustomerForm.customerNotes}
                                onChange={(e) => setNewCustomerForm({ ...newCustomerForm, customerNotes: e.target.value })}
                                className="w-full"
                                rows={4}
                                placeholder="Müşteri hakkında özel notlar..."
                            />
                        </div>
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
                                    id: customers.length > 0 ? Math.max(...customers.map(c => c.id)) + 1 : 1,
                                    address: newCustomerForm.address || "İstanbul",
                                    dateOfBirth: newCustomerForm.dateOfBirth || new Date().toISOString(),
                                    isActive: true,
                                    registrationDate: new Date().toISOString(),
                                    lastContact: new Date().toISOString(),
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
                                    dateOfBirth: "",
                                    profession: "",
                                    budget: 0,
                                    preferredType: "Satılık",
                                    preferredCategory: "Daire",
                                    preferredDistricts: [],
                                    minArea: 0,
                                    maxArea: 0,
                                    minRooms: "",
                                    requirements: [],
                                    isSeriousBuyer: false,
                                    customerNotes: "",
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

