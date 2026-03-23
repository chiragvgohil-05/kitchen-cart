import { useState, useEffect } from "react";
import { ChefHat, Clock, CheckCircle2, Package2, AlertCircle, RefreshCw, Truck, UserCheck, Coffee } from "lucide-react";
import api from "../../utils/api";
import toast from "react-hot-toast";

const STATUS_CONFIG = {
    Pending:    { label: "Pending",    color: "bg-gray-100 text-gray-600 border-gray-200",       dot: "bg-gray-400" },
    Confirmed:  { label: "Confirmed",  color: "bg-blue-50 text-blue-700 border-blue-200",         dot: "bg-blue-500" },
    Preparing:  { label: "Preparing",  color: "bg-amber-50 text-amber-700 border-amber-200",      dot: "bg-amber-500" },
    Ready:      { label: "Ready",      color: "bg-emerald-50 text-emerald-700 border-emerald-200", dot: "bg-emerald-500" },
    Served:     { label: "Served",     color: "bg-coffee-brown/10 text-coffee-brown border-coffee-brown/20", dot: "bg-coffee-brown" },
    Shipped:    { label: "Shipped",    color: "bg-indigo-50 text-indigo-700 border-indigo-200",   dot: "bg-indigo-500" },
    Delivered:  { label: "Delivered",  color: "bg-neutral-100 text-neutral-400 border-neutral-200", dot: "bg-neutral-300" },
    Cancelled:  { label: "Cancelled",  color: "bg-red-50 text-red-500 border-red-200",            dot: "bg-red-400" },
};

