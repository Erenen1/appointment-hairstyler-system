"use client";

import { AdminSidebar } from "@/components/admin";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return <AdminSidebar>{children}</AdminSidebar>;
}


