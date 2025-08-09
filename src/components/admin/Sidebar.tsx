"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "primereact/button";
import UserAvatar from "./UserAvatar";
import BusinessInfo from "./BusinessInfo";
import { usePageTitle } from "@/hooks";

const menuModel = [
    { label: "Özet", icon: "pi pi-home", url: "/admin" },
    { label: "İstatistikler", icon: "pi pi-chart-bar", url: "/admin/istatistikler" },
    { label: "İlan Analitikleri", icon: "pi pi-chart-pie", url: "/admin/ilan-analitikleri" },
    { label: "Müşteriler", icon: "pi pi-users", url: "/admin/musteriler" },
    { label: "Randevular", icon: "pi pi-calendar", url: "/admin/randevular" },
    { label: "WhatsApp Bot", icon: "pi pi-whatsapp", url: "/admin/whatsapp-bot" },
    { label: "Satış Gelirleri", icon: "pi pi-arrow-up", url: "/admin/gelir" },
    { label: "Giderler", icon: "pi pi-arrow-down", url: "/admin/gider" },
    { label: "Cari Hesaplar", icon: "pi pi-credit-card", url: "/admin/cari-hesaplar" },
];

interface SideNavProps {
    collapsed: boolean;
}

function SideNav({ collapsed }: SideNavProps) {
    return (
        <nav className="p-3 space-y-2 flex flex-col h-full">
            {/* Ana Menü */}
            <div className="flex-1 space-y-2">
                {menuModel.map((m) => (
                    <Link
                        key={m.url}
                        href={m.url}
                        title={m.label}
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
    const pageTitle = usePageTitle();

    const gridCols = collapsed ? "md:grid-cols-[80px_1fr]" : "md:grid-cols-[280px_1fr]";

    return (
        <div className={`min-h-screen grid grid-cols-1 ${gridCols} transition-all duration-300`}>
            {/* Sticky sidebar on desktop */}
            <aside className="hidden md:block border-r border-blue-200 bg-gradient-to-b from-blue-50 to-white shadow-lg sticky top-0 h-screen overflow-y-auto relative">
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

            {/* Content area */}
            <div className="flex flex-col bg-gray-50">
                {/* Top bar */}
                <div className="flex items-center justify-between border-b border-blue-200 px-4 py-4 md:px-6 bg-white sticky top-0 z-10 shadow-sm">
                    <div className="flex items-center gap-4">
                        {/* Sidebar Toggle Button */}
                        <Button
                            icon={collapsed ? "pi pi-bars" : "pi pi-times"}
                            rounded
                            text
                            className={`transition-all duration-200 ${collapsed
                                ? "text-blue-600 hover:bg-blue-50"
                                : "text-blue-600 hover:bg-blue-50"
                                } border-0`}
                            onClick={() => setCollapsed((v) => !v)}
                            aria-label="Menüyü Aç/Kapat"
                            tooltip={collapsed ? "Menüyü Genişlet" : "Menüyü Daralt"}
                            tooltipOptions={{ position: 'bottom' }}
                        />
                        <div className="flex items-center gap-3">
                            <h1 className="text-xl font-bold text-gray-900">{pageTitle}</h1>
                        </div>
                    </div>
                    <div></div>
                </div>

                <main className="p-4 md:p-6 bg-gray-50 min-h-screen">{children}</main>
            </div>
        </div>
    );
}

