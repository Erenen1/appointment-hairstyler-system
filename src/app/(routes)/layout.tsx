import Footer from "../share/Footer"
import Header from "../share/Header"

interface SubLayoutProps {
    children: React.ReactNode;
}
const subLayout = ({ children }: SubLayoutProps) => {
    return (
        <>
            <div className="min-h-screen">
                {/*<Header />*/}
                {children}
            </div>
            {/*<Footer />*/}
        </>
    )
}

export default subLayout