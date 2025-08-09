"use client";

import { InputText } from "primereact/inputtext";
import { MultiSelect } from "primereact/multiselect";
import { ToggleButton } from "primereact/togglebutton";
import { Button } from "primereact/button";
import { ServiceCategory, Service } from "../types";

interface ServicesFiltersProps {
    globalFilter: string;
    setGlobalFilter: (value: string) => void;
    categoryFilter: number[];
    setCategoryFilter: (value: number[]) => void;
    activeOnly: boolean;
    setActiveOnly: (value: boolean) => void;
    categories: ServiceCategory[];
    selected: Service | null;
    onAdd: () => void;
    onEdit: () => void;
    onDelete: () => void;
}

export const ServicesFilters = ({
    globalFilter,
    setGlobalFilter,
    categoryFilter,
    setCategoryFilter,
    activeOnly,
    setActiveOnly,
    categories,
    selected,
    onAdd,
    onEdit,
    onDelete
}: ServicesFiltersProps) => {
    return (
        <div className="flex flex-wrap gap-2 justify-between items-center pb-3">
            <div className="flex gap-2 items-center">
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText
                        value={globalFilter}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                        placeholder="Ara..."
                    />
                </span>
                <MultiSelect
                    display="chip"
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.value)}
                    options={categories.map(c => ({ label: c.name, value: c.id }))}
                    placeholder="Kategoriler"
                    className="min-w-[12rem]"
                />
                <ToggleButton
                    onLabel="Aktif"
                    offLabel="Aktif"
                    checked={activeOnly}
                    onChange={(e) => setActiveOnly(e.value)}
                />
            </div>
            <div className="flex gap-2">
                <Button icon="pi pi-plus" label="Ekle" onClick={onAdd} />
                <Button icon="pi pi-pencil" label="Düzenle" onClick={onEdit} disabled={!selected} />
                <Button icon="pi pi-trash" label="Sil" severity="danger" onClick={onDelete} disabled={!selected} />
            </div>
        </div>
    );
};
