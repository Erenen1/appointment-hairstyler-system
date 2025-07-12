// features/ui/data-table/layout.tsx
"use client"

import {
    Table,
    TableBody,
    TableHeader,
} from "@/components/ui/table"


import { ReactNode } from "react"
// import { SearchForm } from "../sidebar/components/SearchForm"
import { PaginationItems } from "../Pag"

export function DataTableLayout({
    header,
    body,
}: {
    header: ReactNode
    body: ReactNode
}) {
    return (
        <div className="space-y-4 w-full">
            {/* <SearchForm /> */}
            {/* buaraya verileri gönderip tüm searchbarları burdan da yönetebiliriiz bunu üzerine çalışılacak */}
            <div className="border rounded-md">
                <Table>
                    <TableHeader>{header}</TableHeader>
                    <TableBody>{body}</TableBody>
                </Table>
            </div>
            <div className="flex justify-end py-4">
                <PaginationItems />
            </div>
        </div>
    )
}
