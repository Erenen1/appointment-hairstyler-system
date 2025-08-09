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
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { MultiSelect } from "primereact/multiselect";
import { Calendar } from "primereact/calendar";
import { InputTextarea } from 'primereact/inputtextarea';
import { Tag } from "primereact/tag";
import { Income, IncomeForm } from "./types";

interface IncomePageProps {
    income?: Income[];
}

export default function IncomePage({ income: initialIncome = [] }: IncomePageProps) {
    const [incomeState, setIncomeState] = useState<Income[]>(initialIncome);
    const [selected, setSelected] = useState<Income | null>(null);
    const [globalFilter, setGlobalFilter] = useState<string>("");
    const [categoryFilter, setCategoryFilter] = useState<string[]>([]);
    const [sourceFilter, setSourceFilter] = useState<string[]>([]);
    const [dateFilter, setDateFilter] = useState<Date | null>(null);
    const [showDialog, setShowDialog] = useState(false);
    const [form, setForm] = useState<IncomeForm>({
        category: "",
        amount: 0,
        date: new Date().toISOString().split('T')[0],
        description: "",
        paymentMethod: "cash",
        source: "service_sales"
    });

    const filteredIncome = useMemo(() => {
        return incomeState.filter((i) => {
            const okCategory = categoryFilter.length === 0 || categoryFilter.includes(i.category);
            const okSource = sourceFilter.length === 0 || sourceFilter.includes(i.source);
            const okDate = !dateFilter || new Date(i.date).toDateString() === dateFilter.toDateString();
            const text = (i.category + " " + i.description + " " + i.paymentMethod).toLowerCase();
            const okSearch = !globalFilter || text.includes(globalFilter.toLowerCase());
            return okCategory && okSource && okDate && okSearch;
        });
    }, [incomeState, categoryFilter, sourceFilter, dateFilter, globalFilter]);

    const chartData = useMemo(() => {
        const categoryTotals = incomeState.reduce((acc, income) => {
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
    }, [incomeState]);

    const monthlyData = useMemo(() => {
        const monthlyTotals = incomeState.reduce((acc, income) => {
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
    }, [incomeState]);

    const openAdd = () => {
        setForm({
            category: "",
            amount: 0,
            date: new Date().toISOString().split('T')[0],
            description: "",
            paymentMethod: "cash",
            source: "service_sales"
        });
        setShowDialog(true);
    };

    const openEdit = () => {
        if (!selected) return;
        setForm({
            id: selected.id,
            category: selected.category,
            amount: selected.amount,
            date: selected.date,
            description: selected.description,
            paymentMethod: selected.paymentMethod,
            source: selected.source
        });
        setShowDialog(true);
    };

    const onDelete = () => {
        if (!selected) return;
        setIncomeState((arr) => arr.filter((i) => i.id !== selected.id));
        setSelected(null);
    };

    const onSave = () => {
        if (!form.category.trim() || form.amount <= 0 || !form.description.trim()) return;

        if (form.id) {
            setIncomeState((arr) => arr.map((i) => (i.id === form.id ? {
                ...i,
                category: form.category,
                amount: form.amount,
                date: form.date,
                description: form.description,
                paymentMethod: form.paymentMethod,
                source: form.source
            } : i)));
        } else {
            const newId = Math.max(0, ...incomeState.map((i) => i.id)) + 1;
            setIncomeState((arr) => [...arr, {
                id: newId,
                category: form.category,
                amount: form.amount,
                date: form.date,
                description: form.description,
                paymentMethod: form.paymentMethod,
                source: form.source
            }]);
        }
        setShowDialog(false);
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

    const totalIncome = incomeState.reduce((sum, i) => sum + i.amount, 0);
    const thisMonthIncome = incomeState
        .filter(i => new Date(i.date).getMonth() === new Date().getMonth())
        .reduce((sum, i) => sum + i.amount, 0);
    const todayIncome = incomeState
        .filter(i => new Date(i.date).toDateString() === new Date().toDateString())
        .reduce((sum, i) => sum + i.amount, 0);

    const categories = Array.from(new Set(incomeState.map(i => i.category)));
    const sources = Array.from(new Set(incomeState.map(i => i.source)));
    const paymentMethods = [
        { label: "Nakit", value: "cash" },
        { label: "Kart", value: "card" },
        { label: "Banka", value: "bank" }
    ];

    return (
        <div className="p-4 md:p-6 space-y-6">
            {/* Özet Kartları */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                        {totalIncome.toFixed(0)}₺
                    </div>
                    <div className="text-sm text-gray-600">Toplam Gelir</div>
                </Card>
                <Card className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                        {thisMonthIncome.toFixed(0)}₺
                    </div>
                    <div className="text-sm text-gray-600">Bu Ay</div>
                </Card>
                <Card className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                        {todayIncome.toFixed(0)}₺
                    </div>
                    <div className="text-sm text-gray-600">Bugün</div>
                </Card>
                <Card className="text-center">
                    <div className="text-2xl font-bold text-orange-600">
                        {incomeState.length}
                    </div>
                    <div className="text-sm text-gray-600">Toplam Kayıt</div>
                </Card>
            </div>

            {/* Grafikler */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card title="Kategori Bazlı Gelir Dağılımı">
                    <div style={{ height: 300 }}>
                        <Chart type="doughnut" data={chartData.data} options={chartData.options} />
                    </div>
                </Card>
                <Card title="Aylık Gelir Trendi">
                    <div style={{ height: 300 }}>
                        <Chart type="line" data={monthlyData.data} options={monthlyData.options} />
                    </div>
                </Card>
            </div>

            {/* Gelir Listesi */}
            <Card title="Gelir Yönetimi">
                <div className="flex flex-wrap gap-2 justify-between items-center pb-3">
                    <div className="flex gap-2 items-center">
                        <span className="p-input-icon-left">
                            <i className="pi pi-search" />
                            <InputText value={globalFilter} onChange={(e) => setGlobalFilter(e.target.value)} placeholder="Ara..." />
                        </span>
                        <MultiSelect
                            display="chip"
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.value)}
                            options={categories.map(c => ({ label: c, value: c }))}
                            placeholder="Kategoriler"
                            className="min-w-[12rem]"
                        />
                        <MultiSelect
                            display="chip"
                            value={sourceFilter}
                            onChange={(e) => setSourceFilter(e.value)}
                            options={sources.map(s => ({ label: getSourceLabel(s), value: s }))}
                            placeholder="Kaynaklar"
                            className="min-w-[12rem]"
                        />
                        <Calendar
                            value={dateFilter}
                            onChange={(e) => setDateFilter(e.value || null)}
                            placeholder="Tarih Filtresi"
                            showIcon
                        />
                    </div>
                    <div className="flex gap-2">
                        <Button icon="pi pi-plus" label="Yeni Gelir" onClick={openAdd} />
                        <Button icon="pi pi-pencil" label="Düzenle" onClick={openEdit} disabled={!selected} />
                        <Button icon="pi pi-trash" label="Sil" severity="danger" onClick={onDelete} disabled={!selected} />
                    </div>
                </div>

                <DataTable
                    value={filteredIncome}
                    paginator
                    rows={10}
                    stripedRows
                    tableStyle={{ minWidth: "100%" }}
                    selectionMode="single"
                    selection={selected}
                    onSelectionChange={(e) => setSelected(e.value as Income)}
                    sortMode="multiple"
                    removableSort
                    globalFilter={globalFilter}
                    globalFilterFields={["category", "description", "paymentMethod"]}
                    className="w-full"
                >
                    <Column field="category" header="Kategori" sortable style={{ minWidth: '120px' }} />
                    <Column field="amount" header="Tutar" sortable style={{ minWidth: '100px' }} body={(rowData) => `${rowData.amount.toFixed(2)}₺`} />
                    <Column field="description" header="Açıklama" sortable style={{ minWidth: '200px', maxWidth: '300px' }} />
                    <Column field="date" header="Tarih" sortable style={{ minWidth: '100px' }} body={(rowData) => new Date(rowData.date).toLocaleDateString('tr-TR')} />
                    <Column field="paymentMethod" header="Ödeme Yöntemi" sortable style={{ minWidth: '120px' }} body={(rowData) => (
                        <Tag value={getPaymentMethodLabel(rowData.paymentMethod)} severity={getPaymentMethodSeverity(rowData.paymentMethod)} />
                    )} />
                    <Column field="source" header="Kaynak" sortable style={{ minWidth: '120px' }} body={(rowData) => (
                        <Tag value={getSourceLabel(rowData.source)} severity={getSourceSeverity(rowData.source)} />
                    )} />
                </DataTable>
            </Card>

            {/* Gelir Ekleme/Düzenleme Dialog */}
            <Dialog
                header={form.id ? "Gelir Düzenle" : "Yeni Gelir"}
                visible={showDialog}
                style={{ width: "600px" }}
                onHide={() => setShowDialog(false)}
            >
                <div className="grid gap-4">
                    <span className="p-float-label">
                        <InputText
                            id="category"
                            value={form.category}
                            onChange={(e) => setForm({ ...form, category: e.target.value })}
                            className="w-full"
                        />
                        <label htmlFor="category">Kategori</label>
                    </span>

                    <span className="p-float-label">
                        <InputNumber
                            inputId="amount"
                            value={form.amount}
                            onValueChange={(e) => setForm({ ...form, amount: Number(e.value || 0) })}
                            className="w-full"
                            suffix=" ₺"
                            min={0}
                            mode="decimal"
                        />
                        <label htmlFor="amount">Tutar</label>
                    </span>

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
                        <InputTextarea
                            id="description"
                            value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                            className="w-full"
                            rows={3}
                        />
                        <label htmlFor="description">Açıklama</label>
                    </span>

                    <div className="grid grid-cols-2 gap-3">
                        <span className="p-float-label">
                            <Dropdown
                                inputId="paymentMethod"
                                value={form.paymentMethod}
                                onChange={(e) => setForm({ ...form, paymentMethod: e.value })}
                                options={paymentMethods}
                                className="w-full"
                            />
                            <label htmlFor="paymentMethod">Ödeme Yöntemi</label>
                        </span>
                        <span className="p-float-label">
                            <Dropdown
                                inputId="source"
                                value={form.source}
                                onChange={(e) => setForm({ ...form, source: e.value })}
                                options={[
                                    { label: "Hizmet Satışı", value: "service_sales" },
                                    { label: "Ürün Satışı", value: "product_sales" },
                                    { label: "Diğer", value: "other" }
                                ]}
                                className="w-full"
                            />
                            <label htmlFor="source">Kaynak</label>
                        </span>
                    </div>

                    <div className="flex justify-end gap-2">
                        <Button label="Vazgeç" outlined onClick={() => setShowDialog(false)} />
                        <Button label="Kaydet" icon="pi pi-check" onClick={onSave} />
                    </div>
                </div>
            </Dialog>
        </div>
    );
}
