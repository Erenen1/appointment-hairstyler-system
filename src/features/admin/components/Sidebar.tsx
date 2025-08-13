"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "primereact/button";
import { Sidebar } from "primereact/sidebar";
import { useResponsive } from "../../../hooks";

const menuModel = [
    { label: "Dashboard", icon: "pi pi-home", url: "/admin" },
    { label: "Randevu Takvimi", icon: "pi pi-calendar", url: "/admin/randevu-takvimi" },
    { label: "Randevular", icon: "pi pi-chart-line", url: "/admin/randevular" },
    { label: "Müşteriler", icon: "pi pi-users", url: "/admin/musteriler" },
    { label: "Cari", icon: "pi pi-credit-card", url: "/admin/cari" },
    { label: "Gelir", icon: "pi pi-arrow-up", url: "/admin/gelir" },
    { label: "Gider", icon: "pi pi-arrow-down", url: "/admin/gider" },
];

interface SideNavProps {
    collapsed: boolean;
}

function SideNav({ collapsed }: SideNavProps) {
    return (
        <nav className="p-3 space-y-2">
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
        </nav>
    );
}

interface SidebarProps {
    children: React.ReactNode;
}

export default function AdminSidebar({ children }: SidebarProps) {
    const [collapsed, setCollapsed] = useState(false);
    const [mobileSidebarVisible, setMobileSidebarVisible] = useState(false);
    const { isMobile } = useResponsive();

    const gridCols = collapsed ? "md:grid-cols-[80px_1fr]" : "md:grid-cols-[280px_1fr]";

    return (
        <div className={`min-h-screen grid grid-cols-1 ${gridCols} transition-all duration-300`}>
            {/* Sticky sidebar on desktop */}
            <aside className="hidden md:block border-r border-blue-200 bg-gradient-to-b from-blue-50 to-white shadow-lg sticky top-0 h-screen overflow-y-auto">
                <div className={`px-4 py-6 font-bold text-blue-800 ${collapsed ? "text-center" : ""}`}>
                    {collapsed ? "Y" : "Yönetim Paneli"}
                </div>
                <SideNav collapsed={collapsed} />

                {/* Sidebar Toggle Button - Bottom'da */}
                <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                    <Button
                        icon={collapsed ? "pi pi-chevron-right" : "pi pi-chevron-left"}
                        rounded
                        className={`transition-all duration-200 ${collapsed
                            ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                            : "bg-blue-600 text-white hover:bg-blue-700"
                            } border-0 shadow-md hover:shadow-lg`}
                        onClick={() => setCollapsed((v) => !v)}
                        aria-label="Sidebar Daralt/Genişlet"
                    />
                </div>
            </aside>

            {/* Content area */}
            <div className="flex flex-col bg-gray-50">
                {/* Top bar */}
                <div className="flex items-center justify-between border-b border-blue-200 px-4 py-4 md:px-6 bg-white sticky top-0 z-10 shadow-sm">
                    <div className="flex items-center gap-3">
                        {isMobile && (
                            <Button
                                icon="pi pi-bars"
                                text
                                className="text-blue-600 hover:text-blue-700"
                                onClick={() => setMobileSidebarVisible(true)}
                                aria-label="Menüyü Aç"
                            />
                        )}
                        <span className="font-bold text-blue-800 text-lg">Admin Panel</span>
                    </div>
                    <div className="text-sm text-blue-600 font-medium">PrimeReact Admin</div>
                </div>

                <main className="p-4 md:p-6 bg-gray-50 min-h-screen">{children}</main>
            </div>

            {/* Mobile Sidebar */}
            <Sidebar
                visible={mobileSidebarVisible}
                position="left"
                onHide={() => setMobileSidebarVisible(false)}
                className="w-80 md:hidden"
                header={
                    <div className="flex items-center gap-3 p-4 border-b border-blue-200">
                        <i className="pi pi-home text-blue-600 text-xl"></i>
                        <span className="font-bold text-blue-800">Yönetim Paneli</span>
                    </div>
                }
            >
                <SideNav collapsed={false} />
            </Sidebar>
        </div>
    );
}
