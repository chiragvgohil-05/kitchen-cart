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
    LayoutGrid
} from "lucide-react";
import logo from "../assets/logo.png";

const AdminLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    const sidebarLinks = [
        { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
        { to: "/admin/categories", label: "Categories", icon: LayoutGrid },
        { to: "/admin/products", label: "Products", icon: Package },
        { to: "/admin/orders", label: "Orders", icon: ShoppingCart },
        { to: "/admin/profile", label: "Profile Settings", icon: UserIcon },
    ];

    return (
        <div className="flex h-screen bg-brand-bg text-brand-primary overflow-hidden">
            {/* Overlay for mobile */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-brand-primary/40 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 w-72 text-brand-primary bg-brand-bg border-r border-brand-primary/10 transform transition-transform duration-300 ease-in-out z-50 lg:translate-x-0 lg:static lg:h-screen ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                <div className="flex flex-col h-full">
                    <div className="p-8">
                        <Link to="/" className="flex items-center group">
                            <img src={logo} alt="Kitchen Logo" className="h-15 w-auto object-contain" />
                        </Link>
                    </div>

                    <nav className="flex-1 px-6 space-y-1.5 mt-4">
                        {sidebarLinks.map((link) => (
                            <NavLink
                                key={link.to}
                                to={link.to}
                                end={link.end}
                                onClick={() => setIsSidebarOpen(false)}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all font-bold text-sm ${isActive
                                        ? "bg-brand-accent text-brand-primary shadow-xl shadow-brand-accent/20"
                                        : "text-brand-primary/50 hover:bg-brand-primary/10 hover:text-brand-primary"
                                    }`
                                }
                            >
                                <link.icon size={20} strokeWidth={2.5} />
                                {link.label}
                            </NavLink>
                        ))}
                    </nav>

                    <div className="p-6 mt-auto">
                        <div className="bg-brand-primary/5 rounded-2xl p-4 border border-brand-primary/10 mb-6">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 rounded-full bg-brand-accent flex items-center justify-center text-brand-primary font-bold shadow-sm">
                                    {user?.name?.charAt(0).toUpperCase() || 'A'}
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-brand-primary">{user?.name || 'Administrator'}</p>
                                    <p className="text-[10px] text-brand-primary/50 font-medium">{user?.role === 'admin' ? 'Super User' : 'User'}</p>
                                </div>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest text-brand-primary/40 hover:text-brand-accent transition-colors py-2"
                            >
                                <LogOut size={14} />
                                Sign Out
                            </button>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Header */}
                <header className="h-20 bg-brand-bg/80 backdrop-blur-md border-b border-brand-primary/10 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="lg:hidden p-2 text-brand-primary/60 hover:bg-brand-primary/5 rounded-xl transition-colors"
                        >
                            <Menu size={24} />
                        </button>
                        <div className="hidden sm:flex items-center bg-brand-primary/5 border border-brand-primary/10 rounded-full px-4 py-2 w-64">
                            <Search size={16} className="text-brand-primary/40 mr-2" />
                            <input
                                type="text"
                                placeholder="Search command..."
                                className="bg-transparent border-none text-xs focus:ring-0 w-full placeholder:text-brand-primary/40 font-medium text-brand-primary"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-3 lg:gap-6">
                        <button className="p-2.5 text-brand-primary/40 hover:text-brand-primary hover:bg-brand-primary/5 rounded-full transition-all relative">
                            <Bell size={20} />
                            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-brand-accent rounded-full border-2 border-brand-bg" />
                        </button>
                        <button className="p-2.5 text-brand-primary/40 hover:text-brand-primary hover:bg-brand-primary/5 rounded-full transition-all">
                            <Settings size={20} />
                        </button>
                    </div>
                </header>

                {/* Content */}
                <main className="flex-1 overflow-y-auto p-4 lg:p-8">
                    <div className="max-w-7xl mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
