import { useState } from "react";
import { NavLink, Outlet, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    Menu,
    X,
    ArrowLeft,
    Settings,
    LogOut,
    Bell,
    Search,
    User as UserIcon,
    LayoutGrid,
    CalendarDays,
    Coffee,
    Trophy,
    Gift
} from "lucide-react";

import logo from "/logo.png";

const AdminLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    const groupedLinks = [
        {
            title: "Insights",
            links: [
                { to: "/admin", label: "Analytics", icon: LayoutDashboard, end: true },
            ]
        },
        {
            title: "Management",
            links: [
                { to: "/admin/categories", label: "Categories", icon: LayoutGrid },
                { to: "/admin/products", label: "Menu Items", icon: Package },
            ]
        },
        {
            title: "Operations",
            links: [
                { to: "/admin/orders", label: "Live Orders", icon: ShoppingCart },
                { to: "/admin/bookings", label: "Reservations", icon: CalendarDays },
                { to: "/admin/tables", label: "Table Layout", icon: Coffee },
            ]
        },
        {
            title: "Loyalty & CRM",
            links: [
                { to: "/admin/users", label: "Staff & Users", icon: UserIcon },
                { to: "/admin/loyalty", label: "Program Stats", icon: Trophy },
                { to: "/admin/rewards", label: "Promotions", icon: Gift },
            ]
        },
        {
            title: "System",
            links: [
                { to: "/admin/settings", label: "Site Settings", icon: Settings },
                { to: "/admin/profile", label: "My Profile", icon: UserIcon },
            ]
        }
    ];



    return (
        <div className="flex h-screen bg-cream text-soft-black overflow-hidden font-sans">
            {/* Overlay for mobile */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-soft-black/40 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 w-72 text-cream bg-coffee-brown border-r border-white/5 transform transition-transform duration-500 ease-in-out z-50 lg:translate-x-0 lg:static lg:h-screen ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                <div className="flex flex-col h-full">
                    <div className="p-6">
                        <Link to="/admin" className="flex items-center gap-3 group">
                            <img src={logo} alt="SnowEra Logo" className="w-10 h-10 object-contain group-hover:scale-110 transition-transform duration-300" />
                            <span className="text-2xl font-black tracking-tighter text-white uppercase italic">
                                SnowEra <span className="text-accent-gold not-italic">Admin</span>
                            </span>
                        </Link>
                    </div>



                    <nav className="flex-1 px-8 space-y-8 mt-6 overflow-y-auto no-scrollbar pb-10">
                        {groupedLinks.map((group) => (
                            <div key={group.title} className="space-y-3">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 ml-5">
                                    {group.title}
                                </h3>
                                <div className="space-y-1">
                                    {group.links.map((link) => (
                                        <NavLink
                                            key={link.to}
                                            to={link.to}
                                            end={link.end}
                                            onClick={() => setIsSidebarOpen(false)}
                                            className={({ isActive }) =>
                                                `flex items-center gap-4 px-5 py-4 rounded-full transition-all text-[10px] font-black uppercase tracking-widest ${isActive
                                                    ? "bg-accent-gold text-white shadow-2xl shadow-accent-gold/20"
                                                    : "text-white/40 hover:bg-white/5 hover:text-white"
                                                }`
                                            }
                                        >
                                            <link.icon size={16} strokeWidth={2.5} />
                                            {link.label}
                                        </NavLink>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </nav>


                    <div className="p-8 mt-auto">
                        <div className="bg-white/5 rounded-3xl p-6 border border-white/10">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 rounded-2xl bg-accent-gold flex items-center justify-center text-white font-bold shadow-lg">
                                    {user?.name?.charAt(0).toUpperCase() || 'S'}
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-white tracking-widest">{user?.name || 'Manager'}</p>
                                    <p className="text-xs text-accent-gold font-bold tracking-widest opacity-80 mt-0.5 capitalize">{user?.role || 'Administrator'}</p>
                                </div>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center justify-center gap-3 text-sm font-bold tracking-wide text-white/40 hover:text-red-400 transition-colors py-2 group"
                            >
                                <LogOut size={16} className="group-hover:-translate-x-1 transition-transform" />
                                Secure Logout
                            </button>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-cream/50">
                {/* Header */}
                <header className="h-24 px-8 lg:px-6 flex items-center justify-between sticky top-0 z-30">
                    <div className="flex items-center gap-6">
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="lg:hidden p-3 text-coffee-brown bg-white rounded-2xl shadow-lg transition-all active:scale-95"
                        >
                            <Menu size={24} />
                        </button>
                        <div className="max-lg:hidden">
                            <h2 className="text-xl font-bold text-coffee-brown tracking-wide">Operational Dashboard</h2>
                            <p className="text-sm font-bold text-coffee-brown/40 tracking-widest mt-1">Welcome back to the SnowEra Management Portal</p>

                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="hidden sm:flex items-center bg-white border border-coffee-brown/5 rounded-full px-6 py-3 w-80 shadow-sm focus-within:shadow-md transition-all">
                            <Search size={18} className="text-coffee-brown/40 mr-3" />
                            <input
                                type="text"
                                placeholder="Search analytics..."
                                className="bg-transparent border-none text-xs focus:ring-0 w-full placeholder:text-coffee-brown/30 font-bold text-coffee-brown tracking-widest"
                            />
                        </div>
                        <button className="relative p-3 bg-white text-coffee-brown rounded-full shadow-sm hover:shadow-md transition-all">
                            <Bell size={20} />
                            <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />
                        </button>
                    </div>
                </header>

                {/* Content */}
                <main className="flex-1 overflow-y-auto p-8 lg:p-6 scrollbar-coffee">
                    <div className="max-w-7xl mx-auto pb-12">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
