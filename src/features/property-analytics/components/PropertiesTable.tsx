"use client";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Badge } from "primereact/badge";
import { Property } from "../types";

interface PropertiesTableProps {
    properties: Property[];
    globalFilter: string;
}

export const PropertiesTable = ({ properties, globalFilter }: PropertiesTableProps) => {
    const featuredBodyTemplate = (rowData: Property) => {
        return rowData.featured ? <Badge value="Öne Çıkan" severity="success" /> : null;
    };

    const priceBodyTemplate = (rowData: Property) => {
        return `₺${rowData.price.toLocaleString()}`;
    };

    const clickRateBodyTemplate = (rowData: Property) => {
        const rate = rowData.views > 0 ? (rowData.clicks / rowData.views) * 100 : 0;
        return (
            <div className="flex items-center gap-3">
                <span className="font-medium text-gray-700">{rate.toFixed(1)}%</span>
                <div className="flex-1 bg-gray-200 rounded-full h-2.5 w-20">
                    <div
                        className="bg-gradient-to-r from-blue-500 to-purple-600 h-2.5 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(rate, 100)}%` }}
                    ></div>
                </div>
            </div>
        );
    };

    const actionBodyTemplate = (rowData: Property) => {
        return (
            <button
                onClick={() => {
                    // Sahibinden.com'a git
                    window.open(`https://www.sahibinden.com/ilan/${rowData.id}`, '_blank');
                }}
                className="px-3 py-1.5 text-blue-300 bg-blue-400 hover:bg-blue-500 bg-none text-sm rounded-lg flex items-center gap-2 transition-colors duration-200"
                title="Sahibinden.com'da Görüntüle"
            >
                <i className="pi pi-eye text-xs"></i>
            </button>
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
            <Column field="category" header="Kategori" sortable />
            <Column field="location" header="Konum" sortable />
            <Column field="price" header="Fiyat" body={priceBodyTemplate} sortable />
            <Column field="area" header="Alan (m²)" sortable />
            <Column field="views" header="Görüntüleme" sortable />
            <Column field="clicks" header="Tıklama" sortable />
            <Column header="Tıklama Oranı" body={clickRateBodyTemplate} />
            <Column header="Durum" body={featuredBodyTemplate} />
            <Column header="İşlemler" body={actionBodyTemplate} style={{ minWidth: '150px' }} />
        </DataTable>
    );
};
