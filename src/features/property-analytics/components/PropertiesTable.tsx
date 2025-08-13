"use client";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Badge } from "primereact/badge";
import { Property } from "../types";

interface PropertiesTableProps {
    properties: Property[];
    globalFilter: string;
    onEdit?: (property: Property) => void;
    onDelete?: (property: Property) => void;
}

export const PropertiesTable = ({
    properties,
    globalFilter,
    onEdit,
    onDelete
}: PropertiesTableProps) => {
    const priceBodyTemplate = (rowData: Property) => {
        return (
            <div className="font-semibold text-green-700">
                ₺{rowData.price.toLocaleString()}
            </div>
        );
    };

    const featuresBodyTemplate = (rowData: Property) => {
        const features = [];

        if (rowData.furnished) features.push({ label: 'Eşyalı', severity: 'success' });
        if (rowData.parking) features.push({ label: 'Otopark', severity: 'info' });
        if (rowData.elevator) features.push({ label: 'Asansör', severity: 'warning' });
        if (rowData.balcony) features.push({ label: 'Balkon', severity: 'secondary' });
        if (rowData.garden) features.push({ label: 'Bahçe', severity: 'help' });
        if (rowData.pool) features.push({ label: 'Havuz', severity: 'danger' });
        if (rowData.security) features.push({ label: 'Güvenlik', severity: 'contrast' });
        if (rowData.featured) features.push({ label: 'Öne Çıkan', severity: 'danger' });

        return (
            <div className="flex flex-wrap gap-1">
                {features.map((feature, index) => (
                    <Badge
                        key={index}
                        value={feature.label}
                        severity={feature.severity as "success" | "info" | "warning" | "secondary" | "danger" | "contrast"}
                        size="normal"
                        className="text-xs"
                    />
                ))}
                {features.length === 0 && (
                    <span className="text-gray-400 text-xs">Özellik yok</span>
                )}
            </div>
        );
    };

    const propertyTypeBodyTemplate = (rowData: Property) => {
        return (
            <div className="flex flex-col gap-1">
                <Badge
                    value={rowData.type}
                    severity="info"
                    size="normal"
                />
                <Badge
                    value={rowData.category}
                    severity="secondary"
                    size="normal"
                />
            </div>
        );
    };

    const actionBodyTemplate = (rowData: Property) => {
        return (
            <div className="flex gap-2">
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
            globalFilterFields={["title", "type", "category", "city", "district"]}
            sortMode="multiple"
            removableSort
            tableStyle={{ minWidth: '60rem' }}
            className="overflow-x-auto"
        >
            <Column field="title" header="İlan Başlığı" sortable filter style={{ minWidth: '200px' }} />
            <Column header="Tür & Kategori" body={propertyTypeBodyTemplate} sortable style={{ minWidth: '140px' }} />
            <Column field="price" header="Fiyat" body={priceBodyTemplate} sortable style={{ minWidth: '120px' }} />
            <Column field="area" header="Alan (m²)" sortable style={{ minWidth: '100px' }} />
            <Column field="rooms" header="Oda Sayısı" sortable style={{ minWidth: '120px' }} />
            <Column field="age" header="Bina Yaşı" sortable style={{ minWidth: '120px' }} />
            <Column header="Özellikler" body={featuresBodyTemplate} style={{ minWidth: '200px' }} />
            <Column header="İşlemler" body={actionBodyTemplate} style={{ minWidth: '150px' }} />
        </DataTable>
    );
};
