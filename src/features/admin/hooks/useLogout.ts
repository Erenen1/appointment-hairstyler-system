// import { toast } from "sonner";
// import adminLogout from "../services/SuperAdminLogout";
// import { removeTokenFromLocalStorage } from "../utils/auth";

// export async function handleLogout(token: string) {
//     try {
//         const res = await adminLogout(token)
//         toast.success('Çıkış yapıldı ✅')
//         removeTokenFromLocalStorage()
//         return res;
//     } catch (error) {
//         console.error('Çıkış yapılamadı ❌');
//         throw error;
//     }
// }
// import { toast } from "sonner";
// import adminLogout from "../services/SuperAdminLogout";
// import { removeTokenFromLocalStorage, getTokenToLocalStorage } from "../utils/auth";
// import { redirect } from "next/navigation";

// export async function handleLogout() {
//     try {
//         const token = getTokenToLocalStorage();
//         if (!token) {
//             toast.error("Token bulunamadı ❌");
//             return;
//         }

//         const res = await adminLogout(token);
//         removeTokenFromLocalStorage();
//         toast.success("Çıkış yapıldı ✅");
//         redirect('/admin')

//         // (Opsiyonel) Sayfa yönlendirme
//         return res;
//         // router.push('/admin/login');

//     } catch (error) {
//         console.error("Çıkış yapılamadı ❌", error);
//         toast.error("Çıkış yapılamadı ❌");
//         throw error;
//     }
// }


'use client';

import { toast } from "sonner";
import adminLogout from "../services/SuperAdminLogout";
import { getTokenToLocalStorage, removeTokenFromLocalStorage } from "../utils/auth";
import { useRouter } from 'next/navigation';

export function useLogout() {
    const router = useRouter();

    const handleLogout = async () => {
        try {
            const token = getTokenToLocalStorage();
            if (!token) {
                toast.error("Token bulunamadı ❌");
                return;
            }

            await adminLogout(token);
            removeTokenFromLocalStorage();
            toast.success("Çıkış yapıldı ✅");

            router.push('/admin'); // ✅ Client-side yönlendirme
        } catch (error) {
            console.error("Çıkış yapılamadı ❌", error);
            toast.error("Çıkış yapılamadı ❌");
            throw error;
        }
    };

    return { handleLogout };
}
