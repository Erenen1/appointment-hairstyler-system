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
import { Badge } from "primereact/badge";
import { CurrentAccount } from "./types";
import { ExportButton } from "../../components/ui/ExportButton";
import { exportCurrentAccountsToCsv } from "../../lib/exportUtils";

interface CurrentAccountsPageProps {
    customers?: CurrentAccount[];
}

export default function CurrentAccountsPage({ customers: initialCustomers = [] }: CurrentAccountsPageProps) {
    const [customers, setCustomers] = useState<CurrentAccount[]>(initialCustomers);
    const [selectedCustomer, setSelectedCustomer] = useState<CurrentAccount | null>(null);
    const [globalFilter, setGlobalFilter] = useState<string>("");
    const [statusFilter, setStatusFilter] = useState<string>("");

    const [showPaymentDialog, setShowPaymentDialog] = useState(false);
    const [paymentAmount, setPaymentAmount] = useState<number>(0);

    const statusOptions = [
        { label: "Tümü", value: "" },
        { label: "Aktif", value: "active" },
        { label: "Gecikmiş", value: "overdue" },
        { label: "Ödenmiş", value: "paid" }
    ];

    const filteredCustomers = useMemo(() => {
        return customers.filter((c) => {
            const okStatus = !statusFilter || c.status === statusFilter;
            const text = (c.name + " " + c.phone + " " + c.email).toLowerCase();
            const okSearch = !globalFilter || text.includes(globalFilter.toLowerCase());
            return okStatus && okSearch;
        });
    }, [customers, statusFilter, globalFilter]);

    // Grafik verileri
    const balanceChart = useMemo(() => {
        const positiveBalances = customers.filter(c => c.balance > 0);
        const negativeBalances = customers.filter(c => c.balance < 0);
        const zeroBalances = customers.filter(c => c.balance === 0);

        return {
            data: {
                labels: ["Pozitif Bakiye", "Negatif Bakiye", "Sıfır Bakiye"],
                datasets: [{
                    data: [positiveBalances.length, negativeBalances.length, zeroBalances.length],
                    backgroundColor: ["#22C55E", "#EF4444", "#6B7280"]
                }]
            },
            options: {
                plugins: { legend: { position: "bottom" } },
                maintainAspectRatio: false
            }
        };
    }, [customers]);

    const statusChart = useMemo(() => {
        const statusCounts = customers.reduce((acc, c) => {
            acc[c.status] = (acc[c.status] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        return {
            data: {
                labels: Object.keys(statusCounts).map(s =>
                    s === "active" ? "Aktif" : s === "overdue" ? "Gecikmiş" : "Ödenmiş"
                ),
                datasets: [{
                    data: Object.values(statusCounts),
                    backgroundColor: ["#22C55E", "#F59E0B", "#3B82F6"]
                }]
            },
            options: {
                plugins: { legend: { position: "bottom" } },
                maintainAspectRatio: false
            }
        };
    }, [customers]);

    const totalBalance = customers.reduce((sum, c) => sum + c.balance, 0);
    const positiveBalance = customers.filter(c => c.balance > 0).reduce((sum, c) => sum + c.balance, 0);
    const negativeBalance = customers.filter(c => c.balance < 0).reduce((sum, c) => sum + c.balance, 0);

    const openPaymentDialog = (customer: CurrentAccount) => {
        setSelectedCustomer(customer);
        setPaymentAmount(Math.abs(customer.balance));
        setShowPaymentDialog(true);
    };

    const processPayment = () => {
        if (!selectedCustomer || paymentAmount <= 0) return;

        setCustomers(prev => prev.map(c =>
            c.id === selectedCustomer.id
                ? { ...c, balance: c.balance + paymentAmount, status: "paid" }
                : c
        ));

        setShowPaymentDialog(false);
        setSelectedCustomer(null);
        setPaymentAmount(0);
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "active": return <Badge value="Aktif" severity="success" />;
            case "overdue": return <Badge value="Gecikmiş" severity="warning" />;
            case "paid": return <Badge value="Ödenmiş" severity="info" />;
            default: return <Badge value={status} severity="secondary" />;
        }
    };

    const getBalanceColor = (balance: number) => {
        if (balance > 0) return "text-green-600";
        if (balance < 0) return "text-red-600";
        return "text-gray-600";
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-blue-100">
                <h1 className="text-3xl font-bold text-blue-800 mb-2">Cari Hesaplar</h1>
                <p className="text-blue-600">Müşteri bakiyeleri ve ödeme takibi</p>
            </div>

            {/* Özet Kartları */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <div className="text-center">
                        <div className="text-4xl font-bold text-blue-600 mb-2">{customers.length}</div>
                        <div className="text-lg font-semibold text-blue-800">Toplam Müşteri</div>
                        <div className="text-sm text-blue-600">Kayıtlı müşteri sayısı</div>
                    </div>
                </Card>
                <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <div className="text-center">
                        <div className="text-4xl font-bold text-green-600 mb-2">{positiveBalance.toFixed(2)}₺</div>
                        <div className="text-lg font-semibold text-blue-800">Pozitif Bakiye</div>
                        <div className="text-sm text-blue-600">Alacak bakiyeleri</div>
                    </div>
                </Card>
                <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <div className="text-center">
                        <div className="text-4xl font-bold text-red-600 mb-2">{Math.abs(negativeBalance).toFixed(2)}₺</div>
                        <div className="text-lg font-semibold text-blue-800">Negatif Bakiye</div>
                        <div className="text-sm text-blue-600">Borç bakiyeleri</div>
                    </div>
                </Card>
                <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <div className="text-center">
                        <div className="text-4xl font-bold text-blue-600 mb-2">{totalBalance.toFixed(2)}₺</div>
                        <div className="text-lg font-semibold text-blue-800">Net Bakiye</div>
                        <div className="text-sm text-blue-600">Genel durum</div>
                    </div>
                </Card>
            </div>

            {/* Grafikler */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card title="Bakiye Dağılımı" className="h-80">
                    <Chart type="doughnut" data={balanceChart.data} options={balanceChart.options} style={{ height: '280px' }} />
                </Card>
                <Card title="Durum Dağılımı" className="h-80">
                    <Chart type="doughnut" data={statusChart.data} options={statusChart.options} style={{ height: '280px' }} />
                </Card>
            </div>

            {/* Müşteri Listesi */}
            <Card title="Müşteri Hesapları">
                <div className="flex flex-wrap gap-2 justify-between items-center pb-3">
                    <div className="flex gap-2 items-center">
                        <span className="p-input-icon-left">
                            <i className="pi pi-search" />
                            <InputText
                                value={globalFilter}
                                onChange={(e) => setGlobalFilter(e.target.value)}
                                placeholder="Müşteri ara..."
                            />
                        </span>
                        <Dropdown
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.value)}
                            options={statusOptions}
                            placeholder="Durum Filtrele"
                            className="min-w-[12rem]"
                        />
                    </div>
                    <div className="flex gap-2">
                        <ExportButton
                            onExport={() => {
                                exportCurrentAccountsToCsv(filteredCustomers);
                                // Simple success feedback
                                alert('Cari hesaplar CSV formatında indirildi');
                            }}
                            label="Excel İndir"
                        />
                    </div>
                </div>

                <DataTable
                    value={filteredCustomers}
                    paginator
                    rows={10}
                    stripedRows
                    tableStyle={{ minWidth: "100%" }}
                    selectionMode="single"
                    selection={selectedCustomer}
                    onSelectionChange={(e) => setSelectedCustomer(e.value as CurrentAccount)}
                    sortMode="multiple"
                    removableSort
                    globalFilter={globalFilter}
                    globalFilterFields={["name", "phone", "email"]}
                    className="w-full"
                >
                    <Column field="name" header="Müşteri Adı" sortable filter style={{ minWidth: '150px' }} />
                    <Column field="phone" header="Telefon" sortable style={{ minWidth: '120px' }} />
                    <Column field="email" header="E-posta" sortable style={{ minWidth: '200px', maxWidth: '250px' }} />
                    <Column
                        field="balance"
                        header="Bakiye"
                        sortable
                        style={{ minWidth: '120px' }}
                        body={(rowData) => (
                            <span className={`font-bold ${getBalanceColor(rowData.balance)}`}>
                                {rowData.balance.toFixed(2)}₺
                            </span>
                        )}
                    />
                    <Column
                        field="status"
                        header="Durum"
                        style={{ minWidth: '100px' }}
                        body={(rowData) => getStatusBadge(rowData.status)}
                    />
                    <Column
                        field="lastTransaction"
                        header="Son İşlem"
                        sortable
                        style={{ minWidth: '120px' }}
                        body={(rowData) => new Date(rowData.lastTransaction).toLocaleDateString('tr-TR')}
                    />
                    <Column
                        header="İşlemler"
                        style={{ minWidth: '150px' }}
                        body={(rowData) => (
                            <div className="flex gap-2">
                                <Button
                                    icon="pi pi-money-bill"
                                    size="small"
                                    severity="success"
                                    onClick={() => openPaymentDialog(rowData)}
                                    disabled={rowData.balance >= 0}
                                />
                                <Button
                                    icon="pi pi-eye"
                                    size="small"
                                    outlined
                                />
                                <Button
                                    icon="pi pi-pencil"
                                    size="small"
                                    outlined
                                />
                            </div>
                        )}
                    />
                </DataTable>
            </Card>

            {/* Ödeme Dialog */}
            <Dialog
                header="Ödeme Al"
                visible={showPaymentDialog}
                style={{ width: "400px" }}
                onHide={() => setShowPaymentDialog(false)}
            >
                <div className="space-y-4">
                    <div className="text-center">
                        <div className="text-lg font-semibold">{selectedCustomer?.name}</div>
                        <div className="text-sm text-gray-600">Mevcut Bakiye: {selectedCustomer?.balance.toFixed(2)}₺</div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Ödeme Tutarı</label>
                        <InputNumber
                            value={paymentAmount}
                            onValueChange={(e) => setPaymentAmount(Number(e.value) || 0)}
                            className="w-full"
                            suffix=" ₺"
                            min={0}
                            mode="decimal"
                        />
                    </div>

                    <div className="flex justify-end gap-2">
                        <Button
                            label="Vazgeç"
                            outlined
                            onClick={() => setShowPaymentDialog(false)}
                        />
                        <Button
                            label="Ödemeyi Al"
                            icon="pi pi-check"
                            onClick={processPayment}
                            severity="success"
                        />
                    </div>
                </div>
            </Dialog>
        </div>
    );
}