// features/ui/data-table/columns.ts
import { ColumnDef } from "@tanstack/react-table"
import { formatDateToTurkish } from "../utils/formatDateToTurkish";
import { Staff } from "../types/StaffType";
import { getTokenToLocalStorage } from "@/features/admin/utils/auth";
import { DetailButton } from '../../../app/share/GlobalDetailButton';
import { UpdateButton } from "@/app/share/GlobalUpdateButton";
import { DeleteButton } from "@/app/share/GlobalDeleteButton";
import deleteCustomers from "@/features/customers/services/DeleteCustomersApi";

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
    {
        id: 'actions',
        header: '',
        cell: ({ row }) => {
            const staff = row.original;
            const token = getTokenToLocalStorage()
            return (
                <div className="flex justify-center gap-3.5">
                    <DetailButton
                        onClick={() => deleteCustomers(staff.id, token as string)}
                        title='Detayler' />
                    <UpdateButton
                        onClick={() => deleteCustomers(staff.id, token as string)}
                        title='Güncelle'
                    />
                    <DeleteButton
                        onClick={() => deleteCustomers(staff.id, token as string)}
                        title='Sil' />
                </div>
            )
        }
    }

]
