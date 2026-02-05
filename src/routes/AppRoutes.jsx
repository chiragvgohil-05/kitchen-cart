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
import Login from "../pages/Login";
import Register from "../pages/Register";
import Cart from "../pages/Cart";
import Wishlist from "../pages/Wishlist";
import Offers from "../pages/Offers";
import NewArrivals from "../pages/NewArrivals";
import Contact from "../pages/Contact";
import Shipping from "../pages/Shipping";
import Returns from "../pages/Returns";
import Faqs from "../pages/Faqs";
import OrderSuccess from "../pages/OrderSuccess";
import UserOrders from "../pages/UserOrders";

import ProductFormPage from "../pages/admin/ProductFormPage";

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
                path: "cart",
                element: <Cart />,
            },
            {
                path: "wishlist",
                element: <Wishlist />,
            },
            {
                path: "offers",
                element: <Offers />,
            },
            {
                path: "new-arrivals",
                element: <NewArrivals />,
            },
            {
                path: "contact",
                element: <Contact />,
            },
            {
                path: "shipping",
                element: <Shipping />,
            },
            {
                path: "returns",
                element: <Returns />,
            },
            {
                path: "faqs",
                element: <Faqs />,
            },
            {
                path: "order-success",
                element: <OrderSuccess />,
            },
            {
                path: "user/orders",
                element: <UserOrders />,
            },
            {
                path: "*",
                element: <NotFound />,
            },
        ],
    },
    {
        path: "/login",
        element: <Login />,
    },
    {
        path: "/register",
        element: <Register />,
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
                children: [
                    {
                        index: true,
                        element: <Products />,
                    },
                    {
                        path: "create",
                        element: <ProductFormPage />,
                    },
                    {
                        path: "edit/:id",
                        element: <ProductFormPage />,
                    },
                ]
            },
            {
                path: "orders",
                element: <Orders />,
            },
        ],
    },
]);

export default router;
