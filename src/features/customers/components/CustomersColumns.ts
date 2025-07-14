import { ColumnDef } from "@tanstack/react-table";
import { formatDateToTurkish } from '../../staff/utils/formatDateToTurkish';
import { Customer } from "../types/CreateCustomersType";

export const customersColumns: ColumnDef<Customer>[] = [
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
        cell: ({ row }) => {

            const value = row.getValue("email")
            return value ? value : 'Veri girilmemiş'
        }
    },
    {
        accessorKey: "notes",
        header: "Not",
        cell: ({ row }) => {
            const value = row.getValue('notes')
            return value ? value : '-'
        }
    },
    {
        accessorKey: "createdAt",
        header: "Oluşturma Tarihi",
        cell: ({ row }) => formatDateToTurkish(row.getValue("createdAt") as string)
    },
    {
        accessorKey: "updatedAt",
        header: "Güncellenme Tarihi",
        cell: ({ row }) => formatDateToTurkish(row.getValue("updatedAt") as string)
    },
]