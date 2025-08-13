"use client";

import { Card } from "primereact/card";
import { Chart } from "primereact/chart";
import "chart.js/auto";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Badge } from "primereact/badge";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { useMemo, useState } from "react";
import { SelectButton } from "primereact/selectbutton";
import { parseISO, startOfISOWeek, startOfMonth, format, getISOWeek, isToday, isThisWeek, isThisMonth } from "date-fns";
import { Appointment, AppointmentStatus } from "./types";
import AppointmentForm from "./components/AppointmentForm";
import AppointmentStats from "./components/AppointmentStats";
import { ExportButton, ResponsiveHero } from "../../components/ui";
import { exportAppointmentsToCsv } from "../../lib/exportUtils";

interface AppointmentsPageProps {
    appointments?: Appointment[];
    statuses?: AppointmentStatus[];
}

export default function AppointmentsPage({
    appointments: initialAppointments = [],
    statuses: initialStatuses = []
}: AppointmentsPageProps) {
    const [globalFilter, setGlobalFilter] = useState<string>("");
    const [period, setPeriod] = useState<"daily" | "weekly" | "monthly">("daily");
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
                            : "Aylık Randevu",
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
        // Genel istatistikler
        const today = appointments.filter(a => isToday(parseISO(a.appointmentDate))).length;
        const thisWeek = appointments.filter(a => isThisWeek(parseISO(a.appointmentDate))).length;
        const thisMonth = appointments.filter(a => isThisMonth(parseISO(a.appointmentDate))).length;

        // Durum istatistikleri
        const confirmed = appointments.filter(a => {
            const status = initialStatuses.find(s => s.id === a.statusId);
            return status?.displayName === 'Onaylandı';
        }).length;
        const pending = appointments.filter(a => {
            const status = initialStatuses.find(s => s.id === a.statusId);
            return status?.displayName === 'Beklemede';
        }).length;
        const cancelled = appointments.filter(a => {
            const status = initialStatuses.find(s => s.id === a.statusId);
            return status?.displayName === 'İptal Edildi';
        }).length;
        const postponed = appointments.filter(a => {
            const status = initialStatuses.find(s => s.id === a.statusId);
            return status?.displayName === 'Ertelendi';
        }).length;

        return {
            labels: [
                'Bugün', 'Bu Hafta', 'Bu Ay',
                'Onaylanan', 'Bekleyen', 'İptal Edilen', 'Ertelendi'
            ],
            datasets: [
                {
                    data: [today, thisWeek, thisMonth, confirmed, pending, cancelled, postponed],
                    backgroundColor: [
                        '#FF5252', '#00BCD4', '#2196F3',  // Genel istatistikler (canlı kırmızı, turkuaz, mavi)
                        '#4CAF50', '#FFC107', '#9C27B0', '#FF5722'  // Durum istatistikleri (yeşil, altın, mor, turuncu)
                    ],
                    borderWidth: 4,
                    borderColor: "#ffffff",
                    hoverBorderWidth: 6,
                    hoverBorderColor: "#f8f9fa",
                    hoverOffset: 8,
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
        cutout: "60%",
        plugins: {
            legend: {
                position: "bottom",
                labels: {
                    padding: 15,
                    usePointStyle: true,
                    pointStyle: "circle",
                    font: {
                        size: 12,
                        weight: '600'
                    }
                }
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleColor: '#ffffff',
                bodyColor: '#ffffff',
                borderColor: '#ffffff',
                borderWidth: 1
            }
        },
        maintainAspectRatio: false,
        elements: {
            arc: {
                borderWidth: 4,
                borderColor: "#ffffff"
            }
        }
    } as Record<string, unknown>;

    const rows = appointments.map((a) => ({
        ...a,
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
        exportAppointmentsToCsv(appointments);
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



    return (
        <div className="p-4 md:p-6 space-y-6">
            {/* Hero Section */}
            <ResponsiveHero
                title="Randevular"
                subtitle="Randevularınızı profesyonel şekilde planlayın, takip edin ve müşteri memnuniyetini artırın"
                icon="pi-calendar"
                iconBgColor="bg-gradient-to-br from-blue-500 to-indigo-600"
                gradient={{ from: 'blue-50', to: 'indigo-100' }}
                borderColor="border-blue-200"
            />

            {/* İstatistik Kartları */}
            <AppointmentStats appointments={appointments} statuses={initialStatuses} />

            {/* Grafikler */}
            <div className="grid gap-6 md:grid-cols-2 mb-6">
                <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-50 to-indigo-50">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="text-lg font-bold text-gray-800 mb-1">Randevu Trendi</h3>
                            <p className="text-sm text-gray-600">Randevu sayısının zaman içindeki dağılımı</p>
                        </div>
                        <SelectButton
                            value={period}
                            onChange={(e) => setPeriod(e.value)}
                            options={[
                                { label: "Günlük", value: "daily" },
                                { label: "Haftalık", value: "weekly" },
                                { label: "Aylık", value: "monthly" }
                            ]}
                            optionLabel="label"
                            multiple={false}
                            className="shadow-sm"
                        />
                    </div>
                    <div style={{ height: 300 }}>
                        <Chart type="line" data={lineData} options={commonLineOptions} className="h-70" />
                    </div>
                </Card>

                <Card className="shadow-xl border-0 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 hover:shadow-2xl transition-all duration-300">
                    <div className="mb-4">
                        <h3 className="text-xl font-bold text-gray-800 mb-2 flex items-center gap-2">
                            <i className="pi pi-chart-pie text-indigo-600"></i>
                            Randevu İstatistikleri
                        </h3>
                        <p className="text-sm text-gray-600">Genel istatistikler ve durum dağılımı</p>
                    </div>
                    <div style={{ height: 300 }}>
                        <Chart type="doughnut" data={doughnutData} options={commonDoughnutOptions} className="h-70" />
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
                                placeholder="Tarih, saat, telefon veya mesaj ara..."
                                className="w-80"
                                style={{ paddingLeft: '2.5rem', paddingRight: '1.5rem' }}
                            />
                        </span>
                    </div>

                    <div className="flex gap-3">
                        <ExportButton
                            onExport={handleExport}
                            label="Excel İndir"
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
                    globalFilterFields={["appointmentDate", "startTime", "customerPhone", "message"]}
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
                        header="Randevu Saati"
                        sortable
                        className="text-center"
                        body={(rowData) => (
                            <span className="text-gray-700 font-medium">
                                {rowData.startTime.slice(0, 5)} - {rowData.endTime.slice(0, 5)}
                            </span>
                        )}
                    />
                    <Column
                        field="appointmentTypeId"
                        header="İlgi Alanı"
                        sortable
                        filter
                        filterPlaceholder="İlgi Alanı Ara"
                        className="font-medium"
                        body={(rowData) => {
                            const typeNames = {
                                1: "Daire",
                                2: "Villa",
                                3: "Arsa",
                                4: "Ofis",
                                5: "Dükkan",
                                6: "Emlak Değerleme",
                                7: "Sözleşme İmzalama",
                                8: "Danışmanlık"
                            };
                            const typeSeverities: Record<number, "info" | "success" | "warning" | "secondary" | "danger"> = {
                                1: "info",
                                2: "success",
                                3: "warning",
                                4: "secondary",
                                5: "info",
                                6: "danger",
                                7: "secondary",
                                8: "success"
                            };
                            const typeName = typeNames[rowData.appointmentTypeId as keyof typeof typeNames] || 'Bilinmiyor';
                            const severity = typeSeverities[rowData.appointmentTypeId as keyof typeof typeSeverities] || 'info';

                            return (
                                <Badge
                                    value={typeName}
                                    severity={severity}
                                    className="text-xs font-medium"
                                />
                            );
                        }}
                    />
                    <Column
                        field="customerPhone"
                        header="Telefon"
                        sortable
                        className="font-medium"
                    />
                    <Column
                        field="message"
                        header="Mesaj"
                        sortable={false}
                        className="font-medium"
                        body={(rowData) => (
                            <div className="max-w-[200px] truncate" title={rowData.message || ''}>
                                {rowData.message ? (
                                    <span className="text-gray-700 text-sm">
                                        {rowData.message}
                                    </span>
                                ) : (
                                    <span className="text-gray-400 text-xs">Mesaj yok</span>
                                )}
                            </div>
                        )}
                    />
                    <Column
                        field="status"
                        header="Durum"
                        sortable
                        body={statusBodyTemplate}
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
                statuses={initialStatuses}
                appointmentTypes={[]}
            />

            {/* Silme Onay Dialog */}
            <ConfirmDialog />
        </div>
    );
}

