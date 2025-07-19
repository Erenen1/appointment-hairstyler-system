import { ColumnDef } from '@tanstack/react-table';
import { Categories } from '../types/CategoriesType';
import { Check, X } from 'lucide-react';
import { formatDateToTurkish } from '../../staff/utils/formatDateToTurkish';
import { DetailButton } from '@/app/share/GlobalDetailButton';
import { UpdateButton } from '@/app/share/GlobalUpdateButton';
import { DeleteButton } from '@/app/share/GlobalDeleteButton';
import { getTokenToLocalStorage } from '@/features/admin/utils/auth';
import deleteCustomers from '@/features/customers/services/DeleteCustomersApi';
import deleteCategories from '../services/DeleteCategoriesApi';
import { DeleteAlertDialogDemo } from '@/app/share/DeleteAlertDialog';
import UpdateCategoriesModal from './UpdateCategoriesModal';
import { toast } from 'sonner';


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
        cell: ({ row }) => formatDateToTurkish(row.getValue("createdAt") as string)
    },
    {
        accessorKey: "updatedAt",
        header: "Güncelleme Tarihi",
        cell: ({ row }) => formatDateToTurkish(row.getValue("updatedAt") as string)
    },
    {
        id: 'actions',
        header: '',
        cell: ({ row }) => {
            const categories = row.original;
            const token = getTokenToLocalStorage()
            return (
                <div className="flex justify-center gap-3.5">
                    <DetailButton
                        onClick={() => deleteCustomers(categories.id, token as string)}
                        title='Detaylar' />
                    <UpdateCategoriesModal
                        selectedCategory={categories}

                    >
                        <UpdateButton
                            title='Güncelle'
                        />
                    </UpdateCategoriesModal>
                    <DeleteAlertDialogDemo
                        onConfirm={() => {
                            toast.success("Kategori başarıyla silindi!");
                            deleteCategories(categories.id, token as string);
                        }}
                        title='Kategori Silinecek'
                        footer='Bu işlem geri alınamaz!'
                        description="Seçmiş olduğunuz kategori kaydı kalıcı olarak silinecektir."
                    // onOpenChange={() => { }}
                    >
                        <DeleteButton
                            title='Sil'
                            onClick={() => deleteCategories(categories.id, token as string)}
                        />
                    </DeleteAlertDialogDemo>
                </div>
            )
        }
    }
]