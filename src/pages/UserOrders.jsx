import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Package, Download, XCircle, CreditCard, Coffee, Truck, Clock, CheckCircle2, RefreshCw } from "lucide-react";
import api from "../utils/api";
import toast from "react-hot-toast";
import { getProductImageUrl } from "../utils/mediaUrl";
import { useShop } from "../context/ShopContext";
import { useAuth } from "../context/AuthContext";
import { loadRazorpayScript } from "../utils/razorpay";

const STATUS_CONFIG = {
    Pending: { label: "Pending", color: "text-slate-400 bg-slate-50 border-slate-100", icon: Clock },
    Confirmed: { label: "Confirmed", color: "text-blue-500 bg-blue-50/50 border-blue-100 shadow-[0_0_15px_rgba(59,130,246,0.1)]", icon: CheckCircle2 },
    Preparing: { label: "Preparing", color: "text-amber-500 bg-amber-50/50 border-amber-100 shadow-[0_0_15px_rgba(245,158,11,0.1)] animate-pulse", icon: Coffee },
    Ready: { label: "Ready", color: "text-emerald-500 bg-emerald-50/50 border-emerald-100 shadow-[0_0_15px_rgba(16,185,129,0.1)]", icon: CheckCircle2 },
    Served: { label: "Served", color: "text-coffee-brown bg-coffee-brown/5 border-coffee-brown/10", icon: CheckCircle2 },
    Shipped: { label: "Shipped", color: "text-indigo-500 bg-indigo-50/50 border-indigo-100", icon: Truck },
    Delivered: { label: "Delivered", color: "text-neutral-400 bg-neutral-50/50 border-neutral-100", icon: CheckCircle2 },
    Cancelled: { label: "Cancelled", color: "text-red-400 bg-red-50/50 border-red-100", icon: XCircle },
};

const UserOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [downloadingInvoiceId, setDownloadingInvoiceId] = useState(null);
    const [cancellingOrderId, setCancellingOrderId] = useState(null);
    const [retryingOrderId, setRetryingOrderId] = useState(null);
    const [confirmCancelOrderId, setConfirmCancelOrderId] = useState(null);
    const { retryPayment, verifyRazorpayPayment } = useShop();
    const { reloadUser } = useAuth();

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const response = await api.get("/orders");
            setOrders(response.data?.data || []);
        } catch (error) {
            console.error("Fetch error", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadInvoice = async (orderId) => {
        try {
            setDownloadingInvoiceId(orderId);
            const response = await api.get(`/orders/${orderId}/invoice`, { responseType: "blob" });
            const blob = new Blob([response.data], { type: "application/pdf" });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `order_${orderId.slice(-6).toUpperCase()}.pdf`;
            a.click();
            toast.success("Receipt downloaded");
        } catch (error) { toast.error("Failed to secure receipt"); }
        finally { setDownloadingInvoiceId(null); }
    };

    const handleRetryPayment = async (orderId) => {
        try {
            setRetryingOrderId(orderId);
            const result = await retryPayment(orderId);
            if (!result) return;
            const { razorpayOrder, order, razorpayKeyId } = result.data;
            const sdkLoaded = await loadRazorpayScript();
            if (!sdkLoaded) return toast.error("Unable to load Synchrony");

            const options = {
                key: razorpayKeyId,
                amount: razorpayOrder.amount,
                currency: razorpayOrder.currency,
                name: "SnowEra Cafe",
                description: `Order ${order._id}`,
                order_id: razorpayOrder.id,
                handler: async (response) => {
                    const verification = await verifyRazorpayPayment({
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_signature: response.razorpay_signature,
                        orderId: order._id
                    });
                    if (verification) {
                        toast.success("Synchronized!");
                        fetchOrders();
                    }
                },
                theme: { color: "#4E342E" }
            };
            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (error) { toast.error("Retry failed"); }
        finally { setRetryingOrderId(null); }
    };

    const handleCancelOrder = async (orderId) => {
        try {
            setCancellingOrderId(orderId);
            const response = await api.put(`/orders/${orderId}/cancel`);
            setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: 'Cancelled' } : o));
            toast.success("Order Retired");
            await reloadUser();
        } catch (error) { toast.error("Retirement failure"); }
        finally { setCancellingOrderId(null); }
    };

    const isCancellable = (status) => ["Pending", "Confirmed"].includes(status);

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-cream gap-4">
                <div className="w-12 h-12 border-4 border-accent-gold border-t-transparent rounded-full animate-spin" />
                <p className="text-[10px] font-black uppercase tracking-widest text-coffee-brown/30">Syncing History...</p>
            </div>
        );
    }

    return (
        <div className="bg-cream min-h-screen py-20 animate-fade-in">
            <div className="max-w-6xl mx-auto px-6">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-20">
                    <div>
                        <h1 className="text-4xl font-black text-coffee-brown tracking-tighter leading-none">
                            MY <span className="text-accent-gold">JOURNEY</span>
                        </h1>
                        <p className="text-[10px] font-black uppercase tracking-[0.25em] text-coffee-brown/30 mt-3 pl-1">A chronicle of your cafe experiences</p>
                    </div>
                    <div className="px-8 py-4 bg-white/50 backdrop-blur-xl rounded-full border border-coffee-brown/5 shadow-sm text-[10px] font-black uppercase tracking-widest">
                        {orders.length} TOTAL VISITS
                    </div>
                </div>

                {orders.length === 0 ? (
                    <div className="bg-white rounded-[48px] p-24 text-center border border-coffee-brown/5">
                        <Package size={64} className="text-coffee-brown/5 mx-auto mb-8" />
                        <h2 className="text-2xl font-black text-coffee-brown mb-4 tracking-tighter">Your Log is Quiet</h2>
                        <Link to="/menu" className="px-8 py-3 bg-coffee-brown text-white rounded-full font-black text-xs uppercase tracking-widest hover:bg-accent-gold transition-all">Begin Harvest</Link>
                    </div>
                ) : (
                    <div className="space-y-12">
                        {orders.map((order) => {
                            const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.Pending;
                            const Icon = cfg.icon;
                            return (
                                <div key={order._id} className="bg-white rounded-[48px] border border-coffee-brown/5 shadow-2xl shadow-coffee-brown/5 overflow-hidden transition-all hover:border-accent-gold/20 flex flex-col">
                                    {/* Header */}
                                    <div className="p-8 bg-neutral-50/50 border-b border-coffee-brown/5 flex flex-wrap items-center justify-between gap-6">
                                        <div className="flex items-center gap-5">
                                            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-coffee-brown border border-coffee-brown/5 shadow-sm">
                                                <Package size={24} />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-coffee-brown/30 mb-1">Entity ID</p>
                                                <p className="font-bold text-coffee-brown">#{order._id.slice(-6).toUpperCase()}</p>
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-6">
                                            <div className="text-right">
                                                <p className="text-[10px] font-black uppercase tracking-widest text-coffee-brown/30 mb-1">Execution</p>
                                                <p className="text-xs font-black text-coffee-brown">{order.orderType} {order.table ? `· Station ${order.table.tableNumber || order.table}` : ''}</p>
                                            </div>
                                            <div className={`px-5 py-2 rounded-full border text-[9px] font-black uppercase tracking-widest flex items-center gap-2 ${cfg.color}`}>
                                                <Icon size={12} />
                                                {cfg.label}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Items */}
                                    <div className="p-8 space-y-8">
                                        {order.items?.map((item) => (
                                            <div key={item._id} className="flex items-center gap-6">
                                                <div className="w-20 h-20 bg-cream rounded-2xl overflow-hidden shrink-0 border border-coffee-brown/5">
                                                    <img src={getProductImageUrl(item.product?.images?.[0])} alt={item.product?.name} className="w-full h-full object-cover mix-blend-multiply" />
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="font-black text-coffee-brown tracking-tight">{item.product?.name}</h3>
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-coffee-brown/30">{item.quantity} Portion · ₹{item.price}</p>
                                                </div>
                                                <p className="font-black text-coffee-brown tracking-tighter">₹{item.price * item.quantity}</p>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Footer */}
                                    <div className="p-8 bg-neutral-50/30 border-t border-coffee-brown/5 flex flex-wrap items-center justify-between gap-6">
                                        <div className="flex gap-10">
                                            <div>
                                                <p className="text-[9px] font-black uppercase tracking-widest text-coffee-brown/20 mb-2">Timestamp</p>
                                                <p className="text-xs font-black text-coffee-brown/60">{new Date(order.createdAt).toLocaleDateString()}</p>
                                            </div>
                                            <div>
                                                <p className="text-[9px] font-black uppercase tracking-widest text-coffee-brown/20 mb-2">Total Value</p>
                                                <div className="flex items-baseline gap-3">
                                                    <p className="text-2xl font-black text-coffee-brown tracking-tighter">₹{order.totalAmount}</p>
                                                    {order.discountAmount > 0 && (
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-[10px] font-bold text-coffee-brown/30 line-through">₹{order.totalAmount + order.discountAmount}</span>
                                                            <span className="text-[9px] font-black bg-emerald-50 text-emerald-500 px-2 py-0.5 rounded-full uppercase tracking-tighter">
                                                                {order.reward?.name || 'Discount Applied'} (-₹{order.discountAmount})
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-3">
                                            {order.status === "Pending" && order.paymentMethod !== "COD" && (
                                                <button onClick={() => handleRetryPayment(order._id)} className="px-6 py-3 bg-accent-gold text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all">Complete Payment</button>
                                            )}
                                            {isCancellable(order.status) && (
                                                <button onClick={() => setConfirmCancelOrderId(order._id)} className="px-6 py-3 bg-white border border-red-100 text-red-500 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-50 transition-all">Retire</button>
                                            )}
                                            <button onClick={() => handleDownloadInvoice(order._id)} className="p-3 bg-coffee-brown text-white rounded-2xl hover:bg-accent-gold transition-all shadow-lg"><Download size={18} /></button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Cancel Modal */}
            {confirmCancelOrderId && (
                <div className="fixed inset-0 z-100 flex items-center justify-center p-6 bg-coffee-brown/50 backdrop-blur-md animate-fade-in">
                    <div className="bg-white rounded-[32px] p-8 max-w-sm w-full shadow-2xl">
                        <h3 className="text-2xl font-black text-coffee-brown tracking-tighter mb-4">Confirm Retirement</h3>
                        <p className="text-xs font-bold text-coffee-brown/40 mb-8 leading-relaxed">Are you certain you wish to retire this order? Credited balance will be restored immediately.</p>
                        <div className="flex gap-3">
                            <button onClick={() => setConfirmCancelOrderId(null)} className="flex-1 py-3 font-black text-[10px] uppercase tracking-widest text-coffee-brown">Maybe Later</button>
                            <button onClick={() => { handleCancelOrder(confirmCancelOrderId); setConfirmCancelOrderId(null); }} className="flex-1 py-3 bg-red-500 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-red-500/20">Retire Order</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserOrders;
