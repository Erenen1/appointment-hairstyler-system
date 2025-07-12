"use client"

import { useEffect, useState } from "react"

import {
    useReactTable,
    getCoreRowModel,
    getPaginationRowModel,
} from "@tanstack/react-table"
// import { Button } from "@/components/ui/button"
import { Randevu } from "@/app/share/table/mock/randevu-mock-data"
import { TableBodyRows } from "@/app/share/table/components/TableBody"
import { TableHeaderRows } from "@/app/share/table/components/TableHeader"
import { DataTableLayout } from "@/app/share/table/layout"
import { appointmentsColumns } from "@/app/share/table/mock/ApointmentsColums"
import { SearchForm } from "@/app/share/sidebar/components/SearchForm"

const AllAppointments = () => {
    const [data, setData] = useState<Randevu[]>([])

    const fetchAppointments = async () => {
        const res = await fetch("/json/appointments.json")
        const json = await res.json()
        setData(json)
    }
    useEffect(() => {
        fetchAppointments()
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
            <SearchForm />
            <DataTableLayout
                header={<TableHeaderRows table={table} />}
                body={<TableBodyRows table={table} />}
            />
        </div>
    )
}

export default AllAppointments