const KitchenPanel = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState(null);
    const [filterStatus, setFilterStatus] = useState("active");

    useEffect(() => {
        fetchOrders();
        const interval = setInterval(fetchOrders, 30000);
        return () => clearInterval(interval);
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await api.get("/orders/admin"); // Using admin route to see all orders
            if (!response.data?.success) throw new Error("Failed to fetch");
            setOrders(response.data.data);
        } catch (error) {
            console.error("fetch error", error);
            // toast.error(error.response?.data?.message || "Failed to load orders");
        } finally {
            setLoading(false);
        }
    };

    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            setUpdatingId(orderId);
            const response = await api.put(`/orders/${orderId}`, { status: newStatus });
            if (!response.data?.success) throw new Error("Update failed");
            setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
            toast.success(`Order marked as ${newStatus}`);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update order");
        } finally {
            setUpdatingId(null);
        }
    };

    const getNextStatus = (order) => {
        const cur = order.status;
        const type = order.orderType;

        if (cur === "Pending") return "Confirmed";
        if (cur === "Confirmed") return "Preparing";
        if (cur === "Preparing") return "Ready";
        
        if (cur === "Ready") {
            if (type === "Delivery") return "Shipped";
            return "Served"; // For Dine-in and Takeaway
        }
        
        if (cur === "Shipped" && type === "Delivery") return "Delivered";
        
        return null;
    };

    const getActionLabel = (next) => {
        switch(next) {
            case 'Confirmed': return "ACCEPT ORDER";
            case 'Preparing': return "START COOKING";
            case 'Ready':     return "MARK AS READY";
            case 'Served':    return "SERVE TO TABLE";
            case 'Shipped':   return "DISPATCH ORDER";
            case 'Delivered': return "MARK DELIVERED";
            default:          return `PROCEED TO ${next || 'NEXT STEP'}`;
        }
    };



    const activeStatuses = ["Pending", "Confirmed", "Preparing", "Ready", "Shipped"];
    const displayOrders = filterStatus === "active"
        ? orders.filter(o => activeStatuses.includes(o.status))
        : orders.filter(o => !activeStatuses.includes(o.status));

    const stats = {
        pending: orders.filter(o => o.status === "Pending" || o.status === "Confirmed").length,
        preparing: orders.filter(o => o.status === "Preparing").length,
        ready: orders.filter(o => o.status === "Ready").length,
        active: orders.filter(o => activeStatuses.includes(o.status)).length,
    };

    return (
        <div className="space-y-8 pb-12">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-coffee-brown tracking-tighter flex items-center gap-3">
                        <ChefHat size={32} className="text-accent-gold" />
                        SNOWERA <span className="text-accent-gold">KITCHEN</span>
                    </h1>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-coffee-brown/30 mt-1 pl-1">
                        Real-time order synchronization & fulfillment
                    </p>
                </div>
                <button
                    onClick={fetchOrders}
                    className="group flex items-center gap-3 px-6 py-3 bg-coffee-brown text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-accent-gold transition-all shadow-xl shadow-coffee-brown/10 active:scale-95"
                >
                    <RefreshCw size={14} className={loading ? "animate-spin" : "group-hover:rotate-180 transition-transform duration-700"} />
                    Refresh Queue
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: "Queue", value: stats.pending, icon: AlertCircle, color: "text-blue-600", bg: "bg-blue-50/50" },
                    { label: "In Prep", value: stats.preparing, icon: Clock, color: "text-amber-600", bg: "bg-amber-50/50" },
                    { label: "Station Ready", value: stats.ready, icon: Coffee, color: "text-emerald-600", bg: "bg-emerald-50/50" },
                    { label: "Active Total", value: stats.active, icon: ChefHat, color: "text-coffee-brown", bg: "bg-neutral-50" },
                ].map(stat => {
                    const Icon = stat.icon;
                    return (
                        <div key={stat.label} className={`${stat.bg} rounded-3xl p-6 flex flex-col gap-2 border border-coffee-brown/5 shadow-sm`}>
                            <Icon size={20} className={stat.color} />
                            <span className="text-4xl font-black tracking-tighter text-coffee-brown">{stat.value}</span>
                            <span className="text-[10px] font-black uppercase tracking-widest text-coffee-brown/30">{stat.label}</span>
                        </div>
                    );
                })}
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-2 bg-white/50 p-1 rounded-2xl w-fit border border-coffee-brown/5">
                {[
                    { key: "active", label: "Live Queue" },
                    { key: "done", label: "Archives" },
                ].map(tab => (
                    <button
                        key={tab.key}
                        onClick={() => setFilterStatus(tab.key)}
                        className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                            filterStatus === tab.key
                                ? "bg-coffee-brown text-white shadow-lg"
                                : "text-coffee-brown/40 hover:bg-coffee-brown/5"
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Order Cards */}
            {loading ? (
                <div className="py-24 text-center">
                    <div className="animate-spin w-8 h-8 border-2 border-accent-gold border-t-transparent rounded-full mx-auto mb-4" />
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-coffee-brown/30">Synchronizing...</p>
                </div>
            ) : displayOrders.length === 0 ? (
                <div className="py-32 text-center bg-white/50 rounded-[48px] border-2 border-dashed border-coffee-brown/10">
                    <Package2 size={48} className="text-coffee-brown/10 mx-auto mb-6" />
                    <p className="text-xs font-black uppercase tracking-widest text-coffee-brown/20 italic">SnowEra Kitchen is currently tranquil</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {displayOrders.map(order => {
                        const next = getNextStatus(order);
                        const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.Pending;
                        const isUpdating = updatingId === order._id;
                        
                        return (
                            <div key={order._id} className="group bg-white rounded-[40px] border border-coffee-brown/5 shadow-2xl shadow-coffee-brown/5 overflow-hidden flex flex-col justify-between hover:border-accent-gold/20 transition-all duration-500">
                                {/* Header */}
                                <div className="p-6 border-b border-coffee-brown/5 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-2xl bg-cream flex items-center justify-center text-coffee-brown/30 group-hover:bg-accent-gold group-hover:text-white transition-all duration-500">
                                            {order.orderType === "Dine-in" ? <Coffee size={20} /> : order.orderType === "Delivery" ? <Truck size={20} /> : <Package2 size={20} />}
                                        </div>
                                        <div>
                                            <p className="text-sm font-black tracking-tight">#{order._id.slice(-6).toUpperCase()}</p>
                                            <p className="text-[9px] font-black uppercase tracking-widest text-coffee-brown/30">{order.orderType} Order</p>
                                        </div>
                                    </div>
                                    <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${cfg.color} flex items-center gap-2`}>
                                        <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} animate-pulse`} />
                                        {cfg.label}
                                    </div>
                                </div>

                                {/* Body */}
                                <div className="p-6 flex-1 space-y-6">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="text-[9px] font-black uppercase tracking-widest text-coffee-brown/20 mb-1">Customer</p>
                                            <p className="font-black text-coffee-brown text-sm">{order.user?.name || "Guest Patron"}</p>
                                        </div>
                                        {order.table && (
                                            <div className="text-right">
                                                <p className="text-[9px] font-black uppercase tracking-widest text-coffee-brown/20 mb-1">Table</p>
                                                <p className="font-black text-accent-gold text-sm">Station {order.table.tableNumber || order.table}</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Items */}
                                    <div className="space-y-3">
                                        <p className="text-[9px] font-black uppercase tracking-widest text-coffee-brown/20 flex items-center gap-2">
                                            Components <span className="h-px bg-coffee-brown/5 flex-1" />
                                        </p>
                                        <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                                            {order.items?.map((item, i) => (
                                                <div key={i} className="flex justify-between items-center text-xs font-bold">
                                                    <span className="text-coffee-brown/70">{item.product?.name}</span>
                                                    <span className="px-2 py-0.5 bg-neutral-50 rounded-lg text-coffee-brown/40 tracking-tighter">×{item.quantity}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="p-6 bg-neutral-50/50 border-t border-coffee-brown/5 mt-auto flex flex-col gap-3">
                                    {next ? (
                                        <>
                                            <button
                                                onClick={() => updateOrderStatus(order._id, next)}
                                                disabled={isUpdating}
                                                className={`w-full py-4 rounded-[20px] text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all shadow-xl active:scale-95 disabled:opacity-50 ${
                                                    next === 'Confirmed' ? 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/10' :
                                                    next === 'Preparing' ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/10' :
                                                    'bg-coffee-brown hover:bg-accent-gold shadow-coffee-brown/10'
                                                } text-white`}
                                            >
                                                {isUpdating ? <RefreshCw size={14} className="animate-spin" /> : <UserCheck size={14} />}
                                                {getActionLabel(next)}
                                            </button>
                                            
                                            {order.status === 'Pending' && (
                                                <button
                                                    onClick={() => updateOrderStatus(order._id, 'Cancelled')}
                                                    className="w-full py-2 text-[8px] font-black uppercase tracking-widest text-red-400 hover:text-red-500 transition-all"
                                                >
                                                    DECLINE ORDER
                                                </button>
                                            )}
                                        </>
                                    ) : (
                                        <div className="w-full py-4 text-center rounded-[20px] border border-coffee-brown/10 text-[10px] font-black uppercase tracking-widest text-coffee-brown/30 italic">
                                            {order.status === "Cancelled" ? "Order Terminated" : "Cycle Complete"}
                                        </div>
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
