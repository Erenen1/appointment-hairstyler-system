"use client";

import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { MultiSelect } from "primereact/multiselect";
import { SortOption, TimeRangeOption } from "../types";

interface AnalyticsFiltersProps {
    globalFilter: string;
    setGlobalFilter: (value: string) => void;
    typeFilter: string[];
    setTypeFilter: (value: string[]) => void;
    categoryFilter: string[];
    setCategoryFilter: (value: string[]) => void;
    sortBy: string;
    setSortBy: (value: string) => void;
    timeRange: string;
    setTimeRange: (value: string) => void;
    sortOptions: SortOption[];
    timeRangeOptions: TimeRangeOption[];
    uniqueTypes: string[];
    uniqueCategories: string[];
}

export const AnalyticsFilters = ({
    globalFilter,
    setGlobalFilter,
    typeFilter,
    setTypeFilter,
    categoryFilter,
    setCategoryFilter,
    sortBy,
    setSortBy,
    timeRange,
    setTimeRange,
    sortOptions,
    timeRangeOptions,
    uniqueTypes,
    uniqueCategories
}: AnalyticsFiltersProps) => {
    return (
        <div className="flex flex-wrap gap-3 items-center mb-4">
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText
                    value={globalFilter}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                    placeholder="İlan ara..."
                    className="w-64"
                />
            </span>

            <MultiSelect
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.value)}
                options={uniqueTypes.map(type => ({ label: type, value: type }))}
                placeholder="Tür Seç"
                className="w-48"
                display="chip"
            />

            <MultiSelect
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.value)}
                options={uniqueCategories.map(cat => ({ label: cat, value: cat }))}
                placeholder="Kategori Seç"
                className="w-48"
                display="chip"
            />

            <Dropdown
                value={sortBy}
                onChange={(e) => setSortBy(e.value)}
                options={sortOptions}
                placeholder="Sıralama"
                className="w-44"
            />

            <Dropdown
                value={timeRange}
                onChange={(e) => setTimeRange(e.value)}
                options={timeRangeOptions}
                placeholder="Zaman Aralığı"
                className="w-40"
            />
        </div>
    );
};
