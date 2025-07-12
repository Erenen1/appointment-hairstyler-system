// features/ui/data-table/table-rows.tsx
import {
    TableRow,
    TableCell,
} from "@/components/ui/table"
import { Table } from "@tanstack/react-table"
import { flexRender } from "@tanstack/react-table"

export function TableBodyRows<T>({ table }: { table: Table<T> }) {
    const rows = table.getRowModel().rows

    if (!rows.length)
        return (
            <TableRow>
                <TableCell colSpan={table.getAllLeafColumns().length} className="text-center h-24">
                    Kayıt bulunamadı.
                </TableCell>
            </TableRow>
        )

    return (
        <>
            {rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                    {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                    ))}
                </TableRow>
            ))}
        </>
    )
}
