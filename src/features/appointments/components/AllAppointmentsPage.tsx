"use client"

import { useEffect } from "react"

import {
    useReactTable,
    getCoreRowModel,
    getPaginationRowModel,
} from "@tanstack/react-table"
// import { Button } from "@/components/ui/button"
import { TableBodyRows } from "@/app/share/table/components/TableBody"
import { TableHeaderRows } from "@/app/share/table/components/TableHeader"
import { DataTableLayout } from "@/app/share/table/layout"
import { appointmentsColumns } from "./AppointmentsColumns"
import { useAllAppointments } from "../hooks/useAllAppointments"
const AllAppointmentsPage = () => {

    const { data, handleAllAppointments } = useAllAppointments()

    useEffect(() => {
        handleAllAppointments()
    }, [])

    const table = useReactTable({
        data,
        columns: appointmentsColumns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    })

    return (
        <div className="p-4 space-y-4">
            {/* <Button onClick={fetchRandevular}>Randevuları Yükle</Button> */}
            <DataTableLayout
                header={<TableHeaderRows table={table} />}
                body={<TableBodyRows table={table} />}
            />
        </div>
    )
}

export default AllAppointmentsPage;
