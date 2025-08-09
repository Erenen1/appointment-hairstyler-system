"use client";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Service } from "../types";

interface ServicesTableProps {
    filteredServices: Service[];
    selected: Service | null;
    onSelectionChange: (service: Service | null) => void;
    globalFilter: string;
}

export const ServicesTable = ({
    filteredServices,
    selected,
    onSelectionChange,
    globalFilter
}: ServicesTableProps) => {
    return (
        <DataTable
            value={filteredServices}
            paginator
            rows={10}
            stripedRows
            tableStyle={{ minWidth: "50rem" }}
            selectionMode="single"
            selection={selected}
            onSelectionChange={(e) => onSelectionChange(e.value as Service)}
            sortMode="multiple"
            removableSort
            globalFilter={globalFilter}
            globalFilterFields={["title", "duration", "price"]}
        >
            <Column field="title" header="Başlık" sortable filter filterPlaceholder="Ara" />
            <Column field="duration" header="Süre (dk)" sortable />
            <Column field="price" header="Fiyat" sortable />
            <Column field="isActive" header="Aktif" />
        </DataTable>
    );
};
