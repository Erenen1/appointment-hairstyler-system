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

interface ExpensePageProps {
    expenses?: Expense[];
}

export default function ExpensePage({ expenses: initialExpenses = [] }: ExpensePageProps) {
    const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);
    const [globalFilter, setGlobalFilter] = useState<string>("");
    const [categoryFilter, setCategoryFilter] = useState<string>("");
    const [dateFilter, setDateFilter] = useState<Date | null>(null);
    const [showDialog, setShowDialog] = useState(false);
    const [form, setForm] = useState<Partial<Expense>>({
        category: "",
        amount: 0,
        date: new Date().toISOString().split('T')[0],
        description: "",
        paymentMethod: "bank"
    });

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
        return expenses.filter((e) => {
            const okCategory = !categoryFilter || e.category === categoryFilter;
            const okDate = !dateFilter || new Date(e.date).toDateString() === dateFilter.toDateString();
            const text = (e.category + " " + e.description).toLowerCase();
            const okSearch = !globalFilter || text.includes(globalFilter.toLowerCase());
            return okCategory && okDate && okSearch;
        });
    }, [expenses, categoryFilter, dateFilter, globalFilter]);

    // Grafik verileri
    const categoryChart = useMemo(() => {
        const categoryData = expenses.reduce((acc, e) => {
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
    }, [expenses]);

    const monthlyChart = useMemo(() => {
        const monthlyData = expenses.reduce((acc, e) => {
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
    }, [expenses]);

    const paymentMethodChart = useMemo(() => {
        const methodData = expenses.reduce((acc, e) => {
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
    }, [expenses]);

    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
    const avgExpenses = totalExpenses / expenses.length;
    const maxExpenses = Math.max(...expenses.map(e => e.amount));

    // Kategori bazlı yüzde hesaplama
    const categoryPercentages = useMemo(() => {
        const categoryData = expenses.reduce((acc, e) => {
            acc[e.category] = (acc[e.category] || 0) + e.amount;
            return acc;
        }, {} as Record<string, number>);

        return Object.entries(categoryData).map(([category, amount]) => ({
            category,
            amount,
            percentage: (amount / totalExpenses) * 100
        })).sort((a, b) => b.percentage - a.percentage);
    }, [expenses, totalExpenses]);

    const openAddDialog = () => {
        setForm({
            category: "",
            amount: 0,
            date: new Date().toISOString().split('T')[0],
            description: "",
            paymentMethod: "bank"
        });
        setShowDialog(true);
    };

    const openEditDialog = (expense: Expense) => {
        setForm(expense);
        setShowDialog(true);
    };

    const saveExpense = () => {
        if (!form.category || !form.amount) return;

        const newExpense: Expense = {
            id: form.id || Math.max(0, ...expenses.map(e => e.id)) + 1,
            category: form.category,
            amount: form.amount || 0,
            date: form.date || new Date().toISOString().split('T')[0],
            description: form.description || "",
            paymentMethod: form.paymentMethod || "bank"
        };

        if (form.id) {
            setExpenses(prev => prev.map(e => e.id === form.id ? newExpense : e));
        } else {
            setExpenses(prev => [...prev, newExpense]);
        }

        setShowDialog(false);
        setForm({});
    };

    const deleteExpense = (expense: Expense) => {
        setExpenses(prev => prev.filter(e => e.id !== expense.id));
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
            {/* Özet Kartları */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
                    <div className="text-center">
                        <div className="text-2xl font-bold">{totalExpenses.toFixed(2)}₺</div>
                        <div className="text-sm opacity-90">Toplam Gider</div>
                    </div>
                </Card>
                <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                    <div className="text-center">
                        <div className="text-2xl font-bold">{avgExpenses.toFixed(2)}₺</div>
                        <div className="text-sm opacity-90">Ortalama Gider</div>
                    </div>
                </Card>
                <Card className="bg-gradient-to-r from-pink-500 to-pink-600 text-white">
                    <div className="text-center">
                        <div className="text-2xl font-bold">{maxExpenses.toFixed(2)}₺</div>
                        <div className="text-sm opacity-90">En Yüksek Gider</div>
                    </div>
                </Card>
                <Card className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white">
                    <div className="text-center">
                        <div className="text-2xl font-bold">{expenses.length}</div>
                        <div className="text-sm opacity-90">Toplam Kayıt</div>
                    </div>
                </Card>
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
                        <Button
                            icon="pi pi-download"
                            label="Excel İndir"
                            onClick={() => {
                                // CSV Export Function
                                const headers = [
                                    "ID", "Kategori", "Tutar", "Tarih", "Açıklama", "Ödeme Yöntemi"
                                ];

                                const csvData = filteredExpenses.map(expense => [
                                    expense.id,
                                    expense.category,
                                    expense.amount.toFixed(2) + " ₺",
                                    new Date(expense.date).toLocaleDateString('tr-TR'),
                                    expense.description,
                                    getPaymentMethodLabel(expense.paymentMethod)
                                ]);

                                const csvContent = [headers, ...csvData]
                                    .map(row => row.map(field => `"${field}"`).join(','))
                                    .join('\n');

                                const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                                const link = document.createElement('a');
                                const url = URL.createObjectURL(blob);
                                link.setAttribute('href', url);
                                link.setAttribute('download', `gider_listesi_${new Date().toISOString().split('T')[0]}.csv`);
                                link.style.visibility = 'hidden';
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                            }}
                            className="bg-green-600 hover:bg-green-700 border-green-600"
                        />
                        <Button
                            icon="pi pi-plus"
                            label="Yeni Gider"
                            onClick={openAddDialog}
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
                            <div className="flex gap-2">
                                <Button
                                    icon="pi pi-pencil"
                                    size="small"
                                    severity="warning"
                                    text
                                    tooltip="Düzenle"
                                    onClick={() => openEditDialog(rowData)}
                                />
                                <Button
                                    icon="pi pi-trash"
                                    size="small"
                                    severity="danger"
                                    text
                                    tooltip="Sil"
                                    onClick={() => deleteExpense(rowData)}
                                />
                            </div>
                        )}
                    />
                </DataTable>
            </Card>

            {/* Gider Ekleme/Düzenleme Dialog */}
            <Dialog
                header={form.id ? "Gider Düzenle" : "Yeni Gider"}
                visible={showDialog}
                style={{ width: "500px" }}
                onHide={() => setShowDialog(false)}
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
                            onClick={() => setShowDialog(false)}
                        />
                        <Button
                            label="Kaydet"
                            icon="pi pi-check"
                            onClick={saveExpense}
                            severity="danger"
                        />
                    </div>
                </div>
            </Dialog>


        </div>
    );
}
