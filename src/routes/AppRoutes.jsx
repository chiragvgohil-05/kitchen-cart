import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import AdminLayout from "../layouts/AdminLayout";
import Home from "../pages/Home";
import Menu from "../pages/Menu";
import About from "../pages/About";
import NotFound from "../pages/NotFound";
import Search from "../pages/Search";
import ProductDetail from "../pages/ProductDetail";
import Dashboard from "../pages/admin/Dashboard";
import Products from "../pages/admin/Products";
import Orders from "../pages/admin/Orders";

const router = createBrowserRouter([
    {
        path: "/",
        element: <MainLayout />,
        children: [
            {
                index: true,
                element: <Home />,
            },
            {
                path: "menu",
                element: <Menu />,
            },
            {
                path: "about",
                element: <About />,
            },
            {
                path: "search",
                element: <Search />,
            },
            {
                path: "product/:productId",
                element: <ProductDetail />,
            },
            {
                path: "*",
                element: <NotFound />,
            },
        ],
    },
    {
        path: "/admin",
        element: <AdminLayout />,
        children: [
            {
                index: true,
                element: <Dashboard />,
            },
            {
                path: "products",
                element: <Products />,
            },
            {
                path: "orders",
                element: <Orders />,
            },
        ],
    },
]);

export default router;
