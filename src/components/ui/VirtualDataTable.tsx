import React, { useState, useMemo } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { MultiSelect } from 'primereact/multiselect';
import { cn } from '../../lib/utils';

interface VirtualDataTableProps<T> {
    data: T[];
    columns: {
        field: string;
        header: string;
        sortable?: boolean;
        body?: (rowData: T) => React.ReactNode;
        style?: React.CSSProperties;
        frozen?: boolean;
        hidden?: boolean;
        mobileHidden?: boolean;
    }[];
    globalFilterFields?: string[];
    globalFilter?: string;
    onGlobalFilterChange?: (value: string) => void;
    filters?: {
        key: string;
        label: string;
        options: { label: string; value: any }[];
        value: any;
        onChange: (value: any) => void;
        type: 'dropdown' | 'multiselect';
    }[];
    actions?: {
        label: string;
        icon: string;
        onClick: () => void;
        className?: string;
    }[];
    exportButton?: {
        label: string;
        onClick: () => void;
    };
    className?: string;
    rows?: number;
    paginator?: boolean;
    stripedRows?: boolean;
    selectionMode?: 'single' | 'multiple' | 'none';
    selection?: T | T[] | null;
    onSelectionChange?: (selection: T | T[] | null) => void;
    sortMode?: 'single' | 'multiple';
    removableSort?: boolean;
    emptyMessage?: string;
    loading?: boolean;
    virtualScrollerOptions?: {
        itemSize: number;
        numTinyItems?: number;
    };
}

export function VirtualDataTable<T>({
    data,
    columns,
    globalFilterFields,
    globalFilter = '',
    onGlobalFilterChange,
    filters = [],
    actions = [],
    exportButton,
    className,
    rows = 15,
    paginator = true,
    stripedRows = true,
    selectionMode = 'none',
    selection,
    onSelectionChange,
    sortMode = 'multiple',
    removableSort = true,
    emptyMessage = 'Veri bulunamadı',
    loading = false,
    virtualScrollerOptions = { itemSize: 46 }
}: VirtualDataTableProps<T>) {
    const [localGlobalFilter, setLocalGlobalFilter] = useState(globalFilter);

    const handleGlobalFilterChange = (value: string) => {
        setLocalGlobalFilter(value);
        onGlobalFilterChange?.(value);
    };

    const visibleColumns = useMemo(() => {
        return columns.filter(col => !col.hidden);
    }, [columns]);

    const mobileColumns = useMemo(() => {
        return columns.filter(col => !col.mobileHidden);
    }, [columns]);

    return (
        <div className={cn('space-y-4', className)}>
            {/* Filters and Actions */}
            <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
                {/* Search and Filters */}
                <div className="flex flex-col sm:flex-row gap-3 flex-1">
                    {globalFilterFields && (
                        <div className="relative">
                            <i className="pi pi-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <InputText
                                value={localGlobalFilter}
                                onChange={(e) => handleGlobalFilterChange(e.target.value)}
                                placeholder="Ara..."
                                className="pl-10 w-full sm:w-80"
                            />
                        </div>
                    )}

                    <div className="flex flex-wrap gap-2">
                        {filters.map((filter) => (
                            <div key={filter.key} className="min-w-[150px]">
                                {filter.type === 'dropdown' ? (
                                    <Dropdown
                                        value={filter.value}
                                        onChange={(e) => filter.onChange(e.value)}
                                        options={filter.options}
                                        placeholder={filter.label}
                                        className="w-full"
                                    />
                                ) : (
                                    <MultiSelect
                                        value={filter.value}
                                        onChange={(e) => filter.onChange(e.value)}
                                        options={filter.options}
                                        placeholder={filter.label}
                                        className="w-full"
                                        display="chip"
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
                    {exportButton && (
                        <Button
                            icon="pi pi-download"
                            label={exportButton.label}
                            outlined
                            onClick={exportButton.onClick}
                            className="w-full sm:w-auto"
                        />
                    )}
                    {actions.map((action, index) => (
                        <Button
                            key={index}
                            icon={action.icon}
                            label={action.label}
                            onClick={action.onClick}
                            className={cn('w-full sm:w-auto', action.className)}
                        />
                    ))}
                </div>
            </div>

            {/* DataTable */}
            <div className="overflow-x-auto">
                <DataTable
                    value={data}
                    paginator={paginator}
                    rows={rows}
                    stripedRows={stripedRows}
                    tableStyle={{ minWidth: '100%' }}
                    selectionMode={selectionMode}
                    selection={selection}
                    onSelectionChange={onSelectionChange}
                    sortMode={sortMode}
                    removableSort={removableSort}
                    globalFilter={localGlobalFilter}
                    globalFilterFields={globalFilterFields}
                    className="w-full"
                    emptyMessage={emptyMessage}
                    loading={loading}
                    virtualScrollerOptions={virtualScrollerOptions}
                    scrollable
                    scrollHeight="400px"
                    responsiveLayout="scroll"
                >
                    {visibleColumns.map((column) => (
                        <Column
                            key={column.field}
                            field={column.field}
                            header={column.header}
                            sortable={column.sortable}
                            body={column.body}
                            style={column.style}
                            frozen={column.frozen}
                            className={cn(
                                column.mobileHidden && 'hidden sm:table-cell'
                            )}
                        />
                    ))}
                </DataTable>
            </div>
        </div>
    );
}

export default VirtualDataTable;
