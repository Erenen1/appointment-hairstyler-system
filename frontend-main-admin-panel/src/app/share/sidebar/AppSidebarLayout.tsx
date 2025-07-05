import { AppSidebar } from "@/app/share/sidebar/page"
import { Separator } from "@/components/ui/separator"
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"

interface SubLayoutProps {
    children: React.ReactNode;
}

export default function SidebarLayout({ children }: SubLayoutProps) {
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 border-b">
                    <div className="flex items-center gap-2 px-3">
                        <SidebarTrigger />
                        <Separator orientation="vertical" className="mr-2 h-4" />
                    </div>
                </header>
                <main className="min-h-screen">
                    {children}
                </main>
            </SidebarInset>
        </SidebarProvider>
    )
}
