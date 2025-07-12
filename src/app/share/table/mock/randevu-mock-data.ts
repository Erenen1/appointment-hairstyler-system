// // features/ui/data-table/mock-data.ts
// export type Randevu = {
//     id: string
//     musteri: string
//     tarih: string
//     durum: "onaylandı" | "bekliyor" | "iptal"
// }
// features/ui/data-table/randevu-mock-data.ts

export type Randevu = {
    id: number
    customerId: number
    staffId: number
    serviceId: number
    statusId: number
    status: 'onaylandı' | 'bekliyor' | 'iptal'
    appointmentDate: string
    startTime: string
    endTime: string
    notes: string
    price: number
    createdByAdmin: number | null
    createdAt: string
    updatedAt: string
}
