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
import { Dialog } from "primereact/dialog";
import { InputNumber } from "primereact/inputnumber";
import { useMemo, useState } from "react";
import { Customer } from "./types";

interface CustomersPageProps {
    customers?: Customer[];
}

export default function CustomersPage({ customers: initialCustomers = [] }: CustomersPageProps) {
    const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
    const [selected, setSelected] = useState<Customer | null>(null);
    const [globalFilter, setGlobalFilter] = useState<string>("");
    const [priorityFilter, setPriorityFilter] = useState<string[]>([]);
    const [typeFilter, setTypeFilter] = useState<string[]>([]);
    const [showDialog, setShowDialog] = useState(false);

    const priorityOptions = [
        { label: "Yüksek", value: "high" },
        { label: "Orta", value: "medium" },
        { label: "Düşük", value: "low" }
    ];

    const typeOptions = [
        { label: "Satılık", value: "Satılık" },
        { label: "Kiralık", value: "Kiralık" }
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
        const configs: Record<string, any> = {
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

    // Stats
    const totalCustomers = customers.length;
    const activeCustomers = customers.filter(c => c.isActive).length;
    const highPriorityCustomers = customers.filter(c => c.priority === "high").length;
    const totalBudget = customers.reduce((sum, c) => sum + c.budget, 0);

    return (
        <div className="p-4 md:p-6 space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{totalCustomers}</div>
                    <div className="text-gray-600">Toplam Müşteri</div>
                </Card>
                <Card className="text-center">
                    <div className="text-2xl font-bold text-green-600">{activeCustomers}</div>
                    <div className="text-gray-600">Aktif Müşteri</div>
                </Card>
                <Card className="text-center">
                    <div className="text-2xl font-bold text-red-600">{highPriorityCustomers}</div>
                    <div className="text-gray-600">Öncelikli</div>
                </Card>
                <Card className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{(totalBudget / 1000000).toFixed(1)}M ₺</div>
                    <div className="text-gray-600">Toplam Bütçe</div>
                </Card>
            </div>

            {/* Customer Management */}
            <Card title="Müşteri Yönetimi">
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
                        <MultiSelect
                            display="chip"
                            value={priorityFilter}
                            onChange={(e) => setPriorityFilter(e.value)}
                            options={priorityOptions}
                            placeholder="Öncelik"
                            className="min-w-[8rem]"
                        />
                        <MultiSelect
                            display="chip"
                            value={typeFilter}
                            onChange={(e) => setTypeFilter(e.value)}
                            options={typeOptions}
                            placeholder="Tür"
                            className="min-w-[8rem]"
                        />
                    </div>
                    <div className="flex gap-2">
                        <Button icon="pi pi-plus" label="Yeni Müşteri" />
                        <Button icon="pi pi-phone" label="Ara" disabled={!selected} />
                        <Button icon="pi pi-envelope" label="Mail Gönder" disabled={!selected} />
                    </div>
                </div>

                <DataTable
                    value={filteredCustomers}
                    paginator
                    rows={10}
                    stripedRows
                    tableStyle={{ minWidth: "100%" }}
                    selectionMode="single"
                    selection={selected}
                    onSelectionChange={(e) => setSelected(e.value as Customer)}
                    sortMode="multiple"
                    removableSort
                    globalFilter={globalFilter}
                    globalFilterFields={["fullName", "phone", "email", "profession"]}
                    className="w-full"
                >
                    <Column field="fullName" header="Ad Soyad" sortable style={{ minWidth: '150px' }} />
                    <Column field="phone" header="Telefon" sortable style={{ minWidth: '120px' }} />
                    <Column field="email" header="E-posta" sortable style={{ minWidth: '180px' }} />
                    <Column field="profession" header="Meslek" sortable style={{ minWidth: '120px' }} />
                    <Column 
                        field="preferredType" 
                        header="İlgi Alanı" 
                        sortable 
                        style={{ minWidth: '100px' }} 
                        body={(rowData) => getTypeTag(rowData.preferredType)} 
                    />
                    <Column 
                        field="budget" 
                        header="Bütçe" 
                        sortable 
                        style={{ minWidth: '120px' }} 
                        body={(rowData) => formatBudget(rowData.budget, rowData.preferredType)} 
                    />
                    <Column 
                        field="preferredCategory" 
                        header="Kategori" 
                        sortable 
                        style={{ minWidth: '100px' }} 
                    />
                    <Column 
                        field="priority" 
                        header="Öncelik" 
                        sortable 
                        style={{ minWidth: '100px' }} 
                        body={(rowData) => getPriorityBadge(rowData.priority)} 
                    />
                    <Column 
                        field="isActive" 
                        header="Durum" 
                        style={{ minWidth: '80px' }} 
                        body={(rowData) => (
                            <Tag 
                                value={rowData.isActive ? "Aktif" : "Pasif"} 
                                severity={getStatusSeverity(rowData.isActive)} 
                            />
                        )} 
                    />
                    <Column 
                        field="lastContact" 
                        header="Son İletişim" 
                        sortable 
                        style={{ minWidth: '120px' }} 
                        body={(rowData) => new Date(rowData.lastContact).toLocaleDateString('tr-TR')} 
                    />
                    <Column 
                        field="favoriteProperties" 
                        header="Favori" 
                        style={{ minWidth: '80px' }} 
                        body={(rowData) => `${rowData.favoriteProperties.length} İlan`} 
                    />
                </DataTable>
            </Card>

            {/* Customer Detail Dialog */}
            <Dialog
                header="Müşteri Detayı"
                visible={showDialog}
                style={{ width: "600px" }}
                onHide={() => setShowDialog(false)}
            >
                {selected && (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <strong>Ad Soyad:</strong> {selected.fullName}
                            </div>
                            <div>
                                <strong>Telefon:</strong> {selected.phone}
                            </div>
                            <div>
                                <strong>E-posta:</strong> {selected.email}
                            </div>
                            <div>
                                <strong>Meslek:</strong> {selected.profession}
                            </div>
                            <div>
                                <strong>Bütçe:</strong> {formatBudget(selected.budget, selected.preferredType)}
                            </div>
                            <div>
                                <strong>İlgi Alanı:</strong> {selected.preferredType}
                            </div>
                        </div>
                        
                        <div>
                            <strong>Tercih Edilen Bölgeler:</strong>
                            <div className="flex gap-1 mt-1">
                                {selected.preferredDistricts.map((district, index) => (
                                    <Tag key={index} value={district} severity="info" />
                                ))}
                            </div>
                        </div>

                        <div>
                            <strong>Gereksinimler:</strong>
                            <div className="flex gap-1 mt-1">
                                {selected.requirements.map((req, index) => (
                                    <Tag key={index} value={req} severity="secondary" />
                                ))}
                            </div>
                        </div>

                        {selected.notes && (
                            <div>
                                <strong>Notlar:</strong>
                                <p className="mt-1 text-gray-700">{selected.notes}</p>
                            </div>
                        )}
                    </div>
                )}
            </Dialog>
        </div>
    );
}

