// 'use client';
// import React from 'react'
// import { adminLogout } from '../service/SuperAdminLogout';
// import { Button } from '@/components/ui/button';
// import { toast } from 'sonner';

// const AdminLogoutButton = () => {
// const handleLogout = async (e: React.FormEvent) => {
//         try {
//             e.preventDefault();
//             const res = await adminLogout();
//             if (res.message === 'Çıkış başarılı') {
//                 toast.success('Çıkış Başarılı ✅')
//             } else if (res.message === 'Yetkisiz erişim') {
//                 toast.error('Çıkış Başarısız ❌')
//             } else if (res.message === 'Sunucu hatası') {
//                 toast.error('Sunucu Hatası ❌')
//             }
//         } catch (error) {
//             console.error('Beklenmeyen bir hata oluştu', error)
//             toast.error('Sunucu hatası oluştu!')
//         }


//     }
//     return (
//         <Button onClick={handleLogout}>
//             Çıkış Yap
//         </Button>
//     )

// }

// export default AdminLogoutButton

// { claude }

import { toast } from 'sonner';
import { adminLogout } from '../service/SuperAdminLogout';

export const useAdminLogout = () => {

    const handleLogout = async () => {
        try {
            const res = await adminLogout();

            switch (res.message) {
                case 'Çıkış başarılı':
                    toast.success('Çıkış Başarılı ✅');
                    break;
                case 'Yetkisiz erişim':
                    toast.error('Çıkış Başarısız ❌');
                    break;
                case 'Sunucu hatası':
                    toast.error('Sunucu Hatası ❌');
                    break;
                default:
                    toast.error('Beklenmeyen bir hata oluştu');
            }
        } catch (error) {
            console.error('Beklenmeyen bir hata oluştu', error);
            toast.error('Sunucu hatası oluştu!');
        }
    };

    return { handleLogout }
};

