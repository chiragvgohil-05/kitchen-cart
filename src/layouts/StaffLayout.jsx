import { useState } from "react";
import { NavLink, Outlet, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
    ChefHat, ClipboardList, LayoutDashboard,
    LogOut, Menu, X, Bell, Calendar, Trophy, Gift
} from "lucide-react";

import logo from "/logo.png";

const StaffLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    const sidebarLinks = [
        { to: "/staff", label: "Kitchen Overview", icon: LayoutDashboard, end: true },
        { to: "/staff/orders", label: "Manage Orders", icon: ClipboardList },
        { to: "/staff/bookings", label: "Reservations", icon: Calendar },
        { to: "/staff/loyalty", label: "Loyalty Program", icon: Trophy },
    ];



    return (
        <div className="flex h-screen bg-cream text-soft-black overflow-hidden font-sans">
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-soft-black/40 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 w-72 text-cream bg-coffee-brown border-r border-white/5 transform transition-transform duration-500 ease-in-out z-50 lg:translate-x-0 lg:static lg:h-screen ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
                <div className="flex flex-col h-full">
                    <div className="p-6">
                        <Link to="/staff" className="flex items-center gap-3 group">
                            <img src={logo} alt="SnowEra Logo" className="w-10 h-10 object-contain group-hover:scale-110 transition-transform duration-300" />
                            <span className="text-2xl font-black tracking-tighter text-white uppercase italic">
                                SnowEra <span className="text-accent-gold not-italic">Staff</span>
                            </span>
                        </Link>
                    </div>


                    <nav className="flex-1 px-8 space-y-2 mt-6">
                        <p className="text-[10px] font-bold text-white/30 tracking-widest uppercase ml-4 mb-4">Kitchen Tools</p>
                        {sidebarLinks.map((link) => (
                            <NavLink
                                key={link.to}
                                to={link.to}
                                end={link.end}
                                onClick={() => setIsSidebarOpen(false)}
                                className={({ isActive }) =>
                                    `flex items-center gap-4 px-5 py-4 rounded-full transition-all text-xs font-black uppercase tracking-widest ${isActive
                                        ? "bg-accent-gold text-white shadow-2xl shadow-accent-gold/20"
                                        : "text-white/40 hover:bg-white/5 hover:text-white"
                                    }`
                                }
                            >
                                <link.icon size={18} strokeWidth={2.5} />
                                {link.label}
                            </NavLink>
                        ))}
                    </nav>

                    <div className="p-8 mt-auto">
                        <div className="bg-white/5 rounded-3xl p-6 border border-white/10">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 rounded-2xl bg-accent-gold flex items-center justify-center text-white font-bold shadow-lg">
                                    {user?.name?.charAt(0).toUpperCase() || 'S'}
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-white tracking-widest">{user?.name || 'Staff Member'}</p>
                                    <p className="text-xs text-accent-gold font-bold tracking-widest opacity-80 mt-0.5 uppercase">Kitchen Staff</p>
                                </div>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center justify-center gap-3 text-sm font-bold tracking-wide text-white/40 hover:text-red-400 transition-colors py-2 group"
                            >
                                <LogOut size={16} className="group-hover:-translate-x-1 transition-transform" />
                                Sign Out
                            </button>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Area */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-cream/50">
                <header className="h-20 px-6 flex items-center justify-between sticky top-0 z-30 bg-cream/80 backdrop-blur-md border-b border-coffee-brown/5">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="lg:hidden p-3 text-coffee-brown bg-white rounded-2xl shadow-lg transition-all active:scale-95"
                        >
                            <Menu size={22} />
                        </button>
                        <div className="max-lg:hidden">
                            <h2 className="text-lg font-bold text-coffee-brown tracking-wide">SnowEra Kitchen</h2>
                            <p className="text-xs font-bold text-coffee-brown/40 tracking-widest mt-0.5">Live order management & status updates</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="relative p-3 bg-white text-coffee-brown rounded-full shadow-sm hover:shadow-md transition-all">
                            <Bell size={18} />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
                        </button>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-6 lg:p-8">
                    <div className="max-w-7xl mx-auto pb-12">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default StaffLayout;
