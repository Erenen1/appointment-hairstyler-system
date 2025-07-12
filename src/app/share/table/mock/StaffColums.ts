// features/ui/data-table/columns.ts
import { ColumnDef } from "@tanstack/react-table"
import { Personel } from "./personel-mock-data"

export const staffColumns: ColumnDef<Personel>[] = [
    {
        accessorKey: "fullName",
        header: "Müşteri Adı",
        cell: ({ row }) => row.getValue("fullName") ?? "",
    },
    {
        accessorKey: "phone",
        header: "Telefon Numarası",
        cell: ({ row }) => row.getValue("phone") ?? "",
    },
    {
        accessorKey: "email",
        header: "E-posta",
        cell: ({ row }) => row.getValue("email") ?? "",
    },
    {
        accessorKey: "specialties",
        header: "Verdiği Hizmet",
        cell: ({ row }) => row.getValue("specialties") ?? "",
    },
    {
        accessorKey: "isWorking",
        header: "Çalışıyor Mu?",
        cell: ({ row }) => row.getValue("isWorking") ?? "",
    },
]
