import { usePathname } from "next/navigation";
import { useMemo } from "react";

const pageMap: Record<string, string> = {
    "/admin": "Dashboard",
    "/admin/istatistikler": "İstatistikler",
    "/admin/ilan-analitikleri": "İlan Analitikleri",
    "/admin/musteriler": "Müşteriler",
    "/admin/randevular": "Randevular",
    "/admin/randevu-takvimi": "Randevu Takvimi",
    "/admin/whatsapp-bot": "WhatsApp Bot",
    "/admin/gelir": "Gelir Yönetimi",
    "/admin/gider": "Gider Yönetimi",


    "/admin/ayarlar": "Ayarlar"
};

export const usePageTitle = () => {
    const pathname = usePathname();

    const currentPageTitle = useMemo(() => {
        return pageMap[pathname] || "Emlak Yönetim";
    }, [pathname]);

    return currentPageTitle;
};
