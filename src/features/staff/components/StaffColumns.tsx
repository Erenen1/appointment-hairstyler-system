// features/ui/data-table/columns.ts
import { ColumnDef } from "@tanstack/react-table"
import { formatDateToTurkish } from "../utils/formatDateToTurkish";
import { Staff } from "../types/StaffType";
import { getTokenToLocalStorage } from "@/features/admin/utils/auth";
import { DetailButton } from '../../../app/share/GlobalDetailButton';
import { UpdateButton } from "@/app/share/GlobalUpdateButton";
import { DeleteButton } from "@/app/share/GlobalDeleteButton";
import deleteCustomers from "@/features/customers/services/DeleteCustomersApi";
import UpdateStaffModal from "./UpdateStaffModal";
import { DeleteAlertDialogDemo } from "@/app/share/DeleteAlertDialog";
import { toast } from "sonner";

export const staffColumns: ColumnDef<Staff>[] = [
    {
        accessorKey: "fullName",
        header: "Personel Adı",
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
                        onClick={() => deleteCustomers(staff.id as string, token as string)}
                        title='Detaylar' />
                    <UpdateStaffModal selectedStaff={staff} >
                        <UpdateButton
                            title="Güncelle"
                        />
                    </UpdateStaffModal>
                    <DeleteAlertDialogDemo
                        title={`Personeli Silmek istediğinize emin misiniz?`}
                        description="Seçmiş olduğunuz personel kaydı kalıcı olarak silinecektir."
                        footer='Bu işlem geri alınamaz!'
                        onConfirm={() => {
                            toast.success("Personel başarıyla silindi!");
                            deleteCustomers(staff.id as string, token as string);
                        }}
                    >
                        <DeleteButton
                            onClick={() => deleteCustomers(staff.id as string, token as string)}
                            title='Sil' />
                    </DeleteAlertDialogDemo>
                </div>
            )
        }
    }

]
