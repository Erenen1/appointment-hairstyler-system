import { ColumnDef } from '@tanstack/react-table';
import { Check, X } from 'lucide-react';
import { formatDateToTurkish } from '../../staff/utils/formatDateToTurkish';
import { Service } from '../types/CreateServiceType';
import { getTokenToLocalStorage } from '@/features/admin/utils/auth';
import { DetailButton } from '@/app/share/GlobalDetailButton';
import { UpdateButton } from '@/app/share/GlobalUpdateButton';
import { DeleteButton } from '@/app/share/GlobalDeleteButton';
import deleteCustomers from '@/features/customers/services/DeleteCustomersApi';

export const servicesColumns: ColumnDef<Service>[] = [
    // {
    //     accessorKey: "staffMembers",
    //     header: "Personel(ler)",
    //     cell: ({ row }) => {
    //         const staffList = row.getValue("staffMembers") as { fullName: string }[];
    //         if (!staffList || staffList.length === 0) return "Yok";
    //         return staffList.map((s) => s.fullName).join(", ");
    //     },
    // },

    {
        header: "Kategori Adı",
        cell: ({ row }) => row.original.category?.name ?? "Kategori adı girilmemiş",
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
        accessorKey: "duration",
        header: "Süre",
        cell: ({ row }) => row.getValue("duration") ?? "",
    },
    {
        accessorKey: "price",
        header: "Ücret (₺)",
        cell: ({ row }) => {
            const val = row.getValue("price");
            return val ? `${Number(val).toLocaleString('tr-TR')} ₺` : "—";
        },
    },
    {
        accessorKey: "isActive",
        header: "Aktif Kullanılıyor mu?",
        cell: ({ row }) => {
            const isActive = row.getValue("isActive");
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
            );
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
            const service = row.original;
            const token = getTokenToLocalStorage();

            return (
                <div className="flex justify-center gap-3.5">
                    <DetailButton
                        onClick={() => deleteCustomers(service.id, token as string)}
                        title='Detaylar'
                    />
                    <UpdateButton
                        onClick={() => deleteCustomers(service.id, token as string)}
                        title='Güncelle'
                    />
                    <DeleteButton
                        onClick={() => deleteCustomers(service.id, token as string)}
                        title='Sil'
                    />
                </div>
            );
        }
    }
];
