"use client";
import React from "react";
import { TableBodyRows } from "@/app/share/table/components/TableBody";
import { TableHeaderRows } from "@/app/share/table/components/TableHeader";
import { DataTableLayout } from "@/app/share/table/layout";
import { useReactTable, getCoreRowModel } from "@tanstack/react-table";
import { useCalendarData } from "@/features/calendar/hooks/CalendarData";
import { columns as calendarColumns } from "@/features/calendar/components/CalendarColumns";
import { CalendarHeader } from "../utils/calendarFunction";

const AllCalendarPage = () => {
    const { data: mockData, isLoading, isError } = useCalendarData();

    const tableData = React.useMemo(() => {
        if (!mockData) return [];
        return mockData.timeSlots.map((timeSlot) => {
            const row: Record<string, any> = { timeSlot };
            mockData.staff.forEach((staff) => {
                const apt = mockData.appointments.find((a) => a.staffId === staff.id && a.time === timeSlot);
                row[staff.id] = apt
                    ? {
                        customer: apt.customer.name,
                        service: apt.service,
                        status: apt.status,
                        phone: apt.customer.phone,
                    }
                    : null;
            });
            return row;
        });
    }, [mockData]);

    const columns = React.useMemo(
        () => (mockData ? calendarColumns(mockData.staff) : []),
        [mockData]
    );

    const table = useReactTable({
        data: tableData,
        columns,
        getPaginationRowModel: getCoreRowModel(),
        getCoreRowModel: getCoreRowModel(),
        meta: {
            title: mockData?.scheduleInfo.system ?? "",
            subtitle: mockData?.scheduleInfo.date ?? "",
            url: mockData?.scheduleInfo.url ?? "",
        },
    });

    if (isLoading) return <div>Yükleniyor...</div>;
    if (isError || !mockData) return <div>Hata oluştu.</div>;

    return (
        <div className="p-4 space-y-4 [&_tr]:border-b-0">
            {/* <div className="mb-4 border-none">
                <h1 className="text-2xl font-bold text-gray-800">{table.options.meta.title}</h1>
                <p className="text-gray-600">{table.options.meta.subtitle}</p>
                <p className="text-sm text-gray-500">{table.options.meta.url}</p>
            </div> */}
            <CalendarHeader />
            <div className="[&_*]:border-0 [&_*]:outline-0">
                <DataTableLayout
                    data={tableData}
                    columns={columns}
                    header={<TableHeaderRows table={table} />}
                    body={<TableBodyRows table={table} />}
                />
            </div>
        </div>

    );
};




export default AllCalendarPage;
// /app/calendar/RandevuTakvimi.tsx