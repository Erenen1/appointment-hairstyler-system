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
import { Calendar } from "primereact/calendar";
import { Badge } from "primereact/badge";
import { Adisyon } from "./types";

interface BillsPageProps {
    adisyons?: Adisyon[];
}

export default function BillsPage({ adisyons: initialAdisyons = [] }: BillsPageProps) {
    const [adisyons, setAdisyons] = useState<Adisyon[]>(initialAdisyons);
    const [selected, setSelected] = useState<Adisyon | null>(null);
    const [globalFilter, setGlobalFilter] = useState<string>("");
    const [statusFilter, setStatusFilter] = useState<string>("");
    const [dateFilter, setDateFilter] = useState<Date | null>(null);

    const statusOptions = [
        { label: "Tümü", value: "" },
        { label: "Açık", value: "open" },
        { label: "Kapalı", value: "closed" },
        { label: "İptal", value: "cancelled" }
    ];

    const filteredAdisyons = useMemo(() => {
        return adisyons.filter((a) => {
            const okStatus = !statusFilter || a.status === statusFilter;
            const okDate = !dateFilter || new Date(a.openedAt).toDateString() === dateFilter.toDateString();
            const text = (a.customerName + " " + a.tableNumber).toLowerCase();
            const okSearch = !globalFilter || text.includes(globalFilter.toLowerCase());
            return okStatus && okDate && okSearch;
        });
    }, [adisyons, statusFilter, dateFilter, globalFilter]);

    // Grafik verileri
    const statusChart = useMemo(() => {
        const statusCounts = adisyons.reduce((acc, a) => {
            acc[a.status] = (acc[a.status] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        return {
            data: {
                labels: Object.keys(statusCounts).map(s =>
                    s === "open" ? "Açık" : s === "closed" ? "Kapalı" : "İptal"
                ),
                datasets: [{
                    data: Object.values(statusCounts),
                    backgroundColor: ["#22C55E", "#3B82F6", "#EF4444"]
                }]
            },
            options: {
                plugins: { legend: { position: "bottom" } },
                maintainAspectRatio: false
            }
        };
    }, [adisyons]);

    const dailyChart = useMemo(() => {
        const dailyTotals = adisyons.reduce((acc, a) => {
            const date = new Date(a.openedAt).toLocaleDateString('tr-TR');
            acc[date] = (acc[date] || 0) + a.total;
            return acc;
        }, {} as Record<string, number>);

        return {
            data: {
                labels: Object.keys(dailyTotals),
                datasets: [{
                    label: 'Günlük Ciro',
                    data: Object.values(dailyTotals),
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
    }, [adisyons]);

    const totalRevenue = adisyons.filter(a => a.status === "closed").reduce((sum, a) => sum + a.total, 0);
    const openAdisyons = adisyons.filter(a => a.status === "open").length;
    const todayRevenue = adisyons
        .filter(a => a.status === "closed" && new Date(a.openedAt).toDateString() === new Date().toDateString())
        .reduce((sum, a) => sum + a.total, 0);
    const avgAdisyon = adisyons.length > 0 ? totalRevenue / adisyons.filter(a => a.status === "closed").length : 0;

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "open": return <Badge value="Açık" severity="success" />;
            case "closed": return <Badge value="Kapalı" severity="info" />;
            case "cancelled": return <Badge value="İptal" severity="danger" />;
            default: return <Badge value={status} severity="secondary" />;
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-blue-100">
                <h1 className="text-3xl font-bold text-blue-800 mb-2">Adisyon Yönetimi</h1>
                <p className="text-blue-600">Masa ve sipariş takibi</p>
            </div>

            {/* Özet Kartları */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <div className="text-center">
                        <div className="text-4xl font-bold text-green-600 mb-2">{totalRevenue.toFixed(2)}₺</div>
                        <div className="text-lg font-semibold text-blue-800">Toplam Ciro</div>
                        <div className="text-sm text-blue-600">Kapanan adisyonlar</div>
                    </div>
                </Card>
                <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <div className="text-center">
                        <div className="text-4xl font-bold text-orange-600 mb-2">{openAdisyons}</div>
                        <div className="text-lg font-semibold text-blue-800">Açık Adisyon</div>
                        <div className="text-sm text-blue-600">Aktif masalar</div>
                    </div>
                </Card>
                <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <div className="text-center">
                        <div className="text-4xl font-bold text-blue-600 mb-2">{todayRevenue.toFixed(2)}₺</div>
                        <div className="text-lg font-semibold text-blue-800">Bugünkü Ciro</div>
                        <div className="text-sm text-blue-600">Günlük gelir</div>
                    </div>
                </Card>
                <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <div className="text-center">
                        <div className="text-4xl font-bold text-purple-600 mb-2">{avgAdisyon.toFixed(2)}₺</div>
                        <div className="text-lg font-semibold text-blue-800">Ortalama Adisyon</div>
                        <div className="text-sm text-blue-600">Masa başına</div>
                    </div>
                </Card>
            </div>

            {/* Grafikler */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card title="Adisyon Durumu" className="h-80">
                    <Chart type="doughnut" data={statusChart.data} options={statusChart.options} style={{ height: '280px' }} />
                </Card>
                <Card title="Günlük Ciro Trendi" className="h-80">
                    <Chart type="line" data={dailyChart.data} options={dailyChart.options} style={{ height: '280px' }} />
                </Card>
            </div>

            {/* Adisyon Listesi */}
            <Card title="Adisyon Listesi">
                <div className="flex flex-wrap gap-2 justify-between items-center pb-3">
                    <div className="flex gap-2 items-center">
                        <span className="p-input-icon-left">
                            <i className="pi pi-search" />
                            <InputText
                                value={globalFilter}
                                onChange={(e) => setGlobalFilter(e.target.value)}
                                placeholder="Masa/Müşteri ara..."
                            />
                        </span>
                        <Dropdown
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.value)}
                            options={statusOptions}
                            placeholder="Durum Filtrele"
                            className="min-w-[12rem]"
                        />
                        <Calendar
                            value={dateFilter}
                            onChange={(e) => setDateFilter(e.value || null)}
                            placeholder="Tarih Filtresi"
                            showIcon
                        />
                    </div>
                </div>

                <DataTable
                    value={filteredAdisyons}
                    paginator
                    rows={10}
                    stripedRows
                    tableStyle={{ minWidth: "100%" }}
                    selectionMode="single"
                    selection={selected}
                    onSelectionChange={(e) => setSelected(e.value as Adisyon)}
                    sortMode="multiple"
                    removableSort
                    globalFilter={globalFilter}
                    globalFilterFields={["customerName", "tableNumber"]}
                    className="w-full"
                >
                    <Column field="tableNumber" header="Masa No" sortable style={{ minWidth: '100px' }} />
                    <Column field="customerName" header="Müşteri" sortable style={{ minWidth: '150px' }} />
                    <Column
                        field="items"
                        header="Ürünler"
                        style={{ minWidth: '200px' }}
                        body={(rowData) => (
                            <div className="space-y-1">
                                {rowData.items.slice(0, 3).map((item: { serviceName: string }, index: number) => (
                                    <span key={index} className="block text-sm truncate">
                                        {item.serviceName}
                                    </span>
                                ))}
                                {rowData.items.length > 3 && (
                                    <span className="text-xs text-gray-500">+{rowData.items.length - 3} daha...</span>
                                )}
                            </div>
                        )}
                    />
                    <Column
                        field="total"
                        header="Toplam"
                        sortable
                        style={{ minWidth: '120px' }}
                        body={(rowData) => `${rowData.total.toFixed(2)}₺`}
                    />
                    <Column
                        field="status"
                        header="Durum"
                        style={{ minWidth: '100px' }}
                        body={(rowData) => getStatusBadge(rowData.status)}
                    />
                    <Column
                        field="openedAt"
                        header="Açılış"
                        sortable
                        style={{ minWidth: '150px' }}
                        body={(rowData) => new Date(rowData.openedAt).toLocaleString('tr-TR')}
                    />
                    <Column
                        header="İşlemler"
                        style={{ minWidth: '150px' }}
                        body={(rowData) => (
                            <div className="flex gap-2">
                                <Button
                                    icon="pi pi-eye"
                                    size="small"
                                    outlined
                                />
                                <Button
                                    icon="pi pi-pencil"
                                    size="small"
                                    outlined
                                    disabled={rowData.status === "closed"}
                                />
                                <Button
                                    icon="pi pi-check"
                                    size="small"
                                    severity="success"
                                    disabled={rowData.status !== "open"}
                                />
                            </div>
                        )}
                    />
                </DataTable>
            </Card>
        </div>
    );
}