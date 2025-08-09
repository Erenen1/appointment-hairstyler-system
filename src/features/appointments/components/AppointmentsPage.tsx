"use client";

import { Card } from "primereact/card";
import { Chart } from "primereact/chart";
import "chart.js/auto";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { useMemo, useState } from "react";
import { SelectButton } from "primereact/selectbutton";
import { parseISO, startOfISOWeek, startOfMonth, startOfYear, format, getISOWeek } from "date-fns";
import { Appointment, AppointmentStatus } from "../types/types";
import { Service } from "../../services/types";
import { Staff } from "../../../service/dataService";

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

    const { labels, counts } = useMemo(() => {
        const bucketMap = new Map<number, number>();
        initialAppointments.forEach((a) => {
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
    }, [period, initialAppointments]);

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
                borderColor: "#007BFF",
                fill: false,
                tension: 0.3,
            },
        ],
    } as Record<string, unknown>;

    const doughnutData = useMemo(() => {
        const byStatus = new Map<number, number>();
        initialAppointments.forEach((a) => {
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
                },
            ],
        } as Record<string, unknown>;
    }, [initialAppointments, initialStatuses]);

    const commonLineOptions = { responsive: true, maintainAspectRatio: false } as Record<string, unknown>;
    const commonDoughnutOptions = { cutout: "60%", plugins: { legend: { position: "bottom" } }, maintainAspectRatio: false } as Record<string, unknown>;

    const rows = initialAppointments.map((a) => ({
        ...a,
        service: initialServices.find((s) => s.id === a.serviceId)?.title,
        staff: initialStaff.find((s) => s.id === a.staffId)?.fullName,
        status: initialStatuses.find((s) => s.id === a.statusId)?.displayName,
    }));

    return (
        <div className="p-4 md:p-6 space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
                <Card title="Randevular Grafiği">
                    <div className="flex items-center justify-between mb-3">
                        <div className="text-sm text-gray-600">Dönem</div>
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
                        />
                    </div>
                    <div style={{ height: 300 }}>
                        <Chart type="line" data={lineData} options={commonLineOptions} />
                    </div>
                </Card>
                <Card title="Durum Dağılımı">
                    <div style={{ height: 300 }}>
                        <Chart type="doughnut" data={doughnutData} options={commonDoughnutOptions} />
                    </div>
                </Card>
            </div>
            <Card title="Randevu Listesi">
                <div className="flex justify-end pb-3">
                    <span className="p-input-icon-left">
                        <i className="pi pi-search" />
                        <InputText value={globalFilter} onChange={(e) => setGlobalFilter(e.target.value)} placeholder="Ara..." />
                    </span>
                </div>
                <DataTable value={rows} paginator rows={10} stripedRows tableStyle={{ minWidth: "50rem" }}
                    sortMode="multiple" removableSort globalFilter={globalFilter} globalFilterFields={["appointmentDate", "startTime", "endTime", "service", "staff", "status"]}>
                    <Column field="appointmentDate" header="Tarih" sortable />
                    <Column field="startTime" header="Başlangıç" sortable />
                    <Column field="endTime" header="Bitiş" sortable />
                    <Column field="service" header="Hizmet" sortable filter filterPlaceholder="Ara" />
                    <Column field="staff" header="Uzman" sortable />
                    <Column field="status" header="Durum" sortable />
                </DataTable>
            </Card>
        </div>
    );
}

