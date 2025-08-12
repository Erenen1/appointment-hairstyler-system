"use client";

import { Card } from "primereact/card";
import { Chart } from "primereact/chart";
import "chart.js/auto";
import { InputText } from "primereact/inputtext";
import { useMemo, useState } from "react";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { Calendar } from "primereact/calendar";
import { InputTextarea } from 'primereact/inputtextarea';
import { Tag } from "primereact/tag";
import { Income } from "./types";
import { useCrudOperations } from "../../hooks";
import { exportIncomeToCsv } from "../../lib/exportUtils";
import { Toast } from "primereact/toast";
import { ConfirmDialog } from "primereact/confirmdialog";
import {
    ResponsiveHero,
    ResponsiveGrid,
    ResponsiveStatsCard,
    ResponsiveDialog,
    VirtualDataTable
} from "../../components/ui";

interface IncomePageProps {
    income?: Income[];
}

export default function IncomePage({ income: initialIncome = [] }: IncomePageProps) {
    const [income, setIncome] = useState<Income[]>(initialIncome);
    const [globalFilter, setGlobalFilter] = useState<string>("");
    const [categoryFilter, setCategoryFilter] = useState<string[]>([]);
    const [sourceFilter, setSourceFilter] = useState<string[]>([]);
    const [dateFilter] = useState<Date | null>(null);

    const defaultForm: Partial<Income> = {
        category: "",
        amount: 0,
        date: new Date().toISOString().split('T')[0],
        description: "",
        paymentMethod: "cash",
        source: "service_sales"
    };

    const {
        items: hookIncome,
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
    } = useCrudOperations<Income>(income, defaultForm, 'id', setIncome);

    const filteredIncome = useMemo(() => {
        return hookIncome.filter((i) => {
            const okCategory = categoryFilter.length === 0 || categoryFilter.includes(i.category);
            const okSource = sourceFilter.length === 0 || sourceFilter.includes(i.source);
            const okDate = !dateFilter || new Date(i.date).toDateString() === dateFilter.toDateString();
            const text = (i.category + " " + i.description + " " + i.paymentMethod).toLowerCase();
            const okSearch = !globalFilter || text.includes(globalFilter.toLowerCase());
            return okCategory && okSource && okDate && okSearch;
        });
    }, [hookIncome, categoryFilter, sourceFilter, dateFilter, globalFilter]);

    const chartData = useMemo(() => {
        const categoryTotals = hookIncome.reduce((acc, income) => {
            acc[income.category] = (acc[income.category] || 0) + income.amount;
            return acc;
        }, {} as Record<string, number>);

        const colors = [
            "#5B8FF9", "#5AD8A6", "#5D7092", "#F6BD16", "#E8684A", "#6DC8EC", "#9270CA", "#FF9D4D", "#269A99", "#FF99C3"
        ];

        return {
            data: {
                labels: Object.keys(categoryTotals),
                datasets: [{
                    data: Object.values(categoryTotals),
                    backgroundColor: colors.slice(0, Object.keys(categoryTotals).length),
                    borderWidth: 0
                }]
            },
            options: {
                cutout: "65%",
                plugins: { legend: { position: "right" } },
                maintainAspectRatio: false,
                responsive: true
            }
        };
    }, [hookIncome]);

    const monthlyData = useMemo(() => {
        const monthlyTotals = hookIncome.reduce((acc, income) => {
            const month = new Date(income.date).toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' });
            acc[month] = (acc[month] || 0) + income.amount;
            return acc;
        }, {} as Record<string, number>);

        return {
            data: {
                labels: Object.keys(monthlyTotals),
                datasets: [{
                    label: 'Aylık Gelir',
                    data: Object.values(monthlyTotals),
                    backgroundColor: 'rgba(59, 130, 246, 0.2)',
                    borderColor: 'rgb(59, 130, 246)',
                    borderWidth: 2,
                    tension: 0.4
                }]
            },
            options: {
                plugins: { legend: { display: false } },
                maintainAspectRatio: false,
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function (value: number) {
                                return value + '₺';
                            }
                        }
                    }
                }
            }
        };
    }, [hookIncome]);

    const validateForm = () => {
        return !!(form.category && form.amount && form.description);
    };

    const createIncome = (formData: Partial<Income>): Income => {
        return {
            id: Math.max(0, ...hookIncome.map(i => i.id)) + 1,
            category: formData.category || "",
            amount: formData.amount || 0,
            date: formData.date || new Date().toISOString().split('T')[0],
            description: formData.description || "",
            paymentMethod: formData.paymentMethod || "cash",
            source: formData.source || "service_sales"
        };
    };

    const updateIncome = (id: number, formData: Partial<Income>): Income => {
        return {
            id,
            category: formData.category || "",
            amount: formData.amount || 0,
            date: formData.date || new Date().toISOString().split('T')[0],
            description: formData.description || "",
            paymentMethod: formData.paymentMethod || "cash",
            source: formData.source || "service_sales"
        };
    };

    const getPaymentMethodLabel = (method: string) => {
        switch (method) {
            case "cash": return "Nakit";
            case "card": return "Kart";
            case "bank": return "Banka";
            default: return method;
        }
    };

    const getSourceLabel = (source: string) => {
        switch (source) {
            case "service_sales": return "Hizmet Satışı";
            case "product_sales": return "Ürün Satışı";
            case "other": return "Diğer";
            default: return source;
        }
    };

    const getPaymentMethodSeverity = (method: string) => {
        switch (method) {
            case "cash": return "success";
            case "card": return "info";
            case "bank": return "warning";
            default: return "secondary";
        }
    };

    const getSourceSeverity = (source: string) => {
        switch (source) {
            case "service_sales": return "success";
            case "product_sales": return "info";
            case "other": return "secondary";
            default: return "secondary";
        }
    };

    // Stats
    const totalIncome = hookIncome.reduce((sum, i) => sum + i.amount, 0);
    const avgIncome = hookIncome.length > 0 ? totalIncome / hookIncome.length : 0;
    const monthlyIncome = monthlyData.data.datasets[0].data[monthlyData.data.datasets[0].data.length - 1] || 0;
    const categoryCount = new Set(hookIncome.map(i => i.category)).size;

    // Table Columns
    const columns = [
        { field: 'id', header: 'ID', sortable: true, style: { minWidth: '60px' }, mobileHidden: true },
        { field: 'category', header: 'Kategori', sortable: true, style: { minWidth: '120px' } },
        { field: 'amount', header: 'Tutar', sortable: true, style: { minWidth: '100px' }, body: (rowData: Income) => `${rowData.amount.toLocaleString()} ₺` },
        { field: 'date', header: 'Tarih', sortable: true, style: { minWidth: '100px' }, body: (rowData: Income) => new Date(rowData.date).toLocaleDateString('tr-TR') },
        { field: 'description', header: 'Açıklama', style: { minWidth: '150px' }, mobileHidden: true },
        {
            field: 'paymentMethod',
            header: 'Ödeme Yöntemi',
            style: { minWidth: '120px' },
            body: (rowData: Income) => (
                <Tag value={getPaymentMethodLabel(rowData.paymentMethod)} severity={getPaymentMethodSeverity(rowData.paymentMethod)} />
            )
        },
        {
            field: 'source',
            header: 'Kaynak',
            style: { minWidth: '120px' },
            mobileHidden: true,
            body: (rowData: Income) => (
                <Tag value={getSourceLabel(rowData.source)} severity={getSourceSeverity(rowData.source)} />
            )
        },
        {
            field: 'actions',
            header: 'İşlemler',
            style: { minWidth: '120px' },
            body: (rowData: Income) => (
                <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                    <Button
                        icon="pi pi-pencil"
                        size="small"
                        severity="warning"
                        text
                        tooltip="Düzenle"
                        onClick={() => openEdit(rowData)}
                        className="w-full sm:w-auto"
                    />
                    <Button
                        icon="pi pi-trash"
                        size="small"
                        severity="danger"
                        text
                        tooltip="Sil"
                        onClick={() => handleDelete(rowData)}
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
            key: 'category',
            label: 'Kategori Filtresi',
            options: Array.from(new Set(hookIncome.map(i => i.category))).map(cat => ({ label: cat, value: cat })),
            value: categoryFilter,
            onChange: setCategoryFilter,
            type: 'multiselect' as const
        },
        {
            key: 'source',
            label: 'Kaynak Filtresi',
            options: [
                { label: 'Hizmet Satışı', value: 'service_sales' },
                { label: 'Ürün Satışı', value: 'product_sales' },
                { label: 'Diğer', value: 'other' }
            ],
            value: sourceFilter,
            onChange: setSourceFilter,
            type: 'multiselect' as const
        }
    ];

    // Actions
    const actions = [
        {
            label: 'Yeni Gelir',
            icon: 'pi pi-plus',
            onClick: openAdd,
            className: 'bg-green-600 hover:bg-green-700 border-green-600'
        }
    ];

    return (
        <div className="p-2 sm:p-4 md:p-6 space-y-4 sm:space-y-6">
            <Toast ref={toast} />
            <ConfirmDialog />

            {/* Hero Section */}
            <ResponsiveHero
                title="Gelir Yönetimi"
                subtitle="Gelir kayıtlarınızı takip edin ve analiz edin"
                icon="pi-money-bill"
                iconBgColor="bg-gradient-to-br from-green-500 to-emerald-600"
            />

            {/* Stats Cards */}
            <ResponsiveGrid cols={{ mobile: 1, tablet: 2, desktop: 4 }} gap="gap-4 sm:gap-6">
                <ResponsiveStatsCard
                    title="Toplam Gelir"
                    value={`${totalIncome.toLocaleString()} ₺`}
                    subtitle="Tüm zamanlar"
                    icon="pi-wallet"
                    iconBgColor="bg-green-500"
                    gradient={{ from: 'green-50', to: 'green-100' }}
                    borderColor="border-green-200"
                />
                <ResponsiveStatsCard
                    title="Ortalama Gelir"
                    value={`${avgIncome.toLocaleString()} ₺`}
                    subtitle="İşlem başına"
                    icon="pi-chart-line"
                    iconBgColor="bg-blue-500"
                    gradient={{ from: 'blue-50', to: 'blue-100' }}
                    borderColor="border-blue-200"
                />
                <ResponsiveStatsCard
                    title="Bu Ay"
                    value={`${monthlyIncome.toLocaleString()} ₺`}
                    subtitle="Aylık gelir"
                    icon="pi-calendar"
                    iconBgColor="bg-purple-500"
                    gradient={{ from: 'purple-50', to: 'purple-100' }}
                    borderColor="border-purple-200"
                />
                <ResponsiveStatsCard
                    title="Kategori Sayısı"
                    value={categoryCount}
                    subtitle="Farklı kategoriler"
                    icon="pi-tags"
                    iconBgColor="bg-orange-500"
                    gradient={{ from: 'orange-50', to: 'orange-100' }}
                    borderColor="border-orange-200"
                />
            </ResponsiveGrid>

            {/* Charts */}
            <ResponsiveGrid cols={{ mobile: 1, desktop: 2 }} gap="gap-4 sm:gap-6">
                <Card title="Gelir Kategori Dağılımı" className="h-auto min-h-[400px] sm:h-[440px]">
                    <div className="w-full h-[300px] sm:h-[350px]">
                        <Chart
                            type="doughnut"
                            data={chartData.data}
                            options={chartData.options}
                            style={{ height: '100%', width: '100%' }}
                        />
                    </div>
                </Card>
                <Card title="Aylık Gelir Trendi" className="h-auto min-h-[400px] sm:h-[440px]">
                    <div className="w-full h-[300px] sm:h-[350px]">
                        <Chart
                            type="line"
                            data={monthlyData.data}
                            options={monthlyData.options}
                            style={{ height: '100%', width: '100%' }}
                        />
                    </div>
                </Card>
            </ResponsiveGrid>

            {/* Income Management */}
            <Card className="bg-white rounded-xl border-0 shadow-sm">
                <VirtualDataTable
                    data={filteredIncome}
                    columns={columns}
                    globalFilterFields={["category", "description", "paymentMethod"]}
                    globalFilter={globalFilter}
                    onGlobalFilterChange={setGlobalFilter}
                    filters={filters}
                    actions={actions}
                    exportButton={{
                        label: "Excel İndir",
                        onClick: () => {
                            exportIncomeToCsv(filteredIncome);
                            toast.current?.show({
                                severity: 'success',
                                summary: 'Başarılı',
                                detail: 'Gelir listesi CSV formatında indirildi',
                                life: 3000
                            });
                        }
                    }}
                    virtualScrollerOptions={{ itemSize: 46 }}
                />
            </Card>

            {/* Add/Edit Dialog */}
            <ResponsiveDialog
                visible={showDialog}
                onHide={() => setShowDialog(false)}
                header={
                    <div className="flex items-center gap-3">
                        <i className={`pi ${dialogMode === 'add' ? 'pi-plus text-green-600' : 'pi-pencil text-orange-600'} text-xl`}></i>
                        <span>{dialogMode === 'add' ? 'Yeni Gelir Ekle' : 'Gelir Düzenle'}</span>
                    </div>
                }
            >
                <div className="space-y-4 sm:space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Kategori *</label>
                            <InputText
                                value={form.category}
                                onChange={(e) => setForm({ ...form, category: e.target.value })}
                                className="w-full"
                                placeholder="Gelir kategorisi"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Tutar *</label>
                            <InputNumber
                                value={form.amount}
                                onValueChange={(e) => setForm({ ...form, amount: e.value || 0 })}
                                className="w-full"
                                mode="currency"
                                currency="TRY"
                                placeholder="0.00"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Tarih *</label>
                            <Calendar
                                value={form.date ? new Date(form.date) : null}
                                onChange={(e) => setForm({ ...form, date: e.value ? e.value.toISOString().split('T')[0] : '' })}
                                className="w-full"
                                showIcon
                                dateFormat="dd/mm/yy"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Ödeme Yöntemi</label>
                            <Dropdown
                                value={form.paymentMethod}
                                onChange={(e) => setForm({ ...form, paymentMethod: e.value })}
                                options={[
                                    { label: 'Nakit', value: 'cash' },
                                    { label: 'Kart', value: 'card' },
                                    { label: 'Banka', value: 'bank' }
                                ]}
                                className="w-full"
                                placeholder="Ödeme yöntemi seçin"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Kaynak</label>
                            <Dropdown
                                value={form.source}
                                onChange={(e) => setForm({ ...form, source: e.value })}
                                options={[
                                    { label: 'Hizmet Satışı', value: 'service_sales' },
                                    { label: 'Ürün Satışı', value: 'product_sales' },
                                    { label: 'Diğer', value: 'other' }
                                ]}
                                className="w-full"
                                placeholder="Gelir kaynağı seçin"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Açıklama *</label>
                        <InputTextarea
                            value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                            className="w-full"
                            rows={3}
                            placeholder="Gelir açıklaması"
                        />
                    </div>

                    <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-gray-200">
                        <Button
                            label="İptal"
                            icon="pi pi-times"
                            outlined
                            onClick={() => setShowDialog(false)}
                            className="w-full sm:w-auto"
                        />
                        <Button
                            label={dialogMode === 'add' ? 'Ekle' : 'Güncelle'}
                            icon="pi pi-check"
                            onClick={() => {
                                if (validateForm()) {
                                    if (dialogMode === 'add') {
                                        const newIncome = createIncome(form);
                                        handleSave(newIncome);
                                    } else {
                                        const updatedIncome = updateIncome(form.id!, form);
                                        handleSave(updatedIncome);
                                    }
                                    resetForm();
                                    setShowDialog(false);
                                } else {
                                    toast.current?.show({
                                        severity: 'error',
                                        summary: 'Hata',
                                        detail: 'Lütfen tüm gerekli alanları doldurun',
                                        life: 3000
                                    });
                                }
                            }}
                            className="bg-green-600 hover:bg-green-700 border-green-600 w-full sm:w-auto"
                        />
                    </div>
                </div>
            </ResponsiveDialog>
        </div>
    );
}
