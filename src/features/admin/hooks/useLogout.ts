'use client';

import { toast } from "sonner";
import logoutBusiness from "../services/LogoutBusinessApi";
import { getTokenToLocalStorage, removeTokenFromLocalStorage } from "../utils/auth";
import { useRouter } from 'next/navigation';
import { useLoading } from "@/app/contexts/LoadingContext";

export function useLogout() {
    const { showLoading, hideLoading } = useLoading();
    const router = useRouter();

    const handleLogout = async () => {
        try {
            const token = getTokenToLocalStorage();
            if (!token) {
                toast.error("Token bulunamadı ❌");
                return;
            }

            await logoutBusiness(token);
            removeTokenFromLocalStorage();
            toast.success("Çıkış yapıldı ✅");
            showLoading() //saniye göster
            router.push('/admin'); // ✅ Client-side yönlendirme
            setTimeout(() => hideLoading(), 2000);
        } catch (error) {
            console.error("Çıkış yapılamadı ❌", error);
            toast.error("Çıkış yapılamadı ❌");
            throw error;
        }
    };

    return { handleLogout };
}
