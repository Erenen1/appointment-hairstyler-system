"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
    const router = useRouter();

    useEffect(() => {
        // Otomatik olarak randevu takvimi sayfasına yönlendir
        router.replace("/admin/randevu-takvimi");
    }, [router]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
            <div className="text-center text-white">
                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <h2 className="text-xl font-semibold mb-2">Yönlendiriliyor...</h2>
                <p className="text-slate-300">Randevu takvimi sayfasına yönlendiriliyorsunuz</p>
            </div>
        </div>
    );
}