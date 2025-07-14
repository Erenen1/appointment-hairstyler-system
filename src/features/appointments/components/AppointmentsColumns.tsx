// // features/ui/data-table/columns.ts
// import { ColumnDef } from "@tanstack/react-table"
// import { Randevu } from "./randevu-mock-data"

// export const appointmentsColumns: ColumnDef<Randevu>[] = [
//     {
//         accessorKey: "müsteriAdi",
//         header: "Müşteri Adı",
//         cell: ({ row }) => row.getValue("müsteriAdi") ?? "",
//     },
//     {
//         accessorKey: "tarih",
//         header: "Tarih",
//         cell: ({ row }) => row.getValue("tarih") ?? "",
//     },
//     {
//         accessorKey: "durum",
//         header: "Durum",
//         cell: ({ row }) => row.getValue("durum") ?? "",
//     },
// ]




// features/ui/data-table/columns.ts
import { ColumnDef } from "@tanstack/react-table"
import { Randevu } from "../../../app/share/table/mock/randevu-mock-data"

export const appointmentsColumns: ColumnDef<Randevu>[] = [
    {
        accessorKey: "appointmentDate",
        header: "Tarih",
        cell: ({ row }) => row.getValue("appointmentDate") ?? "",
    },
    {
        accessorKey: "startTime",
        header: "Başlangıç",
        cell: ({ row }) => row.getValue("startTime") ?? "",
    },
    {
        accessorKey: "endTime",
        header: "Bitiş",
        cell: ({ row }) => row.getValue("endTime") ?? "",
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
    //         const statusMap: Record<number, string> = {
    //             1: "Onaylandı",
    //             2: "Bekliyor",
    //             3: "Tamamlandı",
    //             4: "İptal Edildi",
    //             5: "Müşteri İptali",
    //         }
    //         return (
    //             <div>
    //             { statusMap[row.getValue("statusId")]: "Bilinmiyor" }
    //             </div>
    //         )
    //     },
    // },
]
