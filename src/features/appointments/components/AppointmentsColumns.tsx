import { ColumnDef } from "@tanstack/react-table"
import { Appointment } from "../types/AppointmentType"
import { getTokenToLocalStorage } from "@/features/admin/utils/auth"
import { DetailButton } from "@/app/share/GlobalDetailButton"
import { DeleteButton } from "@/app/share/GlobalDeleteButton"
import deleteCustomers from "@/features/customers/services/DeleteCustomersApi"
import { DeleteAlertDialogDemo } from "@/app/share/DeleteAlertDialog"
import deleteAppointment from "../services/DeleteApoointmentsApi"

export const appointmentsColumns: ColumnDef<Appointment>[] = [
    {
        accessorKey: "appointmentDate",
        header: "Randevu Tarihi",
        cell: ({ row }) => row.getValue("appointmentDate") ?? "",
    },
    {
        accessorKey: "appointmentTime",
        header: "Randevu Saati",
        cell: ({ row }) => row.getValue("appointmentTime") ?? "",
    },
    {
        accessorKey: "price",
        header: "Fiyat (₺)",
        cell: ({ row }) => {
            const price = parseFloat(row.getValue("price"))
            return new Intl.NumberFormat("tr-TR", {
                style: "currency",
                currency: "TRY",
                minimumFractionDigits: 0,
            }).format(price)
        },
    },
    {
        accessorKey: "notes",
        header: "Notlar",
        cell: ({ row }) => row.getValue("notes") ?? "-",
    },
    {
        id: 'actions',
        header: '',
        cell: ({ row }) => {
            const appointment = row.original;
            const token = getTokenToLocalStorage()
            return (
                <div className="flex justify-center gap-3.5">
                    <DetailButton
                        onClick={() => deleteCustomers(appointment.id.toString(), token as string)}
                        title='Detaylar' />
                    <DeleteAlertDialogDemo
                        onConfirm={() => deleteAppointment(appointment, token as string)}
                        title='Randevuyu Sil'
                        description='Randevuyu silmek istediğinize emin misiniz?'
                        footer='Bu işlem geri alınamaz.'
                        toast='Randevu başarıyla silindi.'>
                        <DeleteButton
                            title='Sil' />
                    </DeleteAlertDialogDemo>
                </div>
            )
        }
    }
    // {
    //     accessorKey: "statusId",
    //     header: "Durum",
    //     cell: ({ row }) => {
    //         const statusId = row.getValue('statusId') as number;
    //         const statusMap: Record<number, string> = {
    //             1: "Onaylandı",
    //             2: "Bekliyor",
    //             3: "Tamamlandı",
    //             4: "İptal Edildi",
    //             5: "Müşteri İptali",
    //         }
    //         return <div>{statusMap[statusId] ?? "Bilinmiyor"}   </div>;

    //     },
    // },
]
