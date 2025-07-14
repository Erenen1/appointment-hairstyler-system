import { ColumnDef } from '@tanstack/react-table';
import { Check, X } from 'lucide-react';
import { formatDateToTurkish } from '../../staff/utils/formatDateToTurkish';
import { Service } from '../types/CreateServiceType';


export const servicesColumns: ColumnDef<Service>[] = [
    {
        accessorKey: "categoryId",
        header: "Kategori Adı",
        cell: ({ row }) => row.getValue("categoryId") ?? "",
    },
    {
        accessorKey: "title",
        header: "Başlık",
        cell: ({ row }) => row.getValue("title") ?? "",
    },
    {
        accessorKey: "description",
        header: "Açıklama",
        cell: ({ row }) => row.getValue("description") ?? "",
    },
    {
        accessorKey: "duraiton",
        header: "Süre",
        cell: ({ row }) => row.getValue("duraiton") ?? "",
    },
    {
        accessorKey: "price",
        header: "Ücret (₺)",
        cell: ({ row }) => row.getValue("price") ?? "",
    },
    {
        accessorKey: "isActive",
        header: "Aktif Kullanılıyor mu?",
        cell: ({ row }) => {
            const isActive = row.getValue("isActive")
            return isActive ? (
                <div className='flex items-center gap-1.5'>
                    <p>Aktif</p>
                    <Check className='text-green-500 w-4 h-4' />
                </div>

            ) : (
                <div className='flex items-center gap-1.5'>
                    <p>Pasif</p>
                    <X className='text-red-500 w-4 h-4' />
                </div>
            )
        }
    },
    {
        accessorKey: "isPopular",
        header: "Popüler",
        cell: ({ row }) => row.getValue("isPopular") ?? "",
    },
    {
        accessorKey: "createdAt",
        header: "Oluşturma Tarihi",
        cell: ({ row }) => formatDateToTurkish(row.getValue("createdAt") as string)
    },
    {
        accessorKey: "updatedAt",
        header: "Güncelleme Tarihi",
        cell: ({ row }) => formatDateToTurkish(row.getValue("updatedAt") as string)
    },
]