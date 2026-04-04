import { useState, useEffect } from "react";
import {
    Search,
    Truck,
    CheckCircle2,
    Clock,
    XCircle,
    Download,
    Coffee,
    Package2,
    Filter,
    ArrowRight,
    RefreshCw,
    User,
    CreditCard,
    Banknote,
    Wallet,
    MoreVertical,
    Check,
    Play,
    Bell,
    CheckCircle,
    X
} from "lucide-react";

import api from "../../utils/api";
import toast from "react-hot-toast";

const STATUS_OPTIONS = [
    'Pending',
    'Confirmed',
    'Preparing',
    'Ready',
    'Served',
    'Shipped',
    'Delivered',
    'Cancelled'
];

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [downloadingInvoiceId, setDownloadingInvoiceId] = useState(null);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const res = await api.get('/orders/admin');
            if (res.data.success) {
                setOrders(res.data.data || []);
            }
        } catch (error) {
            console.error("Fetch orders error:", error);
            toast.error("Failed to synchronize orders");
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (orderId, newStatus) => {
        try {
            const res = await api.put(`/orders/${orderId}`, { status: newStatus });
            if (res.data.success) {
                toast.success(`Order transitioned to ${newStatus}`);
                setOrders(prev =>
                    prev.map(order =>
                        order._id === orderId ? { ...order, status: newStatus } : order
                    )
                );
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Transition failure");
        }
    };

    const handleInvoiceDownload = async (orderId) => {
        try {
            setDownloadingInvoiceId(orderId);
            const response = await api.get(`/orders/${orderId}/invoice`, {
                responseType: "blob"
            });
            const blob = new Blob([response.data], { type: "application/pdf" });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `invoice_${orderId.slice(-6).toUpperCase()}.pdf`;
            a.click();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            toast.error("Invoice retrieval failed");
        } finally {
            setDownloadingInvoiceId(null);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "Delivered": case "Served": return "bg-emerald-50 text-emerald-600 border-emerald-100";
            case "Shipped": case "Ready": return "bg-blue-50 text-blue-600 border-blue-100";
            case "Preparing": case "Confirmed": return "bg-amber-50 text-amber-600 border-amber-100";
            case "Cancelled": return "bg-red-50 text-red-600 border-red-100";
            default: return "bg-slate-50 text-slate-400 border-slate-100";
        }
    };

    const filteredOrders = orders.filter(order => {
        const matchesSearch = 
            order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (order.user?.name || "").toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === "All" || order.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="space-y-8 pb-12 animate-fade-in">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-coffee-brown tracking-tighter">
                        ORDER <span className="text-accent-gold">MANAGEMENT</span>
                    </h1>
                    <p className="text-[10px] font-black uppercase tracking-[0.25em] text-coffee-brown/30 mt-2 pl-1">
                        Overview of all cafe transactions and order status
                    </p>
                </div>

                <button 
                   onClick={fetchOrders}
                   className="p-4 bg-white border border-coffee-brown/5 rounded-2xl hover:bg-cream transition-all group"
                >
                    <RefreshCw size={20} className={`text-coffee-brown/30 group-hover:text-accent-gold transition-all ${loading ? 'animate-spin' : ''}`} />
                </button>
            </div>

            {/* Metrics Dashboard */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                {[
                    { label: "Total Orders", value: orders.length, icon: Package2, color: "text-coffee-brown" },
                    { label: "In Progress", value: orders.filter(o => ["Pending", "Confirmed", "Preparing"].includes(o.status)).length, icon: Clock, color: "text-amber-500" },
                    { label: "Ready", value: orders.filter(o => o.status === "Ready").length, icon: Coffee, color: "text-blue-500" },
                    { label: "Fulfilled", value: orders.filter(o => ["Delivered", "Served"].includes(o.status)).length, icon: CheckCircle2, color: "text-emerald-500" },
                    { label: "Revenue", value: `₹${orders.reduce((acc, o) => acc + (o.status !== 'Cancelled' ? o.totalAmount : 0), 0).toLocaleString()}`, icon: Wallet, color: "text-accent-gold" }
                ].map((stat, i) => (

                    <div key={i} className="bg-white p-6 rounded-[32px] border border-coffee-brown/5 shadow-sm hover:shadow-md transition-all">
                        <stat.icon size={18} className={`${stat.color} mb-4`} />
                        <p className="text-[9px] font-black uppercase tracking-widest text-coffee-brown/30 mb-1">{stat.label}</p>
                        <p className={`text-xl font-black text-coffee-brown tracking-tight`}>{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Search & Intelligence */}
            <div className="flex flex-col lg:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-coffee-brown/20" size={20} />
                    <input
                        type="text"
                        placeholder="Search by Order ID or Customer name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-14 pr-6 py-5 bg-white border border-coffee-brown/5 rounded-[24px] focus:outline-none focus:ring-4 focus:ring-accent-gold/5 transition-all font-bold text-coffee-brown shadow-sm text-sm"
                    />
                </div>
                <div className="flex gap-2 p-1 bg-white rounded-[24px] border border-coffee-brown/5 shadow-sm">
                   <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-6 py-3 bg-transparent text-[10px] font-black uppercase tracking-widest text-coffee-brown outline-none cursor-pointer min-w-[180px]"
                    >
                        <option value="All">All Statuses</option>

                        {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
            </div>

            {/* Strategic Table */}
            <div className="bg-white rounded-[40px] border border-coffee-brown/5 shadow-2xl shadow-coffee-brown/5 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[1000px]">
                        <thead>
                            <tr className="bg-neutral-50/50 border-b border-coffee-brown/5">
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-coffee-brown/30">Order ID</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-coffee-brown/30">Customer</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-coffee-brown/30">Order Type</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-coffee-brown/30">Price</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-coffee-brown/30">Status</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-coffee-brown/30">Update Status</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-coffee-brown/5 text-xs">
                            {filteredOrders.map((order) => (
                                <tr key={order._id} className="hover:bg-cream/30 transition-all group">
                                    <td className="px-8 py-6">
                                        <div className="space-y-1">
                                            <p className="font-black text-coffee-brown tracking-tighter text-sm">#{order._id.slice(-6).toUpperCase()}</p>
                                            <p className="text-[9px] font-black uppercase tracking-widest text-coffee-brown/20 italic">{new Date(order.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-xl bg-neutral-50 flex items-center justify-center text-coffee-brown/30 group-hover:bg-accent-gold group-hover:text-white transition-all">
                                                <User size={14} />
                                            </div>
                                            <div>
                                                <p className="font-black text-coffee-brown">{order.user?.name || "Guest"}</p>
                                                <p className="text-[10px] font-bold text-coffee-brown/30">{order.user?.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-neutral-50 border border-coffee-brown/5">
                                            {order.orderType === "Dine-in" ? <Coffee size={12} className="text-accent-gold" /> : order.orderType === "Delivery" ? <Truck size={12} className="text-blue-500" /> : <Package2 size={12} className="text-slate-400" />}
                                            <p className="text-[10px] font-black uppercase tracking-widest text-coffee-brown/60">
                                                {order.orderType} {order.table ? `· ST-${order.table.tableNumber || order.table}` : ''}
                                            </p>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="space-y-1">
                                            <div className="flex items-baseline gap-2">
                                                <p className="font-black text-coffee-brown text-sm">₹{order.totalAmount}</p>
                                                {order.discountAmount > 0 && (
                                                    <p className="text-[10px] font-bold text-coffee-brown/30 line-through tracking-tighter">₹{order.totalAmount + order.discountAmount}</p>
                                                )}
                                            </div>
                                            <div className="flex flex-wrap items-center gap-1.5">
                                                {order.paymentMethod === 'COD' ? <Banknote size={10} className="text-amber-500" /> : order.paymentMethod === 'Wallet' ? <Wallet size={10} className="text-purple-500" /> : <CreditCard size={10} className="text-emerald-500" />}
                                                <span className="text-[9px] font-black uppercase tracking-widest text-coffee-brown/30">{order.paymentMethod}</span>
                                                {order.discountAmount > 0 && (
                                                    <span className="text-[8px] font-black bg-emerald-50 text-emerald-500 px-1.5 py-0.5 rounded-md uppercase tracking-tighter">
                                                        -{order.reward?.name || 'Discount'}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col gap-2">
                                            <span className={`inline-flex items-center px-4 py-2 rounded-full border text-[9px] font-black uppercase tracking-widest whitespace-nowrap ${getStatusColor(order.status)}`}>
                                                {order.status}
                                            </span>
                                            {/* Status Progression Bar */}
                                            <div className="flex gap-1 h-1 px-1">
                                                {['Confirmed', 'Preparing', 'Ready', 'Delivered/Served'].map((step, idx) => {
                                                    const steps = {
                                                        'Pending': -1,
                                                        'Confirmed': 0,
                                                        'Preparing': 1,
                                                        'Ready': 2,
                                                        'Served': 3,
                                                        'Delivered': 3,
                                                        'Shipped': 2.5
                                                    };
                                                    const currentStep = steps[order.status] || 0;
                                                    const isComplete = idx <= currentStep;
                                                    return (
                                                        <div key={idx} className={`flex-1 rounded-full transition-all duration-500 ${isComplete ? 'bg-accent-gold' : 'bg-neutral-100'}`} />
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">

                                        <div className="flex items-center gap-2">
                                            {/* Action Buttons based on status */}
                                            {order.status === 'Pending' && (
                                                <button
                                                    onClick={() => handleStatusUpdate(order._id, 'Confirmed')}
                                                    className="px-4 py-2.5 bg-emerald-500 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/20"
                                                >
                                                    <Check size={12} /> Confirm
                                                </button>
                                            )}
                                            {order.status === 'Confirmed' && (
                                                <button
                                                    onClick={() => handleStatusUpdate(order._id, 'Preparing')}
                                                    className="px-4 py-2.5 bg-amber-500 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-amber-600 transition-all flex items-center gap-2 shadow-lg shadow-amber-500/20"
                                                >
                                                    <Play size={12} /> Prepare
                                                </button>
                                            )}
                                            {order.status === 'Preparing' && (
                                                <button
                                                    onClick={() => handleStatusUpdate(order._id, 'Ready')}
                                                    className="px-4 py-2.5 bg-blue-500 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all flex items-center gap-2 shadow-lg shadow-blue-500/20"
                                                >
                                                    <Bell size={12} /> Ready
                                                </button>
                                            )}
                                            {order.status === 'Ready' && (
                                                <button
                                                    onClick={() => handleStatusUpdate(order._id, order.orderType === 'Delivery' ? 'Shipped' : 'Served')}
                                                    className="px-4 py-2.5 bg-indigo-500 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all flex items-center gap-2 shadow-lg shadow-indigo-500/20"
                                                >
                                                    <CheckCircle size={12} /> {order.orderType === 'Delivery' ? 'Dispatch' : 'Complete'}
                                                </button>
                                            )}
                                            {order.status === 'Shipped' && (
                                                <button
                                                    onClick={() => handleStatusUpdate(order._id, 'Delivered')}
                                                    className="px-4 py-2.5 bg-emerald-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-all flex items-center gap-2 shadow-lg shadow-emerald-600/20"
                                                >
                                                    <CheckCircle size={12} /> Delivered
                                                </button>
                                            )}

                                            {/* Dropdown for other options */}
                                            <div className="relative group/more">
                                                <button className="p-2.5 bg-neutral-50 border border-coffee-brown/5 rounded-xl text-coffee-brown/40 hover:bg-cream transition-all">
                                                    <MoreVertical size={16} />
                                                </button>
                                                <div className="absolute right-0 bottom-full mb-2 w-48 bg-white rounded-2xl shadow-2xl border border-coffee-brown/5 opacity-0 invisible group-hover/more:opacity-100 group-hover/more:visible transition-all z-50 p-2 space-y-1">
                                                    <p className="px-3 py-2 text-[9px] font-black text-coffee-brown/30 uppercase tracking-[0.2em] border-b border-coffee-brown/5 mb-1">Manual Controls</p>
                                                    {['Pending', 'Cancelled', 'Confirmed'].includes(order.status) && (
                                                        <button 
                                                            onClick={() => handleStatusUpdate(order._id, 'Cancelled')}
                                                            className="w-full text-left px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-50 transition-all flex items-center gap-2"
                                                        >
                                                            <X size={12} /> Cancel Order
                                                        </button>
                                                    )}
                                                    <button 
                                                        onClick={() => handleInvoiceDownload(order._id)}
                                                        className="w-full text-left px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-coffee-brown hover:bg-neutral-50 transition-all flex items-center gap-2"
                                                    >
                                                        <Download size={12} /> Download Invoice
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>

                    </table>
                </div>
                {filteredOrders.length === 0 && (
                     <div className="py-24 text-center">
                        <Package2 size={48} className="text-coffee-brown/5 mx-auto mb-4" />
                        <p className="text-[10px] font-black uppercase tracking-widest text-coffee-brown/20 italic">No operational data matches the current filter</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminOrders;
