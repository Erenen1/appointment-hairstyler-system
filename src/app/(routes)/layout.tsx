// import { SidebarProvider } from "@/components/ui/sidebar";

// import Header from "../share/Header"
// import Footer from "../share/Footer";

// const subLayout = ({ children }: SubLayoutProps) => {
//     return (
//         <>
//             <div className="min-h-screen">
//                 <SidebarProvider>

//                     <Header />

//                     {children}
//                 </SidebarProvider>
//             </div>
//             <Footer />
//         </>
//     )
// }

// export default subLayout

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@radix-ui/react-separator'
import React from 'react'
import { AppSidebar } from '../share/sidebar/page'
import SidebarItems from '../share/sidebar/components/SidebarItems'

interface SubLayoutProps {
    children: React.ReactNode;
}
const SubLayout = ({ children }: SubLayoutProps) => {
    return (
        <div>
            <SidebarProvider>
                <AppSidebar />
                <SidebarInset>
                    <SidebarItems />
                    {children}
                </SidebarInset>
            </SidebarProvider>
        </div>
    )
}

export default SubLayout