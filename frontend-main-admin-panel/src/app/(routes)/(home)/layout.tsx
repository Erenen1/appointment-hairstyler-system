import AppSidebarLayout from "@/app/share/sidebar/AppSidebarLayout";

interface SubLayoutProps {
    children: React.ReactNode;
}

const subLayout = ({ children }: SubLayoutProps) => {
    return (
        <>
            <AppSidebarLayout>
                {children}
            </AppSidebarLayout>
            {/* <div className="min-h-screen">
                <Header />
                {children}
            </div>
            <Footer /> */}
        </>
    )
}

export default subLayout


