import { Customers } from "@/features/customers/types/CreateCustomersType";
import { ColumnDef } from "@tanstack/react-table";

export const customersColumns: ColumnDef<Customers>[] = [
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
        accessorKey: "loyaltyPoints",
        header: "Sadakat Puanı",
        cell: ({ row }) => row.getValue("loyaltyPoints") ?? "",
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
        cell: ({ row }) => row.getValue("createdAt") ?? "",
    },
    {
        accessorKey: "updatedAt",
        header: "Güncellenme Tarihi",
        cell: ({ row }) => row.getValue("updatedAt") ?? "",
    },
]