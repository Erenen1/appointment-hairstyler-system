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
import DetailStaffModal from "./DetailStaffModal";

export const staffColumns: ColumnDef<Staff>[] = [
    {
        accessorKey: "firstName",
        header: "Personel Adı",
        cell: ({ row }) => row.getValue("firstName") ?? "",
    },
    {
        accessorKey: "lastName",
        header: "Soyad",
        cell: ({ row }) => row.getValue("lastName") ?? "",
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
        accessorKey: "description",
        header: "Açıklama",
        cell: ({ row }) => row.getValue("description") ?? "",
    },
    {
        accessorKey: "isAvailable",
        header: "Müsait mi?",
        cell: ({ row }) => {
            const isAvailable = row.getValue("isAvailable");
            return isAvailable ? 'Evet ✔️' : 'Hayır ❌';
        }
    },
    // {
    //     accessorKey: "isActive",
    //     header: "Çalışıyor Mu?",
    //     cell: ({ row }) => {
    //         const isActive = row.getValue("isActive");
    //         return isActive ? 'Çalışıyor ✔️' : 'Çalışmıyor ❌'
    //     },
    // },
    {
        accessorKey: "specialization",
        header: "Verdiği Hizmet",
        cell: ({ row }) => row.getValue("specialization") ?? "",
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
                    <DetailStaffModal staff={staff}>
                        <DetailButton
                            onClick={() => { }}
                            title='Detaylar' />
                    </DetailStaffModal>
                    <UpdateStaffModal selectedStaff={staff} >
                        <UpdateButton
                            title="Güncelle"
                        />
                    </UpdateStaffModal>
                    <DeleteAlertDialogDemo
                        onConfirm={() => {
                            toast.success("Personel başarıyla silindi!");
                            deleteCustomers(staff.id as string, token as string);
                        }}
                        // onOpenChange={() => { }}
                        title={`Personeli Silmek istediğinize emin misiniz?`}
                        description="Seçmiş olduğunuz personel kaydı kalıcı olarak silinecektir."
                        footer='Bu işlem geri alınamaz!'
                    >
                        <DeleteButton
                            title='Sil' />
                    </DeleteAlertDialogDemo>
                </div>
            )
        }
    }

]
