import { ColumnDef } from '@tanstack/react-table';
import { Categories } from '../types/CreateCategoriesType';
import { Check, X } from 'lucide-react';


export const categoriesColumns: ColumnDef<Categories>[] = [
    {
        accessorKey: "name",
        header: "Kategori Adı",
        cell: ({ row }) => row.getValue("name") ?? "",
    },
    {
        accessorKey: "description",
        header: "Açıklama",
        cell: ({ row }) => row.getValue("description") ?? "",
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
        accessorKey: "createdAt",
        header: "Oluşturma Tarihi",
        cell: ({ row }) => row.getValue("createdAt") ?? "",
    },
    {
        accessorKey: "updatedAt",
        header: "Güncelleme Tarihi",
        cell: ({ row }) => row.getValue("updatedAt") ?? "",
    },
]