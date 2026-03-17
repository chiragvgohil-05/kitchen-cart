import { useState, useEffect } from "react";
import { ChefHat, Clock, CheckCircle2, Package2, AlertCircle, RefreshCw } from "lucide-react";
import api from "../../utils/api";
import toast from "react-hot-toast";

const STATUS_CONFIG = {
    Pending:    { label: "Pending",    color: "bg-gray-100 text-gray-600 border-gray-200",       dot: "bg-gray-400" },
    Confirmed:  { label: "Confirmed",  color: "bg-blue-50 text-blue-700 border-blue-200",         dot: "bg-blue-500" },
    Preparing:  { label: "Preparing",  color: "bg-amber-50 text-amber-700 border-amber-200",      dot: "bg-amber-500" },
    Ready:      { label: "Ready",      color: "bg-green-50 text-green-700 border-green-200",      dot: "bg-green-500" },
    Delivered:  { label: "Delivered",  color: "bg-coffee-brown/5 text-coffee-brown/50 border-coffee-brown/10", dot: "bg-coffee-brown/30" },
    Cancelled:  { label: "Cancelled",  color: "bg-red-50 text-red-500 border-red-200",            dot: "bg-red-400" },
};

const NEXT_STATUS = {
    Pending:   "Confirmed",
    Confirmed: "Preparing",
    Preparing: "Ready",
    Ready:     "Delivered",
};

