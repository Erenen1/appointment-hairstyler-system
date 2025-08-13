"use client";

import { Card } from "primereact/card";
import { Chart } from "primereact/chart";
import "chart.js/auto";
import { useMemo, useState } from "react";
import { Button } from "primereact/button";
import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { InputTextarea } from 'primereact/inputtextarea';
import { Expense } from "./types";
import { useCrudOperations } from "../../hooks";
import { exportExpensesToCsv } from "../../lib/exportUtils";
import { Toast } from "primereact/toast";
import { ConfirmDialog } from "primereact/confirmdialog";
import {
    ResponsiveHero,
    ResponsiveGrid,
    ResponsiveStatsCard,
    ResponsiveDialog,
    VirtualDataTable,
    ExpenseActionButtons
} from "../../components/ui";

interface ExpensePageProps {
    expenses?: Expense[];
}

export default function ExpensePage({ expenses: initialExpenses = [] }: ExpensePageProps) {
    const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);
    const [globalFilter, setGlobalFilter] = useState<string>("");
    const [categoryFilter, setCategoryFilter] = useState<string[]>([]);
    const [dateFilter] = useState<Date | null>(null);

    const defaultForm: Partial<Expense> = {
        category: "",
        amount: 0,
        date: new Date().toISOString().split('T')[0],
        description: "",
        paymentMethod: "bank",
        type: "expense"
    };

    const {
        items: hookExpenses,
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
    } = useCrudOperations<Expense>(expenses, defaultForm, 'id', setExpenses);

    const categoryOptions = [
        { label: "Personel Maaşları", value: "Personel Maaşları" },
        { label: "Kira", value: "Kira" },
        { label: "Elektrik/Su/Doğalgaz", value: "Elektrik/Su/Doğalgaz" },
        { label: "Ürün Alımı", value: "Ürün Alımı" },
        { label: "Pazarlama", value: "Pazarlama" },
        { label: "Diğer", value: "Diğer" }
    ];

    const paymentMethodOptions = [
        { label: "Nakit", value: "cash" },
        { label: "Kart", value: "card" },
        { label: "Banka Transferi", value: "bank" },
        { label: "Çek", value: "check" }
    ];

    const filteredExpenses = useMemo(() => {
        return hookExpenses.filter((e) => {
            const okCategory = categoryFilter.length === 0 || categoryFilter.includes(e.category);
            const okDate = !dateFilter || new Date(e.date).toDateString() === dateFilter.toDateString();

            // Improved search functionality
            const searchText = globalFilter.toLowerCase().trim();
            const okSearch = !searchText ||
                e.category.toLowerCase().includes(searchText) ||
                e.description.toLowerCase().includes(searchText) ||
                getPaymentMethodLabel(e.paymentMethod).toLowerCase().includes(searchText);

            return okCategory && okDate && okSearch;
        });
    }, [hookExpenses, categoryFilter, dateFilter, globalFilter]);

    // Grafik verileri
    const categoryChart = useMemo(() => {
        const categoryData = hookExpenses.reduce((acc, e) => {
            acc[e.category] = (acc[e.category] || 0) + e.amount;
            return acc;
        }, {} as Record<string, number>);

        return {
            data: {
                labels: Object.keys(categoryData),
                datasets: [{
                    data: Object.values(categoryData),
                    backgroundColor: [
                        "#FF5722", "#FF9800", "#4CAF50", "#2196F3", "#9C27B0",
                        "#00BCD4", "#8BC34A", "#FF5722", "#E91E63", "#607D8B"
                    ],
                    borderWidth: 4,
                    borderColor: "#ffffff"
                }]
            },
            options: {
                cutout: "65%",
                plugins: { legend: { position: "right" } },
                maintainAspectRatio: false,
                responsive: true,
                elements: {
                    arc: {
                        borderWidth: 4,
                        borderColor: "#ffffff",
                        borderJoinStyle: "round"
                    }
                },
                spacing: 2
            }
        };
    }, [hookExpenses]);

    const monthlyChart = useMemo(() => {
        const monthlyData = hookExpenses.reduce((acc, e) => {
            const month = new Date(e.date).toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' });
            acc[month] = (acc[month] || 0) + e.amount;
            return acc;
        }, {} as Record<string, number>);

        return {
            data: {
                labels: Object.keys(monthlyData),
                datasets: [{
                    label: 'Aylık Gider',
                    data: Object.values(monthlyData),
                    backgroundColor: 'rgba(239, 68, 68, 0.2)',
                    borderColor: 'rgb(239, 68, 68)',
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
    }, [hookExpenses]);

    const validateForm = () => {
        return !!(form.category && form.amount && form.description);
    };

    const createExpense = (formData: Partial<Expense>): Expense => {
        return {
            id: Math.max(0, ...hookExpenses.map(e => e.id)) + 1,
            category: formData.category || "",
            amount: formData.amount || 0,
            date: formData.date || new Date().toISOString().split('T')[0],
            description: formData.description || "",
            paymentMethod: formData.paymentMethod || "bank",
            type: formData.type || "expense"
        };
    };

    const updateExpense = (id: number, formData: Partial<Expense>): Expense => {
        return {
            id,
            category: formData.category || "",
            amount: formData.amount || 0,
            date: formData.date || new Date().toISOString().split('T')[0],
            description: formData.description || "",
            paymentMethod: formData.paymentMethod || "bank",
            type: formData.type || "expense"
        };
    };

    const getPaymentMethodLabel = (method: string) => {
        switch (method) {
            case "cash": return "Nakit";
            case "card": return "Kart";
            case "bank": return "Banka";
            case "check": return "Çek";
            default: return method;
        }
    };

    const getPaymentMethodSeverity = (method: string) => {
        switch (method) {
            case "cash": return "success";
            case "card": return "info";
            case "bank": return "warning";
            case "check": return "secondary";
            default: return "secondary";
        }
    };

    // Stats
    const totalExpenses = hookExpenses.reduce((sum, e) => sum + e.amount, 0);
    const avgExpense = hookExpenses.length > 0 ? totalExpenses / hookExpenses.length : 0;
    const monthlyExpense = monthlyChart.data.datasets[0].data[monthlyChart.data.datasets[0].data.length - 1] || 0;
    const categoryCount = new Set(hookExpenses.map(e => e.category)).size;

    // Table Columns
    const columns = [
        { field: 'category', header: 'Kategori', sortable: true, style: { minWidth: '120px' } },
        { field: 'amount', header: 'Tutar', sortable: true, style: { minWidth: '100px' }, body: (rowData: Expense) => `${rowData.amount.toLocaleString()} ₺` },
        { field: 'date', header: 'Tarih', sortable: true, style: { minWidth: '100px' }, body: (rowData: Expense) => new Date(rowData.date).toLocaleDateString('tr-TR') },
        { field: 'description', header: 'Açıklama', style: { minWidth: '150px' }, mobileHidden: true },
        {
            field: 'paymentMethod',
            header: 'Ödeme Yöntemi',
            style: { minWidth: '120px' },
            body: (rowData: Expense) => (
                <span className={`px-2 py-1 rounded-full text-xs font-medium bg-${getPaymentMethodSeverity(rowData.paymentMethod)}-100 text-${getPaymentMethodSeverity(rowData.paymentMethod)}-800`}>
                    {getPaymentMethodLabel(rowData.paymentMethod)}
                </span>
            )
        },
        {
            field: 'actions',
            header: 'İşlemler',
            style: { minWidth: '120px' },
            body: (rowData: Expense) => (
                <ExpenseActionButtons
                    item={rowData}
                    onView={() => {}} // Boş fonksiyon ekleyeceğim
                    onEdit={openEdit}
                    onDelete={handleDelete}
                    showView={false}
                    size="small"
                />
            ),
            frozen: true
        }
    ];

    // Filters
    const filters = [
        {
            key: 'category',
            label: 'Kategori Filtresi',
            options: categoryOptions,
            value: categoryFilter,
            onChange: setCategoryFilter,
            type: 'multiselect' as const
        }
    ];

    // Actions
    const actions = [
        {
            label: 'Yeni Gider',
            icon: 'pi pi-plus',
            onClick: openAdd,
            className: 'bg-red-600 hover:bg-red-700 border-red-600'
        }
    ];

    return (
        <div className="p-2 sm:p-4 md:p-6 space-y-4 sm:space-y-6">
            <Toast ref={toast} />
            <ConfirmDialog />

            {/* Hero Section */}
            <ResponsiveHero
                title="Gider Yönetimi"
                subtitle="Gider kayıtlarınızı takip edin ve analiz edin"
                icon="pi-credit-card"
                iconBgColor="bg-gradient-to-br from-red-500 to-pink-600"
            />

            {/* Stats Cards */}
            <ResponsiveGrid cols={{ mobile: 1, tablet: 2, desktop: 4 }} gap="gap-4 sm:gap-6">
                <ResponsiveStatsCard
                    title="Toplam Gider"
                    value={`${totalExpenses.toLocaleString()} ₺`}
                    subtitle="Tüm zamanlar"
                    icon="pi-credit-card"
                    iconBgColor="bg-red-500"
                    gradient={{ from: 'red-50', to: 'red-100' }}
                    borderColor="border-red-200"
                />
                <ResponsiveStatsCard
                    title="Ortalama Gider"
                    value={`${avgExpense.toLocaleString()} ₺`}
                    subtitle="İşlem başına"
                    icon="pi-chart-line"
                    iconBgColor="bg-blue-500"
                    gradient={{ from: 'blue-50', to: 'blue-100' }}
                    borderColor="border-blue-200"
                />
                <ResponsiveStatsCard
                    title="Bu Ay"
                    value={`${monthlyExpense.toLocaleString()} ₺`}
                    subtitle="Aylık gider"
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
                <Card title="Gider Kategori Dağılımı" className="h-auto min-h-[400px] sm:h-[440px]">
                    <div className="w-full h-[300px] sm:h-[350px]">
                        <Chart
                            type="doughnut"
                            data={categoryChart.data}
                            options={categoryChart.options}
                            style={{ height: '100%', width: '100%' }}
                        />
                    </div>
                </Card>
                <Card title="Aylık Gider Trendi" className="h-auto min-h-[400px] sm:h-[440px]">
                    <div className="w-full h-[300px] sm:h-[350px]">
                        <Chart
                            type="line"
                            data={monthlyChart.data}
                            options={monthlyChart.options}
                            style={{ height: '100%', width: '100%' }}
                        />
                    </div>
                </Card>
            </ResponsiveGrid>

            {/* Expense Management */}
            <Card className="bg-white rounded-xl border-0 shadow-sm">
                <VirtualDataTable
                    data={filteredExpenses}
                    columns={columns}
                    globalFilterFields={["category", "description", "paymentMethod"]}
                    globalFilter={globalFilter}
                    onGlobalFilterChange={setGlobalFilter}
                    filters={filters}
                    actions={actions}
                    exportButton={{
                        label: "Excel İndir",
                        onClick: () => {
                            exportExpensesToCsv(filteredExpenses);
                            toast.current?.show({
                                severity: 'success',
                                summary: 'Başarılı',
                                detail: 'Gider listesi CSV formatında indirildi',
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
                        <span>{dialogMode === 'add' ? 'Yeni Gider Ekle' : 'Gider Düzenle'}</span>
                    </div>
                }
            >
                <div className="space-y-4 sm:space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Kategori *</label>
                            <Dropdown
                                value={form.category}
                                onChange={(e) => setForm({ ...form, category: e.value })}
                                options={categoryOptions}
                                className="w-full"
                                placeholder="Gider kategorisi seçin"
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
                                options={paymentMethodOptions}
                                className="w-full"
                                placeholder="Ödeme yöntemi seçin"
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
                            placeholder="Gider açıklaması"
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
                                        const newExpense = createExpense(form);
                                        handleSave(newExpense);
                                    } else {
                                        const updatedExpense = updateExpense(form.id!, form);
                                        handleSave(updatedExpense);
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
                            className="bg-red-600 hover:bg-red-700 border-red-600 w-full sm:w-auto"
                        />
                    </div>
                </div>
            </ResponsiveDialog>
        </div>
    );
}
