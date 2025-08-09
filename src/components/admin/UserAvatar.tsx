"use client";

import { useRef, useEffect } from "react";
import { Avatar } from "primereact/avatar";
import { Menu } from "primereact/menu";
import { MenuItem } from "primereact/menuitem";
import { useRouter } from "next/navigation";

interface UserAvatarProps {
    compact?: boolean;
}

export default function UserAvatar({ compact = false }: UserAvatarProps) {
    // Mock data for now - gerçek uygulamada context'ten gelecek
    const userName = "Ahmet Yılmaz";
    const userAvatar = undefined;
    const userRole = "İşletme Sahibi";

    const menuRef = useRef<Menu>(null);
    const router = useRouter();

    // Scroll event listener to close menu
    useEffect(() => {
        const handleScroll = () => {
            // PrimeReact Menu scroll'da otomatik kapanır appendTo="body" ile
            // Bu sadece ekstra güvenlik için
            const menuOverlay = document.querySelector('.p-menu-overlay[aria-hidden="false"]');
            if (menuOverlay) {
                // Menu overlay'ini gizle
                (menuOverlay as HTMLElement).style.display = 'none';
            }
        };

        document.addEventListener('scroll', handleScroll, true);
        return () => {
            document.removeEventListener('scroll', handleScroll, true);
        };
    }, []);

    const handleLogout = () => {
        const confirmLogout = window.confirm("Çıkış yapmak istediğinizden emin misiniz?");
        if (confirmLogout) {
            console.log("Çıkış yapılıyor...");
            alert("✅ Güvenli çıkış yapıldı! (Simülasyon)");
            // Gerçek uygulamada: localStorage.clear(), redirect to login, etc.
        }
    };

    const menuItems: MenuItem[] = [
        {
            label: userName,
            className: "font-semibold text-blue-800 border-b border-gray-200 pb-2 mb-2",
            template: () => (
                <div className="px-3 py-2">
                    <div className="font-semibold text-blue-800">{userName}</div>
                    <div className="text-sm text-gray-500">{userRole}</div>
                    <div className="text-xs text-gray-400 mt-1">Son giriş: Bugün 09:30</div>
                </div>
            )
        },
        {
            separator: true
        },
        {
            label: "Hesap Ayarları",
            icon: "pi pi-cog",
            command: () => router.push("/admin/ayarlar")
        },
        {
            separator: true
        },
        {
            label: "Çıkış Yap",
            icon: "pi pi-sign-out",
            className: "text-red-600",
            command: handleLogout
        }
    ];

    if (compact) {
        // Sidebar compact mode
        return (
            <div className="relative w-full">
                <div
                    className="cursor-pointer w-full"
                    onClick={(e) => menuRef.current?.toggle(e)}
                >
                    <div className="flex items-center justify-center p-2 rounded-lg hover:bg-blue-50 transition-all duration-200">
                        <div className="relative">
                            <Avatar
                                image={userAvatar}
                                icon={!userAvatar ? "pi pi-user" : undefined}
                                size="normal"
                                shape="circle"
                                className="border-2 border-blue-200 hover:border-blue-400 transition-all duration-200"
                                style={{
                                    backgroundColor: !userAvatar ? '#3b82f6' : undefined,
                                    color: !userAvatar ? 'white' : undefined
                                }}
                            />
                            <div
                                className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"
                                title="Çevrimiçi"
                            />
                        </div>
                    </div>
                </div>

                <Menu
                    ref={menuRef}
                    model={menuItems}
                    popup
                    autoZIndex
                    baseZIndex={1000}
                    appendTo={typeof document !== 'undefined' ? document.body : null}
                    className="shadow-lg border border-gray-200 rounded-lg"
                    style={{
                        width: '280px',
                        backgroundColor: 'white',
                        borderRadius: '0.5rem'
                    }}
                />
            </div>
        );
    }

    // Sidebar expanded mode
    return (
        <div className="relative w-full">
            <div
                className="cursor-pointer w-full"
                onClick={(e) => menuRef.current?.toggle(e)}
            >
                <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-white hover:shadow-sm transition-all duration-200 border border-transparent hover:border-blue-200">
                    <div className="relative">
                        <Avatar
                            image={userAvatar}
                            icon={!userAvatar ? "pi pi-user" : undefined}
                            size="normal"
                            shape="circle"
                            className="border-2 border-blue-200 hover:border-blue-400 transition-all duration-200"
                            style={{
                                backgroundColor: !userAvatar ? '#3b82f6' : undefined,
                                color: !userAvatar ? 'white' : undefined
                            }}
                        />
                        <div
                            className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"
                            title="Çevrimiçi"
                        />
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-gray-900 truncate">{userName}</div>
                        <div className="text-xs text-blue-600 font-medium truncate">{userRole}</div>
                    </div>
                    <i className="pi pi-chevron-up text-gray-400 text-xs transition-transform duration-200 hover:text-blue-600"></i>
                </div>
            </div>

            <Menu
                ref={menuRef}
                model={menuItems}
                popup
                autoZIndex
                baseZIndex={1000}
                appendTo={typeof document !== 'undefined' ? document.body : null}
                className="shadow-lg border border-gray-200 rounded-lg"
                style={{
                    width: '240px',
                    backgroundColor: 'white',
                    borderRadius: '0.5rem'
                }}
            />
        </div>
    );
}