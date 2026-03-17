import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const MainLayout = () => {
    return (
        <div className="min-h-screen bg-cream flex flex-col">
            <Navbar />
            <main className="grow w-full">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default MainLayout;
