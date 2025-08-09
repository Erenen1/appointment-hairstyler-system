"use client";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Tag } from "primereact/tag";
import { Badge } from "primereact/badge";
import { ProgressBar } from "primereact/progressbar";
import { Property } from "../types";

interface PropertiesTableProps {
    properties: Property[];
    globalFilter: string;
}

export const PropertiesTable = ({ properties, globalFilter }: PropertiesTableProps) => {
    const typeBodyTemplate = (rowData: Property) => {
        return <Tag value={rowData.type} severity={rowData.type === "Satılık" ? "info" : "warning"} />;
    };

    const featuredBodyTemplate = (rowData: Property) => {
        return rowData.featured ? <Badge value="Öne Çıkan" severity="success" /> : null;
    };

    const priceBodyTemplate = (rowData: Property) => {
        return `₺${rowData.price.toLocaleString()}`;
    };

    const clickRateBodyTemplate = (rowData: Property) => {
        const rate = rowData.views > 0 ? (rowData.clicks / rowData.views) * 100 : 0;
        return (
            <div className="flex align-items-center gap-2">
                <span>{rate.toFixed(1)}%</span>
                <ProgressBar value={rate} style={{ width: '60px', height: '6px' }} />
            </div>
        );
    };

    return (
        <DataTable
            value={properties}
            paginator
            rows={10}
            stripedRows
            globalFilter={globalFilter}
            globalFilterFields={["title", "location", "type", "category"]}
            sortMode="multiple"
            removableSort
            tableStyle={{ minWidth: '60rem' }}
        >
            <Column field="title" header="İlan Başlığı" sortable filter />
            <Column field="type" header="Tür" body={typeBodyTemplate} sortable />
            <Column field="category" header="Kategori" sortable />
            <Column field="location" header="Konum" sortable />
            <Column field="price" header="Fiyat" body={priceBodyTemplate} sortable />
            <Column field="area" header="Alan (m²)" sortable />
            <Column field="views" header="Görüntüleme" sortable />
            <Column field="clicks" header="Tıklama" sortable />
            <Column header="Tıklama Oranı" body={clickRateBodyTemplate} />
            <Column header="Durum" body={featuredBodyTemplate} />
        </DataTable>
    );
};