const KitchenPanel = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState(null);
    const [filterStatus, setFilterStatus] = useState("active");

    useEffect(() => {
        fetchOrders();
        // Auto-refresh every 30s
        const interval = setInterval(fetchOrders, 30000);
        return () => clearInterval(interval);
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await api.get("/orders");
            if (!response.data?.success) throw new Error("Failed to fetch");
            setOrders(response.data.data);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to load orders");
        } finally {
            setLoading(false);
        }
    };

    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            setUpdatingId(orderId);
            const response = await api.put(`/orders/${orderId}/status`, { orderStatus: newStatus });
            if (!response.data?.success) throw new Error("Update failed");
            setOrders(prev => prev.map(o => o._id === orderId ? { ...o, orderStatus: newStatus } : o));
            toast.success(`Order marked as ${newStatus}`);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update order");
        } finally {
            setUpdatingId(null);
        }
    };

    const activeStatuses = ["Pending", "Confirmed", "Preparing", "Ready"];
    const displayOrders = filterStatus === "active"
        ? orders.filter(o => activeStatuses.includes(o.orderStatus))
        : orders.filter(o => !activeStatuses.includes(o.orderStatus));

    const stats = {
        pending: orders.filter(o => o.orderStatus === "Pending").length,
        preparing: orders.filter(o => o.orderStatus === "Preparing").length,
        ready: orders.filter(o => o.orderStatus === "Ready").length,
        done: orders.filter(o => o.orderStatus === "Delivered").length,
    };

    return (
        <div className="space-y-8 pb-12">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-coffee-brown tracking-tight flex items-center gap-3">
                        <ChefHat size={30} className="text-accent-gold" />
                        Kitchen Panel
                    </h1>
                    <p className="text-sm font-medium text-coffee-brown/40 mt-1">
                        Live order queue — update statuses as you go
                    </p>
                </div>
                <button
                    onClick={fetchOrders}
                    className="flex items-center gap-2 px-5 py-2.5 bg-coffee-brown text-white rounded-full text-xs font-black uppercase tracking-widest hover:bg-accent-gold transition-all shadow-lg"
                >
                    <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
                    Refresh
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: "Pending", value: stats.pending, icon: AlertCircle, color: "text-gray-500", bg: "bg-gray-50 border border-gray-200" },
                    { label: "Preparing", value: stats.preparing, icon: Clock, color: "text-amber-600", bg: "bg-amber-50 border border-amber-200" },
                    { label: "Ready", value: stats.ready, icon: Package2, color: "text-green-600", bg: "bg-green-50 border border-green-200" },
                    { label: "Delivered", value: stats.done, icon: CheckCircle2, color: "text-coffee-brown", bg: "bg-coffee-brown/5 border border-coffee-brown/10" },
                ].map(stat => {
                    const Icon = stat.icon;
                    return (
                        <div key={stat.label} className={`${stat.bg} rounded-2xl p-5 flex flex-col gap-2`}>
                            <Icon size={20} className={stat.color} />
                            <span className={`text-3xl font-black ${stat.color}`}>{stat.value}</span>
                            <span className="text-[10px] font-black uppercase tracking-widest text-coffee-brown/40">{stat.label}</span>
                        </div>
                    );
                })}
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-3">
                {[
                    { key: "active", label: "Active Orders" },
                    { key: "done", label: "Completed / Cancelled" },
                ].map(tab => (
                    <button
                        key={tab.key}
                        onClick={() => setFilterStatus(tab.key)}
                        className={`px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-widest border transition-all ${
                            filterStatus === tab.key
                                ? "bg-coffee-brown text-white border-transparent shadow-lg"
                                : "bg-white text-coffee-brown/50 border-coffee-brown/10 hover:border-coffee-brown/30"
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Order Cards */}
            {loading ? (
                <div className="py-24 text-center">
                    <div className="animate-spin w-10 h-10 border-4 border-accent-gold border-t-transparent rounded-full mx-auto mb-4" />
                    <p className="text-coffee-brown/30 font-bold tracking-widest text-xs">Loading Orders...</p>
                </div>
            ) : displayOrders.length === 0 ? (
                <div className="py-24 text-center bg-white rounded-2xl border border-coffee-brown/5">
                    <ChefHat size={48} className="text-coffee-brown/10 mx-auto mb-4" />
                    <p className="text-coffee-brown/30 font-bold tracking-widest text-sm">No orders here</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {displayOrders.map(order => {
                        const cfg = STATUS_CONFIG[order.orderStatus] || STATUS_CONFIG.Pending;
                        const next = NEXT_STATUS[order.orderStatus];
                        const isUpdating = updatingId === order._id;
                        return (
                            <div key={order._id} className="bg-white rounded-2xl border border-coffee-brown/5 shadow-sm overflow-hidden hover:shadow-md transition-all">
                                {/* Card Header */}
                                <div className="px-5 py-4 border-b border-coffee-brown/5 flex items-center justify-between">
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-coffee-brown/30">Order ID</p>
                                        <p className="text-sm font-bold text-coffee-brown font-mono">#{order._id.slice(-6).toUpperCase()}</p>
                                    </div>
                                    <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-widest ${cfg.color}`}>
                                        <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                                        {cfg.label}
                                    </div>
                                </div>

                                {/* Order Details */}
                                <div className="px-5 py-4 space-y-1.5">
                                    <div className="flex justify-between text-xs">
                                        <span className="text-coffee-brown/40 font-bold">Customer</span>
                                        <span className="font-bold text-coffee-brown">{order.user?.name || "Guest"}</span>
                                    </div>
                                    <div className="flex justify-between text-xs">
                                        <span className="text-coffee-brown/40 font-bold">Type</span>
                                        <span className={`font-bold px-2 py-0.5 rounded-full text-[10px] tracking-widest uppercase ${order.orderType === "Dine-in" ? "bg-accent-gold/10 text-accent-gold" : "bg-blue-50 text-blue-600"}`}>
                                            {order.orderType}
                                            {order.tableNumber ? ` · Table ${order.tableNumber}` : ""}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-xs">
                                        <span className="text-coffee-brown/40 font-bold">Items</span>
                                        <span className="font-bold text-coffee-brown">{order.orderItems?.length} item(s)</span>
                                    </div>
                                    {/* Items list */}
                                    <ul className="mt-3 space-y-1 pt-3 border-t border-coffee-brown/5">
                                        {order.orderItems?.map((item, i) => (
                                            <li key={i} className="flex justify-between text-[11px] text-coffee-brown/60 font-semibold">
                                                <span>{item.name} <span className="text-coffee-brown/30">×{item.qty}</span></span>
                                                <span>₹{item.price * item.qty}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Action */}
                                <div className="px-5 py-4 bg-coffee-brown/2 border-t border-coffee-brown/5 flex items-center justify-between">
                                    <span className="text-xs font-bold text-coffee-brown">
                                        ₹{order.totalPrice?.toFixed(2)}
                                    </span>
                                    {next ? (
                                        <button
                                            onClick={() => updateOrderStatus(order._id, next)}
                                            disabled={isUpdating}
                                            className="flex items-center gap-2 px-4 py-2 bg-coffee-brown text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-accent-gold transition-all disabled:opacity-50"
                                        >
                                            {isUpdating
                                                ? <RefreshCw size={12} className="animate-spin" />
                                                : <CheckCircle2 size={12} />
                                            }
                                            Mark as {next}
                                        </button>
                                    ) : (
                                        <span className="text-[10px] font-black uppercase tracking-widest text-coffee-brown/30">
                                            {order.orderStatus === "Cancelled" ? "Cancelled" : "Complete"}
                                        </span>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default KitchenPanel;
