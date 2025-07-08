import Footer from "../share/Footer"
import Header from "../share/Header"

interface SubLayoutProps {
    children: React.ReactNode;
}
const subLayout = ({ children }: SubLayoutProps) => {
    return (
        <main>
            <div className="min-h-screen">
                <Header />
                {children}
            </div>
            <Footer />
        </main>
    )
}

export default subLayout