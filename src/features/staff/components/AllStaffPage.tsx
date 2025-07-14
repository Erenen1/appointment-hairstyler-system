'use client'

import { useEffect } from "react"
import { staffColumns } from "@/features/staff/components/StaffColums"
import {
    useReactTable,
    getCoreRowModel,
    getPaginationRowModel,
} from "@tanstack/react-table"
import { DataTableLayout } from "@/app/share/table/layout"
import { TableHeaderRows } from "@/app/share/table/components/TableHeader"
import { TableBodyRows } from "@/app/share/table/components/TableBody"
import { useAllStaff } from "../hooks/useAllStaff"

export default function AllStaffPage() {
    const { staffData, handleAllStaff } = useAllStaff()

    useEffect(() => {
        handleAllStaff()
    }, [])

    const table = useReactTable({
        data: staffData,
        columns: staffColumns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    })

    return (
        <div className="p-4 space-y-4">
            <DataTableLayout
                header={<TableHeaderRows table={table} />}
                body={<TableBodyRows table={table} />}
            />
        </div>
    )
}
