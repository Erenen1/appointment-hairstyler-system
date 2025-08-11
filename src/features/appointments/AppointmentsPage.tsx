"use client";

import { Card } from "primereact/card";
import { Chart } from "primereact/chart";
import "chart.js/auto";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { useMemo, useState } from "react";
import { SelectButton } from "primereact/selectbutton";
import { parseISO, startOfISOWeek, startOfMonth, startOfYear, format, getISOWeek } from "date-fns";
import { Appointment, AppointmentStatus } from "./types";
import { Service } from "../services/types";
import { Staff } from "../../service/dataService";
import AppointmentForm from "./components/AppointmentForm";
import AppointmentStats from "./components/AppointmentStats";
import { exportAppointmentsToExcel } from "./utils/exportUtils";

interface AppointmentsPageProps {
    appointments?: Appointment[];
    services?: Service[];
    staff?: Staff[];
    statuses?: AppointmentStatus[];
}

export default function AppointmentsPage({
    appointments: initialAppointments = [],
    services: initialServices = [],
    staff: initialStaff = [],
    statuses: initialStatuses = []
}: AppointmentsPageProps) {
    const [globalFilter, setGlobalFilter] = useState<string>("");
    const [period, setPeriod] = useState<"daily" | "weekly" | "monthly" | "yearly">("daily");
    const [showForm, setShowForm] = useState(false);
    const [editingAppointment, setEditingAppointment] = useState<Appointment | undefined>();
    const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);

    const { labels, counts } = useMemo(() => {
        const bucketMap = new Map<number, number>();
        appointments.forEach((a) => {
            const d = parseISO(a.appointmentDate);
            let bucketStart: Date;
            switch (period) {
                case "weekly":
                    bucketStart = startOfISOWeek(d);
                    break;
                case "monthly":
                    bucketStart = startOfMonth(d);
                    break;
                case "yearly":
                    bucketStart = startOfYear(d);
                    break;
                default:
                    bucketStart = d;
            }
            const key = bucketStart.getTime();
            bucketMap.set(key, (bucketMap.get(key) || 0) + 1);
        });
        const sortedKeys = Array.from(bucketMap.keys()).sort((a, b) => a - b);
        const outLabels = sortedKeys.map((k) => {
            const d = new Date(k);
            if (period === "weekly") return `W${getISOWeek(d)} ${format(d, "yyyy")}`;
            if (period === "monthly") return format(d, "MM.yyyy");
            if (period === "yearly") return format(d, "yyyy");
            return format(d, "dd.MM.yyyy");
        });
        const outCounts = sortedKeys.map((k) => bucketMap.get(k) || 0);
        return { labels: outLabels, counts: outCounts };
    }, [period, appointments]);

    const lineData = {
        labels,
        datasets: [
            {
                label:
                    period === "daily"
                        ? "Günlük Randevu"
                        : period === "weekly"
                            ? "Haftalık Randevu"
                            : period === "monthly"
                                ? "Aylık Randevu"
                                : "Yıllık Randevu",
                data: counts,
                borderColor: "#3B82F6",
                backgroundColor: "rgba(59, 130, 246, 0.1)",
                fill: true,
                tension: 0.4,
                pointBackgroundColor: "#3B82F6",
                pointBorderColor: "#ffffff",
                pointBorderWidth: 2,
                pointRadius: 6,
                pointHoverRadius: 8,
            },
        ],
    } as Record<string, unknown>;

    const doughnutData = useMemo(() => {
        const byStatus = new Map<number, number>();
        appointments.forEach((a) => {
            byStatus.set(a.statusId, (byStatus.get(a.statusId) || 0) + 1);
        });
        const labels = initialStatuses.map((s) => s.displayName);
        const colors = initialStatuses.map((s) => s.color || "#888");
        const data = initialStatuses.map((s) => byStatus.get(s.id) || 0);
        return {
            labels,
            datasets: [
                {
                    data,
                    backgroundColor: colors,
                    borderWidth: 3,
                    borderColor: "#ffffff",
                    hoverBorderWidth: 4,
                    hoverBorderColor: "#f3f4f6",
                },
            ],
        } as Record<string, unknown>;
    }, [appointments, initialStatuses]);

    const commonLineOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: "rgba(0, 0, 0, 0.05)"
                }
            },
            x: {
                grid: {
                    color: "rgba(0, 0, 0, 0.05)"
                }
            }
        }
    } as Record<string, unknown>;

    const commonDoughnutOptions = {
        cutout: "65%",
        plugins: {
            legend: {
                position: "bottom",
                labels: {
                    padding: 20,
                    usePointStyle: true,
                    pointStyle: "circle"
                }
            }
        },
        maintainAspectRatio: false
    } as Record<string, unknown>;

    const rows = appointments.map((a) => ({
        ...a,
        service: initialServices.find((s) => s.id === a.serviceId)?.title,
        staff: initialStaff.find((s) => s.id === a.staffId)?.fullName,
        status: initialStatuses.find((s) => s.id === a.statusId)?.displayName,
    }));

    const handleAddAppointment = () => {
        setEditingAppointment(undefined);
        setShowForm(true);
    };

    const handleEditAppointment = (appointment: Appointment) => {
        setEditingAppointment(appointment);
        setShowForm(true);
    };

    const handleDeleteAppointment = (appointment: Appointment) => {
        confirmDialog({
            message: `"${appointment.appointmentDate}" tarihli randevuyu silmek istediğinizden emin misiniz?`,
            header: 'Randevu Silme Onayı',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                setAppointments(prev => prev.filter(a => a.id !== appointment.id));
            }
        });
    };

    const handleSubmitAppointment = (appointmentData: Partial<Appointment>) => {
        if (editingAppointment) {
            // Güncelleme
            setAppointments(prev => prev.map(a =>
                a.id === editingAppointment.id
                    ? { ...a, ...appointmentData, updatedAt: new Date().toISOString() }
                    : a
            ));
        } else {
            // Yeni ekleme
            const newAppointment: Appointment = {
                ...appointmentData,
                id: Math.max(...appointments.map(a => a.id), 0) + 1,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            } as Appointment;
            setAppointments(prev => [...prev, newAppointment]);
        }
    };

    const handleExport = () => {
        exportAppointmentsToExcel(appointments, initialServices, initialStaff);
    };

    const actionBodyTemplate = (rowData: Appointment & { service?: string; staff?: string; status?: string }) => {
        return (
            <div className="flex items-center gap-2">
                <Button
                    icon="pi pi-pencil"
                    severity="info"
                    size="small"
                    text
                    className="hover:bg-blue-50 transition-all duration-200"
                    onClick={() => handleEditAppointment(rowData)}
                    tooltip="Düzenle"
                    tooltipOptions={{ position: 'top' }}
                />
                <Button
                    icon="pi pi-trash"
                    severity="danger"
                    size="small"
                    text
                    className="hover:bg-red-50 transition-all duration-200"
                    onClick={() => handleDeleteAppointment(rowData)}
                    tooltip="Sil"
                    tooltipOptions={{ position: 'top' }}
                />
            </div>
        );
    };

    const statusBodyTemplate = (rowData: Appointment & { service?: string; staff?: string; status?: string }) => {
        const status = initialStatuses.find(s => s.id === rowData.statusId);
        return (
            <div className="flex items-center gap-2">
                <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: status?.color || '#888' }}
                ></div>
                <span className="text-sm font-medium text-gray-700">{rowData.status}</span>
            </div>
        );
    };

    const priceBodyTemplate = (rowData: Appointment & { service?: string; staff?: string; status?: string }) => {
        return (
            <span className="font-semibold text-green-600">
                ₺{rowData.price.toLocaleString('tr-TR')}
            </span>
        );
    };

    return (
        <div className="p-4 md:p-6 space-y-6">
            {/* Hero Section */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-8 border border-blue-200">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full mb-6 shadow-lg">
                        <i className="pi pi-calendar text-white text-3xl"></i>
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-3">Randevu Yönetimi</h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Randevularınızı profesyonel şekilde planlayın, takip edin ve müşteri memnuniyetini artırın
                    </p>
                </div>
            </div>

            {/* İstatistik Kartları */}
            <AppointmentStats appointments={appointments} statuses={initialStatuses} />

            {/* Grafikler */}
            <div className="grid gap-6 md:grid-cols-2">
                <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-50 to-indigo-50">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-bold text-gray-800 mb-1">Randevu Trendi</h3>
                            <p className="text-sm text-gray-600">Zaman içindeki randevu dağılımı</p>
                        </div>
                        <SelectButton
                            value={period}
                            onChange={(e) => setPeriod(e.value)}
                            options={[
                                { label: "Günlük", value: "daily" },
                                { label: "Haftalık", value: "weekly" },
                                { label: "Aylık", value: "monthly" },
                                { label: "Yıllık", value: "yearly" },
                            ]}
                            optionLabel="label"
                            multiple={false}
                            className="shadow-sm"
                        />
                    </div>
                    <div style={{ height: 320 }}>
                        <Chart type="line" data={lineData} options={commonLineOptions} />
                    </div>
                </Card>

                <Card className="shadow-lg border-0 bg-gradient-to-br from-purple-50 to-pink-50">
                    <div className="mb-6">
                        <h3 className="text-lg font-bold text-gray-800 mb-1">Durum Dağılımı</h3>
                        <p className="text-sm text-gray-600">Randevu durumlarının yüzdelik dağılımı</p>
                    </div>
                    <div style={{ height: 320 }}>
                        <Chart type="doughnut" data={doughnutData} options={commonDoughnutOptions} />
                    </div>
                </Card>
            </div>

            {/* Randevu Listesi */}
            <Card className="bg-white rounded-xl border-0 shadow-sm">
                <div className="flex flex-wrap gap-4 justify-between items-center pb-6 border-b border-gray-100">
                    <div className="flex gap-3 items-center">
                        <span className="p-input-icon-left">
                            <i className="pi pi-search" />
                            <InputText
                                value={globalFilter}
                                onChange={(e) => setGlobalFilter(e.target.value)}
                                placeholder="Müşteri ara..."
                                className="w-80"
                            />
                        </span>
                    </div>

                    <div className="flex gap-3">
                        <Button
                            icon="pi pi-download"
                            label="Excel İndir"
                            severity="success"
                            onClick={handleExport}
                            className="bg-green-600 hover:bg-green-700 border-green-600"
                        />
                        <Button
                            icon="pi pi-plus"
                            label="Yeni Randevu"
                            className="bg-blue-600 hover:bg-blue-700 border-blue-600"
                            onClick={handleAddAppointment}
                        />
                    </div>
                </div>

                <DataTable
                    value={rows}
                    paginator
                    rows={15}
                    stripedRows
                    tableStyle={{ minWidth: "100%" }}
                    sortMode="multiple"
                    removableSort
                    globalFilter={globalFilter}
                    globalFilterFields={["appointmentDate", "startTime", "endTime", "service", "staff", "status"]}
                    className="shadow-sm"
                >
                    <Column
                        field="appointmentDate"
                        header="Tarih"
                        sortable
                        className="font-medium"
                        body={(rowData) => (
                            <span className="text-gray-800 font-semibold">
                                {new Date(rowData.appointmentDate).toLocaleDateString('tr-TR')}
                            </span>
                        )}
                    />
                    <Column
                        field="startTime"
                        header="Başlangıç"
                        sortable
                        className="text-center"
                        body={(rowData) => (
                            <span className="text-gray-700 font-medium">
                                {rowData.startTime.slice(0, 5)}
                            </span>
                        )}
                    />
                    <Column
                        field="endTime"
                        header="Bitiş"
                        sortable
                        className="text-center"
                        body={(rowData) => (
                            <span className="text-gray-700 font-medium">
                                {rowData.endTime.slice(0, 5)}
                            </span>
                        )}
                    />
                    <Column
                        field="service"
                        header="Hizmet"
                        sortable
                        filter
                        filterPlaceholder="Hizmet Ara"
                        className="font-medium"
                    />
                    <Column
                        field="staff"
                        header="Uzman"
                        sortable
                        className="font-medium"
                    />
                    <Column
                        field="status"
                        header="Durum"
                        sortable
                        body={statusBodyTemplate}
                    />
                    <Column
                        field="price"
                        header="Fiyat"
                        sortable
                        body={priceBodyTemplate}
                        className="text-center"
                    />
                    <Column
                        body={actionBodyTemplate}
                        header="İşlemler"
                        style={{ width: '120px' }}
                        className="text-center"
                    />
                </DataTable>
            </Card>

            {/* Randevu Formu */}
            <AppointmentForm
                visible={showForm}
                onHide={() => setShowForm(false)}
                onSubmit={handleSubmitAppointment}
                appointment={editingAppointment}
                services={initialServices}
                staff={initialStaff}
                statuses={initialStatuses}
            />

            {/* Silme Onay Dialog */}
            <ConfirmDialog />
        </div>
    );
}

