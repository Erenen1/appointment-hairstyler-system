// features/ui/data-table/table-head.tsx
import { flexRender } from "@tanstack/react-table"
import { TableHead, TableRow } from "@/components/ui/table"
import { Table } from "@tanstack/react-table"

export function TableHeaderRows<T>({ table }: { table: Table<T> }) {
    return (
        <>
            {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                        <TableHead key={header.id}>
                            {header.isPlaceholder
                                ? null
                                : flexRender(header.column.columnDef.header, header.getContext())}
                        </TableHead>
                    ))}
                </TableRow>
            ))}
        </>
    )
}
