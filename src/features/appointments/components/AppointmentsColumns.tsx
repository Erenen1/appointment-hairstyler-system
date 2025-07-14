import { ColumnDef } from "@tanstack/react-table"
import { Appointment } from "../types/AppointmentType"

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
