// features/ui/data-table/columns.ts
import { ColumnDef } from "@tanstack/react-table"
import { formatDateToTurkish } from "../utils/formatDateToTurkish";
import { Staff } from "../types/StaffType";

export const staffColumns: ColumnDef<Staff>[] = [
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
        accessorKey: "isActive",
        header: "Çalışıyor Mu?",
        cell: ({ row }) => {
            const isActive = row.getValue("isActive");
            return isActive ? 'Çalışıyor ✔️' : 'Çalışmıyor ❌'
        },
    },
    {
        accessorKey: "specialties",
        header: "Verdiği Hizmet",
        cell: ({ row }) => row.getValue("specialties") ?? "",
    },
    {
        accessorKey: "createdAt",
        header: "Oluşturma Tarihi",
        cell: ({ row }) => formatDateToTurkish(row.getValue("createdAt") as string),
    },
    {
        accessorKey: "updatedAt",
        header: "Güncelleme Tarihi",
        cell: ({ row }) => formatDateToTurkish(row.getValue("updatedAt") as string),
    },

]
