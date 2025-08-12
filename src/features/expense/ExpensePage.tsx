"use client";

import { Card } from "primereact/card";
import { Chart } from "primereact/chart";
import "chart.js/auto";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { useMemo, useState } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { InputTextarea } from 'primereact/inputtextarea';
import { ProgressBar } from "primereact/progressbar";
import { Expense } from "./types";
import { useCrudOperations } from "../../hooks";
import { ExpenseActionButtons, ExpenseStatsCard, ExpenseTransparentHeader } from "../../components/ui";
import { exportExpensesToCsv } from "../../lib/exportUtils";
import { Toast } from "primereact/toast";
import { ConfirmDialog } from "primereact/confirmdialog";
import { ExportButton } from "../../components/ui/ExportButton";

interface ExpensePageProps {
    expenses?: Expense[];
}

export default function ExpensePage({ expenses: initialExpenses = [] }: ExpensePageProps) {
    const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);
    const [globalFilter, setGlobalFilter] = useState<string>("");
    const [categoryFilter, setCategoryFilter] = useState<string>("");
    const [dateFilter, setDateFilter] = useState<Date | null>(null);

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
        { label: "Tümü", value: "" },
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
            const okCategory = !categoryFilter || e.category === categoryFilter;
            const okDate = !dateFilter || new Date(e.date).toDateString() === dateFilter.toDateString();
            const text = (e.category + " " + e.description).toLowerCase();
            const okSearch = !globalFilter || text.includes(globalFilter.toLowerCase());
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
                        "#EF4444", "#F59E0B", "#10B981", "#3B82F6", "#8B5CF6",
                        "#06B6D4", "#84CC16", "#F97316", "#EC4899", "#6B7280"
                    ]
                }]
            },
            options: {
                plugins: { legend: { position: "bottom" } },
                maintainAspectRatio: false
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
                    borderWidth: 3,
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                plugins: { legend: { display: false } },
                maintainAspectRatio: false,
                scales: {
                    y: { beginAtZero: true }
                }
            }
        };
    }, [hookExpenses]);

    const paymentMethodChart = useMemo(() => {
        const methodData = hookExpenses.reduce((acc, e) => {
            acc[e.paymentMethod] = (acc[e.paymentMethod] || 0) + e.amount;
            return acc;
        }, {} as Record<string, number>);

        return {
            data: {
                labels: Object.keys(methodData).map(m =>
                    m === "cash" ? "Nakit" : m === "card" ? "Kart" : m === "bank" ? "Banka" : "Çek"
                ),
                datasets: [{
                    data: Object.values(methodData),
                    backgroundColor: ["#EF4444", "#3B82F6", "#8B5CF6", "#F59E0B"]
                }]
            },
            options: {
                plugins: { legend: { position: "bottom" } },
                maintainAspectRatio: false
            }
        };
    }, [hookExpenses]);

    const totalExpenses = hookExpenses.reduce((sum, e) => sum + e.amount, 0);
    const avgExpenses = totalExpenses / hookExpenses.length;
    const maxExpenses = Math.max(...hookExpenses.map(e => e.amount));

    // Kategori bazlı yüzde hesaplama
    const categoryPercentages = useMemo(() => {
        const categoryData = hookExpenses.reduce((acc, e) => {
            acc[e.category] = (acc[e.category] || 0) + e.amount;
            return acc;
        }, {} as Record<string, number>);

        return Object.entries(categoryData).map(([category, amount]) => ({
            category,
            amount,
            percentage: (amount / totalExpenses) * 100
        })).sort((a, b) => b.percentage - a.percentage);
    }, [hookExpenses, totalExpenses]);

    const validateForm = () => {
        return !!(form.category && form.amount);
    };

    const createExpense = (formData: Partial<Expense>): Expense => {
        return {
            id: Math.max(0, ...hookExpenses.map(e => e.id)) + 1,
            category: formData.category || "",
            amount: formData.amount || 0,
            date: formData.date || new Date().toISOString().split('T')[0],
            description: formData.description || "",
            paymentMethod: formData.paymentMethod || "bank",
            type: "expense"
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
            type: "expense"
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

    const getPaymentMethodColor = (method: string) => {
        switch (method) {
            case "cash": return "text-red-600";
            case "card": return "text-blue-600";
            case "bank": return "text-purple-600";
            case "check": return "text-yellow-600";
            default: return "text-gray-600";
        }
    };

    return (
        <div className="p-4 md:p-6 space-y-6">
            <Toast ref={toast} />
            <ConfirmDialog />

            {/* Gider Sayfası Header */}
            <ExpenseTransparentHeader
                title="Gider Yönetimi"
                description="Gider kayıtlarınızı takip edin, analiz edin ve yönetin"
            />

            {/* Özet Kartları */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <ExpenseStatsCard
                    title="Toplam Gider"
                    value={`${totalExpenses.toFixed(2)}₺`}
                    subtitle="Toplam gider tutarı"
                />
                <ExpenseStatsCard
                    title="Ortalama Gider"
                    value={`${avgExpenses.toFixed(2)}₺`}
                    subtitle="Ortalama gider tutarı"
                />
                <ExpenseStatsCard
                    title="En Yüksek Gider"
                    value={`${maxExpenses.toFixed(2)}₺`}
                    subtitle="En yüksek gider tutarı"
                />
                <ExpenseStatsCard
                    title="Toplam Kayıt"
                    value={hookExpenses.length}
                    subtitle="Toplam gider kaydı"
                />
            </div>

            {/* Grafikler */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card title="Kategori Bazlı Gider" className="h-96">
                    <Chart type="doughnut" data={categoryChart.data} options={categoryChart.options} style={{ height: '280px' }} />
                </Card>
                <Card title="Aylık Gider Trendi" className="h-96">
                    <Chart type="line" data={monthlyChart.data} options={monthlyChart.options} style={{ height: '280px' }} />
                </Card>
                <Card title="Ödeme Yöntemi Dağılımı" className="h-96">
                    <Chart type="doughnut" data={paymentMethodChart.data} options={paymentMethodChart.options} style={{ height: '280px' }} />
                </Card>
            </div>

            {/* Kategori Yüzde Dağılımı */}
            <Card title="Kategori Bazlı Gider Dağılımı">
                <div className="space-y-4">
                    {categoryPercentages.map((item, index) => (
                        <div key={index} className="space-y-2">
                            <div className="flex justify-between items-center">
                                <span className="font-medium">{item.category}</span>
                                <span className="text-sm text-gray-600">
                                    {item.amount.toFixed(2)}₺ ({item.percentage.toFixed(1)}%)
                                </span>
                            </div>
                            <ProgressBar
                                value={item.percentage}
                                color={index === 0 ? "#EF4444" : index === 1 ? "#F59E0B" : index === 2 ? "#10B981" : "#3B82F6"}
                                showValue={false}
                            />
                        </div>
                    ))}
                </div>
            </Card>

            {/* Gider Listesi */}
            <Card title="Gider Kayıtları">
                <div className="flex flex-wrap gap-2 justify-between items-center pb-3">
                    <div className="flex gap-2 items-center">
                        <span className="p-input-icon-left">
                            <i className="pi pi-search" />
                            <InputText
                                value={globalFilter}
                                onChange={(e) => setGlobalFilter(e.target.value)}
                                placeholder="Gider ara..."
                            />
                        </span>
                        <Dropdown
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.value)}
                            options={categoryOptions}
                            placeholder="Kategori Filtrele"
                            className="min-w-[12rem]"
                        />
                        <Calendar
                            value={dateFilter}
                            onChange={(e) => setDateFilter(e.value || null)}
                            placeholder="Tarih Filtrele"
                            showIcon
                            dateFormat="dd/mm/yy"
                        />
                    </div>
                    <div className="flex gap-2 items-center">
                        <ExportButton
                            onExport={() => {
                                exportExpensesToCsv(filteredExpenses);
                                toast.current?.show({
                                    severity: 'success',
                                    summary: 'Başarılı',
                                    detail: 'Gider listesi CSV formatında indirildi',
                                    life: 3000
                                });
                            }}
                            label="Excel İndir"
                        />
                        <Button
                            icon="pi pi-plus"
                            label="Yeni Gider"
                            onClick={openAdd}
                            severity="danger"
                        />
                    </div>
                </div>

                <DataTable
                    value={filteredExpenses}
                    paginator
                    rows={10}
                    stripedRows
                    tableStyle={{ minWidth: "100%" }}
                    sortMode="multiple"
                    removableSort
                    globalFilter={globalFilter}
                    globalFilterFields={["category", "description"]}
                    className="w-full"
                >
                    <Column field="category" header="Kategori" sortable filter style={{ minWidth: '120px' }} />
                    <Column
                        field="amount"
                        header="Tutar"
                        sortable
                        style={{ minWidth: '100px' }}
                        body={(rowData) => (
                            <span className="font-bold text-red-600 text-lg">{rowData.amount.toFixed(2)}₺</span>
                        )}
                    />
                    <Column
                        field="date"
                        header="Tarih"
                        sortable
                        style={{ minWidth: '100px' }}
                        body={(rowData) => new Date(rowData.date).toLocaleDateString('tr-TR')}
                    />
                    <Column
                        field="description"
                        header="Açıklama"
                        sortable
                        style={{ minWidth: '200px', maxWidth: '300px' }}
                        body={(rowData) => (
                            <div className="max-w-xs truncate block" title={rowData.description}>
                                {rowData.description}
                            </div>
                        )}
                    />
                    <Column
                        field="paymentMethod"
                        header="Ödeme Yöntemi"
                        sortable
                        style={{ minWidth: '120px' }}
                        body={(rowData) => (
                            <span className={`font-medium ${getPaymentMethodColor(rowData.paymentMethod)}`}>
                                {getPaymentMethodLabel(rowData.paymentMethod)}
                            </span>
                        )}
                    />
                    <Column
                        header="İşlemler"
                        style={{ minWidth: '120px' }}
                        body={(rowData) => (
                            <ExpenseActionButtons
                                item={rowData}
                                onEdit={openEdit}
                                onDelete={() => handleDelete(rowData, rowData.category)}
                                showView={false}
                            />
                        )}
                    />
                </DataTable>
            </Card>

            {/* Gider Ekleme/Düzenleme Dialog */}
            <Dialog
                header={dialogMode === "edit" ? "Gider Düzenle" : "Yeni Gider"}
                visible={showDialog}
                style={{ width: "500px" }}
                onHide={() => {
                    setShowDialog(false);
                    resetForm(defaultForm);
                }}
            >
                <div className="grid gap-4">
                    <div className="grid grid-cols-2 gap-3">
                        <span className="p-float-label">
                            <Dropdown
                                inputId="category"
                                value={form.category}
                                onChange={(e) => setForm({ ...form, category: e.value })}
                                options={categoryOptions.filter(c => c.value !== "")}
                                className="w-full"
                            />
                            <label htmlFor="category">Kategori</label>
                        </span>
                        <span className="p-float-label">
                            <InputNumber
                                inputId="amount"
                                value={form.amount}
                                onValueChange={(e) => setForm({ ...form, amount: Number(e.value) || 0 })}
                                className="w-full"
                                suffix=" ₺"
                                min={0}
                            />
                            <label htmlFor="amount">Tutar</label>
                        </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <span className="p-float-label">
                            <Calendar
                                inputId="date"
                                value={form.date ? new Date(form.date) : null}
                                onChange={(e) => setForm({ ...form, date: e.value?.toISOString().split('T')[0] || "" })}
                                className="w-full"
                                dateFormat="dd/mm/yy"
                            />
                            <label htmlFor="date">Tarih</label>
                        </span>
                        <span className="p-float-label">
                            <Dropdown
                                inputId="paymentMethod"
                                value={form.paymentMethod}
                                onChange={(e) => setForm({ ...form, paymentMethod: e.value })}
                                options={paymentMethodOptions}
                                className="w-full"
                            />
                            <label htmlFor="paymentMethod">Ödeme Yöntemi</label>
                        </span>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Açıklama</label>
                        <InputTextarea
                            value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                            rows={3}
                            className="w-full"
                            placeholder="Gider açıklaması..."
                        />
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
                            onClick={() => handleSave(validateForm, createExpense, updateExpense)}
                            severity="danger"
                        />
                    </div>
                </div>
            </Dialog>


        </div>
    );
}
