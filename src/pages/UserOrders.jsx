import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Package, Download, XCircle, CreditCard } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import toast from "react-hot-toast";
import { getProductImageUrl } from "../utils/mediaUrl";
import { useShop } from "../context/ShopContext";
import { useAuth } from "../context/AuthContext";
import { loadRazorpayScript } from "../utils/razorpay";

const UserOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [downloadingInvoiceId, setDownloadingInvoiceId] = useState(null);
    const [cancellingOrderId, setCancellingOrderId] = useState(null);
    const [retryingOrderId, setRetryingOrderId] = useState(null);
    const [confirmCancelOrderId, setConfirmCancelOrderId] = useState(null);
    const { retryPayment, verifyRazorpayPayment } = useShop();
    const { reloadUser } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true);
            try {
                const response = await api.get("/orders");
                const orderList = response.data?.data || [];
                const sortedOrders = [...orderList].sort(
                    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                );
                setOrders(sortedOrders);
            } catch (error) {
                console.error("Fetch user orders error:", error);
                toast.error("Failed to fetch your Store log");
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const handleDownloadInvoice = async (orderId) => {
        try {
            setDownloadingInvoiceId(orderId);
            const response = await api.get(`/orders/${orderId}/invoice`, {
                responseType: "blob"
            });

            const blob = new Blob([response.data], { type: "application/pdf" });
            const url = window.URL.createObjectURL(blob);
            const anchor = document.createElement("a");
            anchor.href = url;
            anchor.download = `harvest_receipt_${orderId}.pdf`;
            document.body.appendChild(anchor);
            anchor.click();
            anchor.remove();
            window.URL.revokeObjectURL(url);
            toast.success("Receipt secured");
        } catch (error) {
            console.error("Invoice download error:", error);
            toast.error(error.response?.data?.message || "Failed to secure receipt");
        } finally {
            setDownloadingInvoiceId(null);
        }
    };

    const handleRetryPayment = async (orderId) => {
        try {
            setRetryingOrderId(orderId);
            const result = await retryPayment(orderId);
            if (!result) return;

            const { razorpayOrder, order, razorpayKeyId } = result.data;

            const sdkLoaded = await loadRazorpayScript();
            if (!sdkLoaded) {
                toast.error("Unable to load Store Synchrony");
                return;
            }

            const options = {
                key: razorpayKeyId,
                amount: razorpayOrder.amount,
                currency: razorpayOrder.currency,
                name: "Our Store Cafe",
                description: `Complete Store for Order ${order._id}`,
                order_id: razorpayOrder.id,
                handler: async (response) => {
                    const verification = await verifyRazorpayPayment({
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_signature: response.razorpay_signature,
                        orderId: order._id
                    });

                    if (verification) {
                        toast.success("Store Synchronized Successfully!");
                        navigate('/order-success');
                    }
                },
                modal: {
                    ondismiss: () => {
                        toast.error("Synchrony cancelled");
                    }
                },
                theme: {
                    color: "#4E342E"
                }
            };

            const razorpay = new window.Razorpay(options);
            razorpay.open();
        } catch (error) {
            console.error("Retry payment error:", error);
            toast.error("Failed to re-initialize synchrony");
        } finally {
            setRetryingOrderId(null);
        }
    };

    const isCancellable = (status) => ["Pending", "Processing"].includes(status);

    const handleCancelOrder = async (orderId) => {
        try {
            setCancellingOrderId(orderId);
            const response = await api.put(`/orders/${orderId}/cancel`);
            const updatedOrder = response.data?.data;

            if (updatedOrder?._id) {
                setOrders(prev =>
                    prev.map(order =>
                        order._id === updatedOrder._id ? { ...order, ...updatedOrder } : order
                    )
                );
            }

            toast.success(response.data?.message || "Store order retired");
            await reloadUser();
        } catch (error) {
            console.error("Cancel order error:", error);
            toast.error(error.response?.data?.message || "Failed to retire order");
        } finally {
            setCancellingOrderId(null);
        }
    };

    const getStatusStyles = (status) => {
        switch (status) {
            case "Delivered":
                return "text-green-500 bg-green-50/50 border-green-100 shadow-[0_0_15px_rgba(34,197,94,0.1)]";
            case "Shipped":
                return "text-blue-500 bg-blue-50/50 border-blue-100 shadow-[0_0_15px_rgba(59,130,246,0.1)]";
            case "Processing":
                return "text-accent-gold bg-accent-gold/5 border-accent-gold/20 animate-pulse";
            case "Cancelled":
                return "text-red-400 bg-red-50/50 border-red-100";
            case "Pending":
            default:
                return "text-coffee-brown/40 bg-cream/50 border-coffee-brown/5";
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-cream">
                <div className="flex flex-col items-center gap-6">
                    <div className="relative w-24 h-24">
                        <div className="absolute inset-0 border-8 border-coffee-brown/10 rounded-full" />
                        <div className="absolute inset-0 border-8 border-accent-gold border-t-transparent rounded-full animate-spin" />
                    </div>
                    <p className="font-bold text-coffee-brown tracking-wide text-sm animate-pulse">Reading Store Log...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-cream min-h-screen py-20 lg:py-32 animate-fade-in">
            <div className="max-w-6xl mx-auto px-6 lg:px-6">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-20">
                    <div className="space-y-6">
                        <div className="h-1.5 w-16 bg-accent-gold rounded-full" />
                        <h1 className="text-3xl lg:text-4xl font-bold text-coffee-brown tracking-tighter leading-[0.85]">
                            STORE <br />
                            <span className="text-accent-gold not-">LOG</span>
                        </h1>
                    </div>
                    <p className="text-sm font-bold tracking-wide text-coffee-brown/40 bg-white/50 backdrop-blur-xl px-8 py-4 rounded-full border border-coffee-brown/5 shadow-2xl shadow-coffee-brown/5">
                        {orders.length} <span className="text-accent-gold ml-1">TOTAL HARVESTS</span>
                    </p>
                </div>

                {orders.length === 0 ? (
                    <div className="bg-white rounded-3xl border border-coffee-brown/5 p-20 text-center shadow-2xl shadow-coffee-brown/5">
                        <h3 className="text-2xl font-bold mb-4 tracking-tighter text-coffee-brown">Quiet Horizon</h3>
                        <p className="text-coffee-brown/30 font-bold tracking-widest text-xs mb-10">Your collection journey has not yet begun.</p>
                        <Link
                            to="/menu"
                            className="inline-flex items-center justify-center px-6 py-3 bg-coffee-brown text-white rounded-full font-bold text-sm tracking-wide hover:bg-accent-gold transition-all transform hover:-translate-y-1 shadow-2xl shadow-coffee-brown/20"
                        >
                            Start Your Store
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-16">
                        {orders.map((order) => (
                            <div key={order._id} className="group bg-white rounded-[56px] border border-coffee-brown/5 shadow-2xl shadow-coffee-brown/5 hover:shadow-accent-gold/10 transition-all duration-700 flex flex-col overflow-hidden">
                                <div className="px-6 py-8 bg-cream/50 border-b border-coffee-brown/5 flex flex-wrap items-center justify-between gap-6">
                                    <div className="flex items-center gap-6">
                                        <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-coffee-brown shadow-lg border border-coffee-brown/5 group-hover:scale-110 transition-transform">
                                            <Package size={28} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-coffee-brown/30 tracking-wide mb-1">HARVEST ID</p>
                                            <h2 className="font-bold text-coffee-brown text-lg tracking-tight">{order._id.toUpperCase()}</h2>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <div className="hidden sm:flex flex-col items-end">
                                            <p className="text-sm font-bold text-coffee-brown/30 tracking-wide mb-1">SYNCHRONY</p>
                                            <div className="flex items-center gap-2 font-bold text-coffee-brown text-sm tracking-widest">
                                                <span>{order.paymentMethod === 'COD' ? 'ARRIVAL' : 'DIGITAL'}</span>
                                                <div className={`w-2 h-2 rounded-full ${order.paymentStatus === 'paid' ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : (order.paymentStatus === 'failed' ? 'bg-red-500' : 'bg-accent-gold animate-pulse')}`} />
                                            </div>
                                        </div>
                                        <span className={`px-6 py-2.5 rounded-full border text-[9px] font-black uppercase tracking-[0.3em] transition-all ${getStatusStyles(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </div>
                                </div>

                                <div className="p-6 space-y-10 bg-white">
                                    {(order.items || []).map((item, index) => {
                                        const product = item.product || {};
                                        const imageUrl = getProductImageUrl(product.images?.[0]);

                                        return (
                                            <div key={item._id || `${order._id}-${product._id || index}`} className="flex items-center gap-8 group/item">
                                                <div className="w-24 h-24 bg-cream rounded-xl overflow-hidden shrink-0 border border-coffee-brown/5 group-hover/item:border-accent-gold/30 transition-all transform group-hover/item:scale-105 duration-500 shadow-inner ring-4 ring-cream/20">
                                                    {imageUrl ? (
                                                        <img
                                                            src={imageUrl}
                                                            alt={product.name || "Product"}
                                                            className="w-full h-full object-cover mix-blend-multiply transition-transform duration-700"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-coffee-brown/10">
                                                            <Package size={32} />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="grow min-w-0 py-2">
                                                    <h3 className="text-xl font-bold text-coffee-brown truncate tracking-tighter leading-none mb-3 group-hover/item:text-accent-gold transition-colors">{product.name || "Artifact"}</h3>
                                                    <div className="flex items-center gap-6">
                                                        <p className="text-sm font-bold text-coffee-brown/30 tracking-widest">PORTION: {item.quantity}</p>
                                                        <p className="text-sm font-bold text-accent-gold tracking-wide">₹{(item.price || 0).toLocaleString("en-IN")}</p>
                                                    </div>
                                                </div>
                                                <div className="hidden md:block">
                                                    <p className="text-2xl font-bold text-coffee-brown tracking-tighter tabular-nums">₹{(item.price * item.quantity).toLocaleString("en-IN")}</p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="px-6 py-8 bg-cream/30 border-t border-coffee-brown/5 flex flex-wrap items-center justify-between gap-6">
                                    <div className="flex gap-6">
                                        <div>
                                            <p className="text-sm font-bold text-coffee-brown/30 tracking-wide mb-2">STORES SINCE</p>
                                            <p className="font-bold text-coffee-brown text-sm">{new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-coffee-brown/30 tracking-wide mb-2">FINAL VALUE</p>
                                            <p className="font-bold text-coffee-brown text-3xl tracking-tighter tabular-nums">₹{(order.totalAmount || 0).toLocaleString("en-IN")}</p>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-3">
                                        {order.status === "Pending" && order.paymentMethod !== "COD" && (
                                            <button
                                                onClick={() => handleRetryPayment(order._id)}
                                                disabled={retryingOrderId === order._id}
                                                className={`inline-flex items-center gap-3 px-6 py-4 rounded-3xl text-[10px] font-black uppercase tracking-[0.3em] transition-all transform active:scale-95 shadow-lg ${retryingOrderId === order._id
                                                    ? "bg-accent-gold/20 text-coffee-brown/40 cursor-not-allowed"
                                                    : "bg-accent-gold text-white hover:bg-coffee-brown shadow-accent-gold/20"
                                                    }`}
                                            >
                                                <CreditCard size={16} />
                                                {retryingOrderId === order._id ? "SYNCING..." : "COMPLETE STORE"}
                                            </button>
                                        )}
                                        {isCancellable(order.status) && (
                                            <button
                                                onClick={() => setConfirmCancelOrderId(order._id)}
                                                disabled={cancellingOrderId === order._id}
                                                className={`inline-flex items-center gap-3 px-6 py-4 rounded-3xl text-[10px] font-black uppercase tracking-[0.3em] transition-all border transform active:scale-95 ${cancellingOrderId === order._id
                                                    ? "bg-red-50 text-red-200 border-red-100 cursor-not-allowed"
                                                    : "bg-white text-red-400 border-red-100 hover:bg-red-500 hover:text-white hover:border-red-500 shadow-xl shadow-red-500/5"
                                                    }`}
                                            >
                                                <XCircle size={16} />
                                                {cancellingOrderId === order._id ? "RETIRING..." : "RETIRE ORDER"}
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleDownloadInvoice(order._id)}
                                            disabled={downloadingInvoiceId === order._id}
                                            className={`inline-flex items-center gap-3 px-6 py-4 rounded-3xl text-[10px] font-black uppercase tracking-[0.3em] transition-all transform active:scale-95 shadow-lg ${downloadingInvoiceId === order._id
                                                ? "bg-coffee-brown/10 text-coffee-brown/40 cursor-not-allowed"
                                                : "bg-coffee-brown text-white hover:bg-accent-gold shadow-coffee-brown/20"
                                                }`}
                                        >
                                            <Download size={16} />
                                            {downloadingInvoiceId === order._id ? "SECURING..." : "HARVEST RECEIPT"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Confirm Retirement Modal */}
                {confirmCancelOrderId && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-coffee-brown/40 backdrop-blur-xl animate-fade-in">
                        <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-coffee-brown/5 animate-scale-in">
                            <div className="w-20 h-12 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mb-8 border border-red-100 shadow-inner">
                                <XCircle size={40} />
                            </div>
                            <h3 className="text-2xl font-bold text-coffee-brown tracking-tighter mb-4 leading-none">Retire Order?</h3>
                            <p className="text-coffee-brown/50 font-bold tracking-widest text-sm mb-10 leading-relaxed">
                                Are you certain you wish to retire this harvest? This action is irreversible. For secured payments, credit will be restored to your Store Aura automatically.
                            </p>
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => setConfirmCancelOrderId(null)}
                                    className="flex-1 py-3 px-6 rounded-full font-bold text-sm tracking-wide text-coffee-brown hover:bg-cream transition-all border border-coffee-brown/5"
                                >
                                    Preserve
                                </button>
                                <button
                                    onClick={() => {
                                        handleCancelOrder(confirmCancelOrderId);
                                        setConfirmCancelOrderId(null);
                                    }}
                                    className="flex-1 py-3 px-6 rounded-full bg-red-50 text-red-500 border border-red-100 hover:bg-red-500 hover:text-white font-bold text-sm tracking-wide transition-all shadow-2xl shadow-red-500/10"
                                >
                                    Retire
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <div className="mt-40 p-8 bg-white rounded-3xl text-center border border-coffee-brown/5 shadow-2xl shadow-coffee-brown/5 relative overflow-hidden group">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 bg-accent-gold/5 rounded-full blur-3xl -translate-y-1/2 group-hover:scale-150 transition-transform duration-1000" />
                    <h3 className="text-3xl font-bold mb-4 tracking-tighter text-coffee-brown">Guidance Needed?</h3>
                    <p className="text-coffee-brown/40 font-bold tracking-widest text-sm mb-10 max-w-xs mx-auto">Our keepers are available through all stores to assist with your collection.</p>
                    <Link to="/contact" className="text-accent-gold font-bold text-sm tracking-wide hover:text-coffee-brown transition-colors border-b-2 border-accent-gold/20 pb-1 hover:border-coffee-brown">
                        CONTACT KEEPERS
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default UserOrders;
