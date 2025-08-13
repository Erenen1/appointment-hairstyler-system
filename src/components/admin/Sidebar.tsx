"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "primereact/button";
import { Sidebar } from "primereact/sidebar";
import UserAvatar from "./UserAvatar";
import BusinessInfo from "./BusinessInfo";
import { usePageTitle } from "@/hooks";

const menuModel = [
    { label: "Randevu Takvimi", icon: "pi pi-home", url: "/admin/randevu-takvimi" },
    { label: "İstatistikler", icon: "pi pi-chart-bar", url: "/admin/istatistikler" },
    { label: "İlan Analitikleri", icon: "pi pi-chart-pie", url: "/admin/ilan-analitikleri" },
    { label: "Müşteriler", icon: "pi pi-users", url: "/admin/musteriler" },
    { label: "Randevular", icon: "pi pi-calendar", url: "/admin/randevular" },
    { label: "WhatsApp Bot", icon: "pi pi-whatsapp", url: "/admin/whatsapp-bot" },
    { label: "Satış Gelirleri", icon: "pi pi-arrow-up", url: "/admin/gelir" },
    { label: "Giderler", icon: "pi pi-arrow-down", url: "/admin/gider" },
];

interface SideNavProps {
    collapsed: boolean;
    onItemClick?: () => void;
}

function SideNav({ collapsed, onItemClick }: SideNavProps) {
    return (
        <nav className="p-3 space-y-2 flex flex-col h-full">
            {/* Ana Menü */}
            <div className="flex-1 space-y-2">
                {menuModel.map((m) => (
                    <Link
                        key={m.url}
                        href={m.url}
                        title={m.label}
                        onClick={onItemClick}
                        className={`flex items-center transition-all duration-200 ${collapsed ? "justify-center" : "gap-3"
                            } px-4 py-3 rounded-lg hover:bg-blue-50 hover:text-blue-700 no-underline group`}
                    >
                        <i className={`${m.icon} text-blue-600 group-hover:text-blue-700 transition-colors duration-200`}></i>
                        {!collapsed && (
                            <span className="text-gray-700 group-hover:text-blue-700 transition-colors duration-200 font-medium">
                                {m.label}
                            </span>
                        )}
                    </Link>
                ))}
            </div>
        </nav>
    );
}

interface SidebarProps {
    children: React.ReactNode;
}

export default function AdminSidebar({ children }: SidebarProps) {
    const [collapsed, setCollapsed] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const pathname = usePathname();
    const pageTitle = usePageTitle();

    // Kayıt ol sayfasında sidebar'ı gösterme
    const isAuthPage = pathname === "/admin/kayit-ol" || pathname === "/admin/giris-yap";

    const gridCols = collapsed ? "lg:grid-cols-[80px_1fr]" : "lg:grid-cols-[280px_1fr]";

    // Sayfa değişiminde mobil menüyü kapat
    useEffect(() => {
        setMobileMenuOpen(false);
    }, [pathname]);

    // Router events ile sayfa değişimini dinle
    useEffect(() => {
        const handleRouteChange = () => {
            setMobileMenuOpen(false);
        };

        // Popstate event (geri/ileri butonları)
        window.addEventListener('popstate', handleRouteChange);

        // Beforeunload event (sayfa yenileme)
        window.addEventListener('beforeunload', handleRouteChange);

        return () => {
            window.removeEventListener('popstate', handleRouteChange);
            window.removeEventListener('beforeunload', handleRouteChange);
        };
    }, []);

    const handleMenuToggle = () => {
        // Mobilde menü açılıp kapanır, desktop'ta sidebar daraltılıp genişletilir
        if (window.innerWidth < 1024) { // lg breakpoint
            setMobileMenuOpen(!mobileMenuOpen);
        } else {
            setCollapsed(!collapsed);
        }
    };

    const handleMobileMenuItemClick = () => {
        setMobileMenuOpen(false);
    };

    const handleSidebarHide = () => {
        setMobileMenuOpen(false);
    };

    // Auth sayfalarında sadece children'ı göster
    if (isAuthPage) {
        return <>{children}</>;
    }

    return (
        <div className={`min-h-screen grid grid-cols-1 ${gridCols} transition-all duration-300`}>
            {/* Desktop Sidebar */}
            <aside className="hidden lg:block border-r border-blue-200 bg-gradient-to-b from-blue-50 to-white shadow-lg sticky top-0 h-screen overflow-y-auto relative">
                {/* İşletme Adı */}
                <div className="pt-6">
                    <BusinessInfo collapsed={collapsed} />
                </div>

                <div className="flex flex-col h-[calc(100vh-200px)]">
                    <SideNav collapsed={collapsed} />
                </div>

                {/* User Avatar - Bottom */}
                <div className="absolute bottom-4 left-0 right-0 px-4">
                    <UserAvatar compact={collapsed} />
                </div>
            </aside>

            {/* PrimeReact Mobile Sidebar */}
            <Sidebar
                visible={mobileMenuOpen}
                position="left"
                onHide={handleSidebarHide}
                className="lg:hidden w-full max-w-sm"
                style={{ width: '100%', maxWidth: '24rem' }}
                modal={true}
                closeOnEscape={true}
                dismissable={true}
                showCloseIcon={true}
                header={
                    <div className="flex items-center justify-between w-full">
                        <BusinessInfo collapsed={false} />
                    </div>
                }
            >
                <div className="flex flex-col h-full">
                    {/* Mobile Navigation */}
                    <div className="flex-1">
                        <SideNav collapsed={false} onItemClick={handleMobileMenuItemClick} />
                    </div>

                    {/* Mobile User Avatar - Footer */}
                    <div className="p-4 border-t border-blue-200">
                        <UserAvatar compact={false} />
                    </div>
                </div>
            </Sidebar>

            {/* Content area */}
            <div className="flex flex-col bg-gray-50">
                {/* Top bar */}
                <div className="flex items-center justify-between border-b border-blue-200 px-4 py-4 lg:px-6 bg-white sticky top-0 z-10 shadow-sm">
                    <div className="flex items-center gap-4">
                        {/* Unified Menu Toggle Button - Works on all devices */}
                        <Button
                            icon={collapsed || mobileMenuOpen ? "pi pi-bars" : "pi pi-times"}
                            rounded
                            text
                            className="text-blue-600 hover:bg-blue-50 border-0 transition-all duration-200 w-10 h-10 flex items-center justify-center"
                            onClick={handleMenuToggle}
                            aria-label={collapsed || mobileMenuOpen ? "Menüyü Aç" : "Menüyü Kapat"}
                            tooltip={collapsed || mobileMenuOpen ? "Menüyü Aç" : "Menüyü Kapat"}
                            tooltipOptions={{ position: 'bottom' }}
                        />

                        <div className="flex items-center gap-3">
                            <h1 className="text-lg lg:text-xl font-bold text-gray-900">{pageTitle}</h1>
                        </div>
                    </div>
                    <div></div>
                </div>

                <main className="p-4 lg:p-6 bg-gray-50 min-h-screen">{children}</main>
            </div>
        </div>
    );
}

