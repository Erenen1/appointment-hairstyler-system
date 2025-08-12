"use client";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Property } from "../types";

interface PropertiesTableProps {
    properties: Property[];
    globalFilter: string;
    onEdit?: (property: Property) => void;
    onDelete?: (property: Property) => void;
    onView?: (property: Property) => void;
}

export const PropertiesTable = ({
    properties,
    globalFilter,
    onEdit,
    onDelete,
    onView
}: PropertiesTableProps) => {
    const priceBodyTemplate = (rowData: Property) => {
        return (
            <div className="font-semibold text-green-700">
                ₺{rowData.price.toLocaleString()}
            </div>
        );
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
            <div className="flex gap-2">
                {onView && (
                    <Button
                        icon="pi pi-eye"
                        size="small"
                        severity="info"
                        text
                        tooltip="Detayları Görüntüle"
                        onClick={() => onView(rowData)}
                    />
                )}
                {onEdit && (
                    <Button
                        icon="pi pi-pencil"
                        size="small"
                        severity="warning"
                        text
                        tooltip="Düzenle"
                        onClick={() => onEdit(rowData)}
                    />
                )}
                {onDelete && (
                    <Button
                        icon="pi pi-trash"
                        size="small"
                        severity="danger"
                        text
                        tooltip="Sil"
                        onClick={() => onDelete(rowData)}
                    />
                )}
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
            <Column field="title" header="İlan Başlığı" sortable filter style={{ minWidth: '200px' }} />
            <Column field="category" header="Kategori" sortable style={{ minWidth: '120px' }} />
            <Column field="location" header="Konum" sortable style={{ minWidth: '150px' }} />
            <Column field="price" header="Fiyat" body={priceBodyTemplate} sortable style={{ minWidth: '120px' }} />
            <Column field="area" header="Alan (m²)" sortable style={{ minWidth: '100px' }} />
            <Column field="views" header="Görüntüleme" sortable style={{ minWidth: '120px' }} />
            <Column field="clicks" header="Tıklama" sortable style={{ minWidth: '100px' }} />
            <Column header="Tıklama Oranı" body={clickRateBodyTemplate} style={{ minWidth: '150px' }} />
            <Column header="İşlemler" body={actionBodyTemplate} style={{ minWidth: '250px' }} />
        </DataTable>
    );
};
