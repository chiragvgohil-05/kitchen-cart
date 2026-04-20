import { useState, useEffect } from "react";
import { TrendingUp, Users, DollarSign, Package, ArrowUpRight, ArrowDownRight, ShoppingCart, Clock, ChevronRight, AlertTriangle, Coffee } from "lucide-react";
import api from "../../utils/api";
import { Link } from "react-router-dom";

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            setLoading(true);
            const response = await api.get("/dashboard/stats");
            setStats(response.data.data);
        } catch (error) {
            console.error("Dashboard stats fetch failed", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading || !stats) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin w-12 h-12 border-4 border-accent-gold border-t-transparent rounded-full" />
            </div>
        );
    }

    const metricCards = [
        { label: "Total Revenue", value: `₹${stats.totalRevenue.toLocaleString()}`, change: "+12.5%", trend: "up", icon: DollarSign, color: "text-emerald-600", bg: "bg-emerald-50" },
        { label: "Active Customers", value: stats.totalCustomers, change: "+5.1%", trend: "up", icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
        { label: "Total Orders", value: stats.totalOrders, change: "+2.3%", trend: "up", icon: ShoppingCart, color: "text-amber-600", bg: "bg-amber-50" },
        { label: "Live Orders", value: stats.liveOrders, change: "Active", trend: "up", icon: Clock, color: "text-purple-600", bg: "bg-purple-50" },
    ];

    return (
        <div className="space-y-12 animate-fade-in p-2">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                <div className="space-y-4">
                    <h1 className="text-4xl md:text-5xl font-black text-coffee-brown tracking-tighter leading-[0.85]">
                        ADMIN <br /><span className="text-accent-gold italic">PORTAL</span>
                    </h1>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-coffee-brown/30 mt-2 pl-1 italic">
                        Real-time operational intelligence for SnowEra Cafe
                    </p>
                </div>
                <div className="flex flex-wrap gap-4">
                    <button onClick={fetchStats} className="px-8 py-4 bg-white/40 backdrop-blur-xl border border-coffee-brown/5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-coffee-brown shadow-xl shadow-coffee-brown/5 hover:bg-white transition-all transform hover:-translate-y-1 active:scale-95">Refresh Data</button>
                    <Link to="/admin/orders" className="px-8 py-4 bg-coffee-brown text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-2xl shadow-coffee-brown/20 hover:bg-accent-gold transition-all transform hover:-translate-y-1 active:scale-95">All Orders</Link>
                </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {metricCards.map((stat) => (
                    <div key={stat.label} className="bg-white rounded-[32px] p-8 border border-coffee-brown/5 hover:shadow-2xl transition-all duration-500 group relative overflow-hidden">
                        <div className="flex justify-between items-start mb-10">
                            <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color} group-hover:rotate-12 transition-transform duration-500`}>
                                <stat.icon size={24} strokeWidth={2.5} />
                            </div>
                            <div className={`flex items-center gap-1.5 text-[9px] font-black px-3 py-1.5 rounded-full ${stat.trend === 'up' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                                {stat.change}
                            </div>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] font-black text-coffee-brown/30 uppercase tracking-widest">{stat.label}</p>
                            <h2 className="text-2xl font-black text-coffee-brown tracking-tighter tabular-nums">{stat.value}</h2>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Sales Chart (CSS based) */}
                <div className="lg:col-span-2 bg-white p-10 rounded-[48px] border border-coffee-brown/5 shadow-sm relative overflow-hidden flex flex-col group min-h-[450px]">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-12">
                        <div className="space-y-1">
                            <h3 className="text-xl font-black text-coffee-brown tracking-tighter uppercase">Revenue Analytics</h3>
                            <p className="text-[10px] font-black text-coffee-brown/20 uppercase tracking-widest">Last 7 days performance</p>
                        </div>
                        <div className="flex p-1.5 bg-neutral-50 rounded-2xl border border-coffee-brown/5">
                            {['7 Days', '30 Days'].map(t => (
                                <button key={t} className={`px-6 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${t === '7 Days' ? 'bg-white text-coffee-brown shadow-sm' : 'text-coffee-brown/40'}`}>{t}</button>
                            ))}
                        </div>
                    </div>

                    <div className="flex-1 flex items-end justify-between gap-4 h-full pt-10 px-4">
                        {stats.salesTrends.map((s, i) => (
                            <div key={i} className="group/bar relative flex-1 flex flex-col justify-end h-full">
                                <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover/bar:opacity-100 transition-opacity bg-coffee-brown text-white text-[9px] font-black px-2 py-1 rounded-md pointer-events-none">
                                    ₹{s.revenue}
                                </div>
                                <div
                                    className={`rounded-t-2xl w-full transition-all duration-700 shadow-inner group-hover/bar:bg-accent-gold ${i === 6 ? 'bg-accent-gold shadow-lg shadow-accent-gold/20' : 'bg-coffee-brown/5'}`}
                                    style={{ height: `${Math.max(10, (s.revenue / (Math.max(...stats.salesTrends.map(x => x.revenue)) || 1)) * 100)}%` }}
                                />
                                <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[9px] font-black text-coffee-brown/20 uppercase tracking-widest -rotate-45">{s.day}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Popular Products Sidebar */}
                <div className="bg-coffee-brown p-8 rounded-[48px] text-white relative overflow-hidden flex flex-col shadow-2xl shadow-coffee-brown/20 group">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-lg font-black tracking-tighter uppercase italic text-accent-gold">Elite Sellers</h3>
                        <div className="p-2 bg-white/10 rounded-xl">
                            <TrendingUp size={16} />
                        </div>
                    </div>

                    <div className="flex-1 space-y-6">
                        {stats.topSellingProducts.map((p, i) => (
                            <div key={i} className="flex items-center justify-between group/item p-3 rounded-2xl hover:bg-white/5 transition-all">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-accent-gold/20 flex items-center justify-center font-black text-accent-gold text-xs italic border border-accent-gold/30">
                                        0{i + 1}
                                    </div>
                                    <div>
                                        <p className="text-[11px] font-black uppercase tracking-tight line-clamp-1">{p?._id?.name}</p>
                                        <p className="text-[9px] font-bold text-white/30 uppercase tracking-[0.2em]">{p?.totalQty} Units sold</p>
                                    </div>
                                </div>
                                <p className="text-[10px] font-black text-accent-gold tabular-nums">₹{p?._id?.sellingPrice}</p>
                            </div>
                        ))}
                        {stats.topSellingProducts.length === 0 && <p className="text-white/20 text-[10px] italic">Awaiting initial sales data...</p>}
                    </div>

                    <div className="mt-8 pt-8 border-t border-white/5">
                        <Link to="/admin/products" className="w-full h-12 flex items-center justify-center bg-white text-coffee-brown rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-accent-gold hover:text-white transition-all shadow-xl shadow-black/20 group">
                            Full Portfolio <ChevronRight size={14} className="ml-2 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-10">
                {/* Recent Orders Table */}
                <div className="bg-white p-10 rounded-[48px] border border-coffee-brown/5 shadow-sm">
                    <div className="flex items-center justify-between mb-10">
                        <div className="space-y-1">
                            <h3 className="text-xl font-black text-coffee-brown tracking-tighter uppercase italic">Recent Transactions</h3>
                            <p className="text-[9px] font-black text-coffee-brown/20 uppercase tracking-widest leading-none">Last 5 activities</p>
                        </div>
                        <Link to="/admin/orders" className="p-3 bg-neutral-50 rounded-2xl text-coffee-brown/30 hover:text-accent-gold transition-all">
                            <ChevronRight size={18} />
                        </Link>
                    </div>

                    <div className="space-y-4">
                        {stats.recentOrders.map((o) => (
                            <div key={o._id} className="flex items-center justify-between p-4 rounded-3xl bg-neutral-50/50 border border-transparent hover:border-coffee-brown/5 hover:bg-white transition-all group">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-white rounded-2xl shadow-sm text-coffee-brown/30 group-hover:text-accent-gold transition-all">
                                        <ShoppingCart size={16} />
                                    </div>
                                    <div>
                                        <p className="text-[11px] font-black text-coffee-brown uppercase">{o.user?.name || 'Guest User'}</p>
                                        <p className="text-[9px] font-bold text-coffee-brown/20 uppercase tracking-widest">{new Date(o.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} · #{o._id.slice(-6).toUpperCase()}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-[11px] font-black text-coffee-brown">₹{o.totalAmount}</p>
                                    <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full ${o.status === 'Cancelled' ? 'bg-red-50 text-red-500' : 'bg-emerald-50 text-emerald-500'}`}>{o.status}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Logistics & Alerts */}
                <div className="grid grid-cols-1 gap-6">
                    {/* Low Stock Alert Card */}
                    <div className="bg-red-500 p-8 rounded-[40px] text-white relative overflow-hidden flex flex-col justify-between shadow-2xl shadow-red-500/20 group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl pointer-events-none" />
                        <div className="relative z-10 flex items-start justify-between">
                            <div className="space-y-4">
                                <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30">
                                    <AlertTriangle size={28} className="text-white" />
                                </div>
                                <h3 className="text-2xl font-black tracking-tighter leading-none uppercase italic">Inventory <br />Depleted</h3>
                                <p className="text-white/60 text-[11px] font-bold leading-relaxed tracking-wide uppercase">Critical stock deficiency detected in signature collection.</p>
                            </div>
                            <div className="text-right">
                                <p className="text-3xl font-black tabular-nums leading-none italic">{stats.lowStockProducts.length}</p>
                                <p className="text-[9px] font-black text-white/40 uppercase tracking-widest mt-1">Items at risk</p>
                            </div>
                        </div>
                        <div className="relative z-10 mt-10 pt-6 border-t border-white/10 space-y-3">
                            {stats.lowStockProducts.map(p => (
                                <div key={p?._id} className="flex justify-between items-center bg-white/5 p-2 rounded-xl text-[10px] font-black uppercase tracking-tight">
                                    <span>{p?.name}</span>
                                    <span className="text-white/60">{p.stock} Left</span>
                                </div>
                            ))}
                        </div>
                        <Link to="/admin/products" className="relative z-10 mt-8 w-full h-12 bg-white text-red-600 rounded-[20px] flex items-center justify-center font-black text-[10px] uppercase tracking-[0.4em] hover:bg-black hover:text-white transition-all shadow-xl active:scale-95">
                            RECALIBRATE STOCK
                        </Link>
                    </div>

                    {/* Operational Tip */}
                    <div className="bg-accent-gold p-8 rounded-[40px] text-white relative overflow-hidden flex flex-col justify-center shadow-2xl shadow-accent-gold/20 transform hover:-rotate-1 transition-transform">
                        <div className="flex items-center gap-6">
                            <div className="p-4 bg-black/10 rounded-[20px]">
                                <Coffee size={32} strokeWidth={1} />
                            </div>
                            <div>
                                <h4 className="text-lg font-black tracking-tighter uppercase italic leading-none">Operational Insight</h4>
                                <p className="text-[10px] font-black text-black/20 uppercase tracking-widest mt-1">Dine-in peak hours: 10AM - 1PM</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;

