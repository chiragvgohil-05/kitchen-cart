import { createBrowserRouter, Outlet } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import AdminLayout from "../layouts/AdminLayout";
import StaffLayout from "../layouts/StaffLayout";
import Home from "../pages/Home";
import Menu from "../pages/Menu";
import About from "../pages/About";
import NotFound from "../pages/NotFound";
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
import Profile from "../pages/Profile";
import KitchenPanel from "../pages/staff/KitchenPanel";

import ProductFormPage from "../pages/admin/ProductFormPage";
import Categories from "../pages/admin/Categories";
import CategoryFormPage from "../pages/admin/CategoryFormPage";
import AdminUsers from "../pages/admin/Users";
import AdminTables from "../pages/admin/Tables";
import AdminBookings from "../pages/admin/Bookings";
import BookTable from "../pages/BookTable";
import ProtectedRoute from "../components/ProtectedRoute";
import UserRoute from "../components/UserRoute";
import { ShopProvider } from "../context/ShopContext";

// Root layout: wraps everything in ShopProvider so useNavigate works inside ShopContext
const RootLayout = () => (
    <ShopProvider>
        <Outlet />
    </ShopProvider>
);

const router = createBrowserRouter([
    {
        element: <RootLayout />,
        children: [
            {
                path: "/",
                element: (
                    <UserRoute>
                        <MainLayout />
                    </UserRoute>
                ),
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
                        element: (
                            <ProtectedRoute>
                                <OrderSuccess />
                            </ProtectedRoute>
                        ),
                    },
                    {
                        path: "user/orders",
                        element: (
                            <ProtectedRoute>
                                <UserOrders />
                            </ProtectedRoute>
                        ),
                    },
                    {
                        path: "profile",
                        element: (
                            <ProtectedRoute>
                                <Profile />
                            </ProtectedRoute>
                        ),
                    },
                    {
                        path: "book-table",
                        element: (
                            <ProtectedRoute>
                                <BookTable />
                            </ProtectedRoute>
                        ),
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
                element: (
                    <ProtectedRoute allowedRoles={['admin']}>
                        <AdminLayout />
                    </ProtectedRoute>
                ),
                children: [
                    {
                        index: true,
                        element: <Dashboard />,
                    },
                    {
                        path: "categories",
                        children: [
                            {
                                index: true,
                                element: <Categories />,
                            },
                            {
                                path: "create",
                                element: <CategoryFormPage />,
                            },
                            {
                                path: "edit/:id",
                                element: <CategoryFormPage />,
                            },
                        ]
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
                    {
                        path: "users",
                        element: <AdminUsers />,
                    },
                    {
                        path: "tables",
                        element: <AdminTables />,
                    },
                    {
                        path: "bookings",
                        element: <AdminBookings />,
                    },
                    {
                        path: "profile",
                        element: <Profile />,
                    },
                ],
            },
            {
                path: "/staff",
                element: (
                    <ProtectedRoute allowedRoles={['staff', 'admin']}>
                        <StaffLayout />
                    </ProtectedRoute>
                ),
                children: [
                    {
                        index: true,
                        element: <KitchenPanel />,
                    },
                    {
                        path: "orders",
                        element: <KitchenPanel />,
                    },
                    {
                        path: "bookings",
                        element: <AdminBookings />,
                    },
                ],
            },
        ],
    },
]);

export default router;
