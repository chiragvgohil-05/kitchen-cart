import { lazy } from "react";
import { createBrowserRouter, Outlet } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import AdminLayout from "../layouts/AdminLayout";
import StaffLayout from "../layouts/StaffLayout";

// Lazy Load Pages
const Home = lazy(() => import("../pages/Home"));
const Menu = lazy(() => import("../pages/Menu"));
const About = lazy(() => import("../pages/About"));
const NotFound = lazy(() => import("../pages/NotFound"));
const ProductDetail = lazy(() => import("../pages/ProductDetail"));
const Dashboard = lazy(() => import("../pages/admin/Dashboard"));
const Products = lazy(() => import("../pages/admin/Products"));
const Orders = lazy(() => import("../pages/admin/Orders"));
const Settings = lazy(() => import("../pages/admin/Settings"));

const Login = lazy(() => import("../pages/Login"));
const Register = lazy(() => import("../pages/Register"));
const Cart = lazy(() => import("../pages/Cart"));
const Wishlist = lazy(() => import("../pages/Wishlist"));
const Offers = lazy(() => import("../pages/Offers"));
const NewArrivals = lazy(() => import("../pages/NewArrivals"));
const Contact = lazy(() => import("../pages/Contact"));
const Shipping = lazy(() => import("../pages/Shipping"));
const Returns = lazy(() => import("../pages/Returns"));
const Faqs = lazy(() => import("../pages/Faqs"));
const OrderSuccess = lazy(() => import("../pages/OrderSuccess"));
const UserOrders = lazy(() => import("../pages/UserOrders"));
const Profile = lazy(() => import("../pages/Profile"));
const KitchenPanel = lazy(() => import("../pages/staff/KitchenPanel"));
const Loyalty = lazy(() => import("../pages/Loyalty"));
const Rewards = lazy(() => import("../pages/Rewards"));

const ProductFormPage = lazy(() => import("../pages/admin/ProductFormPage"));
const Categories = lazy(() => import("../pages/admin/Categories"));
const CategoryFormPage = lazy(() => import("../pages/admin/CategoryFormPage"));
const AdminUsers = lazy(() => import("../pages/admin/Users"));
const AdminTables = lazy(() => import("../pages/admin/Tables"));
const AdminBookings = lazy(() => import("../pages/admin/Bookings"));
const AdminRewards = lazy(() => import("../pages/admin/AdminRewards"));
const AdminLoyalty = lazy(() => import("../pages/admin/AdminLoyalty"));
const BookTable = lazy(() => import("../pages/BookTable"));
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
                        path: "loyalty",
                        element: (
                            <ProtectedRoute>
                                <Loyalty />
                            </ProtectedRoute>
                        ),
                    },
                    {
                        path: "rewards",
                        element: (
                            <ProtectedRoute>
                                <Rewards />
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
                        path: "settings",
                        element: <Settings />,
                    },
                    {
                        path: "rewards",
                        element: <AdminRewards />,
                    },
                    {
                        path: "loyalty",
                        element: <AdminLoyalty />,
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
                        element: <Orders />,
                    },
                    {
                        path: "bookings",
                        element: <AdminBookings />,
                    },
                    {
                        path: "loyalty",
                        element: <AdminLoyalty />,
                    },
                ],
            },

        ],
    },
]);

export default router;
