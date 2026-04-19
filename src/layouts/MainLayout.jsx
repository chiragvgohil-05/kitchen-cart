import { Outlet } from "react-router-dom";
import { Suspense } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PageLoader from "../components/PageLoader";

const MainLayout = () => {
    return (
        <div className="min-h-screen bg-cream flex flex-col">
            <Navbar />
            <main className="grow w-full">
                <Suspense fallback={<PageLoader />}>
                    <Outlet />
                </Suspense>
            </main>
            <Footer />
        </div>
    );
};

export default MainLayout;
