"use client";

import { Card } from "primereact/card";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { useState } from "react";
import staff from "@/mocks/staff.json";
import staffServices from "@/mocks/staff-services.json";
import services from "@/mocks/services.json";

export default function StaffPage() {
    const [globalFilter, setGlobalFilter] = useState<string>("");
    const rows = (staff as any[]).map((s) => {
        const serviceIds = (staffServices as any[]).filter((x) => x.staffId === s.id).map((x) => x.serviceId);
        const serviceTitles = (services as any[]).filter((sv) => serviceIds.includes(sv.id)).map((sv) => sv.title).join(", ");
        return { ...s, serviceTitles };
    });

    return (
        <div className="p-4 md:p-6">
            <Card title="Personeller">
                <div className="flex justify-end pb-3">
                    <span className="p-input-icon-left">
                        <i className="pi pi-search" />
                        <InputText value={globalFilter} onChange={(e) => setGlobalFilter(e.target.value)} placeholder="Ara..." />
                    </span>
                </div>
                <DataTable value={rows} paginator rows={10} stripedRows tableStyle={{ minWidth: "50rem" }}
                    sortMode="multiple" removableSort globalFilter={globalFilter} globalFilterFields={["fullName", "workingDays", "serviceTitles"]}>
                    <Column field="fullName" header="Ad Soyad" sortable filter filterPlaceholder="Ara" />
                    <Column field="workingDays" header="Çalışma Günleri" sortable />
                    <Column field="serviceTitles" header="Uzmanlıklar" sortable />
                    <Column field="isActive" header="Aktif" />
                </DataTable>
            </Card>
        </div>
    );
}


