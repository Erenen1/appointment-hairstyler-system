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

import AppointmentsHeader from "./AppointmentsHeader"
const AllAppointmentsPage = () => {

    const { appointmentData, filterAppointment, handleAllAppointments } = useAllAppointments()

    useEffect(() => {
        if (appointmentData.length === 0) handleAllAppointments()
    }, [])

    const table = useReactTable({
        data: appointmentData,
        columns: appointmentsColumns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    })

    return (
        <div className="p-4 space-y-4">
            <AppointmentsHeader onSearch={filterAppointment} />
            <DataTableLayout
                header={<TableHeaderRows table={table} />}
                body={<TableBodyRows table={table} />}
            />
        </div>
    )
}

export default AllAppointmentsPage;
