import { ColumnDef } from "@tanstack/react-table";
import { formatDateToTurkish } from '../../staff/utils/formatDateToTurkish';
import { Customer } from "../types/CustomersType";
import deleteCustomers from "../services/DeleteCustomersApi";
import { getTokenToLocalStorage } from "@/features/admin/utils/auth";
import { DeleteButton } from "@/app/share/GlobalDeleteButton";
import { DetailButton } from "@/app/share/GlobalDetailButton";
import { UpdateButton } from "@/app/share/GlobalUpdateButton";
import { DeleteAlertDialogDemo } from "@/app/share/DeleteAlertDialog";
import { toast } from "sonner";
import UpdateCustomersModal from "./UpdateCustomersModal";

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
    {
        id: 'actions',
        header: '',
        cell: ({ row }) => {
            const customer = row.original;
            const token = getTokenToLocalStorage();
            return (
                <div className="flex justify-center gap-3.5">

                    <DetailButton
                        title='Detaylar'
                        onClick={() => deleteCustomers(customer.id, token as string)}
                    />
                    <UpdateCustomersModal selectedCustomer={customer}>
                        <UpdateButton
                            title='Güncelle' />
                    </UpdateCustomersModal>

                    <DeleteAlertDialogDemo
                        title={`Müşteriyi Silmek istediğinize emin misiniz?`}
                        description="Seçmiş olduğunuz müşteri kaydı kalıcı olarak silinecektir."
                        footer='Bu işlem geri alınamaz!'
                        onConfirm={() => {
                            toast.success("Müşteri başarıyla silindi!");
                            deleteCustomers(customer.id, token as string);
                        }}>
                        <DeleteButton
                            title='Sil'
                        />
                    </DeleteAlertDialogDemo>
                </div>
            )
        }
    }
]